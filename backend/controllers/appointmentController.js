import Appointment from '../models/Appointment.js'; 

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

export const getAppointments = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'Patient') {
            query = { patient: req.user._id };
        } else {
            query = { doctor: req.user._id };
        }
        const appointments = await Appointment.find(query)
            .populate('doctor', 'username')
            .populate('patient', 'username');
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        if (appointment.patient.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        appointment.status = 'Cancelled';
        const updatedAppointment = await appointment.save();
        res.json(updatedAppointment);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};