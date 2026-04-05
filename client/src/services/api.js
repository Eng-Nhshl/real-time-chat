import axios from "axios";
import config from "./config";

const api = axios.create({
  baseURL: config.baseURL,
});

export const setToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export const clearToken = () => {
  delete api.defaults.headers.common["Authorization"];
};

export default api;
