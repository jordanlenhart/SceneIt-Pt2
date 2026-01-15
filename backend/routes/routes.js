import express from "express";
import db from "../db/connection.js";  // my database connector

const router = express.Router();

/* 
   GET PLAYLISTS BY USER ID*/
router.get("/:id/playlists", async (req, res) => {
  try {
    const userId = req.params.id;

    const playlists = await db.collection("playlists").find({ userId }).toArray();

    res.json(playlists);
  } catch (err) {
    console.error("Error fetching playlists:", err);
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
});

/*
   GET FAVORITES BY USER ID
*/
router.get("/:id/favorites", async (req, res) => {
  try {
    const userId = req.params.id;

    const favorites = await db.collection("favorites").find({ userId }).toArray();

    res.json(favorites);
  } catch (err) {
    console.error("Error fetching favorites:", err);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

/* 
   GET REVIEWS BY USER ID
*/
router.get("/:id/reviews", async (req, res) => {
  try {
    const userId = req.params.id;

    const reviews = await db.collection("reviews").find({ userId }).toArray();

    res.json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

export default router;
