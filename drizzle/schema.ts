import { int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/** Core account table supplied by the Manus OAuth scaffold. */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

/** Data-driven mission catalog: new simulations can be added without changing the player schema. */
export const gameMissions = mysqlTable("gameMissions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  title: varchar("title", { length: 160 }).notNull(),
  description: text("description").notNull(),
  difficulty: varchar("difficulty", { length: 32 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  xp: int("xp").notNull(),
  estimatedTime: varchar("estimatedTime", { length: 32 }).notNull(),
  challengeType: varchar("challengeType", { length: 64 }).notNull(),
  instructions: text("instructions").notNull(),
  hints: text("hints").notNull(),
  solution: text("solution").notNull(),
  learningContent: text("learningContent").notNull(),
  status: mysqlEnum("status", ["active", "disabled", "draft"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** One durable record per student and mission attempt / completion. */
export const missionAttempts = mysqlTable("missionAttempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  missionId: varchar("missionId", { length: 64 }).notNull(),
  status: mysqlEnum("status", ["started", "completed"]).default("started").notNull(),
  xpEarned: int("xpEarned").default(0).notNull(),
  hintsUsed: int("hintsUsed").default(0).notNull(),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

/** Society-maintained badge definitions. */
export const gameAchievements = mysqlTable("gameAchievements", {
  id: varchar("id", { length: 64 }).primaryKey(),
  title: varchar("title", { length: 120 }).notNull(),
  description: text("description").notNull(),
  requirement: varchar("requirement", { length: 160 }).notNull(),
  icon: varchar("icon", { length: 32 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/** Join table for achievements earned by an authenticated student. */
export const userAchievements = mysqlTable("userAchievements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  achievementId: varchar("achievementId", { length: 64 }).notNull(),
  earnedAt: timestamp("earnedAt").defaultNow().notNull(),
});

/** One authenticated, server-seeded run for an invitation competition event. */
export const eventRuns = mysqlTable("eventRuns", {
  id: varchar("id", { length: 64 }).primaryKey(),
  eventKey: varchar("eventKey", { length: 80 }).notNull(),
  userId: int("userId").notNull(),
  seed: varchar("seed", { length: 96 }).notNull(),
  currentStage: int("currentStage").default(1).notNull(),
  attemptsInStage: int("attemptsInStage").default(0).notNull(),
  status: mysqlEnum("status", ["active", "completed", "failed"]).default("active").notNull(),
  failedReason: varchar("failedReason", { length: 48 }),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [uniqueIndex("eventRuns_event_user_unique").on(table.eventKey, table.userId)]);

/** Finite invitation reservations. Student IDs are collected only after a place is secured. */
export const eventClaims = mysqlTable("eventClaims", {
  id: int("id").autoincrement().primaryKey(),
  eventKey: varchar("eventKey", { length: 80 }).notNull(),
  runId: varchar("runId", { length: 64 }).notNull(),
  userId: int("userId").notNull(),
  studentId: varchar("studentId", { length: 64 }),
  status: mysqlEnum("status", ["reserved", "submitted"]).default("reserved").notNull(),
  reservedAt: timestamp("reservedAt").defaultNow().notNull(),
  consentedAt: timestamp("consentedAt"),
}, (table) => [
  uniqueIndex("eventClaims_run_unique").on(table.runId),
  uniqueIndex("eventClaims_event_student_unique").on(table.eventKey, table.studentId),
]);

/** Atomic counter prevents more than ten invitation positions being reserved. */
export const eventCounters = mysqlTable("eventCounters", {
  eventKey: varchar("eventKey", { length: 80 }).primaryKey(),
  claimedCount: int("claimedCount").default(0).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type GameMission = typeof gameMissions.$inferSelect;
export type InsertGameMission = typeof gameMissions.$inferInsert;
export type MissionAttempt = typeof missionAttempts.$inferSelect;
export type GameAchievement = typeof gameAchievements.$inferSelect;
export type EventRun = typeof eventRuns.$inferSelect;
export type EventClaim = typeof eventClaims.$inferSelect;
