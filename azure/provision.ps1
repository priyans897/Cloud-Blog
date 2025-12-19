param(
  [string]$ResourceGroupName = "cloud-blog-rg",
  [string]$Location = "westus2"
)

Write-Host "Azure provisioning (PowerShell): resource group, storage, blob container, Cosmos DB"

$SA = Read-Host "Storage account name (globally unique, e.g. myblogstorage123)"
if ([string]::IsNullOrEmpty($SA)) { Write-Error "Storage account name required"; exit 1 }

$COSMOS = Read-Host "Cosmos DB account name (globally unique, e.g. myblogcosmos123)"
if ([string]::IsNullOrEmpty($COSMOS)) { Write-Error "Cosmos DB account name required"; exit 1 }

az group create --name $ResourceGroupName --location $Location

Write-Host "Creating storage account $SA..."
az storage account create --name $SA --resource-group $ResourceGroupName --location $Location --sku Standard_LRS
Write-Host "Creating blob container 'blog-images'..."
az storage container create --name blog-images --account-name $SA

Write-Host "Creating Cosmos DB account $COSMOS (SQL API)"
az cosmosdb create --name $COSMOS --resource-group $ResourceGroupName --kind GlobalDocumentDB --capabilities EnableServerless

Write-Host "Creating SQL database 'blogdb'..."
az cosmosdb sql database create --account-name $COSMOS --resource-group $ResourceGroupName --name blogdb

Write-Host "Creating container 'blogs'..."
az cosmosdb sql container create --account-name $COSMOS --resource-group $ResourceGroupName --database-name blogdb --name blogs --partition-key-path /id

Write-Host "Connection string for storage:"
az storage account show-connection-string --name $SA --resource-group $ResourceGroupName --query connectionString -o tsv

Write-Host "Cosmos DB keys:"
az cosmosdb keys list --name $COSMOS --resource-group $ResourceGroupName

Write-Host "Done. Copy the values to your .env or GitHub Secrets: AZURE_STORAGE_CONNECTION_STRING, COSMOS_URI, COSMOS_KEY."
