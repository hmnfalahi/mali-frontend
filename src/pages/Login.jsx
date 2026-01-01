import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { 
    AlertCircle, 
    Phone, 
    KeyRound, 
    ArrowRight, 
    Loader2, 
    CheckCircle2,
    RefreshCw,
    CreditCard,
    Lock,
    Smartphone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// OTP Configuration
const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

export default function Login() {
    const { login, sendOTP, otpLogin, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Login method: 'password' or 'otp'
    const [loginMethod, setLoginMethod] = useState("otp");
    
    // Form state
    const [step, setStep] = useState("phone"); // 'phone' | 'otp' (for OTP method)
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Countdown timer
    const [countdown, setCountdown] = useState(0);
    const countdownRef = useRef(null);

    // OTP input refs
    const otpInputRefs = useRef([]);

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            const returnUrl = new URLSearchParams(location.search).get("returnUrl");
            if (returnUrl) {
                navigate(returnUrl, { replace: true });
            } else {
                // Redirect to appropriate dashboard based on role
                navigate("/auto-dashboard", { replace: true });
            }
        }
    }, [user, navigate, location]);

    // Countdown timer effect
    useEffect(() => {
        if (countdown > 0) {
            countdownRef.current = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
        }
        return () => {
            if (countdownRef.current) {
                clearTimeout(countdownRef.current);
            }
        };
    }, [countdown]);

    // Focus first OTP input when step changes to OTP
    useEffect(() => {
        if (step === "otp" && otpInputRefs.current[0]) {
            otpInputRefs.current[0].focus();
        }
    }, [step]);

    // Normalize phone number
    const normalizePhoneNumber = (phone) => {
        let normalized = phone.replace(/\D/g, "");
        if (normalized.startsWith("98")) {
            normalized = "0" + normalized.slice(2);
        } else if (normalized.startsWith("9") && normalized.length === 10) {
            normalized = "0" + normalized;
        }
        return normalized;
    };

    // Validate phone number
    const isValidPhoneNumber = (phone) => {
        const normalized = normalizePhoneNumber(phone);
        return /^09[0-9]{9}$/.test(normalized);
    };

    // Handle password login
    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        setError("");

        const normalized = normalizePhoneNumber(phoneNumber);
        
        if (!isValidPhoneNumber(normalized)) {
            setError("شماره موبایل معتبر نیست");
            return;
        }

        if (!password) {
            setError("رمز عبور را وارد کنید");
            return;
        }

        setIsLoading(true);
        try {
            await login(normalized, password);
            const returnUrl = new URLSearchParams(location.search).get("returnUrl");
            // Redirect to appropriate dashboard based on role
            navigate(returnUrl || "/auto-dashboard", { replace: true });
        } catch (err) {
            const errorMsg = err.response?.data?.detail || 
                            err.response?.data?.message ||
                            "شماره موبایل یا رمز عبور اشتباه است";
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle phone submission (send OTP)
    const handleSendOTP = async (e) => {
        e?.preventDefault();
        setError("");
        setSuccessMessage("");

        const normalized = normalizePhoneNumber(phoneNumber);
        
        if (!isValidPhoneNumber(normalized)) {
            setError("شماره موبایل معتبر نیست");
            return;
        }

        setIsLoading(true);
        try {
            const response = await sendOTP(normalized, "LOGIN");
            if (response.success) {
                setPhoneNumber(normalized);
                setStep("otp");
                setCountdown(RESEND_COOLDOWN);
                setSuccessMessage("کد تایید ارسال شد");
                setTimeout(() => setSuccessMessage(""), 3000);
            } else {
                setError(response.message || "خطا در ارسال کد تایید");
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 
                            err.response?.data?.phone_number?.[0] ||
                            "خطا در ارسال کد تایید. لطفا مجددا تلاش کنید.";
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle OTP input change
    const handleOtpChange = (index, value) => {
        const digit = value.replace(/\D/g, "").slice(-1);
        
        const newOtp = [...otpCode];
        newOtp[index] = digit;
        setOtpCode(newOtp);

        if (digit && index < OTP_LENGTH - 1) {
            otpInputRefs.current[index + 1]?.focus();
        }

        if (digit && index === OTP_LENGTH - 1) {
            const fullCode = newOtp.join("");
            if (fullCode.length === OTP_LENGTH) {
                handleVerifyOTP(fullCode);
            }
        }
    };

    // Handle OTP paste
    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (pastedData.length === OTP_LENGTH) {
            const newOtp = pastedData.split("");
            setOtpCode(newOtp);
            otpInputRefs.current[OTP_LENGTH - 1]?.focus();
            handleVerifyOTP(pastedData);
        }
    };

    // Handle OTP key down
    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otpCode[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    };

    // Handle OTP verification
    const handleVerifyOTP = async (code) => {
        setError("");
        setIsLoading(true);

        try {
            const response = await otpLogin(phoneNumber, code);
            const returnUrl = new URLSearchParams(location.search).get("returnUrl");
            
            if (response.is_new_user) {
                // New users (companies) go to company profile
                navigate("/company-profile", { replace: true });
            } else {
                // Redirect to appropriate dashboard based on role
                navigate(returnUrl || "/auto-dashboard", { replace: true });
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 
                            err.response?.data?.detail ||
                            "کد تایید نادرست است";
            setError(errorMsg);
            setOtpCode(["", "", "", "", "", ""]);
            otpInputRefs.current[0]?.focus();
        } finally {
            setIsLoading(false);
        }
    };

    // Handle OTP form submit
    const handleOtpSubmit = (e) => {
        e.preventDefault();
        const code = otpCode.join("");
        if (code.length === OTP_LENGTH) {
            handleVerifyOTP(code);
        } else {
            setError("لطفا کد 6 رقمی را کامل وارد کنید");
        }
    };

    // Resend OTP
    const handleResendOTP = () => {
        if (countdown > 0) return;
        handleSendOTP();
    };

    // Go back to phone step
    const handleBackToPhone = () => {
        setStep("phone");
        setOtpCode(["", "", "", "", "", ""]);
        setError("");
        setSuccessMessage("");
    };

    // Switch login method
    const switchLoginMethod = (method) => {
        setLoginMethod(method);
        setStep("phone");
        setError("");
        setSuccessMessage("");
        setOtpCode(["", "", "", "", "", ""]);
        setPassword("");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4" dir="rtl">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a] flex items-center justify-center shadow-lg">
                            <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-[#1e3a5f]">مالی</h1>
                            <p className="text-xs text-slate-500">پلتفرم تامین مالی</p>
                        </div>
                    </Link>
                </div>

                <Card className="border-0 shadow-xl shadow-slate-200/50">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-2xl font-bold text-center text-slate-800">
                            ورود به حساب
                        </CardTitle>
                        <CardDescription className="text-center text-slate-500">
                            {loginMethod === "password" 
                                ? "با شماره موبایل و رمز عبور وارد شوید"
                                : step === "phone" 
                                    ? "شماره موبایل خود را وارد کنید" 
                                    : `کد تایید ارسال شده به ${phoneNumber} را وارد کنید`
                            }
                    </CardDescription>
                </CardHeader>

                    {/* Login Method Tabs */}
                    {step === "phone" && (
                        <div className="px-6 pb-2">
                            <div className="flex bg-slate-100 rounded-xl p-1">
                                <button
                                    type="button"
                                    onClick={() => switchLoginMethod("otp")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                        loginMethod === "otp"
                                            ? "bg-white text-[#1e3a5f] shadow-sm"
                                            : "text-slate-500 hover:text-slate-700"
                                    }`}
                                >
                                    <Smartphone className="w-4 h-4" />
                                    کد تایید
                                </button>
                                <button
                                    type="button"
                                    onClick={() => switchLoginMethod("password")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                        loginMethod === "password"
                                            ? "bg-white text-[#1e3a5f] shadow-sm"
                                            : "text-slate-500 hover:text-slate-700"
                                    }`}
                                >
                                    <Lock className="w-4 h-4" />
                                    رمز عبور
                                </button>
                            </div>
                        </div>
                        )}

                    <AnimatePresence mode="wait">
                        {/* Password Login */}
                        {loginMethod === "password" && (
                            <motion.div
                                key="password"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <form onSubmit={handlePasswordLogin}>
                                    <CardContent className="space-y-4">
                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2 border border-red-100"
                                            >
                                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                {error}
                                            </motion.div>
                                        )}

                        <div className="space-y-2">
                                            <Label htmlFor="phone-pass" className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-slate-400" />
                                                شماره موبایل
                                            </Label>
                            <Input
                                                id="phone-pass"
                                type="tel"
                                                inputMode="numeric"
                                                placeholder="09123456789"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                                                className="h-12 text-left font-mono"
                                                dir="ltr"
                                                maxLength={11}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-slate-400" />
                                    رمز عبور
                                </Label>
                                <Link 
                                    to="/forgot-password" 
                                    className="text-xs text-[#1e3a5f] hover:underline"
                                >
                                    فراموشی رمز عبور؟
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="رمز عبور"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-12"
                                required
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4">
                        <Button 
                            type="submit"
                            className="w-full h-12 bg-gradient-to-l from-[#1e3a5f] to-[#2d5a8a] text-base"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin ml-2" />
                                    در حال ورود...
                                </>
                            ) : (
                                "ورود"
                            )}
                        </Button>

                        <div className="text-center text-sm text-slate-600">
                            حساب کاربری ندارید؟{" "}
                            <Link to="/signup" className="text-[#1e3a5f] hover:underline font-medium">
                                ثبت‌نام کنید
                            </Link>
                        </div>
                    </CardFooter>
                </form>
                            </motion.div>
                        )}

                        {/* OTP Login - Phone Step */}
                        {loginMethod === "otp" && step === "phone" && (
                            <motion.div
                                key="otp-phone"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <form onSubmit={handleSendOTP}>
                                    <CardContent className="space-y-4">
                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2 border border-red-100"
                                            >
                                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                {error}
                                            </motion.div>
                                        )}

                                        <div className="space-y-2">
                                            <Label htmlFor="phone-otp" className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-slate-400" />
                                                شماره موبایل
                                            </Label>
                                            <Input
                                                id="phone-otp"
                                                type="tel"
                                                inputMode="numeric"
                                                placeholder="09123456789"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                                                className="h-12 text-lg text-left font-mono tracking-wider"
                                                dir="ltr"
                                                maxLength={11}
                                                autoFocus
                                                required
                                            />
                                            <p className="text-xs text-slate-400">
                                                کد تایید به این شماره پیامک خواهد شد
                                            </p>
                                        </div>
                                    </CardContent>

                    <CardFooter className="flex flex-col gap-4">
                                        <Button 
                                            type="submit"
                                            className="w-full h-12 bg-gradient-to-l from-[#1e3a5f] to-[#2d5a8a] text-base"
                                            disabled={isLoading || !phoneNumber}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin ml-2" />
                                                    در حال ارسال...
                                                </>
                                            ) : (
                                                <>
                                                    دریافت کد تایید
                                                    <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
                                                </>
                                            )}
                        </Button>

                        <div className="text-center text-sm text-slate-600">
                            حساب کاربری ندارید؟{" "}
                                            <Link to="/signup" className="text-[#1e3a5f] hover:underline font-medium">
                                ثبت‌نام کنید
                            </Link>
                        </div>
                    </CardFooter>
                </form>
                            </motion.div>
                        )}

                        {/* OTP Login - Code Step */}
                        {loginMethod === "otp" && step === "otp" && (
                            <motion.div
                                key="otp-code"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <form onSubmit={handleOtpSubmit}>
                                    <CardContent className="space-y-6">
                                        {successMessage && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-emerald-50 text-emerald-600 p-3 rounded-xl text-sm flex items-center gap-2 border border-emerald-100"
                                            >
                                                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                                {successMessage}
                                            </motion.div>
                                        )}

                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2 border border-red-100"
                                            >
                                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                {error}
                                            </motion.div>
                                        )}

                                        <div className="space-y-3">
                                            <Label className="flex items-center gap-2 justify-center">
                                                <KeyRound className="w-4 h-4 text-slate-400" />
                                                کد تایید 6 رقمی
                                            </Label>
                                            <div className="flex gap-2 justify-center" dir="ltr">
                                                {otpCode.map((digit, index) => (
                                                    <Input
                                                        key={index}
                                                        ref={(el) => (otpInputRefs.current[index] = el)}
                                                        type="text"
                                                        inputMode="numeric"
                                                        maxLength={1}
                                                        value={digit}
                                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                        onPaste={index === 0 ? handleOtpPaste : undefined}
                                                        className="w-12 h-14 text-center text-xl font-bold"
                                                        disabled={isLoading}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            {countdown > 0 ? (
                                                <p className="text-sm text-slate-500">
                                                    ارسال مجدد کد تا{" "}
                                                    <span className="font-bold text-[#1e3a5f]">{countdown}</span>
                                                    {" "}ثانیه دیگر
                                                </p>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={handleResendOTP}
                                                    disabled={isLoading}
                                                    className="text-sm text-[#1e3a5f] hover:underline flex items-center gap-1 mx-auto"
                                                >
                                                    <RefreshCw className="w-4 h-4" />
                                                    ارسال مجدد کد
                                                </button>
                                            )}
                                        </div>
                                    </CardContent>

                                    <CardFooter className="flex flex-col gap-3">
                                        <Button 
                                            type="submit"
                                            className="w-full h-12 bg-gradient-to-l from-[#1e3a5f] to-[#2d5a8a] text-base"
                                            disabled={isLoading || otpCode.join("").length !== OTP_LENGTH}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin ml-2" />
                                                    در حال تایید...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle2 className="w-5 h-5 ml-2" />
                                                    تایید و ورود
                                                </>
                                            )}
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={handleBackToPhone}
                                            disabled={isLoading}
                                            className="w-full text-slate-500"
                                        >
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                            تغییر شماره موبایل
                                        </Button>
                                    </CardFooter>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
            </Card>

                {/* Back to Home */}
                <div className="mt-6 text-center">
                    <Link 
                        to="/" 
                        className="text-sm text-slate-500 hover:text-[#1e3a5f] transition-colors"
                    >
                        بازگشت به صفحه اصلی
                    </Link>
                </div>
            </div>
        </div>
    );
}
