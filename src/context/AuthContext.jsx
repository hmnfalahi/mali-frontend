import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/axios";
import { apiService } from "@/services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasCompany, setHasCompany] = useState(null); // null: unknown, true/false
    const [companyId, setCompanyId] = useState(null);

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

                // Only check company status for COMPANY role users
                if (userData.role === 'COMPANY') {
                    try {
                        const companies = await apiService.entities.Company.list();
                        setHasCompany(companies.length > 0);
                        if (companies.length > 0) {
                            setCompanyId(companies[0].id);
                        }
                    } catch (err) {
                        console.error("Failed to check company status", err);
                        setHasCompany(false);
                    }
                } else {
                    // Consultants and Admins don't need company check
                    setHasCompany(true);
                }

            } catch (error) {
                console.log("Failed to fetch user", error);
                // Clear invalid tokens
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    // Helper to fetch user details after login
    const fetchUserAndCompany = async (phone_number) => {
        try {
            const userResp = await api.get("/users/me/");
            const userData = userResp.data;
            setUser(userData);
            
            // Only check company for COMPANY role users
            if (userData.role === 'COMPANY') {
                const companies = await apiService.entities.Company.list();
                setHasCompany(companies.length > 0);
                if (companies.length > 0) {
                    setCompanyId(companies[0].id);
                }
            } else {
                setHasCompany(true);
            }
        } catch (e) {
            setUser({ phone_number });
            setHasCompany(false);
        }
    };

    // Traditional login with password
    const login = async (phone_number, password) => {
        const response = await api.post("/users/login/", { phone_number, password });
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        await fetchUserAndCompany(phone_number);
        return response.data;
    };

    // OTP Login (passwordless)
    const otpLogin = async (phone_number, code) => {
        const response = await apiService.auth.otp.login(phone_number, code);
        localStorage.setItem("access_token", response.access);
        localStorage.setItem("refresh_token", response.refresh);
        await fetchUserAndCompany(phone_number);
        return response;
    };

    // Send OTP code
    const sendOTP = async (phone_number, purpose = 'LOGIN') => {
        return await apiService.auth.otp.send(phone_number, purpose);
    };

    // Verify OTP code (without login)
    const verifyOTP = async (phone_number, code, purpose = 'LOGIN') => {
        return await apiService.auth.otp.verify(phone_number, code, purpose);
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
        setCompanyId(null);
        window.location.href = "/login";
    };
    
    // Method to update company status (called after creating company)
    const checkCompanyStatus = async () => {
        if (!user) return;
        if (user.role !== 'COMPANY') {
            setHasCompany(true);
            return;
        }
        try {
            const companies = await apiService.entities.Company.list();
            setHasCompany(companies.length > 0);
            if (companies.length > 0) {
                setCompanyId(companies[0].id);
            }
        } catch (e) {
             console.error("Failed to re-check company status", e);
        }
    };

    // Method to refresh user data (called after profile update)
    const refreshUser = async () => {
        try {
            const response = await api.get("/users/me/");
            setUser(response.data);
        } catch (e) {
            console.error("Failed to refresh user data", e);
        }
    };

    // Method to update user data locally (for optimistic updates)
    const updateUserData = (data) => {
        setUser(prev => ({ ...prev, ...data }));
    };

    // Helper to check user role
    const isConsultant = user?.role === 'CONSULTANT';
    const isAdmin = user?.role === 'ADMIN';
    const isCompany = user?.role === 'COMPANY';

    // Get the default dashboard path based on role
    const getDefaultDashboard = () => {
        if (isConsultant || isAdmin) {
            return '/consultant-dashboard';
        }
        return '/dashboard';
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            otpLogin,
            sendOTP,
            verifyOTP,
            signup, 
            logout, 
            loading, 
            hasCompany, 
            companyId,
            checkCompanyStatus,
            refreshUser,
            updateUserData,
            // Role helpers
            isConsultant,
            isAdmin,
            isCompany,
            getDefaultDashboard
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
