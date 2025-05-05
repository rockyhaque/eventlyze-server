-- AlterEnum
ALTER TYPE "EventStatus" ADD VALUE 'BANNED';

-- AlterEnum
ALTER TYPE "ParticipantStatus" ADD VALUE 'BANNED';

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "readUser" BOOLEAN NOT NULL DEFAULT false;
