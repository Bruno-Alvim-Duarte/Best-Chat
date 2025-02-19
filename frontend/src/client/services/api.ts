import axios from 'axios';
import { getBackendUrl } from '../../utils/config';

const api = axios.create({
  baseURL: getBackendUrl(),
  withCredentials: true,
  headers: {
    'ngrok-skip-browser-warning': '69420',
  },
});

export default api;
