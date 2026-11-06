-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "chat_id" INTEGER;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE SET NULL ON UPDATE CASCADE;
