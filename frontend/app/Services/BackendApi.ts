import axios from "axios";

import { ACCESS_TOKEN } from "~/Constants";

const host = import.meta.env.VITE_HOST
const backendPort = import.meta.env.VITE_BACKEND_PORT
const backendApi = axios.create({
  baseURL: `http://${host}:${backendPort}/api`
});

backendApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  }, (error) => {
    return Promise.reject(error);
  }
);

export default backendApi;
