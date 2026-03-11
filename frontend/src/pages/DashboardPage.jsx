import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Home, Users, Calendar, Bookmark, LogOut, Search, 
    User as UserIcon, Calendar as CalendarIcon, Stethoscope, 
    Activity, ArrowLeft, Menu, X, Clock, ClipboardList, ShieldAlert
} from 'lucide-react';
import { getDoctors, getPatients, getBookedAppointments, cancelAppointment } from '../api/authService';

const DashboardPage = () => {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [user, setUser] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
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
        } catch (error) { console.error(error); }
    }, []);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) { navigate('/login'); return; }
        setUser(userInfo);
        fetchData();
        setLoading(false);
    }, [navigate, fetchData]);

    if (loading || !user) return <div className="h-screen flex items-center justify-center font-bold text-blue-600">LOADING...</div>;

    const role = user.role;

    return (
        <div className="flex min-h-screen bg-[#f8fafc]">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 md:translate-x-0 md:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full flex flex-col p-6">
                    <div className="text-center mb-8 border-b border-gray-50 pb-6">
                        <div className="w-16 h-16 bg-gray-50 rounded-full mx-auto flex items-center justify-center border border-gray-100 mb-3"><UserIcon className="text-gray-400" size={30}/></div>
                        <h3 className="font-bold text-gray-800 text-sm">{user.username}..</h3>
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">{role} Account</p>
                        <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="mt-4 w-full py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all">Log out</button>
                    </div>
                    <nav className="flex-1 space-y-1">
                        <NavItem label="Dashboard" icon={<Home size={18}/>} active={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} />
                        {role === 'Admin' && <AdminNav setActiveTab={setActiveTab} activeTab={activeTab} />}
                        {role === 'Doctor' && <DoctorNav setActiveTab={setActiveTab} activeTab={activeTab} />}
                        {role === 'Patient' && <PatientNav setActiveTab={setActiveTab} activeTab={activeTab} />}
                    </nav>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-black text-gray-800 tracking-tight">{activeTab}</h1>
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
                        <div className="text-right"><p className="text-[9px] text-gray-400 font-bold uppercase">Today's Date</p><p className="text-sm font-bold text-gray-700">2022-06-03</p></div>
                        <CalendarIcon size={20} className="text-blue-500" />
                    </div>
                </div>

                {activeTab === 'Dashboard' && <WelcomeBanner user={user} appointments={appointments} doctors={doctors} patients={patients} />}
                {activeTab === 'Doctors' && <ListView data={doctors} type="Doctor" />}
                {activeTab === 'Patients' && <ListView data={patients} type="Patient" />}
                {activeTab === 'Appointments' && <AppointmentList appointments={appointments} role={role} />}
            </main>
        </div>
    );
};

// --- View Helpers ---

const AdminNav = ({ setActiveTab, activeTab }) => (
    <>
        <NavItem label="All Doctors" icon={<Stethoscope size={18}/>} active={activeTab === 'Doctors'} onClick={() => setActiveTab('Doctors')} />
        <NavItem label="All Patients" icon={<Users size={18}/>} active={activeTab === 'Patients'} onClick={() => setActiveTab('Patients')} />
        <NavItem label="All Appointments" icon={<Bookmark size={18}/>} active={activeTab === 'Appointments'} onClick={() => setActiveTab('Appointments')} />
    </>
);

const DoctorNav = ({ setActiveTab, activeTab }) => (
    <>
        <NavItem label="My Patients" icon={<Users size={18}/>} active={activeTab === 'Patients'} onClick={() => setActiveTab('Patients')} />
        <NavItem label="My Appointments" icon={<Bookmark size={18}/>} active={activeTab === 'Appointments'} onClick={() => setActiveTab('Appointments')} />
    </>
);

const PatientNav = ({ setActiveTab, activeTab }) => (
    <>
        <NavItem label="All Doctors" icon={<Stethoscope size={18}/>} active={activeTab === 'Doctors'} onClick={() => setActiveTab('Doctors')} />
        <NavItem label="My Bookings" icon={<Bookmark size={18}/>} active={activeTab === 'Appointments'} onClick={() => setActiveTab('Appointments')} />
    </>
);

const WelcomeBanner = ({ user, appointments, doctors, patients }) => (
    <div className="space-y-8">
        <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm flex justify-between items-center relative overflow-hidden">
            <div className="z-10">
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">System Overview</p>
                <h2 className="text-5xl font-black text-gray-800 mb-4">{user.username}.</h2>
                <p className="text-gray-500 max-w-lg text-sm leading-relaxed mb-8">Access the complete portal services. Manage users and track history effortlessly.</p>
                <button className="bg-blue-600 text-white px-10 py-3 rounded-lg font-bold text-xs uppercase shadow-xl shadow-blue-100">View Detailed Reports</button>
            </div>
            <div className="absolute right-10 opacity-5 rotate-12"><Activity size={200}/></div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Doctors" count={doctors.length} icon={<Stethoscope size={20}/>} />
            <StatCard label="Patients" count={patients.length} icon={<Users size={20}/>} />
            <StatCard label="New Bookings" count={appointments.length} icon={<Bookmark size={20}/>} />
            <StatCard label="Status" count="Active" icon={<Activity size={20}/>} />
        </div>
    </div>
);

const AppointmentList = ({ appointments, role }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b">
                <tr>
                    <th className="p-5">Reference</th>
                    <th className="p-5">Patient</th>
                    <th className="p-5">Doctor</th>
                    <th className="p-5">Scheduled Date</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {appointments.map((app, i) => (
                    <tr key={app._id} className="text-sm hover:bg-gray-50 transition-colors">
                        <td className="p-5 font-bold text-blue-600">#OC-00{i+1}</td>
                        <td className="p-5 font-bold text-gray-800">{app.patient?.username}</td>
                        <td className="p-5 font-bold text-gray-800">Dr. {app.doctor?.username}</td>
                        <td className="p-5 text-gray-500 font-medium">{new Date(app.appointmentDate).toLocaleString()}</td>
                    </tr>
                ))}
                {appointments.length === 0 && <tr><td colSpan="4" className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest">No Records Found</td></tr>}
            </tbody>
        </table>
    </div>
);

const NavItem = ({ label, icon, active, onClick }) => (
    <div onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-600 text-white font-bold shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
        {icon} <span className="text-[13px]">{label}</span>
    </div>
);

const StatCard = ({ label, count, icon }) => (
    <div className="bg-white p-5 rounded-2xl border border-gray-50 flex items-center justify-between shadow-sm">
        <div><h4 className="text-2xl font-black text-blue-600">{count}</h4><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p></div>
        <div className="bg-gray-50 p-3 rounded-xl text-gray-300">{icon}</div>
    </div>
);

const ListView = ({ data, type }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map(item => (
            <div key={item._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-full mx-auto flex items-center justify-center text-blue-600 mb-3 font-bold border border-gray-50">{item.username.charAt(0)}</div>
                <h4 className="font-bold text-gray-800 text-sm">{type === 'Doctor' ? 'Dr.' : ''} {item.username}</h4>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{type}</p>
            </div>
        ))}
    </div>
);

export default DashboardPage;