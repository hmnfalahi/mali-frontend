import api from "@/lib/axios";

// Refactored to use real API
export const base44 = {
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
