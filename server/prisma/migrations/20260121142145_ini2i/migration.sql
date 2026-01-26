/*
  Warnings:

  - You are about to drop the column `assetId` on the `Bid` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Bid` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `Bid` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to drop the column `balance` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Asset` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AssetImage` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `auctionId` to the `Bid` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AuctionStatus" AS ENUM ('ACTIVE', 'ENDED', 'PAYMENT_PENDING', 'COMPLETED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_acquiredById_fkey";

-- DropForeignKey
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_listedById_fkey";

-- DropForeignKey
ALTER TABLE "AssetImage" DROP CONSTRAINT "AssetImage_assetId_fkey";

-- DropForeignKey
ALTER TABLE "Bid" DROP CONSTRAINT "Bid_assetId_fkey";

-- AlterTable
ALTER TABLE "Bid" DROP COLUMN "assetId",
DROP COLUMN "createdAt",
ADD COLUMN     "auctionId" TEXT NOT NULL,
ADD COLUMN     "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "amount" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "balance",
DROP COLUMN "updatedAt",
ADD COLUMN     "wallet" INTEGER NOT NULL DEFAULT 50000;

-- DropTable
DROP TABLE "Asset";

-- DropTable
DROP TABLE "AssetImage";

-- DropEnum
DROP TYPE "AssetStatus";

-- CreateTable
CREATE TABLE "Auction" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "basePrice" INTEGER NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" "AuctionStatus" NOT NULL DEFAULT 'ACTIVE',
    "sellerId" TEXT NOT NULL,
    "winnerId" TEXT,
    "highestBid" INTEGER NOT NULL DEFAULT 0,
    "currentHolder" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Auction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
