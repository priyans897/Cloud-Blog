import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

// Assuming these service files exist in your project structure
import uploadImage from "../services/blobService.js";
import { getContainer } from "../services/cosmosService.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST: Create a new blog
// Route: POST /api/blog
router.post("/blog", upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;
    
    // Validate input
    if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required." });
    }
    if (!req.file) {
        return res.status(400).json({ message: "Image is required." });
    }

    const imageUrl = await uploadImage(req.file);

    const blog = { 
        id: uuidv4(), 
        title, 
        content, 
        imageUrl, 
        createdAt: new Date().toISOString() 
    };

    const container = getContainer();
    await container.items.create(blog);

    res.status(201).json(blog);
  } catch (err) {
    console.error("Error creating blog:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET: Health Check
// Route: GET /api/
router.get("/", (req, res) => {
  res.send("Cloud-Blog Backend is Live and Running!");
});

// GET: Fetch all blogs
// Route: GET /api/blogs
router.get("/blogs", async (req, res) => {
  try {
    const container = getContainer();
    const { resources } = await container.items
        .query("SELECT * FROM c ORDER BY c.createdAt DESC")
        .fetchAll();
    res.json(resources);
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;