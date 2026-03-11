import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, ArrowRight } from 'lucide-react';

const HomePage = () => {
    return (
        <div className="relative min-h-screen w-full flex flex-col overflow-hidden font-sans">
            {/* Background Image with Dark Overlay */}
            <div 
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ 
                    backgroundImage: `url('https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1920&q=80')` 
                }}
            >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
            </div>

            {/* Header Section */}
            <header className="relative z-10 flex justify-between items-center px-6 md:px-12 py-8">
                {/* Left Side: Doctor Icon and Logo */}
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <Stethoscope className="text-white" size={28} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold text-white leading-none tracking-tight">Hospital Appointment System</span>
                       
                    </div>
                </div>

                {/* Right Side: Navigation Links */}
                <div className="flex items-center gap-8">
                    <Link 
                        to="/login" 
                        className="text-white text-sm font-bold uppercase tracking-widest hover:text-blue-400 transition-colors"
                    >
                        Login
                    </Link>
                    <Link 
                        to="/register" 
                        className="text-white text-sm font-bold uppercase tracking-widest hover:text-blue-400 transition-colors"
                    >
                        Register
                    </Link>
                </div>
            </header>

            {/* Hero Content Section */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-8 tracking-tight drop-shadow-2xl">
Hospital Appointment System             
    </h1>
                
                <div className="max-w-3xl space-y-4">
                    <p className="text-xl md:text-2xl text-blue-400 font-semibold italic">
                        How is health today? Sounds like not good!
                    </p>
                    <p className="text-gray-200 text-base md:text-lg leading-relaxed">
                        Don't worry. Find your doctor online and book appointments as you wish with eDoc. 
                        We offer a complete system to register patients, authenticate users, and manage medical schedules effortlessly.
                    </p>
                    <p className="text-gray-300 text-sm md:text-base">
                        Make your appointment now through our professional channeling service.
                    </p>
                </div>

                {/* Call to Action Button */}
                <Link 
                    to="/login" 
                    className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-3 rounded-md font-bold text-sm uppercase tracking-[0.2em] transition-all shadow-2xl hover:shadow-blue-500/40 transform hover:-translate-y-1 flex items-center gap-3"
                >
                    Make Appointment
                    <ArrowRight size={18} />
                </Link>
            </main>

          
        </div>
    );
};

export default HomePage;