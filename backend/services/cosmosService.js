import { CosmosClient } from "@azure/cosmos";

let container;

function getContainer() {
  if (!container) {
    const uri = process.env.COSMOS_URI;
    const key = process.env.COSMOS_KEY;

    
    if (!uri) throw new Error("BACKEND_ERROR: COSMOS_URI is undefined. Check Azure App Settings names.");

    const sanitizedUri = uri.trim().replace(/\/$/, "");
    
    try {
      const client = new CosmosClient({ endpoint: sanitizedUri, key });
      container = client.database("blogdb").container("blogs");
    } catch (err) {
      throw new Error(`Cosmos Client Failed: ${err.message}`);
    }
  }
  return container;
}

export { getContainer };
