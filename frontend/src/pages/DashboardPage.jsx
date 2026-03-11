import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Home, Users, Calendar, Bookmark, LogOut, 
    Stethoscope, Edit3, Trash2, User as UserIcon, 
    Activity, Menu, X, Plus, ShieldAlert, CheckCircle, Clock
} from 'lucide-react';
import { 
    getDoctors, getPatients, getBookedAppointments, 
    createUserApi, updateUserApi, deleteUserApi, 
    deleteAppointmentApi, bookAppointment 
} from '../api/authService';

const DashboardPage = () => {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [user, setUser] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    
    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ username: '', password: '', role: '' });

    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        try {
            const [apptData, docData, patData] = await Promise.all([
                getBookedAppointments(),
                getDoctors(),
                getPatients()
            ]);
            setAppointments(apptData);
            setDoctors(docData);
            setPatients(patData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, []);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) {
            navigate('/login');
            return;
        }
        setUser(userInfo);
        fetchData();
    }, [navigate, fetchData]);

    // --- Action Handlers ---
    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleBooking = async (doctorId) => {
        try {
            const appointmentDate = new Date("2050-01-01T18:00:00");
            await bookAppointment({ doctorId, appointmentDate });
            alert("Success: Appointment Booked!");
            fetchData();
            setActiveTab('Appointments');
        } catch (error) {
            alert("Error: Booking failed");
        }
    };

    const handleDelete = async (id, type) => {
        if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
            try {
                if (type === 'Appointment') await deleteAppointmentApi(id);
                else await deleteUserApi(id);
                fetchData();
            } catch (error) { alert("Delete failed"); }
        }
    };

    const openEditModal = (item, type) => {
        setEditingItem({ ...item, type });
        setFormData({ username: item.username || '', password: '', role: item.role || '' });
        setIsModalOpen(true);
    };

    if (!user) return null;

    const role = user.role;

    return (
        <div className="flex min-h-screen bg-[#f8fafc] font-sans">
            
            {/* --- SIDEBAR --- */}
            <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 md:translate-x-0 md:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full flex flex-col p-6">
                    <div className="text-center mb-8 border-b pb-6">
                        <div className="w-16 h-16 bg-gray-50 rounded-full mx-auto flex items-center justify-center border border-gray-100 mb-3 shadow-sm">
                            <UserIcon className="text-gray-400" size={30}/>
                        </div>
                        <h3 className="font-bold text-gray-800 text-sm truncate px-2">{user.username}..</h3>
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">{role} Portal</p>
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
                                <NavItem label="My Patients" icon={<Users size={18}/>} active={activeTab === 'Patients'} onClick={() => setActiveTab('Patients')} />
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

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
                <header className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 bg-white border rounded-lg"><Menu size={18}/></button>
                        <h1 className="text-2xl font-black text-gray-800 tracking-tight italic">{activeTab}</h1>
                    </div>
                </header>

                {activeTab === 'Dashboard' && <WelcomeBanner user={user} doctors={doctors} patients={patients} appointments={appointments} />}

                {/* --- MANAGEMENT TABLES --- */}
                {(activeTab === 'Doctors' || activeTab === 'Patients') && (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest">Available {activeTab}</h3>
                            {role === 'Admin' && (
                                <button onClick={() => { setEditingItem(null); setFormData({username:'', password:'', role: activeTab === 'Doctors' ? 'Doctor' : 'Patient'}); setIsModalOpen(true); }} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
                                    <Plus size={16}/> Add {activeTab.slice(0, -1)}
                                </button>
                            )}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b">
                                    <tr>
                                        <th className="p-6">Name</th>
                                        <th className="p-6">Identity</th>
                                        <th className="p-6 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {(activeTab === 'Doctors' ? doctors : patients).map(u => (
                                        <tr key={u._id} className="text-sm hover:bg-gray-50 transition-colors">
                                            <td className="p-6 font-bold text-gray-800">{activeTab === 'Doctors' ? 'Dr. ' : ''}{u.username}</td>
                                            <td className="p-6 text-gray-400 font-medium">{u.username.toLowerCase()}@edoc.com</td>
                                            <td className="p-6 flex justify-center gap-4">
                                                {role === 'Admin' ? (
                                                    <>
                                                        <button onClick={() => openEditModal(u, 'User')} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"><Edit3 size={18}/></button>
                                                        <button onClick={() => handleDelete(u._id, 'User')} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={18}/></button>
                                                    </>
                                                ) : (
                                                    <button onClick={() => handleBooking(u._id)} className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">View Session</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- BOOKINGS TABLE --- */}
                {activeTab === 'Appointments' && (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b">
                                    <tr>
                                        <th className="p-6">Ref No</th>
                                        <th className="p-6">Patient</th>
                                        <th className="p-6">Doctor</th>
                                        <th className="p-6">Schedule</th>
                                        <th className="p-6 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {appointments.map((app, i) => (
                                        <tr key={app._id} className="text-sm hover:bg-gray-50 transition-colors">
                                            <td className="p-6 font-bold text-blue-600 tracking-tighter">#OC-00{i+1}</td>
                                            <td className="p-6 font-bold text-gray-800">{app.patient?.username}</td>
                                            <td className="p-6 font-bold text-gray-700">Dr. {app.doctor?.username}</td>
                                            <td className="p-6 text-gray-500 font-medium">{new Date(app.appointmentDate).toLocaleString()}</td>
                                            <td className="p-6 flex justify-center gap-3">
                                                <button className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg"><Edit3 size={16}/></button>
                                                <button onClick={() => handleDelete(app._id, 'Appointment')} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={16}/></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {appointments.length === 0 && <tr><td colSpan="5" className="p-20 text-center text-gray-300 font-black uppercase tracking-widest">No Bookings Found</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* --- MODAL FOR ADMIN CRUD --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-gray-800 uppercase tracking-tighter">{editingItem ? 'Update' : 'Add'} {formData.role}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900"><X/></button>
                        </div>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                                editingItem ? await updateUserApi(editingItem._id, formData) : await createUserApi(formData);
                                setIsModalOpen(false); fetchData();
                            } catch (err) { alert("Operation Failed"); }
                        }} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
                                <input type="text" className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-blue-500" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required />
                            </div>
                            {!editingItem && (
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                                    <input type="password" className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-blue-500" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                                </div>
                            )}
                            <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-xl shadow-lg mt-4 hover:bg-blue-700 transition-all uppercase text-[11px] tracking-widest">
                                Save Information
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Sub-components
const NavItem = ({ label, icon, active, onClick }) => (
    <div onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${active ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-100' : 'text-gray-400 hover:bg-gray-50'}`}>
        {icon} <span className="text-[13px] tracking-tight">{label}</span>
    </div>
);

const WelcomeBanner = ({ user, doctors, patients, appointments }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm flex justify-between items-center relative overflow-hidden">
            <div className="z-10">
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2 leading-none">Status Overview</p>
                <h2 className="text-5xl font-black text-gray-800 mb-4 tracking-tighter">{user.username}.</h2>
                <p className="text-gray-500 max-w-lg text-sm leading-relaxed mb-8 font-medium italic">
                    {user.role === 'Admin' ? "Complete Administrative Control: Monitor all medical sessions, manage staff accounts, and oversee patient flow." : "Access specialized healthcare services and manage your medical history efficiently."}
                </p>
                <button className="bg-blue-600 text-white px-10 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-blue-100">View System Logs</button>
            </div>
            <div className="hidden lg:block absolute right-10 opacity-5 rotate-12"><ShieldAlert size={220}/></div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Doctors" count={doctors.length} icon={<Stethoscope size={20}/>} />
            <StatCard label="Patients" count={patients.length} icon={<Users size={20}/>} />
            <StatCard label="New Bookings" count={appointments.length} icon={<Bookmark size={20}/>} />
            <StatCard label="Status" count="Active" icon={<CheckCircle size={20}/>} />
        </div>
    </div>
);

const StatCard = ({ label, count, icon }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-50 flex items-center justify-between shadow-sm hover:scale-[1.02] transition-transform">
        <div><h4 className="text-2xl font-black text-blue-600 mb-1 leading-none">{count}</h4><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p></div>
        <div className="bg-gray-50 p-3 rounded-xl text-gray-300">{icon}</div>
    </div>
);

export default DashboardPage;