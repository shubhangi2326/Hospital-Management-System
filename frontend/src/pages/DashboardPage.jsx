import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    getDoctors, 
    getBookedAppointments, 
    bookAppointment, 
    cancelAppointment 
} from '../api/authService';

const DashboardPage = () => {
    const [user, setUser] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchAppointments = useCallback(async () => {
        try {
            const data = await getBookedAppointments();
            setAppointments(data);
        } catch (error) {
            console.error('Could not fetch appointments', error);
        }
    }, []);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) {
            navigate('/login');
            return;
        }
        
        setUser(userInfo);
        fetchAppointments();

        if (userInfo.role === 'Patient') {
            const fetchDoctors = async () => {
                try {
                    const data = await getDoctors();
                    setDoctors(data);
                } catch (error) {
                    console.error('Could not fetch doctors', error);
                }
            };
            fetchDoctors();
        }
        setLoading(false);
    }, [navigate, fetchAppointments]);

    const bookAppointmentHandler = async (e) => {
        e.preventDefault();
        try {
            await bookAppointment({ doctorId: selectedDoctor, appointmentDate });
            alert('Appointment booked successfully!');
            fetchAppointments(); 
            setSelectedDoctor('');
            setAppointmentDate('');
        } catch (error) {
            alert('Failed to book appointment');
            console.error(error);
        }
    };
    
    const cancelAppointmentHandler = async (id) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            try {
                await cancelAppointment(id);
                alert('Appointment cancelled!');
                fetchAppointments(); 
            } catch (error) {
                alert('Failed to cancel appointment');
                console.error(error);
            }
        }
    };

    if (loading || !user) return <div className="container text-center mt-5"><h2>Loading...</h2></div>;

    
    return (
        <div className="container mt-4">
            <h2 className="mb-4">Welcome, {user.username} ({user.role})</h2>
            
            {user.role === 'Patient' && (
                <div className="card mb-4">
                    <div className="card-header"><h3>Book an Appointment</h3></div>
                    <div className="card-body">
                        <form onSubmit={bookAppointmentHandler}>
                            <div className="mb-3">
                                <label className="form-label">Select Doctor</label>
                                <select className="form-select" value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} required>
                                    <option value="">-- Select --</option>
                                    {doctors.map(doc => <option key={doc._id} value={doc._id}>{doc.username}</option>)}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Appointment Date</label>
                                <input type="datetime-local" className="form-control" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} required />
                            </div>
                            <button type="submit" className="btn btn-primary">Book Now</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="card">
                 <div className="card-header"><h3>Your Appointments</h3></div>
                 <div className="card-body">
                    {appointments.length === 0 ? <p>No appointments found.</p> : (
                        <ul className="list-group">
                            {appointments.map(app => (
                                <li key={app._id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        {user.role === 'Patient' ? (
                                            <strong>Dr. {app.doctor.username}</strong>
                                        ) : (
                                            <strong>Patient: {app.patient.username}</strong>
                                        )}
                                        <p className="mb-1">Date: {new Date(app.appointmentDate).toLocaleString()}</p>
                                        <span className={`badge ${app.status === 'Scheduled' ? 'bg-success' : 'bg-danger'}`}>{app.status}</span>
                                    </div>
                                    {user.role === 'Patient' && app.status === 'Scheduled' && (
                                        <button className="btn btn-sm btn-warning" onClick={() => cancelAppointmentHandler(app._id)}>
                                            Cancel
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                 </div>
            </div>
        </div>
    );
};

export default DashboardPage;