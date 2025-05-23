import axios from "axios";
import { API_BASE_URL } from "../config/api.config";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.request.use(
    async (config) => {
        try {
            const user = JSON.parse(localStorage.getItem('kalla_dashboard_user'));
            
            if (user?.token) {
                config.headers['Authorization'] = `Bearer ${user.token}`;
            } else if (user?.accessToken) {
                config.headers['Authorization'] = `Bearer ${user.accessToken}`;
            }

            config.metadata = { startTime: new Date().getTime() };
            return config;
        } catch (error) {
            return Promise.reject(error);
        }
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => {
        const endTime = new Date().getTime();
        const startTime = response.config.metadata.startTime;
        response.responseTime = endTime - startTime;
        return response;
    },
    async (error) => {
        // Don't retry if request was cancelled
        if (axios.isCancel(error)) {
            return Promise.reject(error);
        }

        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // try {
            //     const user = JSON.parse(localStorage.getItem('kalla_dashboard_user'));
            //     const refreshToken = user?.refreshToken;

            //     if (refreshToken) {
            //         try {
            //             // Preserve the original signal
            //             const originalSignal = originalRequest.signal;
                        
            //             const response = await axiosInstance.post('/auth/refresh', { refreshToken });
            //             const { accessToken } = response.data;

            //             localStorage.setItem('kalla_dashboard_user', JSON.stringify({ 
            //                 ...user, 
            //                 accessToken,
            //                 token: accessToken 
            //             }));

            //             // Restore original signal and update token
            //             originalRequest.signal = originalSignal;
            //             originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            //             return axiosInstance(originalRequest);
            //         } catch (refreshError) {
            //             localStorage.removeItem('kalla_dashboard_user');
            //             window.location.href = '/login';
            //             return Promise.reject(refreshError);
            //         }
            //     }
            // } catch (error) {
            // }
            localStorage.removeItem('kalla_dashboard_user');
            window.location.href = '/login';
            return Promise.reject(error);
        }

        if (error.response?.status === 429) {
            const retryAfter = error.response.headers['retry-after'] || 5;
            await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
            return axiosInstance(originalRequest);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;