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

// Get appointments based on Role (Patient/Doctor/Admin)
export const getAppointments = async (req, res) => {
    try {
        let query = {};
        
        // Logic for 3 panels
        if (req.user.role === 'Patient') {
            query = { patient: req.user._id };
        } else if (req.user.role === 'Doctor') {
            query = { doctor: req.user._id };
        } else if (req.user.role === 'Admin') {
            query = {}; // Admin sees all appointments in the system
        }

        const appointments = await Appointment.find(query)
            .populate('doctor', 'username')
            .populate('patient', 'username')
            .sort({ appointmentDate: -1 }); // Latest appointments first

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
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