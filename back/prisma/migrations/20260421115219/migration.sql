/*
  Warnings:

  - You are about to drop the `user_chats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_chats" DROP CONSTRAINT "user_chats_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "user_chats" DROP CONSTRAINT "user_chats_user_id_fkey";

-- DropTable
DROP TABLE "user_chats";

-- CreateTable
CREATE TABLE "user_chat" (
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "chat_id" INTEGER NOT NULL,

    CONSTRAINT "user_chat_pkey" PRIMARY KEY ("user_id","chat_id")
);

-- AddForeignKey
ALTER TABLE "user_chat" ADD CONSTRAINT "user_chat_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_chat" ADD CONSTRAINT "user_chat_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
