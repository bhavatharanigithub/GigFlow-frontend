import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Your backend base URL
  withCredentials: true, // Important for HttpOnly cookies
});

export default API;
