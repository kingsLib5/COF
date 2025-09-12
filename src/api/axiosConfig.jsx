import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/', // adjust if needed
});

// attach token automatically
api.interceptors.request.use(
  (config) => {
    const authData = JSON.parse(localStorage.getItem('cof_auth'));
    if (authData?.token) {
      config.headers.Authorization = `Bearer ${authData.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
