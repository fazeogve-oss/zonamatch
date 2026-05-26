ALTER TABLE `profiles` MODIFY COLUMN `photos` varchar(2000) NOT NULL DEFAULT '[]';--> statement-breakpoint
ALTER TABLE `profiles` MODIFY COLUMN `interests` varchar(1000) NOT NULL DEFAULT '[]';