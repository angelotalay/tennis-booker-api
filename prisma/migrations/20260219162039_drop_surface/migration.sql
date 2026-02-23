/*
  Warnings:

  - You are about to drop the column `surfaceId` on the `Court` table. All the data in the column will be lost.
  - You are about to drop the `Surface` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Court" DROP CONSTRAINT "Court_surfaceId_fkey";

-- AlterTable
ALTER TABLE "Court" DROP COLUMN "surfaceId";

-- DropTable
DROP TABLE "Surface";
