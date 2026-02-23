-- CreateEnum
CREATE TYPE "Surface" AS ENUM ('HARD', 'CLAY', 'GRASS', 'CARPET');

-- AlterTable
ALTER TABLE "Court" ADD COLUMN     "surface" "Surface" NOT NULL DEFAULT 'HARD';
