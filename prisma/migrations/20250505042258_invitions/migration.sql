/*
  Warnings:

  - Added the required column `eventId` to the `Invite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hostId` to the `Invite` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "Invite" ADD COLUMN     "eventId" TEXT NOT NULL,
ADD COLUMN     "hostId" TEXT NOT NULL,
ADD COLUMN     "status" "InviteStatus" NOT NULL DEFAULT 'PENDING';
