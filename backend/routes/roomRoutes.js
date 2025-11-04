import express from 'express';
import protect from '../middleware/authMiddleware.js';
import protectRoom from '../middleware/roomMiddleware.js';
import { createRoom, enterRoom, fetchAllRooms, fetchSingleRoom, seedDemo, addRequest, upvote } from '../controllers/roomController.js';

const router = express.Router();

// --- Room Creation ---
router.post('/create', createRoom);

// --- Room Entry (Login) ---
router.post('/enter', enterRoom);

// --- Get All Rooms ---
router.get('/all', fetchAllRooms);

// --- Seeding Demo Data ---
router.post('/seed-demo', seedDemo);

// --- Get Single Room Details ---
router.get("/:roomId", protectRoom, fetchSingleRoom);

// --- Add Song Request ---
router.post('/add-request', protectRoom, addRequest);

// --- Upvote / Toggle Upvote ---
router.post('/:roomId/request/:requestId/upvote', protect, upvote);

export default router;