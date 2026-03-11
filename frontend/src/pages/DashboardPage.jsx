import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Home, Users, Calendar, Bookmark, LogOut, Stethoscope, 
    Edit3, Trash2, User as UserIcon, Menu, X, Plus, ShieldAlert, CheckCircle 
} from 'lucide-react';
import { 
    getDoctors, getPatients, getBookedAppointments, 
    updateUserApi, deleteUserApi, deleteAppointmentApi, 
    updateAppointmentApi, bookAppointment 
} from '../api/authService';

const DashboardPage = () => {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [user, setUser] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    
    // --- Popup Modal States ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null); // Stores the item being edited
    const [editType, setEditType] = useState(''); // 'user' or 'appointment'

    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        try {
            const [appt, docs, pats] = await Promise.all([
                getBookedAppointments(), getDoctors(), getPatients()
            ]);
            setAppointments(appt); setDoctors(docs); setPatients(pats);
        } catch (e) { console.error(e); }
    }, []);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) { navigate('/login'); return; }
        setUser(userInfo); fetchData();
    }, [navigate, fetchData]);

    // --- Modal Handlers ---
    const openEditModal = (item, type) => {
        setEditType(type);
        setEditData({ ...item });
        setIsModalOpen(true);
    };

    const handleSaveUpdate = async () => {
        try {
            if (editType === 'user') {
                await updateUserApi(editData._id, { username: editData.username });
                alert("User updated successfully!");
            } else {
                await updateAppointmentApi(editData._id, { 
                    appointmentDate: editData.appointmentDate,
                    status: editData.status 
                });
                alert("Appointment updated successfully!");
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            alert("Update failed!");
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm("Delete account?")) { await deleteUserApi(id); alert("Deleted!"); fetchData(); }
    };

    const handleDeleteAppt = async (id) => {
        if (window.confirm("Remove booking?")) { await deleteAppointmentApi(id); alert("Removed!"); fetchData(); }
    };

    const handleBookAppt = async (doctorId, doctorName) => {
        const date = prompt(`Book with Dr. ${doctorName} (YYYY-MM-DD HH:mm):`);
        if (date) { await bookAppointment({ doctorId, appointmentDate: date }); alert("Booked!"); fetchData(); }
    };

    if (!user) return null;
    const role = user.role;

    return (
        <div className="flex min-h-screen bg-[#f8fafc] font-sans">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 md:translate-x-0 md:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full flex flex-col p-6">
                    <div className="text-center mb-8 border-b pb-6">
                        <div className="w-16 h-16 bg-gray-50 rounded-full mx-auto flex items-center justify-center mb-3 shadow-sm"><UserIcon className="text-gray-400" size={30}/></div>
                        <h3 className="font-bold text-gray-800 text-sm truncate">{user.username}..</h3>
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">{role} Panel</p>
                        <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="mt-4 w-full py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-all">Log out</button>
                    </div>
                    <nav className="flex-1 space-y-1">
                        <NavItem label="Dashboard" icon={<Home size={18}/>} active={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} />
                        {role === 'Admin' && (
                            <>
                                <NavItem label="Manage Doctors" icon={<Stethoscope size={18}/>} active={activeTab === 'Doctors'} onClick={() => setActiveTab('Doctors')} />
                                <NavItem label="Manage Patients" icon={<Users size={18}/>} active={activeTab === 'Patients'} onClick={() => setActiveTab('Patients')} />
                                <NavItem label="All Bookings" icon={<Bookmark size={18}/>} active={activeTab === 'Appointments'} onClick={() => setActiveTab('Appointments')} />
                            </>
                        )}
                        {role === 'Doctor' && (
                            <>
                                <NavItem label="List of Patients" icon={<Users size={18}/>} active={activeTab === 'Patients'} onClick={() => setActiveTab('Patients')} />
                                <NavItem label="My Appointments" icon={<Bookmark size={18}/>} active={activeTab === 'Appointments'} onClick={() => setActiveTab('Appointments')} />
                            </>
                        )}
                        {role === 'Patient' && (
                            <>
                                <NavItem label="All Doctors" icon={<Stethoscope size={18}/>} active={activeTab === 'Doctors'} onClick={() => setActiveTab('Doctors')} />
                                <NavItem label="My Bookings" icon={<Bookmark size={18}/>} active={activeTab === 'Appointments'} onClick={() => setActiveTab('Appointments')} />
                            </>
                        )}
                    </nav>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
                <header className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 bg-white border rounded-lg"><Menu size={18}/></button>
                        <h1 className="text-2xl font-black text-gray-800 tracking-tight italic uppercase">{activeTab}</h1>
                    </div>
                </header>

                {activeTab === 'Dashboard' && <WelcomeView user={user} doctors={doctors} patients={patients} appointments={appointments} />}

                {(activeTab === 'Doctors' || activeTab === 'Patients') && (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b">
                                <tr><th className="p-6">Name</th><th className="p-6">Identity</th><th className="p-6 text-center">Actions</th></tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {(activeTab === 'Doctors' ? doctors : patients).map(u => (
                                    <tr key={u._id} className="text-sm hover:bg-gray-50 transition-colors">
                                        <td className="p-6 font-bold text-gray-800">{u.username}</td>
                                        <td className="p-6 text-gray-400 font-medium">{u.username.toLowerCase()}@edoc.com</td>
                                        <td className="p-6 flex justify-center gap-4">
                                            {activeTab === 'Doctors' && role === 'Patient' ? (
                                                <button onClick={() => handleBookAppt(u._id, u.username)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-all">Book Now</button>
                                            ) : (
                                                <>
                                                    <button onClick={() => openEditModal(u, 'user')} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"><Edit3 size={18}/></button>
                                                    <button onClick={() => handleDeleteUser(u._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={18}/></button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'Appointments' && (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b">
                                <tr><th className="p-6">Ref No</th><th className="p-6">Patient</th><th className="p-6">Doctor</th><th className="p-6">Schedule</th><th className="p-6">Status</th><th className="p-6 text-center">Actions</th></tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm">
                                {appointments.map((app, i) => (
                                    <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-6 font-bold text-blue-600">#OC-00{i+1}</td>
                                        <td className="p-6 font-bold text-gray-800">{app.patient?.username}</td>
                                        <td className="p-6 font-bold text-gray-700 italic">Dr. {app.doctor?.username}</td>
                                        <td className="p-6 text-gray-500 font-medium">{new Date(app.appointmentDate).toLocaleString()}</td>
                                        <td className="p-6"><span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${app.status === 'Cancelled' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>{app.status || 'Scheduled'}</span></td>
                                        <td className="p-6 flex justify-center gap-3">
                                            <button onClick={() => openEditModal(app, 'appointment')} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"><Edit3 size={18}/></button>
                                            <button onClick={() => handleDeleteAppt(app._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={18}/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {/* --- UPDATE POPUP MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="font-black text-gray-800 uppercase tracking-tight italic">Update {editType === 'user' ? 'Profile' : 'Booking'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                        </div>
                        <div className="p-8 space-y-5">
                            {editType === 'user' ? (
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">Username</label>
                                    <input type="text" value={editData.username} onChange={(e) => setEditData({...editData, username: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">Date & Time</label>
                                        <input type="datetime-local" value={editData.appointmentDate.slice(0, 16)} onChange={(e) => setEditData({...editData, appointmentDate: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">Status</label>
                                        <select value={editData.status || 'Scheduled'} onChange={(e) => setEditData({...editData, status: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                                            <option value="Scheduled">Scheduled</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </>
                            )}
                            <div className="pt-4 flex gap-3">
                                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest hover:bg-gray-50 rounded-xl transition-all">Cancel</button>
                                <button onClick={handleSaveUpdate} className="flex-1 py-3 text-xs font-bold text-white bg-blue-600 uppercase tracking-widest rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper Components (Same as before)
const NavItem = ({ label, icon, active, onClick }) => (
    <div onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-100' : 'text-gray-400 hover:bg-gray-50'}`}>
        {icon} <span className="text-[13px]">{label}</span>
    </div>
);

const WelcomeView = ({ user, doctors, patients, appointments }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm flex justify-between items-center relative overflow-hidden">
            <div className="z-10">
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2 leading-none">Management Center</p>
                <h2 className="text-5xl font-black text-gray-800 mb-4 tracking-tighter uppercase">{user.username}.</h2>
                <p className="text-gray-500 max-w-lg text-sm leading-relaxed mb-8 font-medium">Dynamic medical gateway for managing staff, patient registry, and all upcoming clinical sessions.</p>
                <button className="bg-blue-600 text-white px-10 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-blue-100">System Activity Logs</button>
            </div>
            <div className="hidden lg:block absolute right-10 opacity-5 rotate-12"><ShieldAlert size={220}/></div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatSmall label="Doctors" count={doctors.length} icon={<Stethoscope size={20}/>} />
            <StatSmall label="Patients" count={patients.length} icon={<Users size={20}/>} />
            <StatSmall label="Bookings" count={appointments.length} icon={<Bookmark size={20}/>} />
            <StatSmall label="Status" count="Active" icon={<CheckCircle size={20}/>} />
        </div>
    </div>
);

const StatSmall = ({ label, count, icon }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-50 flex items-center justify-between shadow-sm">
        <div><h4 className="text-2xl font-black text-blue-600 mb-1 leading-none">{count}</h4><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p></div>
        <div className="bg-gray-50 p-3 rounded-xl text-gray-300">{icon}</div>
    </div>
);

export default DashboardPage;