import axios from 'axios';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true // For cookie support if needed
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('ayurveda_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export default axiosClient;
