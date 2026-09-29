import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

// Attach JWT to every request if present in localStorage.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
