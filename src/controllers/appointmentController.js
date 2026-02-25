import Appointment from '../models/Appointment.js';
import Property from '../models/Property.js';
import Notification from '../models/Notification.js';

// Helper to create notifications
const createNotification = async (userId, message) => {
    await Notification.create({ user: userId, message });
};

// @desc    Request an appointment
// @route   POST /api/v1/appointments
// @access  Private/Buyer
export const requestAppointment = async (req, res) => {
    try {
        const { propertyId, type, appointmentDate, notes } = req.body;

        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        const appointment = new Appointment({
            buyer: req.user._id,
            seller: property.seller,
            property: propertyId,
            type,
            appointmentDate
        });

        if (notes) appointment.notes = notes;

        const createdAppointment = await appointment.save();

        // Generate Notification for the Seller
        await createNotification(
            property.seller, 
            `New ${type} requested by buyer ${req.user.name} for property in ${property.location.locality}`
        );

        res.status(201).json(createdAppointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get appointments for a user (can view as Buyer or Seller or Admin)
// @route   GET /api/v1/appointments
// @access  Private
export const getAppointments = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'buyer') {
            query.buyer = req.user._id;
        } else if (req.user.role === 'seller') {
            query.seller = req.user._id;
        } 
        // admin sees all by default

        const appointments = await Appointment.find(query)
            .populate('buyer', 'name email')
            .populate('property', 'title location');

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update appointment status
// @route   PUT /api/v1/appointments/:id/status
// @access  Private
export const updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['scheduled', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check if user is authorized to update
        if (req.user.role !== 'admin' && 
            !appointment.buyer.equals(req.user._id) && 
            !appointment.seller.equals(req.user._id)) {
            return res.status(403).json({ message: 'User not authorized to update this appointment' });
        }

        appointment.status = status;
        const updatedAppointment = await appointment.save();

        // Notify the appropriate party
        const receiverId = req.user._id.equals(appointment.buyer) ? appointment.seller : appointment.buyer;
        await createNotification(
            receiverId, 
            `Appointment status updated to ${status} for ${appointment.type}`
        );

        res.json(updatedAppointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
