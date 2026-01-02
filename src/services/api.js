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
            const response = await api.get("/users/me/");
            return response.data;
        },
        /**
         * Update user profile (first_name, last_name)
         * @param {Object} data - { first_name, last_name }
         */
        updateProfile: async (data) => {
            const response = await api.patch("/users/me/update/", data);
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
        },
        /**
         * Reset password with OTP code
         * @param {string} phone_number - Iranian phone number
         * @param {string} code - 6-digit OTP code
         * @param {string} new_password - New password
         */
        resetPassword: async (phone_number, code, new_password) => {
            const response = await publicApi.post("/users/password/reset/", {
                phone_number,
                code,
                new_password
            });
            return response.data;
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
                const params = new URLSearchParams(query).toString();
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
            // Main endpoints
            list: async () => {
                const response = await api.get("/financing-requests/");
                return response.data;
            },
            create: async (data) => {
                const response = await api.post("/financing-requests/create/", data);
                return response.data;
            },
            get: async (id) => {
                const response = await api.get(`/financing-requests/${id}/`);
                return response.data;
            },
            cancel: async (id) => {
                const response = await api.post(`/financing-requests/${id}/cancel/`);
                return response.data;
            },
            // Activity actions
            submitActivity: async (requestId, activityId, metaData = null) => {
                const response = await api.post(
                    `/financing-requests/${requestId}/activities/${activityId}/submit/`,
                    metaData ? { meta_data: metaData } : {}
                );
                return response.data;
            },
            completeActivity: async (requestId, activityId, metaData = null) => {
                const response = await api.post(
                    `/financing-requests/${requestId}/activities/${activityId}/complete/`,
                    metaData ? { meta_data: metaData } : {}
                );
                return response.data;
            },
            rejectActivity: async (requestId, activityId, reason, adminNotes = null) => {
                const response = await api.post(
                    `/financing-requests/${requestId}/activities/${activityId}/reject/`,
                    { reason, admin_notes: adminNotes }
                );
                return response.data;
            },
            revisionActivity: async (requestId, activityId, adminNotes) => {
                const response = await api.post(
                    `/financing-requests/${requestId}/activities/${activityId}/revision/`,
                    { admin_notes: adminNotes }
                );
                return response.data;
            },
            // Document operations
            uploadDocument: async (requestId, activityId, file, description = null, documentConfigId = null) => {
                const formData = new FormData();
                formData.append('file', file);
                if (description) {
                    formData.append('description', description);
                }
                if (documentConfigId) {
                    formData.append('document_config_id', documentConfigId);
                }
                const response = await api.post(
                    `/financing-requests/${requestId}/activities/${activityId}/documents/`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                return response.data;
            },
            deleteDocument: async (requestId, documentId) => {
                await api.delete(`/financing-requests/${requestId}/documents/${documentId}/`);
            },
            // Form data operations
            saveFormData: async (requestId, activityId, formData) => {
                const response = await api.post(
                    `/financing-requests/${requestId}/activities/${activityId}/form-data/`,
                    { form_data: formData }
                );
                return response.data;
            },
            // Admin endpoints
            assignConsultant: async (requestId, consultantId) => {
                const response = await api.post(
                    `/financing-requests/${requestId}/assign-consultant/`,
                    { consultant_id: consultantId }
                );
                return response.data;
            },
            getPendingForRole: async (role) => {
                const response = await api.get(`/financing-requests/pending/${role}/`);
                return response.data;
            }
        },
        FinancingType: {
            list: async () => {
                const response = await publicApi.get("/financing-requests/types/");
                return response.data;
            },
            get: async (slug) => {
                const response = await publicApi.get(`/financing-requests/types/${slug}/`);
                return response.data;
            }
        }
    },
    // Admin APIs
    admin: {
        // Dashboard stats
        getStats: async () => {
            const response = await api.get("/financing-requests/admin/stats/");
            return response.data;
        },
        // Companies
        getCompanies: async () => {
            const response = await api.get("/financing-requests/admin/companies/");
            return response.data;
        },
        // All requests
        getRequests: async (status = null) => {
            const params = status ? `?status=${status}` : '';
            const response = await api.get(`/financing-requests/admin/requests/${params}`);
            return response.data;
        },
        // Consultants
        getConsultants: async () => {
            const response = await api.get("/financing-requests/admin/consultants/");
            return response.data;
        },
        // Financing Types
        financingTypes: {
            list: async () => {
                const response = await api.get("/financing-requests/admin/financing-types/");
                return response.data;
            },
            create: async (data) => {
                const response = await api.post("/financing-requests/admin/financing-types/create/", data);
                return response.data;
            },
            get: async (id) => {
                const response = await api.get(`/financing-requests/admin/financing-types/${id}/`);
                return response.data;
            },
            update: async (id, data) => {
                const response = await api.patch(`/financing-requests/admin/financing-types/${id}/`, data);
                return response.data;
            },
            delete: async (id) => {
                await api.delete(`/financing-requests/admin/financing-types/${id}/`);
            },
        },
        // Workflow Templates
        workflowTemplates: {
            create: async (data) => {
                const response = await api.post("/financing-requests/admin/workflow-templates/create/", data);
                return response.data;
            },
            get: async (id) => {
                const response = await api.get(`/financing-requests/admin/workflow-templates/${id}/`);
                return response.data;
            },
            update: async (id, data) => {
                const response = await api.patch(`/financing-requests/admin/workflow-templates/${id}/`, data);
                return response.data;
            },
            delete: async (id) => {
                await api.delete(`/financing-requests/admin/workflow-templates/${id}/`);
            },
        },
        // Document Configs
        documentConfigs: {
            create: async (data) => {
                const response = await api.post("/financing-requests/admin/document-configs/create/", data);
                return response.data;
            },
            get: async (id) => {
                const response = await api.get(`/financing-requests/admin/document-configs/${id}/`);
                return response.data;
            },
            update: async (id, data) => {
                const response = await api.patch(`/financing-requests/admin/document-configs/${id}/`, data);
                return response.data;
            },
            delete: async (id) => {
                await api.delete(`/financing-requests/admin/document-configs/${id}/`);
            },
        },
        // Form Field Configs
        formFieldConfigs: {
            create: async (data) => {
                const response = await api.post("/financing-requests/admin/form-field-configs/create/", data);
                return response.data;
            },
            get: async (id) => {
                const response = await api.get(`/financing-requests/admin/form-field-configs/${id}/`);
                return response.data;
            },
            update: async (id, data) => {
                const response = await api.patch(`/financing-requests/admin/form-field-configs/${id}/`, data);
                return response.data;
            },
            delete: async (id) => {
                await api.delete(`/financing-requests/admin/form-field-configs/${id}/`);
            },
        },
    }
};
