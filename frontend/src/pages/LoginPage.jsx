import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/authService';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (JSON.parse(localStorage.getItem('userInfo'))) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            
            const data = await loginUser({ username, password });
            
            
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/dashboard');

        } catch (error) {
            alert('Invalid username or password');
            console.error('Login failed:', error.response ? error.response.data : error.message);
        }
    };

    return (
        
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <h2 className="card-title text-center mb-4">Login</h2>
                            <form onSubmit={submitHandler}>
                                {/* Form fields... */}
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <input
                                        type="text" id="username" className="form-control"
                                        value={username} onChange={(e) => setUsername(e.target.value)} required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password_login" className="form-label">Password</label>
                                    <input
                                        type="password" id="password_login" className="form-control"
                                        value={password} onChange={(e) => setPassword(e.target.value)} required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100 mt-3">Login</button>
                                <div className="mt-3 text-center">
                                    <small>New user? <Link to="/register">Register here</Link></small>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;