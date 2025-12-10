import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

/**
 * Signup page - redirects to Login
 * Since OTP login auto-creates new users, we redirect to the login page
 * which handles both login and registration through phone verification
 */
export default function Signup() {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            navigate("/dashboard", { replace: true });
        } else {
            // Redirect to login page - OTP login handles new user registration
            navigate("/login", { replace: true });
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50" dir="rtl">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1e3a5f] border-t-transparent" />
        </div>
    );
}
