import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const createFolder = async (name) => {
    return await axios.post(`${API_URL}/createNotes`, { name }, { withCredentials: true });
};