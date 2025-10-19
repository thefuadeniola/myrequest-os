import express from "express";
import connectToDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createTerminus } from "@godaddy/terminus";
import mongoose from "mongoose";

const port = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === "production";

const app = express();

connectToDB();

app.use(
  cors({
    origin: isProduction
      ? "https://myrequest-os.vercel.app"
      : "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server up and running");
});

app.use("/api/user", userRoutes);
app.use("/api/room", roomRoutes);

const server = app.listen(port, () =>
  console.log(`Server is runnin on port ${port}`)
);

/* Handle process level errors */

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

/* Graceful shutdown setup */
const onSignal = async () => {
  console.log("Server is starting cleanup");

  // Perform cleanup tasks here, like closing DB connections
  await mongoose.connection.close();
  console.log("Database connection closed");
};

const onShutdown = async () => {
  console.log("Cleanup finished, server is shutting down");
};

createTerminus(server, {
  signals: ["SIGINT", "SIGTERM"],
  onSignal,
  onShutdown,
  timeout: 10000,
});
