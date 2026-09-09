CREATE TABLE `gameAchievements` (
	`id` varchar(64) NOT NULL,
	`title` varchar(120) NOT NULL,
	`description` text NOT NULL,
	`requirement` varchar(160) NOT NULL,
	`icon` varchar(32) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `gameAchievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gameMissions` (
	`id` varchar(64) NOT NULL,
	`title` varchar(160) NOT NULL,
	`description` text NOT NULL,
	`difficulty` varchar(32) NOT NULL,
	`category` varchar(80) NOT NULL,
	`xp` int NOT NULL,
	`estimatedTime` varchar(32) NOT NULL,
	`challengeType` varchar(64) NOT NULL,
	`instructions` text NOT NULL,
	`hints` text NOT NULL,
	`solution` text NOT NULL,
	`learningContent` text NOT NULL,
	`status` enum('active','disabled','draft') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `gameMissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `missionAttempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`missionId` varchar(64) NOT NULL,
	`status` enum('started','completed') NOT NULL DEFAULT 'started',
	`xpEarned` int NOT NULL DEFAULT 0,
	`hintsUsed` int NOT NULL DEFAULT 0,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `missionAttempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userAchievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`achievementId` varchar(64) NOT NULL,
	`earnedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userAchievements_id` PRIMARY KEY(`id`)
);
