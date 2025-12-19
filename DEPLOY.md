# Deployment Checklist

## 1. Provision Azure Resources (one-time)

Choose your OS and run the provisioning script:

**Linux/macOS/WSL:**
```bash
bash azure/provision.sh
```

**Windows PowerShell:**
```powershell
.\azure\provision.ps1
```

The script will create:
- Resource group
- Storage account + `blog-images` container
- Cosmos DB account with `blogdb` database and `blogs` container

Save the output connection strings and keys.

## 2. Configure GitHub Secrets

Go to **Settings → Secrets and variables → Actions** and add:

| Secret | Value |
|--------|-------|
| `AZURE_PUBLISH_PROFILE` | Azure App Service publish profile (download from Azure Portal) |
| `AZURE_FRONTEND_APP` | Frontend App Service name |
| `AZURE_BACKEND_APP` | Backend App Service name |
| `COSMOS_URI` | From provisioning script output |
| `COSMOS_KEY` | From provisioning script output |
| `AZURE_STORAGE_CONNECTION_STRING` | From provisioning script output |

## 3. Create Azure Web Apps (for Containers)

In Azure Portal, create two App Services:
- **Frontend**: Container (GHCR), single container, image `ghcr.io/<owner>/cloud-blog-frontend:latest`
- **Backend**: Container (GHCR), single container, image `ghcr.io/<owner>/cloud-blog-backend:latest`

For each, add Application Settings (env vars):
- Frontend: (optional, no secrets needed)
- Backend: `COSMOS_URI`, `COSMOS_KEY`, `AZURE_STORAGE_CONNECTION_STRING`, `PORT=5000`, `MODE=AZURE`

## 4. Push to GitHub (trigger CI/CD)

```bash
git add .
git commit -m "Add Docker, CI/CD, and provisioning scripts"
git push origin main
```

The workflow will:
- Build and push images to GHCR
- Deploy to your Azure Web Apps

## 5. Verify Deployment

- **Frontend**: Visit `https://<frontend-app>.azurewebsites.net`
- **Backend health**: `https://<backend-app>.azurewebsites.net/health`
- **Test blog creation**: publish a blog from frontend and check:
  - Image in Storage → `blog-images` container
  - Document in Cosmos DB → `blogdb` → `blogs` container

## 6. (Optional) Secure Secrets

For production, use:
- **Azure Key Vault** for sensitive values
- **Managed Identity** for app authentication (no keys needed)

## Troubleshooting

- **Images not in GHCR?** Check workflow permissions in GitHub (Settings → Actions → Workflow permissions).
- **App Service can't pull image?** Verify container registry credentials in App Service.
- **Cosmos DB not found?** Ensure database/container names match `backend/services/cosmosService.js` (default: `blogdb`, `blogs`).
- **Blob upload fails?** Check Storage connection string and container name in backend env vars.
