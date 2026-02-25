import express from 'express';
import {
    requestAppointment,
    getAppointments,
    updateAppointmentStatus
} from '../controllers/appointmentController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .post(authorize('buyer'), requestAppointment)
    .get(getAppointments);

router.put('/:id/status', updateAppointmentStatus);

export default router;
