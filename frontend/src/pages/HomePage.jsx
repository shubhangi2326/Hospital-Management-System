import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="container mt-5">
            <div className="p-5 mb-4 bg-light rounded-3 text-center">
                <div className="container-fluid py-5">
                    <h1 className="display-5 fw-bold">Hospital Appointment System</h1>
                    <p className="fs-4">Your health is our priority. Register or log in to book and manage your appointments with our expert doctors.</p>
                    <Link className="btn btn-primary btn-lg me-2" to="/register">Register</Link>
                    <Link className="btn btn-secondary btn-lg" to="/login">Login</Link>
                </div>
            </div>
        </div>
    );
};
export default HomePage;