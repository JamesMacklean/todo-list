import axios from 'axios';

// Create an axios instance for easy configuration
const api = axios.create({
    baseURL: 'http://localhost:8000/api', // Update this to your Django backend's URL
});

export default api;
