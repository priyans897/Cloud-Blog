import { CosmosClient } from "@azure/cosmos";
import dotenv from "dotenv";
dotenv.config();

let container = null;


export async function connectToCosmos() {
  if (container) return container;

  const uri = process.env.COSMOS_URI;
  const key = process.env.COSMOS_KEY;

  if (!uri || !key) {
    throw new Error("COSMOS_URI or COSMOS_KEY is missing in .env file");
  }

  try {
    const client = new CosmosClient({ endpoint: uri, key });

    const { database } = await client.databases.createIfNotExists({ id: "blogdb" });
    console.log(`✔ Database '${database.id}' ready.`);

    
    const { container: c } = await database.containers.createIfNotExists({ 
        id: "blogs",
        partitionKey: "/id" 
    });
    console.log(`✔ Container '${c.id}' ready.`);

    container = c;
    return container;
  } catch (err) {
    console.error("Cosmos DB Connection Failed:", err.message);
    throw err;
  }
}

export function getContainer() {
  if (!container) {
    throw new Error("Database not initialized. Call connectToCosmos() first in index.js");
  }
  return container;
}