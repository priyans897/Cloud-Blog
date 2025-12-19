import { CosmosClient } from "@azure/cosmos";

let container;

function getContainer() {
  if (!container) {
    const uri = process.env.COSMOS_URI;
    const key = process.env.COSMOS_KEY;
    if (!uri || !key) throw new Error("COSMOS_URI or COSMOS_KEY missing in .env");
    
    const client = new CosmosClient({ endpoint: uri, key });
    const database = client.database("blogdb");
    container = database.container("blogs");
  }
  return container;
}

export { getContainer };
