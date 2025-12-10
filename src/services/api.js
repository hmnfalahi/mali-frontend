import api from "@/lib/axios";
import axios from "axios";

// Base axios instance for unauthenticated requests
const publicApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Refactored to use real API
export const apiService = {
    auth: {
        me: async () => {
            // This is now redundant if we use AuthContext, but kept for compatibility or direct usage
            const response = await api.get("/users/me/");
            return response.data;
        },
        logout: async () => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/login";
        },
        redirectToLogin: (returnUrl) => {
            window.location.href = `/login?returnUrl=${encodeURIComponent(returnUrl || window.location.pathname)}`;
        },
        // OTP endpoints
        otp: {
            /**
             * Send OTP code to phone number
             * @param {string} phone_number - Iranian phone number
             * @param {string} purpose - 'LOGIN' | 'SIGNUP' | 'PASSWORD_RESET'
             */
            send: async (phone_number, purpose = 'LOGIN') => {
                const response = await publicApi.post("/users/otp/send/", { 
                    phone_number, 
                    purpose 
                });
                return response.data;
            },
            /**
             * Verify OTP code (without login)
             * @param {string} phone_number - Iranian phone number
             * @param {string} code - 6-digit OTP code
             * @param {string} purpose - 'LOGIN' | 'SIGNUP' | 'PASSWORD_RESET'
             */
            verify: async (phone_number, code, purpose = 'LOGIN') => {
                const response = await publicApi.post("/users/otp/verify/", { 
                    phone_number, 
                    code, 
                    purpose 
                });
                return response.data;
            },
            /**
             * Login using OTP code
             * @param {string} phone_number - Iranian phone number
             * @param {string} code - 6-digit OTP code
             * @returns {{ access: string, refresh: string, is_new_user: boolean }}
             */
            login: async (phone_number, code) => {
                const response = await publicApi.post("/users/otp/login/", { 
                    phone_number, 
                    code 
                });
                return response.data;
            }
        }
    },
    entities: {
        Company: {
            list: async (params = {}) => {
                const queryString = new URLSearchParams(params).toString();
                const response = await api.get(`/companies/?${queryString}`);
                return response.data;
            },
            create: async (data) => {
                const response = await api.post("/companies/", data);
                return response.data;
            },
            get: async (id) => {
                const response = await api.get(`/companies/${id}/`);
                return response.data;
            },
            update: async (id, data) => {
                // Defaulting to PATCH for flexibility as per common frontend patterns, 
                // but we can expose PUT if needed. 
                // The doc says PUT for Full Update, PATCH for Partial.
                // Usually frontend forms send what they have. 
                // If the caller wants PUT, they can use updateFull.
                const response = await api.patch(`/companies/${id}/`, data);
                return response.data;
            },
            updateFull: async (id, data) => {
                const response = await api.put(`/companies/${id}/`, data);
                return response.data;
            },
            delete: async (id) => {
                await api.delete(`/companies/${id}/`);
            },
            filter: async (query) => {
                // Mapping filter query to query params
                const params = new URLSearchParams(query).toString();
                // Assumes endpoint /companies/?created_by=... exists
                const response = await api.get(`/companies/?${params}`);
                return response.data;
            }
        },
        FinancingRequest: {
            // Legacy filter method for backward compatibility
            filter: async (query, orderBy) => {
                const params = new URLSearchParams(query);
                if (orderBy) params.append("ordering", orderBy);
                const response = await api.get(`/financing-requests/?${params.toString()}`);
                return response.data;
            },
            // Main endpoints (per API docs: Base URL /api/financing-requests/)
            list: async () => {
                const response = await api.get("/financing-requests/");
                return response.data;
            },
            create: async (data) => {
                const response = await api.post("/financing-requests/", data);
                return response.data;
            },
            get: async (id) => {
                const response = await api.get(`/financing-requests/${id}/`);
                return response.data;
            },
            update: async (id, data) => {
                const response = await api.patch(`/financing-requests/${id}/`, data);
                return response.data;
            },
            delete: async (id) => {
                await api.delete(`/financing-requests/${id}/`);
            },
            submit: async (id) => {
                const response = await api.post(`/financing-requests/${id}/submit/`);
                return response.data;
            }
        }
    }
};
