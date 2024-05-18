import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://api.menu.avillettapizzeria.it/api/',
});

export default axiosInstance;