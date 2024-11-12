/*
  Warnings:

  - You are about to drop the column `availability` on the `washing_station` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `gasstations` ADD COLUMN `washing_station_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `favourite_station_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `washing_station` DROP COLUMN `availability`;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_favourite_station_id_fkey` FOREIGN KEY (`favourite_station_id`) REFERENCES `GasStations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GasStations` ADD CONSTRAINT `GasStations_washing_station_id_fkey` FOREIGN KEY (`washing_station_id`) REFERENCES `Washing_station`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GasStations` ADD CONSTRAINT `GasStations_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `Location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
