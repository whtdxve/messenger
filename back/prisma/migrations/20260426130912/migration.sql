/*
  Warnings:

  - Made the column `chat_id` on table `messages` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_chat_id_fkey";

-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "chat_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
