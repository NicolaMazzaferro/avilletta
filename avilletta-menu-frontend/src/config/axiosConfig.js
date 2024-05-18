import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://menu.avillettapizzeria.it/api/',
});

export default axiosInstance;