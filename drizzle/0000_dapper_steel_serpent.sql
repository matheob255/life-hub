CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`icon` text NOT NULL,
	`color` text NOT NULL,
	`createdAt` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`trackableId` integer NOT NULL,
	`date` text NOT NULL,
	`value` text NOT NULL,
	`notes` text,
	`createdAt` text NOT NULL,
	FOREIGN KEY (`trackableId`) REFERENCES `trackables`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `trackables` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`categoryId` integer NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`unit` text,
	`target` text,
	`createdAt` text NOT NULL,
	FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
