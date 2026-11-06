/*
  Warnings:

  - The values [Pending,Delivered,Read] on the enum `MessageStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `created_at` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `roles` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('MONOLOGUE', 'DIALOGUE', 'POLYLOGUE');

-- AlterEnum
BEGIN;
CREATE TYPE "MessageStatus_new" AS ENUM ('PENDING', 'DELIVERED', 'READ');
ALTER TABLE "public"."messages" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "messages" ALTER COLUMN "status" TYPE "MessageStatus_new" USING ("status"::text::"MessageStatus_new");
ALTER TYPE "MessageStatus" RENAME TO "MessageStatus_old";
ALTER TYPE "MessageStatus_new" RENAME TO "MessageStatus";
DROP TYPE "public"."MessageStatus_old";
ALTER TABLE "messages" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "roles" DROP COLUMN "created_at",
DROP COLUMN "updated_at";

-- CreateTable
CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_role" (
    "user_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "role_permission" (
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,

    CONSTRAINT "role_permission_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
