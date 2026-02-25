import express from 'express';
import { 
    getUsers, 
    updateUserStatus, 
    paySellerFee,
    getUserProfile
} from '../controllers/userController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.post('/pay-fee', protect, authorize('seller'), paySellerFee);

// Admin only routes
router.get('/', protect, authorize('admin'), getUsers);
router.put('/:id/status', protect, authorize('admin'), updateUserStatus);

export default router;
