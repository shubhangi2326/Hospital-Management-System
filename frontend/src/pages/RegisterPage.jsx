import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/authService';
import { User, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '', role: 'Patient' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await registerUser(formData);
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/dashboard');
        } catch (error) {
            alert(error.response?.data?.message || 'Registration failed');
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create Account</h2>
                    <p className="text-gray-500 mt-2">Join the eDoc Healthcare System</p>
                </div>
                <form onSubmit={submitHandler} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input type="text" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-50 outline-none" 
                            placeholder="Username" onChange={(e) => setFormData({...formData, username: e.target.value})} required />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input type="password" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-50 outline-none" 
                            placeholder="••••••••" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">User Role</label>
                        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 font-medium outline-none" 
                        value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                            <option value="Patient">Patient</option>
                            <option value="Doctor">Doctor</option>
                            <option value="Admin">Administrator</option>
                        </select>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                        {loading ? "Processing..." : "Register Now"} <ArrowRight size={18}/>
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-500">Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login</Link></p>
            </div>
        </div>
    );
};

export default RegisterPage;