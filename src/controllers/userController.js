import User from '../models/User.js';

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user status (approve/block)
// @route   PUT /api/v1/users/:id/status
// @access  Private/Admin
export const updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['pending', 'active', 'blocked'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const user = await User.findById(req.params.id);

        if (user) {
            user.status = status;
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                status: updatedUser.status
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Mock payment for seller (upgrade to active/paid)
// @route   POST /api/v1/users/pay-fee
// @access  Private/Seller
export const paySellerFee = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            if (user.role !== 'seller') {
                return res.status(400).json({ message: 'Only sellers can pay the fee' });
            }

            user.isPaid = true;
            // Depending on logic, paying fee might automatically make them 'active' instead of 'pending'
            if (user.status === 'pending') {
                user.status = 'active'; 
            }
            
            const updatedUser = await user.save();
            
            res.json({
                message: 'Payment mock successful',
                isPaid: updatedUser.isPaid,
                status: updatedUser.status
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile (current logged in user)
// @route   GET /api/v1/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
