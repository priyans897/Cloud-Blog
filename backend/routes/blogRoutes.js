import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";


import uploadImage from "../services/blobService.js"; 


import { getContainer, updateBlogInCosmos ,deleteBlogFromCosmos } from "../services/cosmosService.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// --- POST: Create Blog ---
router.post("/blog", upload.single("image"), async (req, res) => {
  try {
    const { title, content , userId, userName} = req.body;
    
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
        userId,
        userName,
        type: "blog", 
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

// --- GET: Health Check ---
router.get("/", (req, res) => {
  res.send("Cloud-Blog Backend is Live and Running!");
});

// --- GET: Fetch All ---
// --- GET: Get All Blogs ---
router.get("/blogs", async (req, res) => {
  try {
    const container = getContainer();
    const querySpec = {
      query: "SELECT * FROM c WHERE IS_DEFINED(c.title)"
    };

    const { resources } = await container.items.query(querySpec).fetchAll();
    
    // Sort by Date (Newest First)
   
    const sortedBlogs = resources.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB - dateA;
    });

    res.status(200).json(sortedBlogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// --- PUT: Update Blog  ---
router.put("/blog/:id", upload.single("image"), async (req, res) => {
  try {
    const blogId = req.params.id;
    const { title, content } = req.body;
    let imageUrl = undefined;

   
    if (req.file) {
     
      imageUrl = await uploadImage(req.file);
    }

    
    const updateData = {
      title,
      content,
      ...(imageUrl && { imageUrl }) 
    };

    
   
    const updatedBlog = await updateBlogInCosmos(blogId, updateData);

    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: "Failed to update blog" });
  }
});
router.delete("/blog/:id", async (req, res) => {
  try {
    const blogId = req.params.id;
    await deleteBlogFromCosmos(blogId);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "Failed to delete blog" });
  }
});

export default router;