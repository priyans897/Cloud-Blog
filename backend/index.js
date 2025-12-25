import dotenv from "dotenv";
dotenv.config(); 

import express from "express"; 
import cors from "cors";
import blogRoutes from "./routes/blogRoutes.js";
import { connectToCosmos } from "./services/cosmosService.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// --- 1. CORS CONFIGURATION ---
const allowedOrigins = [
  "http://localhost:5173", 
  "http://localhost:3000",
  "http://127.0.0.1:5173", 
  "https://cloud-blog-backend-gvffhqg9hbg8a4gn.centralindia-01.azurewebsites.net",
  "https://orange-mud-051177900.2.azurestaticapps.net",
  "https://hoppscotch.io"
];

app.use(cors({
  origin: function (origin, callback) {
    // 👇 Debugging ke liye: Terminal mein dikhega request kahan se aayi
    console.log("Incoming Request from Origin:", origin);

    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// --- 2. MIDDLEWARE ---
app.use(express.json());

// --- 3. ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api", blogRoutes);

// --- 4. SERVER START & DB CONNECTION ---
const PORT = process.env.PORT || 5000;

console.log("Connecting to Database...");

connectToCosmos()
  .then(() => {
    app.listen(PORT, () => console.log(`✔ Backend running on port ${PORT}`));
  })
  .catch((err) => {
    console.error(" Server failed to start due to DB error:", err);
  });