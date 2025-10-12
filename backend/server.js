import express from 'express'
import connectToDB from './config/db.js';
import userRoutes from './routes/userRoutes.js'
import roomRoutes from './routes/roomRoutes.js'
import cookieParser from "cookie-parser";
import cors from 'cors'
import{ auth } from "express-openid-connect";

const port = process.env.PORT || 8080

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.JWT_SECRET,
  baseURL: `http://localhost:8000`,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: 'https://dev-gugk0vaqqsbhpf27.us.auth0.com',
};

const app = express();

// auth router attaches /login, /logout, and /callback routes to the baseURL

connectToDB();
app.use(auth(config));


app.use(cors({
    origin: true,    
    credentials: true
}))

app.use(express.json());

app.use(cookieParser())

app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Welcome, Logged in' : 'Logged out');
})

app.get('/callback', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in via auth0' : 'Logged out');
})

app.use('/api/user', userRoutes);
app.use('/api/room', roomRoutes);



app.listen(port, () => console.log(`Server is runnin on port ${port}`));