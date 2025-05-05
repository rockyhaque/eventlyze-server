/*
  Warnings:

  - Changed the type of `category` on the `events` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('MUSIC', 'TECHNOLOGY', 'FOOD_AND_DRINK', 'ARTS', 'BUSINESS', 'SPORTS', 'NETWORKING', 'ENTERTAINMENT', 'PHOTOGRAPHY', 'GAMING', 'TRAVEL', 'EDUCATION');

-- AlterTable
ALTER TABLE "events" DROP COLUMN "category",
ADD COLUMN     "category" "EventCategory" NOT NULL;
