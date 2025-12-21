import { BlobServiceClient } from "@azure/storage-blob";

let containerClient;

function getContainerClient() {
  if (!containerClient) {
    const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!connStr) {
        console.error("ERROR: AZURE_STORAGE_CONNECTION_STRING is missing!");
        return null;
    }
    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
        containerClient = blobServiceClient.getContainerClient("blog-images");
    } catch (e) {
        console.error("Blob Init Error:", e.message);
        return null;
    }
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
