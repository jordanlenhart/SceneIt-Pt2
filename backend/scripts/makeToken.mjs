/// scripts/makeToken.mjs
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "dev_secret";
const payload = { id: 1, role: "tester" }; // shape should match what your app expects

const token = jwt.sign(payload, secret, { expiresIn: "10m" });
console.log(token);