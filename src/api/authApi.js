import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Attach JWT token to every request automatically
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('cinevo_token');
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

export const signupUser = (formData) => API.post('/auth/signup', formData);
export const loginUser = (formData) => API.post('/auth/login', formData);
export const getMe = () => API.get('/auth/me');
export const logoutUser = () => API.post('/auth/logout');
