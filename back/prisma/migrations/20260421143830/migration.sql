/*
  Warnings:

  - You are about to drop the `_user_chat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_user_chat" DROP CONSTRAINT "_user_chat_A_fkey";

-- DropForeignKey
ALTER TABLE "_user_chat" DROP CONSTRAINT "_user_chat_B_fkey";

-- DropTable
DROP TABLE "_user_chat";
