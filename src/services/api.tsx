import axios from 'axios';

const api = axios.create({
  baseURL: 'https://rodrigobrocchi.com.br/api',
});

export default api;
