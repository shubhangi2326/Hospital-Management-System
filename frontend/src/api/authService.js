import axios from 'axios';
import { BASE_URL, ENDPOINTS } from './authApi';


const getAuthHeader = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
        return {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
    }
    return {};
};

// --- User Services ---


export const loginUser = async (credentials) => {
    const response = await axios.post(`${BASE_URL}${ENDPOINTS.LOGIN}`, credentials);
    return response.data;
};


// ==============================================================
export const registerUser = async (userData) => {
    const response = await axios.post(`${BASE_URL}${ENDPOINTS.REGISTER}`, userData);
    return response.data;
};

// ==============================================================
export const getDoctors = async () => {
    const response = await axios.get(`${BASE_URL}${ENDPOINTS.GET_DOCTORS}`);
    return response.data;
};

// --- Appointment Services ---

// ==============================================================
export const getBookedAppointments = async () => {
    const config = getAuthHeader();
    const response = await axios.get(`${BASE_URL}${ENDPOINTS.GET_APPOINTMENTS}`, config);
    return response.data;
};

// ==============================================================
export const bookAppointment = async (appointmentData) => {
    const config = getAuthHeader();
    const response = await axios.post(`${BASE_URL}${ENDPOINTS.BOOK_APPOINTMENT}`, appointmentData, config);
    return response.data;
};

// ==============================================================
export const cancelAppointment = async (appointmentId) => {
    const config = getAuthHeader();
    const response = await axios.put(`${BASE_URL}${ENDPOINTS.CANCEL_APPOINTMENT}/${appointmentId}`, {}, config);
    return response.data;
};