import express from "express";
import cors from "cors";
import verifyToken from "./middleware/auth.js";
import showRouter from "./routes/show.js";
import jwt from "jsonwebtoken";

const app = express();

// ✅ CORS (allow frontend on 5173 and the Authorization header)
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

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
