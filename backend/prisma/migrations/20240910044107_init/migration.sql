/*
  Warnings:

  - The primary key for the `RefreshToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `refreshToken` on the `RefreshToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[refresh_token]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `refresh_token` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "RefreshToken_refreshToken_key";

-- AlterTable
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_pkey",
DROP COLUMN "refreshToken",
ADD COLUMN     "refresh_token" TEXT NOT NULL,
ADD CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("refresh_token");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_refresh_token_key" ON "RefreshToken"("refresh_token");
