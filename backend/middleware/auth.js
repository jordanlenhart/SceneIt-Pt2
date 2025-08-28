// middleware/auth.js
import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ success: false, error: "Missing or invalid Authorization header" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    req.user = payload;
    return next();
  } catch (e) {
    return res.status(401).json({
      success: false,
      error: e?.name === "TokenExpiredError" ? "Token expired" : "Invalid token",
    });
  }
}

export default verifyToken; // ✅ lets you `import verifyToken from "./middleware/auth.js"`
