/*
  Warnings:

  - You are about to drop the column `ownerUsername` on the `Playlist` table. All the data in the column will be lost.
  - The primary key for the `PlaylistMedia` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ownerUsername` on the `PlaylistMedia` table. All the data in the column will be lost.
  - The primary key for the `Rating` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `score` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `userUsername` on the `Rating` table. All the data in the column will be lost.
  - The primary key for the `Watchlist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userUsername` on the `Watchlist` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name,profileId]` on the table `Playlist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `profileId` to the `Playlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId` to the `PlaylistMedia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId` to the `Rating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `Rating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId` to the `Watchlist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Playlist" DROP CONSTRAINT "Playlist_ownerUsername_fkey";

-- DropForeignKey
ALTER TABLE "public"."PlaylistMedia" DROP CONSTRAINT "PlaylistMedia_playlistName_ownerUsername_fkey";

-- DropForeignKey
ALTER TABLE "public"."Rating" DROP CONSTRAINT "Rating_userUsername_fkey";

-- DropForeignKey
ALTER TABLE "public"."Watchlist" DROP CONSTRAINT "Watchlist_userUsername_fkey";

-- DropIndex
DROP INDEX "public"."Playlist_name_ownerUsername_key";

-- AlterTable
ALTER TABLE "public"."Playlist" DROP COLUMN "ownerUsername",
ADD COLUMN     "profileId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."PlaylistMedia" DROP CONSTRAINT "PlaylistMedia_pkey",
DROP COLUMN "ownerUsername",
ADD COLUMN     "profileId" TEXT NOT NULL,
ADD CONSTRAINT "PlaylistMedia_pkey" PRIMARY KEY ("playlistName", "profileId", "mediaTmdbId");

-- AlterTable
ALTER TABLE "public"."Rating" DROP CONSTRAINT "Rating_pkey",
DROP COLUMN "score",
DROP COLUMN "userUsername",
ADD COLUMN     "profileId" TEXT NOT NULL,
ADD COLUMN     "rating" INTEGER NOT NULL,
ADD CONSTRAINT "Rating_pkey" PRIMARY KEY ("profileId", "mediaTmdbId");

-- AlterTable
ALTER TABLE "public"."Watchlist" DROP CONSTRAINT "Watchlist_pkey",
DROP COLUMN "userUsername",
ADD COLUMN     "profileId" TEXT NOT NULL,
ADD CONSTRAINT "Watchlist_pkey" PRIMARY KEY ("profileId", "mediaTmdbId");

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "public"."Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_username_key" ON "public"."Profile"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_name_profileId_key" ON "public"."Playlist"("name", "profileId");

-- AddForeignKey
ALTER TABLE "public"."Rating" ADD CONSTRAINT "Rating_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Watchlist" ADD CONSTRAINT "Watchlist_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Playlist" ADD CONSTRAINT "Playlist_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaylistMedia" ADD CONSTRAINT "PlaylistMedia_playlistName_profileId_fkey" FOREIGN KEY ("playlistName", "profileId") REFERENCES "public"."Playlist"("name", "profileId") ON DELETE CASCADE ON UPDATE CASCADE;
