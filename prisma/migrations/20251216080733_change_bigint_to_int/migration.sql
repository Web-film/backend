/*
  Warnings:

  - The primary key for the `episode` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `episode` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `tmdb_episode_id` on the `episode` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `season_id` on the `episode` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `episodeview` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `episodeview` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `episode_id` on the `episodeview` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `film` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `film` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `tmdb_id` on the `film` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `filmgenre` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `film_id` on the `filmgenre` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `genre_id` on the `filmgenre` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `genre` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `genre` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `tmdb_id` on the `genre` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `season` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `season` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `tmdb_season_id` on the `season` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `film_id` on the `season` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `episode` DROP FOREIGN KEY `Episode_season_id_fkey`;

-- DropForeignKey
ALTER TABLE `episodeview` DROP FOREIGN KEY `EpisodeView_episode_id_fkey`;

-- DropForeignKey
ALTER TABLE `filmgenre` DROP FOREIGN KEY `FilmGenre_film_id_fkey`;

-- DropForeignKey
ALTER TABLE `filmgenre` DROP FOREIGN KEY `FilmGenre_genre_id_fkey`;

-- DropForeignKey
ALTER TABLE `season` DROP FOREIGN KEY `Season_film_id_fkey`;

-- DropIndex
DROP INDEX `Episode_season_id_fkey` ON `episode`;

-- DropIndex
DROP INDEX `EpisodeView_episode_id_fkey` ON `episodeview`;

-- DropIndex
DROP INDEX `FilmGenre_genre_id_fkey` ON `filmgenre`;

-- DropIndex
DROP INDEX `Season_film_id_fkey` ON `season`;

-- AlterTable
ALTER TABLE `episode` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `tmdb_episode_id` INTEGER NOT NULL,
    MODIFY `season_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `episodeview` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `episode_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `film` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `tmdb_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `filmgenre` DROP PRIMARY KEY,
    MODIFY `film_id` INTEGER NOT NULL,
    MODIFY `genre_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`film_id`, `genre_id`);

-- AlterTable
ALTER TABLE `genre` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `tmdb_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `season` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `tmdb_season_id` INTEGER NOT NULL,
    MODIFY `film_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

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
