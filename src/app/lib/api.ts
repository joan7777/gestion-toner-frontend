// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3005/api', // Port du backend NestJS
});

export default api;
