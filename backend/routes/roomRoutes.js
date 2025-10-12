import express from 'express';
import Room from '../models/room.js';
import protect from '../middleware/authMiddleware.js';
import generateToken from '../utils/generateToken.js';
import protectRoom from '../middleware/roomMiddleware.js';
import User from '../models/user.js';

const router = express.Router();

// --- Room Creation ---
router.post('/create', protect, async (req, res, next) => {
    try {
        const { name, pin, image } = req.body;

        const room = await Room.create({
            name,
            pin,
            image,
            admin: req.user._id // Use req.user._id directly
        });

        return res.status(201).json(room);
    } catch (error) {
        // Send internal server error for database or unexpected issues
        return res.status(500).json({ message: error.message });
    }
});

// --- Room Entry (Login) ---
router.post('/enter', async(req, res, next) => {
    const { id, pin } = req.body;
    
    // Find the room and populate admin for the response
    const room = await Room.findById(id).populate("admin", "username");
    
    if (!room) {
        return res.status(404).json({ message: "Room not found." });
    }

    try {
        // Use matchPin method, which only runs if 'room' exists.
        if (await room.matchPin(pin)) {
            const roomToken = generateToken({ roomId: room._id });

            res.cookie("room_token", roomToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "none",
                path: "/"
            });

            return res.status(200).json({
                _id: room.id,
                name: room.name,
                adminUsername: room.admin.username,
            });
        } 
        
        return res.status(401).json({ message: "Invalid room pin!" });
        
    } catch (error) {
        // Handle any errors that might occur during pin matching or token generation
        return res.status(500).json({ message: `Unable to enter room: ${error.message}` });
    }
});

// --- Get All Rooms ---
router.get('/all', async (req, res, next) => {
    try {
        const rooms = await Room.find({});
        return res.status(200).json(rooms);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// --- Seeding Demo Data ---
router.post('/seed-demo', async (req, res, next) => {
    try {
        if (process.env.NODE_ENV === 'production') {
            return res.status(403).json({ message: 'Seeding disabled in production' });
        }

        const demoUsername = process.env.DEMO_USER_USERNAME || 'demo';
        const demoPassword = process.env.DEMO_USER_PASSWORD || 'demo123';

        let user = await User.findOne({ username: demoUsername });
        if (!user) {
            user = await User.create({ username: demoUsername, password: demoPassword });
        }

        let room = await Room.findOne({ name: 'Demo Room' });
        if (!room) {
            room = await Room.create({
                name: 'Demo Room',
                image: 'https://via.placeholder.com/400x200.png?text=Demo+Room',
                pin: '1234',
                admin: user._id,
                requests: [
                    { song_title: 'Demo Song', artistes: [{ id: '1', name: 'Demo Artist' }] }
                ]
            });
        }

        return res.status(201).json({ room });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// --- Get Single Room Details ---
router.get("/:roomId", protectRoom, async (req, res, next) => {
    try {
        const { roomId } = req.params;
        
        // Since protectRoom already found the room, we use req.room if possible 
        // to avoid a second find. However, since the middleware might only check a token,
        // and this route needs full data, we'll keep the logic clean here:
        const room = await Room.findById(roomId).select("-pin").populate("admin", "username");
        
        if (!room) return res.status(404).json({ message: "Room not found" });

        // Sort before sending
        room.requests.sort((a, b) => b.upvotes - a.upvotes);

        return res.json(room);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// --- Add Song Request ---
router.post('/add-request', protectRoom, async (req, res, next) => {
    try {
        const { title, artistes } = req.body;
        
        // IMPROVEMENT: Use the room object attached by protectRoom middleware
        const room = req.room; 
        
        // Note: The check if (!room) is safely handled by the protectRoom middleware
        // (assuming it throws an error or returns a 401/404 if the room isn't valid/found).

        const duplicate = room.requests.some(req =>
            req.song_title.toLowerCase() === title.toLowerCase() &&
            JSON.stringify(req.artistes.map(a => a.id).sort()) === JSON.stringify(artistes.map(a => a.id).sort())
        );

        // Better status code for application logic conflict
        if (duplicate) {
            return res.status(400).json({ message: "Song is already on the list!" });
        }

        room.requests.push({ song_title: title, artistes });
        await room.save();

        return res.status(201).json(room);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// --- Upvote / Toggle Upvote ---
router.post('/:roomId/request/:requestId/upvote', protect, async (req, res, next) => {
    try {
        const { roomId, requestId } = req.params;
        const userId = req.user._id;

        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ message: 'Room not found' });

        const request = room.requests.id(requestId);
        if (!request) return res.status(404).json({ message: 'Request not found' });

        // Check if the user has already upvoted
        const userIndex = request.upvotedBy.indexOf(userId);

        if (userIndex > -1) {
            // User has upvoted, so toggle off (downvote)
            request.upvotes -= 1;
            request.upvotedBy.splice(userIndex, 1);
        } else {
            // User has not upvoted, so toggle on (upvote)
            request.upvotes += 1;
            request.upvotedBy.push(userId);
        }

        await room.save();

        // Sort only once, before sending the response
        room.requests.sort((a, b) => b.upvotes - a.upvotes);

        return res.status(200).json(room);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

export default router;