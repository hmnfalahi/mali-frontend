import api from "@/lib/axios";

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
            filter: async (query, orderBy) => {
                const params = new URLSearchParams(query);
                if (orderBy) params.append("ordering", orderBy);
                const response = await api.get(`/financing-requests/?${params.toString()}`);
                return response.data;
            }
        },
        FinancingMethod: {
            filter: async (query) => {
                const params = new URLSearchParams(query).toString();
                const response = await api.get(`/financing-methods/?${params}`);
                return response.data;
            }
        }
    }
};
