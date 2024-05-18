import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.menu.avillettapizzeria.it/api/',
});

export default axiosInstance;