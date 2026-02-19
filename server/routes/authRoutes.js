import express from 'express';
import { signup, login, getProfile, logout } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting for login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,                    // 5 attempts only
    message: 'Too many login attempts. Try again in 15 minutes.'
});

router.post('/signup', signup);
router.post('/login', loginLimiter, login);
router.get('/me', protect, getProfile);
router.post('/logout', protect, logout);

export default router;
