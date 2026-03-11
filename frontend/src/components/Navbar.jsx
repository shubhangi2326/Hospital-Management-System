// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// const Navbar = () => {
//     const navigate = useNavigate();
//     const userInfo = JSON.parse(localStorage.getItem('userInfo'));

//     const logoutHandler = () => {
//         localStorage.removeItem('userInfo');
//         navigate('/login');
//     };

//     return (
//         <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
//             <div className="container-fluid">
//                 <Link className="navbar-brand" to="/">Hospital System</Link>
//                 <div className="collapse navbar-collapse">
//                     <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
//                         {userInfo ? (
//                             <>
//                                 <li className="nav-item">
//                                     <Link className="nav-link" to="/dashboard">Dashboard</Link>
//                                 </li>
//                                 <li className="nav-item">
//                                     <button className="btn btn-danger" onClick={logoutHandler}>Logout</button>
//                                 </li>
//                             </>
//                         ) : (
//                             <>
//                                 <li className="nav-item">
//                                     <Link className="nav-link" to="/login">Login</Link>
//                                 </li>
//                                 <li className="nav-item">
//                                     <Link className="nav-link" to="/register">Register</Link>
//                                 </li>
//                             </>
//                         )}
//                     </ul>
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;


// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, Activity } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
                                <Activity className="text-white" size={24} />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                CarePlus
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {userInfo ? (
                            <>
                                <Link 
                                    to="/dashboard" 
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        location.pathname === '/dashboard' 
                                        ? 'bg-blue-50 text-blue-600' 
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <LayoutDashboard size={18} />
                                    Dashboard
                                </Link>
                                <button 
                                    onClick={logoutHandler}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex gap-3">
                                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium px-4 py-2">Login</Link>
                                <Link to="/register" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md shadow-blue-200">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;