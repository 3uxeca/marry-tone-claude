-- MarryTone Initial Migration
-- Sprint 1 | 2026-04-15

CREATE TABLE `users` (
  `id`            VARCHAR(191) NOT NULL,
  `email`         VARCHAR(191) NOT NULL,
  `password_hash` VARCHAR(191) NULL,
  `name`          VARCHAR(191) NOT NULL,
  `system_role`   ENUM('USER','ADMIN') NOT NULL DEFAULT 'USER',
  `created_at`    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`    DATETIME(3) NOT NULL,
  `deleted_at`    DATETIME(3) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `users_email_key` (`email`),
  INDEX `users_email_idx` (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `user_sessions` (
  `id`         VARCHAR(191) NOT NULL,
  `user_id`    VARCHAR(191) NOT NULL,
  `token`      VARCHAR(191) NOT NULL,
  `expires_at` DATETIME(3) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `user_sessions_token_key` (`token`),
  INDEX `user_sessions_user_id_idx` (`user_id`),
  INDEX `user_sessions_token_idx` (`token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `profiles` (
  `id`                   VARCHAR(191) NOT NULL,
  `user_id`              VARCHAR(191) NOT NULL,
  `wedding_role`         ENUM('BRIDE','GROOM') NULL,
  `diagnosis_experience` ENUM('EXPERIENCED','NOT_EXPERIENCED','UNSURE') NULL,
  `personal_color_season` ENUM('SPRING_WARM','SUMMER_COOL','AUTUMN_WARM','WINTER_COOL') NULL,
  `skeleton_type`        ENUM('STRAIGHT','WAVE','NATURAL') NULL,
  `created_at`           DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`           DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `profiles_user_id_key` (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `diagnosis_gates` (
  `id`           VARCHAR(191) NOT NULL,
  `profile_id`   VARCHAR(191) NOT NULL,
  `experience`   ENUM('EXPERIENCED','NOT_EXPERIENCED','UNSURE') NOT NULL,
  `wedding_role` ENUM('BRIDE','GROOM') NOT NULL,
  `next_route`   VARCHAR(191) NOT NULL,
  `completed_at` DATETIME(3) NULL,
  `created_at`   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`   DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `diagnosis_gates_profile_id_key` (`profile_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `diagnosis_logs` (
  `id`                VARCHAR(191) NOT NULL,
  `profile_id`        VARCHAR(191) NOT NULL,
  `diagnosis_type`    VARCHAR(191) NOT NULL,
  `status`            ENUM('PENDING','IN_PROGRESS','COMPLETED','FAILED','MANUAL') NOT NULL,
  `confidence`        DOUBLE NULL,
  `retry_count`       INT NOT NULL DEFAULT 0,
  `is_manual_fallback` BOOLEAN NOT NULL DEFAULT false,
  `error_message`     TEXT NULL,
  `created_at`        DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`        DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `diagnosis_logs_profile_id_idx` (`profile_id`),
  INDEX `diagnosis_logs_diagnosis_type_idx` (`diagnosis_type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Foreign Keys
ALTER TABLE `user_sessions`
  ADD CONSTRAINT `user_sessions_user_id_fkey`
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `profiles`
  ADD CONSTRAINT `profiles_user_id_fkey`
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `diagnosis_gates`
  ADD CONSTRAINT `diagnosis_gates_profile_id_fkey`
  FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `diagnosis_logs`
  ADD CONSTRAINT `diagnosis_logs_profile_id_fkey`
  FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
