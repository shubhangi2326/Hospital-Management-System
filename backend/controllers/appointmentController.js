import Appointment from '../models/Appointment.js'; 

// Book a new appointment
export const bookAppointment = async (req, res) => {
    const { doctorId, appointmentDate } = req.body;
    try {
        const newAppointment = new Appointment({
            patient: req.user._id,
            doctor: doctorId,
            appointmentDate,
        });
        const savedAppointment = await newAppointment.save();
        res.status(201).json(savedAppointment);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// controllers/appointmentController.js

export const getAppointments = async (req, res) => {
    try {
        let query = {};

        // Role-based logic for 3 Panels
        if (req.user.role === 'Patient') {
            // Patient only sees their own bookings
            query = { patient: req.user._id };
        } else if (req.user.role === 'Doctor') {
            // Doctor only sees appointments booked with them
            query = { doctor: req.user._id };
        } else if (req.user.role === 'Admin') {
            // Admin sees EVERY appointment in the database
            query = {}; 
        }

        const appointments = await Appointment.find(query)
            .populate('doctor', 'username') // Fetch doctor name
            .populate('patient', 'username') // Fetch patient name
            .sort({ createdAt: -1 }); // Show latest first

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Cancel Appointment
export const cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Authorization check: Only Admin or the Patient who booked it can cancel
        const isOwner = appointment.patient.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'Admin';

        if (!isOwner && !isAdmin) {
            return res.status(401).json({ message: 'User not authorized to cancel this' });
        }

        appointment.status = 'Cancelled';
        const updatedAppointment = await appointment.save();
        res.json(updatedAppointment);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update Appointment (Date/Time)
export const updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (appointment) {
            appointment.appointmentDate = req.body.appointmentDate || appointment.appointmentDate;
            const updatedApp = await appointment.save();
            res.json(updatedApp);
        } else {
            res.status(404).json({ message: 'Appointment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Hard Delete Appointment
export const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (appointment) {
            await appointment.deleteOne();
            res.json({ message: 'Appointment deleted successfully' });
        } else {
            res.status(404).json({ message: 'Appointment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
