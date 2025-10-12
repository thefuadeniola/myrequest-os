import express from 'express'
import connectToDB from './config/db.js';
import userRoutes from './routes/userRoutes.js'
import roomRoutes from './routes/roomRoutes.js'
import cookieParser from "cookie-parser";
import cors from 'cors'
import { auth } from "express-openid-connect";

const port = process.env.PORT || 8080

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.JWT_SECRET,
  baseURL: 'http://localhost:8000' || 'https://myrequest-os.onrender.com',
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
};

const app = express();

app.use(cors({
    origin: true,    
    credentials: true
}))


// auth router attaches /login, /logout, and /callback routes to the baseURL

connectToDB();

app.use(auth(config));


app.get("/logout", (req, res) => {
  res.oidc.logout({ returnTo: `${config.baseURL}/login` });
});


app.use(express.json());

app.use(cookieParser())

app.get("/", (req, res) => {
  const isLoggedIn = req.oidc.isAuthenticated();

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>${isLoggedIn ? "Welcome" : "Logged Out"}</title>
      <style>
        body {
          font-family: sans-serif;
          background: #f6f6f6;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }
        a {
          padding: 12px 20px;
          background: #0070f3;
          color: white;
          border-radius: 6px;
          text-decoration: none;
          font-size: 16px;
        }
        a:hover { background: #005dc1; }
      </style>
    </head>
    <body>
      ${
        isLoggedIn
          ? `<h2>Welcome back!</h2><a href="http://localhost:3000">Continue to Homepage</a>`
          : `<h2>You are logged out</h2><a href="/login">Log In</a>`
      }
    </body>
    </html>
  `;

  res.send(html);
});

app.use('/api/user', userRoutes);
app.use('/api/room', roomRoutes);



app.listen(port, () => console.log(`Server is runnin on port ${port}`));