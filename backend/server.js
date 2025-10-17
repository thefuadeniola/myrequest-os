import express from 'express'
import connectToDB from './config/db.js';
import userRoutes from './routes/userRoutes.js'
import roomRoutes from './routes/roomRoutes.js'
import cookieParser from "cookie-parser";
import cors from 'cors'

const port = process.env.PORT || 8080
const isProduction = process.env.NODE_ENV === 'production';

const app = express();

app.use(cors({
    origin: isProduction ? 'https://myrequest-os.vercel.app' : 'http://localhost:3000',    
    credentials: true
}))

connectToDB();

app.use(express.json());

app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("Server up and running")
});

app.use('/api/user', userRoutes);
app.use('/api/room', roomRoutes);



app.listen(port, () => console.log(`Server is runnin on port ${port}`));