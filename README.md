# Cloud-Blog

This repository contains a small blog app with a Node backend and a Vite React frontend. The project is configured to use Azure Blob Storage for images and Azure Cosmos DB for content.

## Local development (Node + Vite)

Backend:
```bash
cd backend
npm install
npm start
# backend runs at http://localhost:5000
```

Frontend:
```bash
cd frontend
npm install
npm run dev
# frontend runs at http://localhost:5173 by default
```

## Docker (local)

Build and run both services with Docker Compose (uses env vars):

1. Create a local `.env` file in the repo root with the required values (do NOT commit it):
```
AZURE_STORAGE_CONNECTION_STRING=your_connection_string
COSMOS_URI=https://...
COSMOS_KEY=...
```

2. Start services:
```bash
docker compose up --build
```
- Frontend (NGINX): http://localhost:3000
- Backend: http://localhost:5000

## Health check
The backend exposes a health endpoint at `GET /health`.

## CI/CD (GitHub Actions)
The workflow (`.github/workflows/ci-cd.yml`) builds Docker images for frontend and backend and pushes them to GitHub Container Registry (GHCR), then deploys to Azure Web Apps for Containers.

Required GitHub repository settings and secrets:
- Ensure the workflow has package publishing permissions (the included workflow sets `permissions: packages: write`).
- No external registry secrets are required when using the repository `GITHUB_TOKEN` for GHCR, but you must allow `GITHUB_TOKEN` to publish packages in repository settings if your organization blocks it.
- `AZURE_PUBLISH_PROFILE` (publish profile for Azure Web App)
- `AZURE_FRONTEND_APP` (App Service name)
- `AZURE_BACKEND_APP` (App Service name)

Images will be pushed to:
- `ghcr.io/<your-org-or-username>/cloud-blog-backend:latest`
- `ghcr.io/<your-org-or-username>/cloud-blog-frontend:latest`

## Azure resources
- Storage account with a `blog-images` container for images.
- Cosmos DB account with a database and collection (container) for blogs. Match the names and casing used in `backend/services/cosmosService.js` (default `blogdb` and `blogs`).

### Provisioning helper scripts
Two helper scripts are included to provision Azure resources:

- `azure/provision.sh` — Bash script for Linux/macOS (or WSL). Usage:
```bash
bash azure/provision.sh
# or with args: bash azure/provision.sh my-rg westus2
```

- `azure/provision.ps1` — PowerShell script for Windows. Usage:
```powershell
.\azure\provision.ps1
```

Both scripts will create a resource group, a Storage Account + `blog-images` container, and a Cosmos DB SQL account with a `blogdb` database and `blogs` container (partition key `/id`). After running, copy the Storage connection string and Cosmos keys into your `.env` or GitHub Secrets.

## Notes
- Keep `.env` out of version control; commit `.env.example` with variable names.
- For production, consider using managed identities or Key Vault instead of plaintext secrets.

If you want, I can also:
- Add a health-check in container definitions,
- Create sample `Dockerfile` improvements, or
- Generate an Azure CLI script for provisioning resources.
