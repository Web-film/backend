/*
  Warnings:

  - You are about to drop the `episodeview` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `episodeview` DROP FOREIGN KEY `EpisodeView_episode_id_fkey`;

-- AlterTable
ALTER TABLE `episode` ADD COLUMN `views` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `film` ADD COLUMN `views` INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `episodeview`;
