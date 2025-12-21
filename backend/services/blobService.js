import { BlobServiceClient } from "@azure/storage-blob";

let containerClient;

function getContainer() {
  if (!container) {
    let uri = process.env.COSMOS_URI;
    const key = process.env.COSMOS_KEY;

    if (uri) {
      uri = uri.replace(/['"]+/g, '').trim(); 
    }

    console.log("Current URI being used:", uri); // ये Azure Logs में दिखेगा

    if (!uri || !key) throw new Error("COSMOS_URI or COSMOS_KEY is missing");

    try {
      
      new URL(uri); 
      const client = new CosmosClient({ endpoint: uri, key });
      const database = client.database("blogdb");
      container = database.container("blogs");
    } catch (urlErr) {
      throw new Error(`The URI "${uri}" is not a valid URL format.`);
    }
  }
  return container;
}

  return blockBlobClient.url;
}
