import jwt from "jsonwebtoken";
import Room from "../models/room.js";

const protectRoom = async (req, res, next) => {
  let token;

  try {
    // Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check cookies
    if (!token && req.cookies?.room_token) {
      token = req.cookies.room_token;
    }

    // No token found
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no room token" });
    }

    // Verify token
  const secret = process.env.JWT_SECRET || 'dev_jwt_secret_change_in_production';
  const decoded = jwt.verify(token, secret);

    // Attach room to request
    req.room = await Room.findById(decoded.roomId);

    if (!req.room) {
      return res.status(404).json({ message: "Room not found" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Room token authorization failed" });
  }
};

export default protectRoom;
