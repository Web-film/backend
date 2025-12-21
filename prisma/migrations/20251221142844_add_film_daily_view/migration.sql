-- CreateTable
CREATE TABLE `FilmDailyView` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `film_id` INTEGER NOT NULL,
    `view_date` DATE NOT NULL,
    `views` INTEGER NOT NULL DEFAULT 0,

    INDEX `FilmDailyView_view_date_idx`(`view_date`),
    UNIQUE INDEX `FilmDailyView_film_id_view_date_key`(`film_id`, `view_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FilmDailyView` ADD CONSTRAINT `FilmDailyView_film_id_fkey` FOREIGN KEY (`film_id`) REFERENCES `Film`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
