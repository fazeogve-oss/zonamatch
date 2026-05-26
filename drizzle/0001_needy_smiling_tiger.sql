CREATE TABLE `likes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fromUserId` int NOT NULL,
	`toUserId` int NOT NULL,
	`type` enum('like','superlike','nope') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `likes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `matches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user1Id` int NOT NULL,
	`user2Id` int NOT NULL,
	`lastMessage` text,
	`lastMessageAt` timestamp,
	`unreadCount1` int NOT NULL DEFAULT 0,
	`unreadCount2` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `matches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`matchId` int NOT NULL,
	`senderId` int NOT NULL,
	`text` text NOT NULL,
	`read` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`displayName` varchar(100) NOT NULL,
	`birthDate` varchar(20) NOT NULL,
	`gender` enum('man','woman','nonbinary','other') NOT NULL,
	`lookingFor` enum('men','women','everyone') NOT NULL DEFAULT 'everyone',
	`bio` text,
	`photos` text NOT NULL DEFAULT ('[]'),
	`interests` text NOT NULL DEFAULT ('[]'),
	`city` varchar(100),
	`isPremium` boolean NOT NULL DEFAULT false,
	`premiumPlan` enum('none','premium','gold') NOT NULL DEFAULT 'none',
	`premiumUntil` timestamp,
	`swipesLeft` int NOT NULL DEFAULT 20,
	`superLikesLeft` int NOT NULL DEFAULT 1,
	`boostsLeft` int NOT NULL DEFAULT 0,
	`lastSwipeReset` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `profiles_userId_unique` UNIQUE(`userId`)
);
