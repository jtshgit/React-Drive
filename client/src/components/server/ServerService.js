import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const createFolder = async (name) => {
    return await axios.post(`${API_URL}/createNotes`, { name }, { withCredentials: true });
};
export const createFolderinNote = async (name,folderId) => {
    return await axios.post(`${API_URL}/createfolderinnote`, { name,folderId }, { withCredentials: true });
};