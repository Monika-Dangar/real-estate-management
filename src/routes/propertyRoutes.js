import express from 'express';
import {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    getMyProperties,
    updatePropertyStatus
} from '../controllers/propertyController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.route('/')
    .get(getProperties)
    .post(protect, authorize('seller'), createProperty);

// Seller/User specific
router.get('/my-properties', protect, authorize('seller'), getMyProperties);

// Specific ID routes
router.route('/:id')
    .get(getPropertyById) // Public but includes logic for private viewing
    .put(protect, authorize('seller'), updateProperty);

// Admin routes
router.put('/:id/status', protect, authorize('admin'), updatePropertyStatus);

export default router;
