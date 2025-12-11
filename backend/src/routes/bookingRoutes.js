
import express from 'express';
import { createBooking, getUserBookings } from '../controllers/bookingController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/', protect, getUserBookings);

export default router;
