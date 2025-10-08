# MyRequest 🎵💼

MyRequest is a real-time **request platform** that allows users to submit and view requests seamlessly.  
Originally designed for **music party requests**, it can also be adapted for the **corporate sector** — where employees or event participants can submit, prioritize, and manage requests (like agenda items, Q&A topics, or resources) in an engaging and transparent way.

---

## ✨ Features

### For Music/Parties
- Search any song via **Spotify API** and request it in a shared room.
- Rooms are **secured with credentials**, so only authorized users can add requests.
- View a **live-updating list of all requests** in the room.
- Prevents duplicate requests by checking both song title and artists.

### For Corporate Use
- Employees or event attendees can submit requests for:
  - Meeting topics  
  - Q&A questions  
  - Feedback or resources  
- Transparent **real-time visibility** of all submitted requests.
- Moderators/organizers can manage or filter requests.
- Works seamlessly for **hybrid meetings and events** (desktop & mobile).

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS  
- **Backend:** Node.js, Express, MongoDB (Mongoose)  
- **Auth & State:** Cookies (with credentials), JWT-based authentication  
- **3rd Party API:** Spotify Web API for music search  
- **Deployment:**  
  - Frontend → Vercel  
  - Backend → Render  
  - Database → MongoDB Atlas  

---

## ⚙️ Installation (Local Development)

1. **Clone the repository:**
   ```
   git clone https://github.com/thefuadeniola/myrequest-os.git

   cd myrequest-os
   ```

2. **Install deps for frontend and backend**

   ```
    # In root folder (frontend)
    cd frontend
    npm install

    # In backend folder
    cd ../backend
    npm install

   ``` 

3. **Set up environment variables**
    ```
    # Frontend
    NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
    NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
    NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8000

    # Backend

    PORT=8000
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret

    ```

4. **Run the app**

    ```

    # Backend
    npm run dev

    # Frontend (In another terminal)
    npm run dev
    ```

Local run checklist
- Copy `backend/.env.example` to `backend/.env` and set `MONGODB_CONNECTION_STRING` and `JWT_SECRET` before starting the backend. The server will error if the MongoDB URI is missing.
- Start the backend first (from `backend`):

```powershell
# In one terminal (backend)
Set-Location -Path 'F:\GitHubpr\myrequest-os\backend'
copy .env.example .env  # then edit .env to add your MongoDB URI and JWT_SECRET
npm install
npm run dev
```

- Start the frontend in a second terminal (from `frontend`):

```powershell
# In another terminal (frontend)
Set-Location -Path 'F:\GitHubpr\myrequest-os\frontend'
npm install
npm run dev
```

Open `http://localhost:3000` in your browser once both services are running. If you are missing a MongoDB connection, the backend will log an error about `uri` being undefined — fill that in `backend/.env` and restart the backend.

---

## CI/CD

This repository includes two GitHub Actions workflows to run CI on PRs and push to `main`:

- `.github/workflows/frontend-ci.yml` — installs frontend dependencies, runs `npm run lint` and `npm run build` for the Next.js app. It also has an optional `deploy-vercel` job which will run on `main` when the required Vercel secrets are added to the repo.
- `.github/workflows/backend-ci.yml` — installs backend dependencies and performs a quick parse/check of `server.js`. It has an optional `deploy-render` job which can trigger a Render deploy via API when Render secrets are configured.

Required GitHub Secrets (optional for deployments):
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` — for automatic Vercel deploys of the frontend.
- `RENDER_API_KEY`, `RENDER_SERVICE_ID` — to trigger a deploy for the backend on Render.

How it behaves:
- Pull requests and pushes to `main` will run the CI jobs. If you add the secrets above, the respective deploy job will run on the `main` branch.

Notes:
- Deploy steps are optional and gated on the presence of the corresponding secrets so the project remains usable without them.
