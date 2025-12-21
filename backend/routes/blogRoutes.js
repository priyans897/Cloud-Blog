import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import uploadImage from "../services/blobService.js";
import { getContainer } from "../services/cosmosService.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/blog", upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content || !req.file) return res.status(400).json({ message: "All fields required" });

    const imageUrl = await uploadImage(req.file);

    const blog = { id: uuidv4(), title, content, imageUrl, createdAt: new Date().toISOString() };
    const container = getContainer();
    await container.items.create(blog);

    res.status(201).json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


app.get("/", (req, res) => {
  res.send("Cloud-Blog Backend is Live and Running!");
});
router.get("/blogs", async (req, res) => {
  try {
    const container = getContainer();
    const { resources } = await container.items.query("SELECT * FROM Blogs b ORDER BY b.createdAt DESC").fetchAll();
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
