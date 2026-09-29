import api from "./api";

const TOKEN_KEY = "jwt";

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const login = (email, password) =>
    api.post("/auth/login", { email, password });

export const register = (email, password) =>
    api.post("/auth/register", { email, password });
