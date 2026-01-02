import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { apiService } from "@/services/api";
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
    Lock,
    ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// OTP Configuration
const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export default function ChangePassword() {
    const { user, sendOTP, logout, isAdmin, isConsultant } = useAuth();
    const navigate = useNavigate();
    
    // Theme colors based on role
    const themeColors = isAdmin ? {
        primary: "#5b21b6",
        gradient: "from-[#5b21b6] to-[#7c3aed]",
    } : isConsultant ? {
        primary: "#0f766e",
        gradient: "from-[#0f766e] to-[#14b8a6]",
    } : {
        primary: "#1e3a5f",
        gradient: "from-[#1e3a5f] to-[#2d5a8a]",
    };

    // Step: 'confirm' | 'reset'
    const [step, setStep] = useState("confirm");
    
    // Form state
    const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    // UI state
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    // Countdown timer
    const [countdown, setCountdown] = useState(0);
    const countdownRef = useRef(null);
    
    // OTP input refs
    const otpInputRefs = useRef([]);

    // Countdown timer
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

    // Focus first OTP input when entering reset step
    useEffect(() => {
        if (step === "reset" && otpInputRefs.current[0]) {
            otpInputRefs.current[0].focus();
        }
    }, [step]);

    // Handle send OTP
    const handleSendOTP = async () => {
        setError("");
        setSuccessMessage("");

        if (!user?.phone_number) {
            setError("شماره موبایل یافت نشد");
            return;
        }

        setIsLoading(true);
        try {
            const response = await sendOTP(user.phone_number, "PASSWORD_RESET");
            if (response.success) {
                setStep("reset");
                setCountdown(RESEND_COOLDOWN);
                setSuccessMessage("کد تایید ارسال شد");
                setTimeout(() => setSuccessMessage(""), 3000);
            } else {
                setError(response.message || "خطا در ارسال کد تایید");
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 
                            err.response?.data?.phone_number?.[0] ||
                            "خطا در ارسال کد تایید";
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
    };

    // Handle OTP paste
    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (pastedData.length === OTP_LENGTH) {
            const newOtp = pastedData.split("");
            setOtpCode(newOtp);
            otpInputRefs.current[OTP_LENGTH - 1]?.focus();
        }
    };

    // Handle OTP key down
    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otpCode[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    };

    // Validate password
    const validatePassword = () => {
        if (newPassword.length < 6) {
            setError("رمز عبور باید حداقل 6 کاراکتر باشد");
            return false;
        }
        if (newPassword !== confirmPassword) {
            setError("رمز عبور و تکرار آن یکسان نیست");
            return false;
        }
        return true;
    };

    // Handle password reset
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");

        const code = otpCode.join("");
        if (code.length !== OTP_LENGTH) {
            setError("لطفا کد 6 رقمی را کامل وارد کنید");
            return;
        }

        if (!validatePassword()) return;

        setIsLoading(true);
        try {
            const response = await apiService.auth.resetPassword(user.phone_number, code, newPassword);
            
            if (response.success) {
                // Logout user and redirect to login
                logout();
                navigate("/login", { replace: true });
            } else {
                setError(response.message || "خطا در تغییر رمز عبور");
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 
                            err.response?.data?.detail ||
                            "خطا در تغییر رمز عبور";
            setError(errorMsg);
            
            // If OTP is invalid, clear OTP inputs
            if (errorMsg.includes("کد") || errorMsg.includes("تایید")) {
                setOtpCode(["", "", "", "", "", ""]);
                otpInputRefs.current[0]?.focus();
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Resend OTP
    const handleResendOTP = async () => {
        if (countdown > 0) return;
        
        setError("");
        setIsLoading(true);
        
        try {
            const response = await sendOTP(user.phone_number, "PASSWORD_RESET");
            if (response.success) {
                setCountdown(RESEND_COOLDOWN);
                setSuccessMessage("کد تایید مجددا ارسال شد");
                setTimeout(() => setSuccessMessage(""), 3000);
            } else {
                setError(response.message || "خطا در ارسال کد تایید");
            }
        } catch (err) {
            setError("خطا در ارسال مجدد کد");
        } finally {
            setIsLoading(false);
        }
    };

    // Go back to confirm step
    const handleBackToConfirm = () => {
        setStep("confirm");
        setOtpCode(["", "", "", "", "", ""]);
        setNewPassword("");
        setConfirmPassword("");
        setError("");
        setSuccessMessage("");
    };

    return (
        <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">تغییر رمز عبور</h1>
                <p className="text-slate-500 mt-1">رمز عبور خود را با استفاده از کد تایید تغییر دهید</p>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center justify-center gap-2 mb-6">
                <div className={`w-3 h-3 rounded-full transition-colors ${step === "confirm" ? `bg-[${themeColors.primary}]` : "bg-emerald-500"}`} style={step === "confirm" ? {backgroundColor: themeColors.primary} : {}} />
                <div className={`w-8 h-0.5 ${step === "reset" ? `bg-[${themeColors.primary}]` : "bg-slate-200"}`} style={step === "reset" ? {backgroundColor: themeColors.primary} : {}} />
                <div className={`w-3 h-3 rounded-full transition-colors ${step === "reset" ? `bg-[${themeColors.primary}]` : "bg-slate-200"}`} style={step === "reset" ? {backgroundColor: themeColors.primary} : {}} />
            </div>

            <Card className="border-0 shadow-xl shadow-slate-200/50">
                <CardHeader className="space-y-1 pb-4">
                    <CardTitle className="text-xl font-bold text-center text-slate-800">
                        {step === "confirm" ? "تایید شماره موبایل" : "رمز عبور جدید"}
                    </CardTitle>
                    <CardDescription className="text-center text-slate-500">
                        {step === "confirm" 
                            ? "کد تایید به شماره زیر ارسال خواهد شد" 
                            : "کد تایید و رمز عبور جدید را وارد کنید"
                        }
                    </CardDescription>
                </CardHeader>

                <AnimatePresence mode="wait">
                    {/* Step 1: Confirm Phone */}
                    {step === "confirm" && (
                        <motion.div
                            key="confirm"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                        >
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
                                    <Label className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-slate-400" />
                                        شماره موبایل شما
                                    </Label>
                                    <div className="h-12 px-4 rounded-md border border-slate-200 bg-slate-50 flex items-center text-lg font-mono tracking-wider" dir="ltr">
                                        {user?.phone_number}
                                    </div>
                                    <p className="text-xs text-slate-400">
                                        کد تایید به این شماره پیامک خواهد شد
                                    </p>
                                </div>
                            </CardContent>

                            <CardFooter className="flex flex-col gap-4">
                                <Button 
                                    onClick={handleSendOTP}
                                    className={`w-full h-12 bg-gradient-to-l ${themeColors.gradient} text-base`}
                                    disabled={isLoading}
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

                                <Link to="/account" className="w-full">
                                    <Button variant="ghost" className="w-full text-slate-500">
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                        بازگشت
                                    </Button>
                                </Link>
                            </CardFooter>
                        </motion.div>
                    )}

                    {/* Step 2: OTP + New Password */}
                    {step === "reset" && (
                        <motion.div
                            key="reset"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <form onSubmit={handleResetPassword}>
                                <CardContent className="space-y-5">
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

                                    {/* OTP Input */}
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
                                                    className="w-11 h-12 text-center text-lg font-bold"
                                                    disabled={isLoading}
                                                />
                                            ))}
                                        </div>
                                        
                                        {/* Countdown / Resend */}
                                        <div className="text-center">
                                            {countdown > 0 ? (
                                                <p className="text-xs text-slate-500">
                                                    ارسال مجدد کد تا{" "}
                                                    <span className="font-bold" style={{color: themeColors.primary}}>{countdown}</span>
                                                    {" "}ثانیه دیگر
                                                </p>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={handleResendOTP}
                                                    disabled={isLoading}
                                                    className="text-xs hover:underline flex items-center gap-1 mx-auto"
                                                    style={{color: themeColors.primary}}
                                                >
                                                    <RefreshCw className="w-3 h-3" />
                                                    ارسال مجدد کد
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-slate-200" />
                                        </div>
                                        <div className="relative flex justify-center text-xs">
                                            <span className="px-2 bg-white text-slate-400">رمز عبور جدید</span>
                                        </div>
                                    </div>

                                    {/* New Password */}
                                    <div className="space-y-2">
                                        <Label htmlFor="new-password" className="flex items-center gap-2">
                                            <Lock className="w-4 h-4 text-slate-400" />
                                            رمز عبور جدید
                                        </Label>
                                        <Input
                                            id="new-password"
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="حداقل 6 کاراکتر"
                                            className="h-11"
                                            required
                                        />
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="space-y-2">
                                        <Label htmlFor="confirm-password" className="flex items-center gap-2">
                                            <Lock className="w-4 h-4 text-slate-400" />
                                            تکرار رمز عبور جدید
                                        </Label>
                                        <Input
                                            id="confirm-password"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="تکرار رمز عبور"
                                            className="h-11"
                                            required
                                        />
                                    </div>
                                </CardContent>

                                <CardFooter className="flex flex-col gap-3">
                                    <Button 
                                        type="submit"
                                        className={`w-full h-12 bg-gradient-to-l ${themeColors.gradient} text-base`}
                                        disabled={isLoading || otpCode.join("").length !== OTP_LENGTH || !newPassword || !confirmPassword}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin ml-2" />
                                                در حال تغییر...
                                            </>
                                        ) : (
                                            <>
                                                <ShieldCheck className="w-5 h-5 ml-2" />
                                                تغییر رمز عبور
                                            </>
                                        )}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={handleBackToConfirm}
                                        disabled={isLoading}
                                        className="w-full text-slate-500"
                                    >
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                        بازگشت
                                    </Button>
                                </CardFooter>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </div>
    );
}
