import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'https://vedayura.celiyo.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true // For cookie support if needed
});

axiosClient.interceptors.request.use((config) => {
   const token = localStorage.getItem('ayurveda_token');
   console.log('🔑 Interceptor:', config.url, token ? '✅ Token attached' : '❌ No token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export default axiosClient;
