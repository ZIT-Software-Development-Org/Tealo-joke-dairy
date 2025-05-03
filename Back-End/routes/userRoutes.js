import express from 'express';
import { updateProfile, getProfile, uploadProfilePicture, upload } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.post('/profile/picture', authMiddleware, upload.single('profile_picture'), uploadProfilePicture);

export default router;
