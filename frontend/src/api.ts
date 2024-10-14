// src/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Замените на ваш URL (убрали лишний http://)

export const registerUser = async (data: { username: string; password: string }) => {
    return await axios.post(`${API_URL}/register/`, data); // Добавлен слеш в конце
};

export const loginUser = async (data: { username: string; password: string }) => {
    return await axios.post(`${API_URL}/login/`, data); // Добавлен слеш в конце
};

export const getUserData = async () => {
    return await axios.get(`${API_URL}/patient-dashboard/`, { withCredentials: true }); // Исправленный эндпоинт
};
