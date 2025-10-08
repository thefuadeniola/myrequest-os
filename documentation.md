# 🎬 Application Flow Documentation

This document describes the overall flow and user experience for the app — from visiting the landing page to making a request within a room.

---

## Landing Page

### Description
The landing page serves as the entry point for all users, both guests and authenticated users.

### Behavior
- When the page loads, the app makes a **GET** request to `/room/all` to fetch and display all public rooms.
- Simultaneously, the **Navbar component** makes a **GET** request to `/me` using cookies:
  - If no cookies are found → user is **not authenticated**.
  - If cookies are valid → user is **authenticated**.

### User Interface
- **Unauthenticated users** see:
  - Room list
  - “Login” and “Signup” buttons
  - No “Create Room” button
- **Authenticated users** see:
  - Room list
  - “Create Room” button
  - “Profile” or “Logout” options

---

##  Authentication

### Login Flow
1. User clicks **Login**.
2. Redirected to the login form page.
3. On submit:
   - Frontend sends a **POST** request to `/auth/login` with credentials.
   - Backend validates credentials and sets an authentication cookie.
4. User is redirected back to the landing page where the navbar re-fetches `/me`.

### Signup Flow
1. User clicks **Signup**.
2. Fills in registration form (username, email, password).
3. Frontend sends a **POST** request to `/auth/register`.
4. On success, user can now log in using their credentials.

---

## Rooms Display

### Description
Displays a grid/list of all available rooms fetched from the backend (`GET /room/all`).

### Features
- Each room card shows:
  - Room name
  - Creator username
  - Number of active requests
- Clicking a room navigates to `/room/:id`.

---

## Create Room (Authenticated Only)

### Flow
1. User clicks the **“Create Room”** button.
2. A modal or separate page opens with a form:
   - Room name
   - Description (optional)
   - Access level (public/private)
3. On submit:
   - Frontend sends a **POST** request to `/room/create` with form data and credentials.
   - On success, the user is redirected to the new room page (`/room/:id`).

---

## Inside a Room

### Overview
A room contains all user-generated requests. Authenticated users can post new requests, while guests can only view them.

### Components
- **Room Header:** Displays the room title and creator.
- **Request Feed:** Lists all requests in reverse chronological order.
- **Request Form:** (Authenticated only) allows users to make a new request.

---

## Making a Request

### Flow
1. User fills in a form with:
   - Request title
   - Description
2. On submit:
   - Frontend sends **POST** `/request/create` with:
     ```json
     {
       "roomId": "<current_room_id>",
       "title": "Song Request Title",
       "description": "Details about the request"
     }
     ```
   - Backend validates and saves the request.
3. The new request appears instantly in the room feed (optimistic update or re-fetch).

---

## Logging Out

### Flow
1. User clicks **Logout** in the navbar.
2. Frontend sends a **POST** request to `/auth/logout`.
3. Cookies are cleared.
4. Navbar updates to reflect unauthenticated state (login/signup options appear).

---

## Summary of API Endpoints Used

| Action                | Method | Endpoint           | Description                          |
|------------------------|--------|--------------------|--------------------------------------|
| Fetch all rooms        | GET    | `/room/all`        | Fetch list of all available rooms    |
| Get current user       | GET    | `/me`              | Retrieve authenticated user info     |
| Register new user      | POST   | `/auth/register`   | Create new user account              |
| Login user             | POST   | `/auth/login`      | Authenticate and set cookies         |
| Logout user            | POST   | `/auth/logout`     | Clear cookies and end session        |
| Create room            | POST   | `/room/create`     | Add a new room (authenticated only)  |
| Create request         | POST   | `/request/create`  | Submit a new request to a room       |

---

## Developer Notes

- The frontend relies on **cookies with credentials** enabled (`credentials: true`) for auth routes.
- Cross-origin requests should be enabled in the backend:
  ```js
  app.use(cors({
      origin: true,
      credentials: true
  }));
  ```
