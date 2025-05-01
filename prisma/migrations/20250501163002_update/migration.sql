-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_reviewId_fkey";

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
