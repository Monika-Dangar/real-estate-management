import Property from '../models/Property.js';
import User from '../models/User.js';

// @desc    Get all approved properties (Search/Filter)
// @route   GET /api/v1/properties
// @access  Public
export const getProperties = async (req, res) => {
    try {
        const { keyword, city, locality, configuration, minBudget, maxBudget, maxPossessionDate } = req.query;

        let query = { status: 'approved' }; // Only show approved properties to public

        // Keyword Search (uses text index on title, description, city, locality)
        if (keyword) {
            query.$text = { $search: keyword };
        }

        // Specific Filters
        if (city) query['location.city'] = new RegExp(city, 'i');
        if (locality) query['location.locality'] = new RegExp(locality, 'i');
        if (configuration) query.configuration = configuration;

        if (minBudget || maxBudget) {
            query.price = {};
            if (minBudget) query.price.$gte = Number(minBudget);
            if (maxBudget) query.price.$lte = Number(maxBudget);
        }

        if (maxPossessionDate) {
            query.possessionDate = { $lte: new Date(maxPossessionDate) };
        }

        // Sort: Premium properties first, then newest
        const properties = await Property.find(query)
            .populate('seller', 'name email')
            .sort({ isPremium: -1, createdAt: -1 });

        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get property by ID
// @route   GET /api/v1/properties/:id
// @access  Public
export const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate('seller', 'name email');

        if (property && (property.status === 'approved' || (req.user && (req.user.role === 'admin' || req.user._id.equals(property.seller._id))))) {
            res.json(property);
        } else {
            res.status(404).json({ message: 'Property not found or not approved yet' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a property
// @route   POST /api/v1/properties
// @access  Private/Seller
export const createProperty = async (req, res) => {
    try {
        // Confirm user is an active/paid seller
        const user = await User.findById(req.user._id);
        if (!user.isPaid || user.status !== 'active') {
            return res.status(403).json({ message: 'You must have an active and paid account to list properties.' });
        }

        const property = new Property({
            seller: req.user._id,
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            configuration: req.body.configuration,
            location: req.body.location,
            budgetRange: req.body.budgetRange,
            possessionDate: req.body.possessionDate,
            amenities: req.body.amenities,
            videos: req.body.videos,
            isPremium: req.body.isPremium || false
            // default status is 'pending'
        });

        const createdProperty = await property.save();
        res.status(201).json(createdProperty);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a property
// @route   PUT /api/v1/properties/:id
// @access  Private/Seller
export const updateProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (property) {
            // Check ownership
            if (!property.seller.equals(req.user._id)) {
                return res.status(403).json({ message: 'User not authorized to update this property' });
            }

            property.title = req.body.title || property.title;
            property.description = req.body.description || property.description;
            property.price = req.body.price || property.price;
            property.configuration = req.body.configuration || property.configuration;
            property.location = req.body.location || property.location;
            property.budgetRange = req.body.budgetRange || property.budgetRange;
            property.possessionDate = req.body.possessionDate || property.possessionDate;
            property.amenities = req.body.amenities || property.amenities;
            property.videos = req.body.videos || property.videos;
            property.isPremium = req.body.isPremium !== undefined ? req.body.isPremium : property.isPremium;

            // Re-eval for admin approval if significant fields change (optional logic)
            // property.status = 'pending'; 

            const updatedProperty = await property.save();
            res.json(updatedProperty);
        } else {
            res.status(404).json({ message: 'Property not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in seller properties
// @route   GET /api/v1/properties/my-properties
// @access  Private/Seller
export const getMyProperties = async (req, res) => {
    try {
        const properties = await Property.find({ seller: req.user._id });
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve/Reject property
// @route   PUT /api/v1/properties/:id/status
// @access  Private/Admin
export const updatePropertyStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const property = await Property.findById(req.params.id);

        if (property) {
            property.status = status;
            const updatedProperty = await property.save();
            res.json(updatedProperty);
        } else {
            res.status(404).json({ message: 'Property not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
