// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//     getDoctors, 
//     getBookedAppointments, 
//     bookAppointment, 
//     cancelAppointment 
// } from '../api/authService';

// const DashboardPage = () => {
//     const [user, setUser] = useState(null);
//     const [doctors, setDoctors] = useState([]);
//     const [appointments, setAppointments] = useState([]);
//     const [selectedDoctor, setSelectedDoctor] = useState('');
//     const [appointmentDate, setAppointmentDate] = useState('');
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     const fetchAppointments = useCallback(async () => {
//         try {
//             const data = await getBookedAppointments();
//             setAppointments(data);
//         } catch (error) {
//             console.error('Could not fetch appointments', error);
//         }
//     }, []);

//     useEffect(() => {
//         const userInfo = JSON.parse(localStorage.getItem('userInfo'));
//         if (!userInfo) {
//             navigate('/login');
//             return;
//         }
        
//         setUser(userInfo);
//         fetchAppointments();

//         if (userInfo.role === 'Patient') {
//             const fetchDoctors = async () => {
//                 try {
//                     const data = await getDoctors();
//                     setDoctors(data);
//                 } catch (error) {
//                     console.error('Could not fetch doctors', error);
//                 }
//             };
//             fetchDoctors();
//         }
//         setLoading(false);
//     }, [navigate, fetchAppointments]);

//     const bookAppointmentHandler = async (e) => {
//         e.preventDefault();
//         try {
//             await bookAppointment({ doctorId: selectedDoctor, appointmentDate });
//             alert('Appointment booked successfully!');
//             fetchAppointments(); 
//             setSelectedDoctor('');
//             setAppointmentDate('');
//         } catch (error) {
//             alert('Failed to book appointment');
//             console.error(error);
//         }
//     };
    
//     const cancelAppointmentHandler = async (id) => {
//         if (window.confirm('Are you sure you want to cancel this appointment?')) {
//             try {
//                 await cancelAppointment(id);
//                 alert('Appointment cancelled!');
//                 fetchAppointments(); 
//             } catch (error) {
//                 alert('Failed to cancel appointment');
//                 console.error(error);
//             }
//         }
//     };

//     if (loading || !user) return <div className="container text-center mt-5"><h2>Loading...</h2></div>;

    
//     return (
//         <div className="container mt-4">
//             <h2 className="mb-4">Welcome, {user.username} ({user.role})</h2>
            
//             {user.role === 'Patient' && (
//                 <div className="card mb-4">
//                     <div className="card-header"><h3>Book an Appointment</h3></div>
//                     <div className="card-body">
//                         <form onSubmit={bookAppointmentHandler}>
//                             <div className="mb-3">
//                                 <label className="form-label">Select Doctor</label>
//                                 <select className="form-select" value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} required>
//                                     <option value="">-- Select --</option>
//                                     {doctors.map(doc => <option key={doc._id} value={doc._id}>{doc.username}</option>)}
//                                 </select>
//                             </div>
//                             <div className="mb-3">
//                                 <label className="form-label">Appointment Date</label>
//                                 <input type="datetime-local" className="form-control" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} required />
//                             </div>
//                             <button type="submit" className="btn btn-primary">Book Now</button>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             <div className="card">
//                  <div className="card-header"><h3>Your Appointments</h3></div>
//                  <div className="card-body">
//                     {appointments.length === 0 ? <p>No appointments found.</p> : (
//                         <ul className="list-group">
//                             {appointments.map(app => (
//                                 <li key={app._id} className="list-group-item d-flex justify-content-between align-items-center">
//                                     <div>
//                                         {user.role === 'Patient' ? (
//                                             <strong>Dr. {app.doctor.username}</strong>
//                                         ) : (
//                                             <strong>Patient: {app.patient.username}</strong>
//                                         )}
//                                         <p className="mb-1">Date: {new Date(app.appointmentDate).toLocaleString()}</p>
//                                         <span className={`badge ${app.status === 'Scheduled' ? 'bg-success' : 'bg-danger'}`}>{app.status}</span>
//                                     </div>
//                                     {user.role === 'Patient' && app.status === 'Scheduled' && (
//                                         <button className="btn btn-sm btn-warning" onClick={() => cancelAppointmentHandler(app._id)}>
//                                             Cancel
//                                         </button>
//                                     )}
//                                 </li>
//                             ))}
//                         </ul>
//                     )}
//                  </div>
//             </div>
//         </div>
//     );
// };

// export default DashboardPage;


// src/pages/DashboardPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User as UserIcon, Clock, CheckCircle, XCircle, PlusCircle } from 'lucide-react';
import { getDoctors, getBookedAppointments, bookAppointment, cancelAppointment } from '../api/authService';

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
        } catch (error) { console.error(error); }
    }, []);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) { navigate('/login'); return; }
        setUser(userInfo);
        fetchAppointments();
        if (userInfo.role === 'Patient') {
            getDoctors().then(setDoctors).catch(console.error);
        }
        setLoading(false);
    }, [navigate, fetchAppointments]);

    const bookAppt = async (e) => {
        e.preventDefault();
        try {
            await bookAppointment({ doctorId: selectedDoctor, appointmentDate });
            fetchAppointments();
            setSelectedDoctor(''); setAppointmentDate('');
        } catch (err) { alert('Booking failed'); }
    };

    if (loading || !user) return <div className="flex justify-center mt-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="min-h-screen bg-[#f8fafc] py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Welcome Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.username} 👋</h1>
                        <p className="text-gray-500">Manage your medical appointments with ease.</p>
                    </div>
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                        Role: {user.role}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Booking Section */}
                    {user.role === 'Patient' && (
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                                <div className="p-6 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
                                    <PlusCircle className="text-blue-600" size={20} />
                                    <h3 className="font-bold text-blue-900">New Appointment</h3>
                                </div>
                                <form onSubmit={bookAppt} className="p-6 space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Select Doctor</label>
                                        <select 
                                            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
                                            value={selectedDoctor} 
                                            onChange={(e) => setSelectedDoctor(e.target.value)} 
                                            required
                                        >
                                            <option value="">Choose a specialist</option>
                                            {doctors.map(doc => <option key={doc._id} value={doc._id}>Dr. {doc.username}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Preferred Date & Time</label>
                                        <input 
                                            type="datetime-local" 
                                            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
                                            value={appointmentDate} 
                                            onChange={(e) => setAppointmentDate(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-100 transition-all">
                                        Book Appointment
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Appointments List */}
                    <div className={user.role === 'Patient' ? "lg:col-span-2" : "lg:col-span-3"}>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900">Your Consultations</h3>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {appointments.length === 0 ? (
                                    <div className="p-10 text-center text-gray-500">No appointments found.</div>
                                ) : (
                                    appointments.map(app => (
                                        <div key={app._id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div className="flex gap-4">
                                                <div className={`p-3 rounded-2xl ${app.status === 'Scheduled' ? 'bg-green-50' : 'bg-red-50'}`}>
                                                    <Calendar className={app.status === 'Scheduled' ? 'text-green-600' : 'text-red-600'} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900">
                                                        {user.role === 'Patient' ? `Dr. ${app.doctor.username}` : `Patient: ${app.patient.username}`}
                                                    </h4>
                                                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 font-medium">
                                                        <span className="flex items-center gap-1"><Clock size={14}/> {new Date(app.appointmentDate).toLocaleDateString()}</span>
                                                        <span className="flex items-center gap-1"> {new Date(app.appointmentDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                    </div>
                                                    <div className="mt-2 flex items-center gap-1">
                                                        {app.status === 'Scheduled' ? <CheckCircle size={14} className="text-green-500"/> : <XCircle size={14} className="text-red-500"/>}
                                                        <span className={`text-xs font-bold uppercase tracking-wider ${app.status === 'Scheduled' ? 'text-green-600' : 'text-red-600'}`}>
                                                            {app.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {user.role === 'Patient' && app.status === 'Scheduled' && (
                                                <button 
                                                    onClick={() => cancelAppointment(app._id).then(fetchAppointments)}
                                                    className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-all"
                                                >
                                                    Cancel Appointment
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;