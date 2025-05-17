CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`avatar` text NOT NULL,
	`role` text DEFAULT 'user',
	`created_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `vote` (
	`media_id` text,
	`user_id` text,
	`media_type` text,
	PRIMARY KEY(`media_id`, `user_id`)
);
