
export const BASE_URL = import.meta.env.VITE_API_URL || 'https://hospital-management-system-pfl9.onrender.com';

// Object containing all the API endpoints
export const ENDPOINTS = {
    // User endpoints
    LOGIN: '/api/users/login',
    REGISTER: '/api/users/register',
    GET_DOCTORS: '/api/users/doctors',

    // Appointment endpoints
    GET_APPOINTMENTS: '/api/appointments',
    BOOK_APPOINTMENT: '/api/appointments/book',
    CANCEL_APPOINTMENT: '/api/appointments/cancel' 
};