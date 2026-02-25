import Notification from '../models/Notification.js';

// @desc    Get user's notifications
// @route   GET /api/v1/notifications
// @access  Private
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/v1/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        if (!notification.user.equals(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        notification.isRead = true;
        const updatedNotification = await notification.save();

        res.json(updatedNotification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
