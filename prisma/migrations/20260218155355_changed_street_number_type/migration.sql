/*
  Warnings:

  - You are about to alter the column `streetNumber` on the `Address` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `VarChar(10)`.
  - A unique constraint covering the columns `[name]` on the table `Club` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "streetNumber" SET DATA TYPE VARCHAR(10);

-- CreateIndex
CREATE UNIQUE INDEX "Club_name_key" ON "Club"("name");
