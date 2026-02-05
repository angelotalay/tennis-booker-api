/*
  Warnings:

  - Added the required column `indoor` to the `Court` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surfaceId` to the `Court` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Court" ADD COLUMN     "indoor" BOOLEAN NOT NULL,
ADD COLUMN     "surfaceId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Surface" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,

    CONSTRAINT "Surface_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Court" ADD CONSTRAINT "Court_surfaceId_fkey" FOREIGN KEY ("surfaceId") REFERENCES "Surface"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
