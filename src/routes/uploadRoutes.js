import express from 'express';
import { upload } from '../middlewares/uploadMiddleware.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// @desc    Upload media file
// @route   POST /api/v1/upload
// @access  Private/Seller
router.post('/', protect, authorize('seller'), upload.single('media'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    // Return relative path to file
    // Assumes server runs on localhost:3003
    const filePath = `/${req.file.path.replace(/\\/g, '/')}`;
    res.json({
        message: 'File Uploaded',
        filePath: filePath
    });
});

export default router;
