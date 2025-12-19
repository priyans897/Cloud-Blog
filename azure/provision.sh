#!/usr/bin/env bash
set -euo pipefail

echo "Azure provisioning script: create resource group, storage account + container, Cosmos DB (SQL API) database & container"

RG=${1:-cloud-blog-rg}
LOCATION=${2:-westus2}

read -p "Storage account name (globally unique, e.g. myblogstorage123): " SA
if [ -z "$SA" ]; then
  echo "Storage account name is required" >&2
  exit 1
fi

read -p "Cosmos DB account name (globally unique, e.g. myblogcosmos123): " COSMOS
if [ -z "$COSMOS" ]; then
  echo "Cosmos DB account name is required" >&2
  exit 1
fi

echo "Creating resource group $RG in $LOCATION..."
az group create -n "$RG" -l "$LOCATION"

echo "Creating storage account $SA..."
az storage account create -n "$SA" -g "$RG" -l "$LOCATION" --sku Standard_LRS
echo "Creating blob container 'blog-images'..."
az storage container create --name blog-images --account-name "$SA"

echo "Creating Cosmos DB account $COSMOS (SQL API, serverless if available)..."
# Try to create serverless-capable account; if CLI doesn't support capability in your subscription, remove --capabilities
az cosmosdb create -n "$COSMOS" -g "$RG" --kind GlobalDocumentDB --capabilities EnableServerless || \
  az cosmosdb create -n "$COSMOS" -g "$RG" --kind GlobalDocumentDB

echo "Creating SQL database 'blogdb'..."
az cosmosdb sql database create --account-name "$COSMOS" -g "$RG" -n blogdb

echo "Creating container 'blogs' with partition key /id..."
az cosmosdb sql container create --account-name "$COSMOS" -g "$RG" --database-name blogdb -n blogs --partition-key-path /id || true

echo "Fetching connection strings (copy these to your .env or GitHub Secrets)..."
echo "STORAGE_CONNECTION_STRING:"
az storage account show-connection-string -n "$SA" -g "$RG" --query connectionString -o tsv

echo "Cosmos DB keys and URI (full JSON):"
az cosmosdb keys list --name "$COSMOS" --resource-group "$RG"

echo "Done. Remember to add the returned values to your backend .env or as GitHub Secrets: AZURE_STORAGE_CONNECTION_STRING, COSMOS_URI, COSMOS_KEY."
