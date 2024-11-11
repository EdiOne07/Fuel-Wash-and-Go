-- CreateTable
CREATE TABLE `Testing` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `gas_station_id` INTEGER NOT NULL,
    `whatever_string` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
