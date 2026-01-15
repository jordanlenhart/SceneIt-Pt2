// routes/show.js
import express from "express";
import prisma from "../db/index.js"; // assumes default export of a PrismaClient instance

const router = express.Router();

// helper: safely JSON-ify BigInt fields (e.g., id: BigInt)
const toPlain = (data) =>
  JSON.parse(
    JSON.stringify(data, (_, v) => (typeof v === "bigint" ? v.toString() : v))
  );

// GET /shows  → list all shows
router.get("/", async (_req, res) => {
  try {
    const shows = await prisma.show.findMany({
      orderBy: { created_at: "desc" },
      // select only what you need (optional):
      // select: { id: true, title: true, genre: true, release_year: true, created_at: true },
    });

    res.status(200).json({
      success: true,
      shows: toPlain(shows),
    });
  } catch (err) {
    console.error("Error fetching shows:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// POST /shows  → create a new show
router.post("/", async (req, res) => {
  try {
    const { title, genre, description, producer, release_year } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({ success: false, error: "title is required" });
    }

    // release_year is optional Int in schema; coerce if provided
    const data = {
      title,
      genre: genre ?? null,
      description: description ?? null,
      producer: producer ?? null,
      release_year:
        typeof release_year === "number"
          ? release_year
          : release_year
          ? Number.parseInt(release_year, 10)
          : null,
    };

    const created = await prisma.show.create({ data });

    res.status(201).json({
      success: true,
      show: toPlain(created),
    });
  } catch (err) {
    console.error("Error creating show:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// GET /shows/:id → fetch one
router.get("/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ success: false, error: "Invalid id" });
      }
  
      const show = await prisma.show.findUnique({ where: { id } });
      if (!show) {
        return res.status(404).json({ success: false, error: "Show not found" });
      }
  
      res.status(200).json({ success: true, show: toPlain(show) });
    } catch (err) {
      console.error("Error fetching show:", err);
      res.status(500).json({ success: false, error: "Server error" });
    }
  });
  
  // PUT /shows/:id → full replace (unset missing optional fields to null)
  router.put("/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ success: false, error: "Invalid id" });
      }
  
      const { title, genre, description, producer, release_year } = req.body;
      if (!title || typeof title !== "string") {
        return res.status(400).json({ success: false, error: "title is required" });
      }
  
      const data = {
        title,
        genre: genre ?? null,
        description: description ?? null,
        producer: producer ?? null,
        release_year:
          typeof release_year === "number"
            ? release_year
            : release_year !== undefined && release_year !== null
            ? Number.parseInt(release_year, 10)
            : null,
      };
  
      const updated = await prisma.show.update({
        where: { id },
        data,
      });
  
      res.status(200).json({ success: true, show: toPlain(updated) });
    } catch (err) {
      // Prisma not found error
      if (err?.code === "P2025") {
        return res.status(404).json({ success: false, error: "Show not found" });
      }
      console.error("Error updating (PUT) show:", err);
      res.status(500).json({ success: false, error: "Server error" });
    }
  });
  
  // PATCH /shows/:id → partial update
  router.patch("/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ success: false, error: "Invalid id" });
      }
  
      const { title, genre, description, producer, release_year } = req.body;
  
      const data = {};
      if (title !== undefined) {
        if (!title || typeof title !== "string") {
          return res.status(400).json({ success: false, error: "title must be a non-empty string" });
        }
        data.title = title;
      }
      if (genre !== undefined) data.genre = genre ?? null;
      if (description !== undefined) data.description = description ?? null;
      if (producer !== undefined) data.producer = producer ?? null;
      if (release_year !== undefined) {
        data.release_year =
          typeof release_year === "number"
            ? release_year
            : release_year === null
            ? null
            : Number.parseInt(release_year, 10);
        if (data.release_year !== null && !Number.isInteger(data.release_year)) {
          return res.status(400).json({ success: false, error: "release_year must be an integer or null" });
        }
      }
  
      const updated = await prisma.show.update({
        where: { id },
        data,
      });
  
      res.status(200).json({ success: true, show: toPlain(updated) });
    } catch (err) {
      if (err?.code === "P2025") {
        return res.status(404).json({ success: false, error: "Show not found" });
      }
      console.error("Error updating (PATCH) show:", err);
      res.status(500).json({ success: false, error: "Server error" });
    }
  });
  
  // DELETE /shows/:id → delete
  router.delete("/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ success: false, error: "Invalid id" });
      }
  
      await prisma.show.delete({ where: { id } });
      res.status(204).send();
    } catch (err) {
      if (err?.code === "P2025") {
        return res.status(404).json({ success: false, error: "Show not found" });
      }
      console.error("Error deleting show:", err);
      res.status(500).json({ success: false, error: "Server error" });
    }
  });
  

export default router;


