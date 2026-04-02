import express from 'express';
import { getMe, loginUser, registerUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validateAuthPayload } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/register', validateAuthPayload('register'), asyncHandler(registerUser));
router.post('/login', validateAuthPayload('login'), asyncHandler(loginUser));
router.get('/me', protect, asyncHandler(getMe));

export default router;
