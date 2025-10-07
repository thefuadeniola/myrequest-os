# MyRequest 🎵💼

MyRequest is a real-time **request platform** that allows users to submit and view requests seamlessly.  
Originally designed for **music party requests**, it can also be adapted for the **corporate sector** — where employees or event participants can submit, prioritize, and manage requests (like agenda items, Q&A topics, or resources) in an engaging and transparent way.

---

## 🚀 Live Demo

- **Frontend (Next.js + Vercel):** [https://myrequest-psi.vercel.app](https://myrequest-psi.vercel.app)  
- **Backend (Express + MongoDB + Render):** [https://myrequest-backend.onrender.com](https://myrequest-backend.onrender.com)

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
   git clone https://github.com/thefuadeniola/myrequest.git (frontend)
    git clone https://github.com/thefuadeniola/myrequest-backend.git (backend)

   cd myrequest
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
    npm run dev
    ```