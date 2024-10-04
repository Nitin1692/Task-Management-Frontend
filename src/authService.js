import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; 

// Login User
const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
};

// Refresh Access Token
const refreshAccessToken = async () => {
    const response = await axios.get(`${API_URL}/refresh`, { withCredentials: true });
    return response.data;
};

// Logout User
const logout = async () => {
    const response = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    return response.data;
};

const signup = async (name, email, password) => {
    const response = await axios.post(`${API_URL}/register`, { name, email, password });
    return response.data;
};

export { signup, login, refreshAccessToken, logout };
