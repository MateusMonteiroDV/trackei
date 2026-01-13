import axios from 'axios'

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const api = axios.create({
  baseURL: 'http://localhost:8000/',
  withCredentials: true,
  headers: {
    Accept: "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = getCookie('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;

