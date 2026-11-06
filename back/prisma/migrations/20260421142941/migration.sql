/*
  Warnings:

  - You are about to drop the `_ChatToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ChatToUser" DROP CONSTRAINT "_ChatToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChatToUser" DROP CONSTRAINT "_ChatToUser_B_fkey";

-- DropTable
DROP TABLE "_ChatToUser";

-- CreateTable
CREATE TABLE "_UserChat" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UserChat_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserChat_B_index" ON "_UserChat"("B");

-- AddForeignKey
ALTER TABLE "_UserChat" ADD CONSTRAINT "_UserChat_A_fkey" FOREIGN KEY ("A") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserChat" ADD CONSTRAINT "_UserChat_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
