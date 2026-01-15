-- CreateEnum
CREATE TYPE "public"."MediaType" AS ENUM ('MOVIE', 'TV');

-- CreateEnum
CREATE TYPE "public"."WatchStatus" AS ENUM ('WATCHING', 'COMPLETED', 'PLANNED', 'DROPPED', 'REMOVED');

-- CreateEnum
CREATE TYPE "public"."Genre" AS ENUM ('ACTION', 'COMEDY', 'DRAMA', 'FANTASY', 'HORROR', 'ROMANCE', 'SCIFI', 'THRILLER', 'ANIMATION');

-- CreateTable
CREATE TABLE "public"."User" (
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "public"."Media" (
    "tmdbId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "type" "public"."MediaType" NOT NULL DEFAULT 'MOVIE',
    "genres" "public"."Genre"[],
    "description" TEXT,
    "posterUrl" TEXT,
    "producer" TEXT,
    "releaseYear" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("tmdbId")
);

-- CreateTable
CREATE TABLE "public"."Episode" (
    "mediaTmdbId" INTEGER NOT NULL,
    "seasonNumber" INTEGER NOT NULL,
    "episodeNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "airDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Episode_pkey" PRIMARY KEY ("mediaTmdbId","seasonNumber","episodeNumber")
);

-- CreateTable
CREATE TABLE "public"."Rating" (
    "userUsername" TEXT NOT NULL,
    "mediaTmdbId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "review" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("userUsername","mediaTmdbId")
);

-- CreateTable
CREATE TABLE "public"."Watchlist" (
    "userUsername" TEXT NOT NULL,
    "mediaTmdbId" INTEGER NOT NULL,
    "status" "public"."WatchStatus" NOT NULL DEFAULT 'PLANNED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Watchlist_pkey" PRIMARY KEY ("userUsername","mediaTmdbId")
);

-- CreateTable
CREATE TABLE "public"."Playlist" (
    "id" SERIAL NOT NULL,
    "ownerUsername" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlaylistMedia" (
    "playlistName" TEXT NOT NULL,
    "ownerUsername" TEXT NOT NULL,
    "mediaTmdbId" INTEGER NOT NULL,

    CONSTRAINT "PlaylistMedia_pkey" PRIMARY KEY ("playlistName","ownerUsername","mediaTmdbId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_name_ownerUsername_key" ON "public"."Playlist"("name", "ownerUsername");

-- AddForeignKey
ALTER TABLE "public"."Episode" ADD CONSTRAINT "Episode_mediaTmdbId_fkey" FOREIGN KEY ("mediaTmdbId") REFERENCES "public"."Media"("tmdbId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Rating" ADD CONSTRAINT "Rating_userUsername_fkey" FOREIGN KEY ("userUsername") REFERENCES "public"."User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Rating" ADD CONSTRAINT "Rating_mediaTmdbId_fkey" FOREIGN KEY ("mediaTmdbId") REFERENCES "public"."Media"("tmdbId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Watchlist" ADD CONSTRAINT "Watchlist_userUsername_fkey" FOREIGN KEY ("userUsername") REFERENCES "public"."User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Watchlist" ADD CONSTRAINT "Watchlist_mediaTmdbId_fkey" FOREIGN KEY ("mediaTmdbId") REFERENCES "public"."Media"("tmdbId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Playlist" ADD CONSTRAINT "Playlist_ownerUsername_fkey" FOREIGN KEY ("ownerUsername") REFERENCES "public"."User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaylistMedia" ADD CONSTRAINT "PlaylistMedia_playlistName_ownerUsername_fkey" FOREIGN KEY ("playlistName", "ownerUsername") REFERENCES "public"."Playlist"("name", "ownerUsername") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaylistMedia" ADD CONSTRAINT "PlaylistMedia_mediaTmdbId_fkey" FOREIGN KEY ("mediaTmdbId") REFERENCES "public"."Media"("tmdbId") ON DELETE CASCADE ON UPDATE CASCADE;
