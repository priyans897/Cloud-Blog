import { BlobServiceClient } from "@azure/storage-blob";

let containerClient;

function getContainerClient() {
  if (!containerClient) {
    const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!connStr) throw new Error("AZURE_STORAGE_CONNECTION_STRING missing in .env");
    const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
    containerClient = blobServiceClient.getContainerClient("blog-images");
  }
  return containerClient;
}

export default async function uploadImage(file) {
  const container = getContainerClient();
  const blobName = `${Date.now()}-${file.originalname}`;
  const blockBlobClient = container.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(file.buffer, {
    blobHTTPHeaders: { blobContentType: file.mimetype }
  });

  return blockBlobClient.url;
}
