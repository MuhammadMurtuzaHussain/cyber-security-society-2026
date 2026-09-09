import { COOKIE_NAME } from "@shared/const";
import { randomUUID } from "crypto";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { systemRouter } from "./_core/systemRouter";
import { getAdminClaims, getClaimedSlotCount, getEventClaim, getEventRun, createEventRun, expireEventRun, advanceEventRun, recordEventAttempt, completeEventRunAndReserveSlot, submitStudentId } from "./isaca-event-db";
import { buildEventStages, getEventCloseReason, getRunDeadline, ISACA_EVENT, isRunActive, normaliseEventAnswer, toPublicStage } from "./isaca-event-engine";

function publicRun(run: NonNullable<Awaited<ReturnType<typeof getEventRun>>>) {
  const stages = buildEventStages(run.seed);
  const stage = stages[run.currentStage - 1];
  return {
    id: run.id,
    currentStage: run.currentStage,
    attemptsInStage: run.attemptsInStage,
    status: run.status,
    failedReason: run.failedReason,
    startedAt: run.startedAt,
    deadlineAt: new Date(getRunDeadline(run.startedAt)),
    stage: stage ? toPublicStage(stage) : null,
  };
}

async function getOrCreateActiveRun(userId: number) {
  const existing = await getEventRun(userId);
  if (existing) return existing;
  const created = await createEventRun(userId, randomUUID(), randomUUID());
  if (!created) throw new Error("Unable to create the competition run.");
  return created;
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  isacaEvent: router({
    status: publicProcedure.query(async () => ({
      eventKey: ISACA_EVENT.key,
      title: ISACA_EVENT.title,
      deadlineAt: new Date(ISACA_EVENT.deadlineMs),
      durationMs: ISACA_EVENT.durationMs,
      stageCount: ISACA_EVENT.stageCount,
      attemptsPerStage: ISACA_EVENT.maxAttemptsPerStage,
      invitationCapacity: ISACA_EVENT.maxInvitationSlots,
      claimedSlots: await getClaimedSlotCount(),
      closed: Boolean(getEventCloseReason()),
    })),

    start: protectedProcedure.mutation(async ({ ctx }) => {
      const closeReason = getEventCloseReason();
      const existing = await getEventRun(ctx.user.id);
      if (closeReason) {
        if (!existing) return { outcome: "event_closed" as const, run: null, claim: null };
        if (existing.status === "active") await expireEventRun(existing.id, "event_closed");
        const closedRun = await getEventRun(ctx.user.id);
        const claim = await getEventClaim(ctx.user.id);
        return { outcome: "ready" as const, run: closedRun ? publicRun(closedRun) : null, claim: claim ? { status: claim.status, studentIdSubmitted: Boolean(claim.studentId) } : null };
      }
      const run = await getOrCreateActiveRun(ctx.user.id);
      if (run.status === "active" && !isRunActive(run.startedAt)) {
        await expireEventRun(run.id, "time_expired");
        const expired = await getEventRun(ctx.user.id);
        return { outcome: "expired" as const, run: expired ? publicRun(expired) : null, claim: null };
      }
      const claim = await getEventClaim(ctx.user.id);
      return { outcome: "ready" as const, run: publicRun(run), claim: claim ? { status: claim.status, studentIdSubmitted: Boolean(claim.studentId) } : null };
    }),

    submitStage: protectedProcedure.input(z.object({ answer: z.string().min(1).max(256) })).mutation(async ({ ctx, input }) => {
      const closeReason = getEventCloseReason();
      const run = await getEventRun(ctx.user.id);
      if (!run) return { outcome: "no_run" as const };
      if (run.status !== "active") return { outcome: run.status === "completed" ? "completed" as const : "failed" as const, run: publicRun(run) };
      if (closeReason) {
        await expireEventRun(run.id, "event_closed");
        const closedRun = await getEventRun(ctx.user.id);
        return { outcome: "event_closed" as const, run: closedRun ? publicRun(closedRun) : null };
      }
      if (!isRunActive(run.startedAt)) {
        await expireEventRun(run.id, "time_expired");
        const expired = await getEventRun(ctx.user.id);
        return { outcome: "time_expired" as const, run: expired ? publicRun(expired) : null };
      }

      const stages = buildEventStages(run.seed);
      const stage = stages[run.currentStage - 1];
      if (!stage) return { outcome: "failed" as const, run: publicRun(run) };
      if (normaliseEventAnswer(input.answer) !== normaliseEventAnswer(stage.answer)) {
        await recordEventAttempt(run.id, run.currentStage, run.attemptsInStage);
        const updated = await getEventRun(ctx.user.id);
        const attempts = updated?.attemptsInStage ?? run.attemptsInStage;
        return { outcome: updated?.status === "failed" ? "attempt_limit" as const : "incorrect" as const, attemptsRemaining: Math.max(0, ISACA_EVENT.maxAttemptsPerStage - attempts), run: updated ? publicRun(updated) : null };
      }

      if (run.currentStage === ISACA_EVENT.stageCount) {
        const slotReserved = await completeEventRunAndReserveSlot(run.id, ctx.user.id);
        const completed = await getEventRun(ctx.user.id);
        return { outcome: "completed" as const, slotReserved, run: completed ? publicRun(completed) : null };
      }

      await advanceEventRun(run.id, run.currentStage);
      const updated = await getEventRun(ctx.user.id);
      return { outcome: "advanced" as const, run: updated ? publicRun(updated) : null };
    }),

    submitStudentId: protectedProcedure.input(z.object({ studentId: z.string().trim().min(4).max(64).regex(/^[A-Za-z0-9-]+$/, "Use letters, numbers, and hyphens only.") })).mutation(async ({ ctx, input }) => {
      const run = await getEventRun(ctx.user.id);
      if (!run || run.status !== "completed") throw new Error("Complete the event before submitting an ID.");
      const claim = await submitStudentId(ctx.user.id, input.studentId.toUpperCase());
      return { status: claim?.status ?? "submitted", studentIdSubmitted: Boolean(claim?.studentId) };
    }),

    expire: protectedProcedure.mutation(async ({ ctx }) => {
      const run = await getEventRun(ctx.user.id);
      if (!run || run.status !== "active") return { outcome: "unchanged" as const, run: run ? publicRun(run) : null };
      if (!getEventCloseReason() && isRunActive(run.startedAt)) return { outcome: "unchanged" as const, run: publicRun(run) };
      const reason = getEventCloseReason() ? "event_closed" : "time_expired";
      await expireEventRun(run.id, reason);
      const expired = await getEventRun(ctx.user.id);
      return { outcome: reason, run: expired ? publicRun(expired) : null };
    }),

    adminClaims: adminProcedure.query(async () => ({
      capacity: ISACA_EVENT.maxInvitationSlots,
      claimedSlots: await getClaimedSlotCount(),
      claims: await getAdminClaims(),
    })),
  }),
});

export type AppRouter = typeof appRouter;
