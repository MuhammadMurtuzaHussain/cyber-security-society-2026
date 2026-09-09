import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

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

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type GameMission = typeof gameMissions.$inferSelect;
export type InsertGameMission = typeof gameMissions.$inferInsert;
export type MissionAttempt = typeof missionAttempts.$inferSelect;
export type GameAchievement = typeof gameAchievements.$inferSelect;
