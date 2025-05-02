/*
  Warnings:

  - You are about to drop the column `eventId` on the `Invite` table. All the data in the column will be lost.
  - You are about to drop the column `inviteId` on the `Invite` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `inviteId` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `participantId` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `reviewId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `_EventInvites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EventParticipants` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_eventId_fkey";

-- DropForeignKey
ALTER TABLE "_EventInvites" DROP CONSTRAINT "_EventInvites_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventInvites" DROP CONSTRAINT "_EventInvites_B_fkey";

-- DropForeignKey
ALTER TABLE "_EventParticipants" DROP CONSTRAINT "_EventParticipants_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventParticipants" DROP CONSTRAINT "_EventParticipants_B_fkey";

-- AlterTable
ALTER TABLE "Invite" DROP COLUMN "eventId",
DROP COLUMN "inviteId";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "eventId";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "eventId";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "inviteId",
DROP COLUMN "participantId",
ADD COLUMN     "eventBanner" TEXT,
ADD COLUMN     "meetingLink" TEXT,
ADD COLUMN     "meetingLinkPassword" TEXT,
ADD COLUMN     "platform" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "reviewId";

-- DropTable
DROP TABLE "_EventInvites";

-- DropTable
DROP TABLE "_EventParticipants";

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_id_fkey" FOREIGN KEY ("id") REFERENCES "Invite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
