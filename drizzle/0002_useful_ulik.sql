CREATE TABLE `eventClaims` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventKey` varchar(80) NOT NULL,
	`runId` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`studentId` varchar(64),
	`status` enum('reserved','submitted') NOT NULL DEFAULT 'reserved',
	`reservedAt` timestamp NOT NULL DEFAULT (now()),
	`consentedAt` timestamp,
	CONSTRAINT `eventClaims_id` PRIMARY KEY(`id`),
	CONSTRAINT `eventClaims_run_unique` UNIQUE(`runId`),
	CONSTRAINT `eventClaims_event_student_unique` UNIQUE(`eventKey`,`studentId`)
);
--> statement-breakpoint
CREATE TABLE `eventCounters` (
	`eventKey` varchar(80) NOT NULL,
	`claimedCount` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `eventCounters_eventKey` PRIMARY KEY(`eventKey`)
);
--> statement-breakpoint
CREATE TABLE `eventRuns` (
	`id` varchar(64) NOT NULL,
	`eventKey` varchar(80) NOT NULL,
	`userId` int NOT NULL,
	`seed` varchar(96) NOT NULL,
	`currentStage` int NOT NULL DEFAULT 1,
	`attemptsInStage` int NOT NULL DEFAULT 0,
	`status` enum('active','completed','failed') NOT NULL DEFAULT 'active',
	`failedReason` varchar(48),
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `eventRuns_id` PRIMARY KEY(`id`),
	CONSTRAINT `eventRuns_event_user_unique` UNIQUE(`eventKey`,`userId`)
);
