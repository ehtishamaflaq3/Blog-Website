# DevPulse Blog Website

This repository contains two separate apps:

- `frontend/` — React + Vite website
- `backend/` — Express API and MongoDB connection

## Run locally (Windows)

Open two terminals in this project folder.

### 1. Start the backend

```powershell
cd backend
Copy-Item .env.example .env
npm install
npm run dev
```

Edit `backend/.env` and add your MongoDB connection string, a new JWT secret,
and Cloudinary credentials. Keep this file private.

### 2. Start the frontend

In the second terminal:

```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```

Open the local URL printed by Vite. Add the public feedback email to
`frontend/.env` as `VITE_FEEDBACK_EMAIL`.

## Environment variables

Backend variables belong in `backend/.env` locally and in your backend host's
Environment Variables settings when deployed:

| Variable | Purpose |
| --- | --- |
| `PORT` | API port; the hosting service may provide this automatically |
| `CLIENT_URL` | Exact public URL of the frontend |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long, random secret used to sign login tokens |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

Frontend variables belong in `frontend/.env` locally and in your frontend
host's environment settings at build time:

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Backend URL ending in `/api/v1` |
| `VITE_FEEDBACK_EMAIL` | Address that receives footer feedback |

Never put database passwords, JWT secrets, or Cloudinary secrets in frontend
variables. Every `VITE_` variable is included in the public browser bundle.

## GitHub and deployment checklist

1. Rotate any MongoDB/Atlas and Cloudinary credentials that were ever committed.
   Generate a new `JWT_SECRET` too. Do not send secret values in chat or commit
   them to GitHub.
2. Set each deployment variable in the matching host dashboard. Deploy the API
   from `backend/`; build and publish the Vite app from `frontend/` (`npm run
   build`, output folder `dist`).
3. Set `CLIENT_URL` to the deployed frontend URL and `VITE_API_URL` to the
   deployed backend URL followed by `/api/v1`.
4. Test signup, login, image upload, blog loading, and logout on the deployed
   site before sharing it.

Previously committed secrets can remain in older Git commits even after the
files are ignored or removed from the latest version. Rotate them first.
Removing those old copies requires rewriting Git history and coordinating a
force-push; do not force-push while you have uncommitted changes or before
rotating the credentials.
