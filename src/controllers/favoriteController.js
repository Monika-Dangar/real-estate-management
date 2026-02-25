import Favorite from '../models/Favorite.js';
import Property from '../models/Property.js';

// @desc    Add property to favorites
// @route   POST /api/v1/favorites
// @access  Private/Buyer
export const addFavorite = async (req, res) => {
    try {
        const { propertyId } = req.body;

        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        const existingFavorite = await Favorite.findOne({
            buyer: req.user._id,
            property: propertyId
        });

        if (existingFavorite) {
            return res.status(400).json({ message: 'Property already in favorites' });
        }

        const favorite = new Favorite({
            buyer: req.user._id,
            property: propertyId
        });

        const createdFavorite = await favorite.save();
        res.status(201).json(createdFavorite);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's favorites
// @route   GET /api/v1/favorites
// @access  Private/Buyer
export const getFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.find({ buyer: req.user._id })
            .populate('property');
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove property from favorites
// @route   DELETE /api/v1/favorites/:id
// @access  Private/Buyer
export const removeFavorite = async (req, res) => {
    try {
        const favorite = await Favorite.findById(req.params.id);

        if (!favorite) {
            return res.status(404).json({ message: 'Favorite not found' });
        }

        if (!favorite.buyer.equals(req.user._id)) {
            return res.status(403).json({ message: 'User not authorized to remove this favorite' });
        }

        await favorite.deleteOne();
        res.json({ message: 'Favorite removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
