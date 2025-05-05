/*
  Warnings:

  - You are about to drop the column `paymentId` on the `events` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[eventId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_paymentId_fkey";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "paymentId";

-- CreateIndex
CREATE UNIQUE INDEX "Payment_eventId_key" ON "Payment"("eventId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
