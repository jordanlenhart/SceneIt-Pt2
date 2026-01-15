import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

/// Saves or updates rating for logged-in user
router.post("/", async (req, res) => {
  try {
    const userUsername = req.user.username; // Use username, not id
    const { mediaTmdbId, rating, review } = req.body;

    if (!mediaTmdbId || !rating) {
      return res.status(400).json({ error: "mediaTmdbId and rating required." });
    }

    const savedRating = await prisma.rating.upsert({
      where: {
        userUsername_mediaTmdbId: {
          userUsername,
          mediaTmdbId: parseInt(mediaTmdbId),
        },
      },
      update: { rating, review },
      create: {
        userUsername,
        mediaTmdbId: parseInt(mediaTmdbId),
        rating,
        review,
      },
    });

    return res.json({ success: true, rating: savedRating });
  } catch (error) {
    console.error("RATING_SAVE_ERROR:", error);
    return res.status(500).json({ error: "Could not save rating." });
  }
});

/**
 * GET /ratings/:mediaTmdbId
 * Returns the logged-in user's rating for that media
 */
router.get("/:mediaTmdbId", async (req, res) => {
  try {
    const userUsername = req.user.username;
    const mediaTmdbId = parseInt(req.params.mediaTmdbId);

    const rating = await prisma.rating.findUnique({
      where: {
        userUsername_mediaTmdbId: {
          userUsername,
          mediaTmdbId,
        },
      },
    });

    return res.json({ rating });
  } catch (error) {
    console.error("RATING_FETCH_ERROR:", error);
    return res.status(500).json({ error: "Could not fetch rating." });
  }
});

export default router;
