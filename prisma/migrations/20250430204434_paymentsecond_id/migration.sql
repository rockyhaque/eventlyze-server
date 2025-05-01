/*
  Warnings:

  - The primary key for the `payments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `payments` table. All the data in the column will be lost.
  - Added the required column `paymentId` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentUrl` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payments" DROP CONSTRAINT "payments_pkey",
DROP COLUMN "id",
ADD COLUMN     "paymentId" TEXT NOT NULL,
ADD COLUMN     "paymentUrl" TEXT NOT NULL,
ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("paymentId");
