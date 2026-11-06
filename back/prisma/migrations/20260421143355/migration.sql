/*
  Warnings:

  - You are about to drop the `_UserChat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserChat" DROP CONSTRAINT "_UserChat_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserChat" DROP CONSTRAINT "_UserChat_B_fkey";

-- DropTable
DROP TABLE "_UserChat";

-- CreateTable
CREATE TABLE "_user_chat" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_user_chat_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_user_chat_B_index" ON "_user_chat"("B");

-- AddForeignKey
ALTER TABLE "_user_chat" ADD CONSTRAINT "_user_chat_A_fkey" FOREIGN KEY ("A") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user_chat" ADD CONSTRAINT "_user_chat_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
