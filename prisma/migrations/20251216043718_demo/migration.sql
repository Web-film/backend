-- CreateTable
CREATE TABLE `Film` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `tmdb_id` BIGINT NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `original_title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `overview` VARCHAR(191) NULL,
    `poster_path` VARCHAR(191) NULL,
    `backdrop_path` VARCHAR(191) NULL,
    `release_date` DATETIME(3) NULL,
    `type` ENUM('movie', 'tv') NOT NULL,
    `status` ENUM('ongoing', 'completed') NOT NULL,
    `rating` DOUBLE NULL,
    `vote_count` INTEGER NULL,
    `popularity` DOUBLE NULL,
    `runtime` INTEGER NULL,
    `trailer_key` VARCHAR(50) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `directors` JSON NULL,
    `cast` JSON NULL,

    UNIQUE INDEX `Film_tmdb_id_key`(`tmdb_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Season` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `tmdb_season_id` BIGINT NOT NULL,
    `film_id` BIGINT NOT NULL,
    `season_number` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `overview` VARCHAR(191) NULL,
    `poster_path` VARCHAR(191) NULL,
    `air_date` DATETIME(3) NULL,
    `episode_count` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Season_tmdb_season_id_key`(`tmdb_season_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Episode` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `tmdb_episode_id` BIGINT NOT NULL,
    `season_id` BIGINT NOT NULL,
    `episode_number` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `overview` VARCHAR(191) NULL,
    `runtime` INTEGER NULL,
    `air_date` DATETIME(3) NULL,
    `still_path` VARCHAR(191) NULL,
    `video_key` VARCHAR(50) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Episode_tmdb_episode_id_key`(`tmdb_episode_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Genre` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `tmdb_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `Genre_tmdb_id_key`(`tmdb_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FilmGenre` (
    `film_id` BIGINT NOT NULL,
    `genre_id` BIGINT NOT NULL,

    PRIMARY KEY (`film_id`, `genre_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EpisodeView` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `episode_id` BIGINT NOT NULL,
    `view_date` DATETIME(3) NOT NULL,
    `views` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Season` ADD CONSTRAINT `Season_film_id_fkey` FOREIGN KEY (`film_id`) REFERENCES `Film`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Episode` ADD CONSTRAINT `Episode_season_id_fkey` FOREIGN KEY (`season_id`) REFERENCES `Season`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FilmGenre` ADD CONSTRAINT `FilmGenre_film_id_fkey` FOREIGN KEY (`film_id`) REFERENCES `Film`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FilmGenre` ADD CONSTRAINT `FilmGenre_genre_id_fkey` FOREIGN KEY (`genre_id`) REFERENCES `Genre`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EpisodeView` ADD CONSTRAINT `EpisodeView_episode_id_fkey` FOREIGN KEY (`episode_id`) REFERENCES `Episode`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
