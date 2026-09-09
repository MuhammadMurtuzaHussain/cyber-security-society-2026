import { describe, expect, it } from "vitest";
import { buildEventStages, getEventCloseReason, getRunDeadline, ISACA_EVENT, isEventRestartable, isRunActive, normaliseEventAnswer, toPublicStage } from "./isaca-event-engine";

describe("ISACA invitation event engine", () => {
  it("creates fifteen sequential, tagged stages", () => {
    const stages = buildEventStages("test-seed-alpha");
    expect(stages).toHaveLength(15);
    expect(stages.map((stage) => stage.number)).toEqual(Array.from({ length: 15 }, (_, index) => index + 1));
    stages.forEach((stage) => {
      expect(stage.answer).toMatch(/:case-[a-f0-9]{6}$/);
      expect(stage.files["case.tag"]).toContain("RUN IDENTIFIER");
      expect(stage.briefing.length).toBeGreaterThan(30);
    });
  });

  it("creates a distinct case tag for each server seed", () => {
    const alpha = buildEventStages("test-seed-alpha");
    const bravo = buildEventStages("test-seed-bravo");
    expect(alpha[0]?.answer).not.toEqual(bravo[0]?.answer);
    expect(alpha[6]?.answer).not.toEqual(bravo[6]?.answer);
  });

  it("does not expose answers in public stage payloads", () => {
    const stage = buildEventStages("test-seed-alpha")[0]!;
    const publicStage = toPublicStage(stage);
    expect("answer" in publicStage).toBe(false);
    expect(JSON.stringify(publicStage)).not.toContain(stage.answer);
  });

  it("normalises harmless response formatting while retaining unique case tags", () => {
    expect(normaliseEventAnswer("  SeV-2 : CASE-ABC123 ")).toBe("sev-2:case-abc123");
  });

  it("enforces the one-hour run deadline and Saturday event cutoff", () => {
    const start = Date.UTC(2026, 8, 12, 12, 0, 0);
    expect(getRunDeadline(start)).toBe(Date.UTC(2026, 8, 12, 13, 0, 0));
    expect(isRunActive(start, Date.UTC(2026, 8, 12, 12, 59, 59))).toBe(true);
    expect(isRunActive(start, Date.UTC(2026, 8, 12, 13, 0, 0))).toBe(false);
    const lateStart = Date.UTC(2026, 8, 12, 15, 50, 0);
    expect(getRunDeadline(lateStart)).toBe(Date.UTC(2026, 8, 12, 16, 0, 0));
    expect(getEventCloseReason(Date.UTC(2026, 8, 12, 15, 59, 59))).toBeNull();
    expect(getEventCloseReason(ISACA_EVENT.deadlineMs)).toBe("event_closed");
  });

  it("permits a fresh run only after a failed attempt and before event close", () => {
    const beforeClose = Date.UTC(2026, 8, 12, 15, 59, 59);
    expect(isEventRestartable("failed", beforeClose)).toBe(true);
    expect(isEventRestartable("active", beforeClose)).toBe(false);
    expect(isEventRestartable("completed", beforeClose)).toBe(false);
    expect(isEventRestartable("failed", ISACA_EVENT.deadlineMs)).toBe(false);
  });
});
