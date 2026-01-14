// import axios from "axios";

// const API = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   withCredentials: true
// });

// export default API;
import axios from "axios";

const API = axios.create({
  baseURL: "https://gigflow-server-g2ws.onrender.com/api",
  withCredentials: false, // IMPORTANT: we are NOT using cookies
});

// Attach token automatically
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

export default API;

