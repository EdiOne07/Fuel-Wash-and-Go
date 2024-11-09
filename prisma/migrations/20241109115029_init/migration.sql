/*
  Warnings:

  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[password]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `favourite_station_id` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `name`,
    ADD COLUMN `favourite_station_id` INTEGER NOT NULL,
    ADD COLUMN `location` VARCHAR(191) NOT NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `username` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `GasStations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `washing_station_available` BOOLEAN NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `gas_price` INTEGER NOT NULL,
    `location_id` INTEGER NOT NULL,
    `status` ENUM('Empty', 'AverageBusy', 'VeryBusy') NOT NULL DEFAULT 'Empty',
    `rating` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Washing_station` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `gas_station_id` INTEGER NOT NULL,
    `standard_wash_price` INTEGER NOT NULL,
    `comfort_wash_price` INTEGER NOT NULL,
    `premium_wash_price` INTEGER NOT NULL,
    `availability` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_password_key` ON `User`(`password`);
