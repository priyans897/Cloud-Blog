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
export const updateBlogInCosmos = async (id, updatedData) => {
  try {
    
    const { resource: existingBlog } = await container.item(id, id).read();

    if (!existingBlog) {
      throw new Error("Blog not found");
    }

   
    const newBlogData = {
      ...existingBlog, 
      ...updatedData,  
      id: id           
    };

    
    const { resource } = await container.item(id, id).replace(newBlogData);
    return resource;
  } catch (error) {
    console.error("Error updating blog in Cosmos:", error);
    throw error;
  }
};
export const deleteBlogFromCosmos = async (id) => {
  try {
   
    await container.item(id, id).delete();
    return true;
  } catch (error) {
    console.error("Error deleting from Cosmos:", error);
    throw error;
  }
};

export function getContainer() {
  if (!container) {
    throw new Error("Database not initialized. Call connectToCosmos() first in index.js");
  }
  return container;
}