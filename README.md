# Dream House AI

Dream House AI is a React/Vite floor-plan editor with an Express/MongoDB backend. The existing SVG editor and visual design are preserved; the backend adds JWT authentication, project persistence, Gemini AI workflows, image recognition, version history, PDF export, and DXF export.

## Prerequisites

- Node.js 20+
- MongoDB running locally or a MongoDB Atlas connection string
- A Google Gemini API key for AI generation and image recognition

## Setup

### Backend

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Set these values in `backend/.env`:

```env
PORT=7210
MONGODB_URI=mongodb://127.0.0.1:27017/dream-house
JWT_SECRET=use-a-long-random-secret
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your-gemini-key
GEMINI_MODEL=gemini-2.0-flash
CLIENT_URL=http://localhost:5173
```

Start the API:

```powershell
npm run dev
```

Health check: `http://localhost:7210/api/health`

### Frontend

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

The frontend uses `VITE_API_URL=http://localhost:7210/api` by default.

## API

Authentication:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Projects and history (JWT required):

- `GET/POST /api/projects`
- `GET/PUT/DELETE /api/projects/:id`
- `POST /api/projects/:id/versions`
- `GET /api/projects/:id/versions`
- `GET /api/projects/:id/versions/:versionId`
- `POST /api/projects/:id/versions/:versionId/restore`

AI and uploads (JWT required):

- `POST /api/ai/generate`
- `POST /api/ai/modify-floorplan`
- `POST /api/ai/analyze-image` with multipart field `image`

Exports (JWT required):

- `GET /api/projects/:id/export/pdf`
- `GET /api/projects/:id/export/dxf`

## Data and security

Floor-plan geometry is stored in the `Project` document using the editor's existing `project`, `rooms`, `doors`, `windows`, `walls`, and `furniture` collections. Passwords are hashed with bcrypt. Project queries are always scoped to the authenticated JWT user. Gemini credentials remain server-only.

The old localStorage snapshot is retained only as a migration/offline fallback. Cloud projects are the source of truth once a user is authenticated and the API is configured.

## Verification

```powershell
cd backend
Get-ChildItem config,models,controllers,middleware,routes,services,utils -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }

cd ..\frontend
npm run build
```

A MongoDB instance and Gemini key are required to exercise authenticated persistence and real AI requests end to end.
