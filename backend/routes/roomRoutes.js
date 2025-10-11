import express from 'express';
import Room from '../models/room.js';
import protect from '../middleware/authMiddleware.js';
import generateToken from '../utils/generateToken.js';
import protectRoom from '../middleware/roomMiddleware.js';
import Admin from '../models/admin.js';

const router = express.Router();

router.post('/create', protect, async (req, res, next) => {
    try {
        const { name, pin, image } = req.body;

        const room = await Room.create({
            name, pin, image, admin: req.admin._id
        });

        res.status(201).json(room)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/enter', async(req, res, next) => {
    const { id, pin } = req.body;
    const room = await Room.findById(id).populate("admin", "username")
    if(!room) console.log("Found a matching room!")

    try {
        if(await room.matchPin(pin)) {

            const roomToken = generateToken({roomId: room._id});

            res.cookie("room_token", roomToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/"
            });

            res.status(200).json({
                _id: room.id,
                name: room.name,
                adminUsername: room.admin.username,
            })
        } else res.status(401).json({ message: "Invalid room pin!" })
    } catch (error) {
        res.status(500).json({ message: `Unable to enter room` })
    }
})


router.get('/all', async (req, res, next) => {
    try {
        const rooms = await Room.find({});
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Dev-only: seed a demo admin and room for local development
router.post('/seed-demo', async (req, res) => {
    try {
        if (process.env.NODE_ENV === 'production') {
            return res.status(403).json({ message: 'Seeding disabled in production' });
        }

        const demoUsername = process.env.DEMO_ADMIN_USERNAME || 'demo';
        const demoPassword = process.env.DEMO_ADMIN_PASSWORD || 'demo123';

        // Create or reuse an admin
        let admin = await Admin.findOne({ username: demoUsername });
        if (!admin) {
            admin = await Admin.create({ username: demoUsername, password: demoPassword });
        }

        // Create demo room if none exists
        let room = await Room.findOne({ name: 'Demo Room' });
        if (!room) {
            room = await Room.create({
                name: 'Demo Room',
                image: 'https://via.placeholder.com/400x200.png?text=Demo+Room',
                pin: '1234',
                admin: admin._id,
                requests: [
                    { song_title: 'Demo Song', artistes: [{ id: '1', name: 'Demo Artist' }] }
                ]
            });
        }

        res.status(201).json({ room });
    } catch (error) {
        console.error('Seed error', error);
        res.status(500).json({ message: error.message });
    }
});

router.get("/:roomId", protectRoom, async (req, res) => {
    try {
        const { roomId } = req.params;

        const room = await Room.findById(roomId).select("-pin").populate("admin", "username");
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        res.json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/add-request', protectRoom, async (req, res, next) => {
    try {
        const { title, artistes } = req.body;
        const room = await Room.findById(req.room._id);

        if (!room) {
            return res.status(404).json({ message: "Room not found" })
        }

        const duplicate = room.requests.some(req =>
            req.song_title.toLowerCase() === title.toLowerCase() &&
            JSON.stringify(req.artistes.map(a => a.id).sort()) === JSON.stringify(artistes.map(a => a.id).sort())
        );

        if (duplicate) {
            return res.status(409).json({ message: "duplicate!" });
        }

        room.requests.push({
            song_title: title,
            artistes: artistes
        })

        await room.save();
        res.status(201).json(room)
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.log(error)
    }
})

export default router;