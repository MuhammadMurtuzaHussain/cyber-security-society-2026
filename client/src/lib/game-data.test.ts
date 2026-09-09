import { describe, expect, it } from "vitest";
import { achievements, levelFromXp, missionById, missions, titleForLevel } from "./game-data";

describe("Cyber Security Society game catalog", () => {
  it("provides six data-driven fictional missions", () => {
    expect(missions).toHaveLength(6);
    expect(missions.map((mission) => mission.id)).toEqual([
      "guess-my-password",
      "catch-the-phish",
      "who-hacked-us",
      "broken-website",
      "escape-room",
      "isaca-invitation",
    ]);
    missions.forEach((mission) => {
      expect(mission.description).toMatch(/fictional|Sarah|student|ACME|ransomware/i);
      expect(mission.xp).toBeGreaterThan(0);
      expect(mission.learning.defenders.length).toBeGreaterThan(30);
    });
  });

  it("resolves a mission route and rejects unknown mission identifiers", () => {
    expect(missionById("catch-the-phish")?.title).toBe("Catch the Phish");
    expect(missionById("not-a-real-mission")).toBeUndefined();
  });

  it("maps XP to beginner-friendly progression titles", () => {
    expect(levelFromXp(0)).toBe(1);
    expect(levelFromXp(1420)).toBe(3);
    expect(levelFromXp(3000)).toBe(7);
    expect(titleForLevel(1)).toBe("Recruit");
    expect(titleForLevel(4)).toBe("Investigator");
    expect(titleForLevel(99)).toBe("Security Expert");
  });

  it("contains the required starter achievement path", () => {
    expect(achievements.map((achievement) => achievement.id)).toEqual(expect.arrayContaining([
      "password-cracker",
      "phishing-hunter",
      "digital-detective",
      "web-explorer",
      "ctf-survivor",
    ]));
  });
});
