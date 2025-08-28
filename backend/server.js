import express from "express";
import verifyToken from "./middleware/auth.js";     // default import (see auth.js below)
import showRouter from "./routes/show.js";
import jwt from "jsonwebtoken";                     // ✅ use default import

const app = express();
app.use(express.json());

// Public login to mint a test token
app.post("/auth/login", (req, res) => {
  try {
    const user = { id: 1, email: "tester@example.com", role: "tester" };
    const token = jwt.sign(user, process.env.JWT_SECRET || "dev_secret", { expiresIn: "1h" });
    return res.json({ token, user });
  } catch (e) {
    console.error("LOGIN_ERROR:", e);
    return res.status(500).json({ success: false, error: "Login failed" });
  }
});

// Public
app.get("/health", (_req, res) => res.json({ ok: true }));

// Protected probe
app.get("/private/ping", verifyToken, (req, res) => {
  res.json({ ok: true, user: req.user ?? null });
});

// Protect your shows API
app.use("/shows", verifyToken, showRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
