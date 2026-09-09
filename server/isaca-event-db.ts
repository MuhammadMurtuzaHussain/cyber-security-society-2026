import { and, desc, eq, isNull, lt, sql } from "drizzle-orm";
import { eventClaims, eventCounters, eventRuns } from "../drizzle/schema";
import { getDb } from "./db";
import { ISACA_EVENT } from "./isaca-event-engine";

function requiredDbError() {
  return new Error("The competition database is temporarily unavailable. Please try again shortly.");
}

function affectedRows(result: unknown) {
  const header = Array.isArray(result) ? result[0] : result;
  return Number((header as { affectedRows?: number } | undefined)?.affectedRows ?? 0);
}

async function requireDb() {
  const db = await getDb();
  if (!db) throw requiredDbError();
  return db;
}

export async function getEventRun(userId: number) {
  const db = await requireDb();
  const rows = await db.select().from(eventRuns).where(and(eq(eventRuns.eventKey, ISACA_EVENT.key), eq(eventRuns.userId, userId))).limit(1);
  return rows[0];
}

export async function createEventRun(userId: number, seed: string, runId: string) {
  const db = await requireDb();
  await db.insert(eventRuns).values({
    id: runId,
    eventKey: ISACA_EVENT.key,
    userId,
    seed,
    currentStage: 1,
    attemptsInStage: 0,
    status: "active",
  });
  return getEventRun(userId);
}

/**
 * Reuses the student's event record after a failed run, but replaces the seed,
 * identifier, clock, stage and attempts so the next try is a complete fresh case.
 * Completed runs are never reset and therefore remain tied to any invitation claim.
 */
export async function restartFailedEventRun(userId: number, seed: string, runId: string) {
  const db = await requireDb();
  const result = await db.update(eventRuns).set({
    id: runId,
    seed,
    currentStage: 1,
    attemptsInStage: 0,
    status: "active",
    failedReason: null,
    startedAt: new Date(),
    completedAt: null,
    updatedAt: new Date(),
  }).where(and(eq(eventRuns.eventKey, ISACA_EVENT.key), eq(eventRuns.userId, userId), eq(eventRuns.status, "failed")));
  return affectedRows(result) === 1;
}

export async function expireEventRun(runId: string, reason: "time_expired" | "event_closed") {
  const db = await requireDb();
  await db.update(eventRuns).set({ status: "failed", failedReason: reason, updatedAt: new Date() }).where(and(eq(eventRuns.id, runId), eq(eventRuns.status, "active")));
}

export async function advanceEventRun(runId: string, currentStage: number) {
  const db = await requireDb();
  await db.update(eventRuns).set({ currentStage: currentStage + 1, attemptsInStage: 0, updatedAt: new Date() }).where(and(eq(eventRuns.id, runId), eq(eventRuns.status, "active"), eq(eventRuns.currentStage, currentStage)));
}

export async function recordEventAttempt(runId: string, currentStage: number, previousAttempts: number) {
  const db = await requireDb();
  const attempts = previousAttempts + 1;
  if (attempts >= ISACA_EVENT.maxAttemptsPerStage) {
    const result = await db.update(eventRuns).set({ attemptsInStage: attempts, status: "failed", failedReason: "attempt_limit", updatedAt: new Date() }).where(and(eq(eventRuns.id, runId), eq(eventRuns.status, "active"), eq(eventRuns.currentStage, currentStage), eq(eventRuns.attemptsInStage, previousAttempts)));
    return affectedRows(result) === 1;
  } else {
    const result = await db.update(eventRuns).set({ attemptsInStage: attempts, updatedAt: new Date() }).where(and(eq(eventRuns.id, runId), eq(eventRuns.status, "active"), eq(eventRuns.currentStage, currentStage), eq(eventRuns.attemptsInStage, previousAttempts)));
    return affectedRows(result) === 1;
  }
}

/** Claims a finite invitation position only after the final server-side answer has validated. */
export async function completeEventRunAndReserveSlot(runId: string, userId: number) {
  const db = await requireDb();
  const completeResult = await db.update(eventRuns).set({ status: "completed", completedAt: new Date(), updatedAt: new Date() }).where(and(eq(eventRuns.id, runId), eq(eventRuns.status, "active"), eq(eventRuns.currentStage, ISACA_EVENT.stageCount)));

  if (affectedRows(completeResult) === 0) {
    const existingClaim = await db.select().from(eventClaims).where(eq(eventClaims.runId, runId)).limit(1);
    return Boolean(existingClaim[0]);
  }

  await db.insert(eventCounters).values({ eventKey: ISACA_EVENT.key, claimedCount: 0 }).onDuplicateKeyUpdate({ set: { eventKey: ISACA_EVENT.key } });
  const updateResult = await db.update(eventCounters).set({ claimedCount: sql`${eventCounters.claimedCount} + 1`, updatedAt: new Date() }).where(and(eq(eventCounters.eventKey, ISACA_EVENT.key), lt(eventCounters.claimedCount, ISACA_EVENT.maxInvitationSlots)));
  const slotReserved = affectedRows(updateResult) === 1;

  if (!slotReserved) return false;

  await db.insert(eventClaims).values({
    eventKey: ISACA_EVENT.key,
    runId,
    userId,
    status: "reserved",
  });
  return true;
}

export async function getEventClaim(userId: number) {
  const db = await requireDb();
  const rows = await db.select().from(eventClaims).where(and(eq(eventClaims.eventKey, ISACA_EVENT.key), eq(eventClaims.userId, userId))).limit(1);
  return rows[0];
}

export async function submitStudentId(userId: number, studentId: string) {
  const db = await requireDb();
  const claim = await getEventClaim(userId);
  if (!claim) throw new Error("An invitation slot has not been reserved for this account.");
  if (claim.studentId) return claim;

  const duplicate = await db.select({ id: eventClaims.id }).from(eventClaims).where(and(eq(eventClaims.eventKey, ISACA_EVENT.key), eq(eventClaims.studentId, studentId))).limit(1);
  if (duplicate[0]) throw new Error("That student ID has already been submitted for this event.");

  await db.update(eventClaims).set({ studentId, consentedAt: new Date(), status: "submitted" }).where(and(eq(eventClaims.id, claim.id), isNull(eventClaims.studentId)));
  return getEventClaim(userId);
}

export async function getClaimedSlotCount() {
  const db = await requireDb();
  const rows = await db.select().from(eventCounters).where(eq(eventCounters.eventKey, ISACA_EVENT.key)).limit(1);
  return rows[0]?.claimedCount ?? 0;
}

export async function getAdminClaims() {
  const db = await requireDb();
  return db.select({
    id: eventClaims.id,
    studentId: eventClaims.studentId,
    status: eventClaims.status,
    reservedAt: eventClaims.reservedAt,
    consentedAt: eventClaims.consentedAt,
  }).from(eventClaims).where(eq(eventClaims.eventKey, ISACA_EVENT.key)).orderBy(desc(eventClaims.reservedAt)).limit(ISACA_EVENT.maxInvitationSlots);
}
