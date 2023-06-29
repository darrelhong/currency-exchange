CREATE TABLE `rates` (
	`id` integer PRIMARY KEY NOT NULL,
	`base_currency` text NOT NULL,
	`target_currency` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`rate` text NOT NULL
);
