/*
  Warnings:

  - You are about to drop the column `audioUrl` on the `Videos` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnailUrl` on the `Videos` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Videos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Videos" DROP COLUMN "audioUrl",
DROP COLUMN "thumbnailUrl",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Videos" ADD CONSTRAINT "Videos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
