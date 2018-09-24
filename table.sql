CREATE TABLE `users` (
	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`email` VARCHAR(50) NULL DEFAULT NULL,
	`password` VARCHAR(50) NULL DEFAULT NULL,
	`verified` TINYINT(1) NULL DEFAULT '0',
	`code` VARCHAR(50) NULL DEFAULT '0',
	PRIMARY KEY (`id`)
)
ENGINE=InnoDB
;
