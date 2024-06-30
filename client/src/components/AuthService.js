import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const register = async (username, password) => {
    return await axios.post(`${API_URL}/register`, { username, password }, { withCredentials: true });
};

export const login = async (username, password) => {
    return await axios.post(`${API_URL}/login`, { username, password }, { withCredentials: true });
};

export const logout = async () => {
    return await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
};

export const getProtected = async () => {
    return await axios.get(`${API_URL}/protected`, { withCredentials: true });
};
