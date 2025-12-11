import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Request Interceptor: Attach Access Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Public endpoints that should not trigger 401 redirect
const publicEndpoints = ['/users/login/', '/users/signup/', '/users/otp/', '/users/token/refresh/'];

// Response Interceptor: Handle 401 & Refresh Token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const requestUrl = originalRequest?.url || '';
        
        // Check if this is a public endpoint (login, signup, OTP, etc.)
        const isPublicEndpoint = publicEndpoints.some(endpoint => requestUrl.includes(endpoint));

        // Prevent infinite loop if refresh token is invalid
        // Skip 401 handling for public endpoints - let the error propagate to the component
        if (error.response?.status === 401 && !originalRequest._retry && !isPublicEndpoint) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                try {
                    const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/token/refresh/`, {
                        refresh: refreshToken,
                    });

                    // Store new tokens
                    if (response.data.access) {
                        localStorage.setItem('access_token', response.data.access);

                        // Generally refresh endpoints might return a new refresh token too
                        if (response.data.refresh) {
                            localStorage.setItem('refresh_token', response.data.refresh);
                        }

                        // Retry original request with new token
                        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    // If refresh fails, logout user
                    console.error("Token refresh failed:", refreshError);
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            } else {
                // No refresh token available, redirect to login
                localStorage.removeItem('access_token'); // Ensure clean state
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
