import express from 'express';
import {
    addFavorite,
    getFavorites,
    removeFavorite
} from '../controllers/favoriteController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('buyer'));

router.route('/')
    .post(addFavorite)
    .get(getFavorites);

router.route('/:id')
    .delete(removeFavorite);

export default router;
