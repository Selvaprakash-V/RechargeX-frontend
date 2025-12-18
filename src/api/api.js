import axios from "axios";

const API = axios.create({
  baseURL: "https://rechargex-backend2.onrender.com",
});

// Attach JWT token automatically to all requests (except public routes)
API.interceptors.request.use((req) => {
  // Public routes that don't need authentication
  const publicRoutes = ['/plans', '/feedbacks/approved'];
  const isPublicRoute = publicRoutes.some(route => req.url === route || req.url.startsWith(route));
  
  if (!isPublicRoute) {
    const authData = localStorage.getItem("rechargex_auth");
    if (authData) {
      try {
        const { token } = JSON.parse(authData);
        if (token) {
          req.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error("Error parsing auth data:", e);
      }
    }
  }
  return req;
});

// Handle response errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth data
      localStorage.removeItem("rechargex_auth");
      // Only redirect if not on login/signup page
      if (!window.location.pathname.includes('login') && !window.location.pathname.includes('signup')) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;
