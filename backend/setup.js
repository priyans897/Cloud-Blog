import dotenv from "dotenv";
dotenv.config();

import { CosmosClient } from "@azure/cosmos";

async function setupDatabase() {
  const uri = process.env.COSMOS_URI;
  const key = process.env.COSMOS_KEY;

  if (!uri || !key) {
    throw new Error("COSMOS_URI or COSMOS_KEY missing in .env");
  }

  const client = new CosmosClient({ endpoint: uri, key });

  try {
    // Create database if it doesn't exist
    console.log("Creating database 'BlogDB'...");
    const { database } = await client.databases.createIfNotExists({ id: "BlogDB" });
    console.log("✓ Database created or already exists");

    // Create container if it doesn't exist (serverless - no throughput needed)
    console.log("Creating container 'Blogs' (serverless)...");
    const { container } = await database.containers.createIfNotExists({
      id: "Blogs",
      partitionKey: { paths: ["/id"] }
    });
    console.log("✓ Container created or already exists");

    console.log("\n✓ Database setup complete!");
    process.exit(0);
  } catch (err) {
    console.error("Error setting up database:", err.message);
    process.exit(1);
  }
}

setupDatabase();
