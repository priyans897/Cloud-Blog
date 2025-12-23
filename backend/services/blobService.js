import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";
dotenv.config();

let containerClient;

function getContainerClient() {
  if (!containerClient) {
    const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING;
    
   
    if (!connStr) {
        throw new Error("AZURE_STORAGE_CONNECTION_STRING is missing in .env file");
    }

    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
        containerClient = blobServiceClient.getContainerClient("blog-images");
    } catch (e) {
        throw new Error(`Blob Init Error: ${e.message}`);
    }
  }
  return containerClient;
}

export default async function uploadImage(file) {
  const container = getContainerClient();

 
  await container.createIfNotExists({ access: 'blob' });

  const blobName = `${Date.now()}-${file.originalname}`;
  const blockBlobClient = container.getBlockBlobClient(blobName);

  // 3. File Upload
  await blockBlobClient.uploadData(file.buffer, {
    blobHTTPHeaders: { blobContentType: file.mimetype }
  });

  return blockBlobClient.url;
}