import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/axios";
import { apiService } from "@/services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasCompany, setHasCompany] = useState(null); // null: unknown, true/false

    // Load user on mount
    useEffect(() => {
        const loadUser = async () => {
            const accessToken = localStorage.getItem("access_token");
            const refreshToken = localStorage.getItem("refresh_token");

            if (!accessToken && !refreshToken) {
                setLoading(false);
                return;
            }

            try {
                // Fetch user
                const response = await api.get("/users/me/");
                const userData = response.data;
                setUser(userData);

                // Check if user has a company
                try {
                    const companies = await apiService.entities.Company.list({ created_by: userData.phone_number });
                    setHasCompany(companies.length > 0);
                } catch (err) {
                    console.error("Failed to check company status", err);
                    setHasCompany(false); // Default to false if check fails, maybe not ideal but safe?
                }

            } catch (error) {
                console.log("Failed to fetch user", error);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (phone_number, password) => {
        const response = await api.post("/users/login/", { phone_number, password });
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);

        // After login, fetch user details & company status
        try {
            const userResp = await api.get("/users/me/");
            const userData = userResp.data;
            setUser(userData);
            
            const companies = await apiService.entities.Company.list({ created_by: userData.phone_number });
            setHasCompany(companies.length > 0);
        } catch (e) {
            setUser({ phone_number });
            setHasCompany(false);
        }
        return response.data;
    };

    const signup = async (data) => {
        const response = await api.post("/users/signup/", data);
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        setHasCompany(null);
        window.location.href = "/login";
    };
    
    // Method to update company status (called after creating company)
    const checkCompanyStatus = async () => {
        if (!user) return;
        try {
            const companies = await apiService.entities.Company.list({ created_by: user.phone_number });
            setHasCompany(companies.length > 0);
        } catch (e) {
             console.error("Failed to re-check company status", e);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading, hasCompany, checkCompanyStatus }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
