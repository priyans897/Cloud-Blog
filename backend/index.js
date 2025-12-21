import dotenv from "dotenv";
dotenv.config(); // MUST be first

import express from "express";
import cors from "cors";

// Import routes after dotenv.config()
import blogRoutes from "./routes/blogRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", blogRoutes);
app.use(cors({
  origin: 'https://orange-mud-051177900.2.azurestaticapps.net', 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Health endpoint for readiness checks
app.get('/health', (req, res) => {
	res.json({ status: 'ok', uptime: process.uptime() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
