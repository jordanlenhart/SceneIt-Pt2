import express from "express";
import verifyToken from "./middleware/auth.js";     // default import (see auth.js below)
import jwt from "jsonwebtoken";                     // ✅ use default import

import cors from 'cors';
import showRouter from "./routes/show.js";
import playlistsRouter from './routes/playlists.js';
import ratingsRoute from './routes/ratings.js';


const app = express();
app.use(express.json());

/// allows requests from the frontend
app.use(cors({
  origin: "http://localhost:5173",
}));

/// Confirms server is running for testing routes
app.get('/', (req, res) => {
  res.send('Backend server ran successfully!');
});

// Public login to mint a test token
// app.post("/auth/login", (req, res) => {
//   try {
//     const user = { id: 1, email: "tester@example.com", role: "tester" };
//     const token = jwt.sign(user, process.env.JWT_SECRET || "dev_secret", { expiresIn: "1h" });
//     return res.json({ token, user });
//   } catch (e) {
//     console.error("LOGIN_ERROR:", e);
//     return res.status(500).json({ success: false, error: "Login failed" });
//   }
// });

// Public
app.get("/health", (_req, res) => res.json({ ok: true }));

// Protected probe
app.get("/private/ping", verifyToken, (req, res) => {
  res.json({ ok: true, user: req.user ?? null });
});

// Protect your shows API
app.use("/shows", verifyToken, showRouter);
app.use('/playlists', playlistsRouter);
app.use('/ratings', ratingsRoute);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`"SceneIt" server is now running on http://localhost:${PORT}`));
