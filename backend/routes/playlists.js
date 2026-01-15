import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

/// confirms user’s Favorites playlist exists, then creates playlist if "favorite" doesn't exist
async function ensureFavorites(profileId) {
  let favorites = await prisma.playlist.findFirst({
    where: { profileId, isFavorite: true },
  });

  if (!favorites) {
    favorites = await prisma.playlist.create({
      data: {
        name: "Favorites",
        isFavorite: true,
        isPublic: false,
        profileId,
      },
    });
  }

  return favorites;
}


/// Create a new playlist (user-created, not favorites)

router.post("/", async (req, res) => {
    try {
        const { userId, name, isPublic = true } = req.body;

        if (!userId || !name) {
            return res.status(400).json({ error: "Missing userId or name." });
        }

    const playlist = await prisma.playlist.create({
      data: { name, isPublic, profileId: userId },
    });

    res.status(201).json(playlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create playlist." });
  }
});


// POST /playlists/favorites
// Add a show to the user's Favorites playlist

router.post("/favorites", async (req, res) => {
  try {
    const { profileId, tmdbId, title, posterUrl } = req.body;

    if (!profileId || !tmdbId || !title) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Upsert the media
    const media = await prisma.media.upsert({
      where: { tmdbId },
      update: {},
      create: { tmdbId, title, posterUrl: posterUrl || null },
    });

    // Get or create favorites playlist
    const favorites = await ensureFavorites(profileId);

    // Check if media is already in playlist
    const exists = await prisma.playlistMedia.findUnique({
      where: {
        playlistId_mediaTmdbId: {
          playlistId: favorites.id,
          mediaTmdbId: media.tmdbId,
        },
      },
    });

    if (exists) return res.status(200).json({ message: "Media already in favorites." });

    // Connect media
    await prisma.playlistMedia.create({
      data: {
        playlistId: favorites.id,
        mediaTmdbId: media.tmdbId,
      },
    });

    const updatedFavorites = await prisma.playlist.findUnique({
      where: { id: favorites.id },
      include: { playlistMedia: { include: { media: true } } },
    });

    res.status(201).json(updatedFavorites);
  } catch (err) {
    console.error("Error adding favorite:", err);
    res.status(500).json({ error: "Failed to add favorite." });
  }
});




/// Fetches the user's Favorites playlist
router.get("/favorites/:profileId", async (req, res) => {
  try {
    const { profileId } = req.params;

    if (!profileId) {
      return res.status(400).json({ error: "Missing profileId parameter." });
    }

    const favorites = await prisma.playlist.findFirst({
      where: { profileId, isFavorite: true },
      include: { playlistMedia: { include: { media: true } } },
    });

    if (!favorites) {
      return res.status(200).json({ playlist: null, message: "No favorites playlist found." });
    }

    return res.status(200).json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return res.status(500).json({ error: "Failed to fetch favorites." });
  }
});




/// Add media to custom playlist
router.post("/:playlistId/media", async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { tmdbId, title, posterUrl } = req.body;

    if (!playlistId || !tmdbId || !title) {
      return res.status(400).json({ error: "Missing playlistId or media info." });
    }

    const playlist = await prisma.playlist.findUnique({ where: { id: Number(playlistId) } });
    if (!playlist) return res.status(404).json({ error: "Playlist not found." });

    const media = await prisma.media.upsert({
      where: { tmdbId },
      update: {},
      create: { tmdbId, title, posterUrl: posterUrl || null },
    });

    const exists = await prisma.playlistMedia.findUnique({
      where: {
        playlistId_mediaTmdbId: {
          playlistId: playlist.id,
          mediaTmdbId: media.tmdbId,
        },
      },
    });

    if (exists) return res.status(200).json({ message: "Media already in playlist." });

    await prisma.playlistMedia.create({
      data: { playlistId: playlist.id, mediaTmdbId: media.tmdbId },
    });

    const updatedPlaylist = await prisma.playlist.findUnique({
      where: { id: playlist.id },
      include: { playlistMedia: { include: { media: true } } },
    });

    res.status(201).json(updatedPlaylist);
  } catch (err) {
    console.error("Error adding media:", err);
    res.status(500).json({ error: "Failed to add media." });
  }
});


/// Remove media from playlist
router.delete("/:playlistId/media/:tmdbId", async (req, res) => {
  try {
    const { playlistId, tmdbId } = req.params;

    await prisma.playlistMedia.deleteMany({
      where: {
        playlistId: Number(playlistId),
        mediaTmdbId: Number(tmdbId),
      },
    });

    res.json({ message: "Media removed successfully." });
  } catch (err) {
    console.error("Error removing media:", err);
    res.status(500).json({ error: "Failed to remove media." });
  }
});


/// Get all playlists for a user
router.get("/user/:profileId", async (req, res) => {
  try {
    const { profileId } = req.params;

    const playlists = await prisma.playlist.findMany({
      where: { profileId },
      include: { playlistMedia: { include: { media: true } } },
    });

    res.status(200).json({ playlists });
  } catch (err) {
    console.error("Error fetching playlists:", err);
    res.status(500).json({ error: "Failed to fetch playlists." });
  }
});

export default router;

