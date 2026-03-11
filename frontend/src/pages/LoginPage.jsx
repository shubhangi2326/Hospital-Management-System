// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { loginUser } from '../api/authService';

// const LoginPage = () => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (JSON.parse(localStorage.getItem('userInfo'))) {
//             navigate('/dashboard');
//         }
//     }, [navigate]);

//     const submitHandler = async (e) => {
//         e.preventDefault();
//         try {
            
//             const data = await loginUser({ username, password });
            
            
//             localStorage.setItem('userInfo', JSON.stringify(data));
//             navigate('/dashboard');

//         } catch (error) {
//             alert('Invalid username or password');
//             console.error('Login failed:', error.response ? error.response.data : error.message);
//         }
//     };

//     return (
        
//         <div className="container mt-5">
//             <div className="row justify-content-center">
//                 <div className="col-md-6 col-lg-5">
//                     <div className="card shadow-sm">
//                         <div className="card-body p-4">
//                             <h2 className="card-title text-center mb-4">Login</h2>
//                             <form onSubmit={submitHandler}>
//                                 {/* Form fields... */}
//                                 <div className="mb-3">
//                                     <label htmlFor="username" className="form-label">Username</label>
//                                     <input
//                                         type="text" id="username" className="form-control"
//                                         value={username} onChange={(e) => setUsername(e.target.value)} required
//                                     />
//                                 </div>
//                                 <div className="mb-3">
//                                     <label htmlFor="password_login" className="form-label">Password</label>
//                                     <input
//                                         type="password" id="password_login" className="form-control"
//                                         value={password} onChange={(e) => setPassword(e.target.value)} required
//                                     />
//                                 </div>
//                                 <button type="submit" className="btn btn-primary w-100 mt-3">Login</button>
//                                 <div className="mt-3 text-center">
//                                     <small>New user? <Link to="/register">Register here</Link></small>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LoginPage;

// src/pages/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/authService';
import { User, Lock, ArrowRight } from 'lucide-react';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('userInfo')) navigate('/dashboard');
    }, [navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await loginUser({ username, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/dashboard');
        } catch (error) {
            alert('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#f8fafc] px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl shadow-blue-100/50 border border-gray-100 overflow-hidden">
                    <div className="p-8">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                            <p className="text-gray-500 mt-2">Please enter your details to sign in</p>
                        </div>

                        <form onSubmit={submitHandler} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Username</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all outline-none"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                                    <input
                                        type="password"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all outline-none"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 group"
                            >
                                {loading ? "Signing in..." : "Login"}
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-gray-600">
                                New user? <Link to="/register" className="text-blue-600 font-bold hover:underline">Register here</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;