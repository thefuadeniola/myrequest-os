import express from 'express';
import User from '../models/user.js';
import generateToken from '../utils/generateToken.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const userExists = await User.findOne({ username });
        if (userExists) return res.status(400).json({ message: "User already exists" });
        
        const user = await User.create({ username, password });

        const accessToken = generateToken({ userId: user._id });
        
        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        res.status(201).json({
            _id: user._id,
            username: user.username,
            token: accessToken
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (user && (await user.matchPassword(password))) {
            const accessToken = generateToken({ userId: user._id });

            res.cookie("access_token", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "none",
                path: "/",
            });

            res.status(200).json({
                _id: user.id,
                username: user.username,
                token: accessToken
            });
        } else {
            res.status(401).json({ message: "Invalid username or password" });
        }
    } catch (error) {
        res.status(500).json({ message: `Unable to login: ${error.message}` });
    }
});

router.get('/me', protect, async (req, res) => {
    const { username } = req.user;
    if (username) {
        res.status(200).json({ username });
    } else {
        res.status(401).json({ message: "Not logged in" });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie("access_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        path: "/"
    });

    res.status(200).json({ message: "Logged out successfully" });
});

/* // Get single post
router.get('/:id', getPost);

// create new post
router.post('/', newPost);

// Update post
router.put('/:id', updatePost);

// Delete Post
router.delete('/:id', deletePost);
 */

export default router;
