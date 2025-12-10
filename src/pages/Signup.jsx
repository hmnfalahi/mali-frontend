import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
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
    User,
    UserCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// OTP Configuration
const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export default function Signup() {
    const { signup, sendOTP, verifyOTP, login, user } = useAuth();
    const navigate = useNavigate();

    // Step: 'info' | 'otp'
    const [step, setStep] = useState("info");
    
    // Form data
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        phone_number: "",
        password: "",
        confirm_password: ""
    });
    
    // OTP state
    const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
    const [countdown, setCountdown] = useState(0);
    const countdownRef = useRef(null);
    const otpInputRefs = useRef([]);
    
    // UI state
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate("/dashboard", { replace: true });
        }
    }, [user, navigate]);

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

    // Focus first OTP input
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

    // Handle input change
    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    // Validate step 1
    const validateInfo = () => {
        if (!formData.first_name.trim()) {
            setError("نام را وارد کنید");
            return false;
        }
        if (!formData.last_name.trim()) {
            setError("نام خانوادگی را وارد کنید");
            return false;
        }
        if (!isValidPhoneNumber(formData.phone_number)) {
            setError("شماره موبایل معتبر نیست");
            return false;
        }
        if (formData.password.length < 6) {
            setError("رمز عبور باید حداقل 6 کاراکتر باشد");
            return false;
        }
        if (formData.password !== formData.confirm_password) {
            setError("رمز عبور و تکرار آن یکسان نیست");
            return false;
        }
        return true;
    };

    // Handle step 1 submit - send OTP
    const handleInfoSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateInfo()) return;

        const normalizedPhone = normalizePhoneNumber(formData.phone_number);
        
        setIsLoading(true);
        try {
            const response = await sendOTP(normalizedPhone, "SIGNUP");
            if (response.success) {
                setFormData({ ...formData, phone_number: normalizedPhone });
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

        if (digit && index === OTP_LENGTH - 1) {
            const fullCode = newOtp.join("");
            if (fullCode.length === OTP_LENGTH) {
                handleVerifyAndSignup(fullCode);
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
            handleVerifyAndSignup(pastedData);
        }
    };

    // Handle OTP key down
    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otpCode[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    };

    // Verify OTP and create account
    const handleVerifyAndSignup = async (code) => {
        setError("");
        setIsLoading(true);

        try {
            // Step 1: Verify OTP
            const verifyResponse = await verifyOTP(formData.phone_number, code, "SIGNUP");
            
            if (!verifyResponse.success) {
                setError(verifyResponse.message || "کد تایید نادرست است");
                setOtpCode(["", "", "", "", "", ""]);
                otpInputRefs.current[0]?.focus();
                setIsLoading(false);
                return;
            }

            // Step 2: Create account
            await signup({
                first_name: formData.first_name,
                last_name: formData.last_name,
                phone_number: formData.phone_number,
                password: formData.password
            });

            // Step 3: Login automatically
            await login(formData.phone_number, formData.password);
            
            // Redirect to company profile for new users
            navigate("/company-profile", { replace: true });

        } catch (err) {
            const errorData = err.response?.data;
            let errorMsg = "خطا در ثبت‌نام";
            
            if (errorData) {
                if (errorData.message) {
                    errorMsg = errorData.message;
                } else if (typeof errorData === 'object') {
                    const messages = Object.values(errorData).flat();
                    errorMsg = messages[0] || errorMsg;
                }
            }
            
            setError(errorMsg);
            
            // If OTP verification failed, clear OTP inputs
            if (errorMsg.includes("کد") || errorMsg.includes("تایید")) {
                setOtpCode(["", "", "", "", "", ""]);
                otpInputRefs.current[0]?.focus();
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Handle OTP form submit
    const handleOtpSubmit = (e) => {
        e.preventDefault();
        const code = otpCode.join("");
        if (code.length === OTP_LENGTH) {
            handleVerifyAndSignup(code);
        } else {
            setError("لطفا کد 6 رقمی را کامل وارد کنید");
        }
    };

    // Resend OTP
    const handleResendOTP = async () => {
        if (countdown > 0) return;
        
        setError("");
        setIsLoading(true);
        
        try {
            const response = await sendOTP(formData.phone_number, "SIGNUP");
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

    // Go back to info step
    const handleBackToInfo = () => {
        setStep("info");
        setOtpCode(["", "", "", "", "", ""]);
        setError("");
        setSuccessMessage("");
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

                {/* Progress indicator */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    <div className={`w-3 h-3 rounded-full transition-colors ${step === "info" ? "bg-[#1e3a5f]" : "bg-emerald-500"}`} />
                    <div className={`w-8 h-0.5 ${step === "otp" ? "bg-[#1e3a5f]" : "bg-slate-200"}`} />
                    <div className={`w-3 h-3 rounded-full transition-colors ${step === "otp" ? "bg-[#1e3a5f]" : "bg-slate-200"}`} />
                </div>

                <Card className="border-0 shadow-xl shadow-slate-200/50">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-2xl font-bold text-center text-slate-800">
                            {step === "info" ? "ایجاد حساب کاربری" : "تایید شماره موبایل"}
                        </CardTitle>
                        <CardDescription className="text-center text-slate-500">
                            {step === "info" 
                                ? "اطلاعات خود را وارد کنید" 
                                : `کد تایید ارسال شده به ${formData.phone_number} را وارد کنید`
                            }
                    </CardDescription>
                </CardHeader>

                    <AnimatePresence mode="wait">
                        {/* Step 1: User Info */}
                        {step === "info" && (
                            <motion.div
                                key="info"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <form onSubmit={handleInfoSubmit}>
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

                                        {/* Name fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                                <Label htmlFor="first_name" className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-slate-400" />
                                                    نام
                                                </Label>
                                <Input
                                    id="first_name"
                                    value={formData.first_name}
                                                    onChange={(e) => handleChange("first_name", e.target.value)}
                                                    placeholder="نام"
                                                    className="h-11"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                                <Label htmlFor="last_name" className="flex items-center gap-2">
                                                    <UserCircle className="w-4 h-4 text-slate-400" />
                                                    نام خانوادگی
                                                </Label>
                                <Input
                                    id="last_name"
                                    value={formData.last_name}
                                                    onChange={(e) => handleChange("last_name", e.target.value)}
                                                    placeholder="نام خانوادگی"
                                                    className="h-11"
                                    required
                                />
                            </div>
                        </div>

                                        {/* Phone */}
                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-slate-400" />
                                                شماره موبایل
                                            </Label>
                            <Input
                                id="phone"
                                type="tel"
                                                inputMode="numeric"
                                value={formData.phone_number}
                                                onChange={(e) => handleChange("phone_number", e.target.value.replace(/\D/g, ""))}
                                                placeholder="09123456789"
                                                className="h-11 text-left font-mono"
                                                dir="ltr"
                                                maxLength={11}
                                required
                            />
                        </div>

                                        {/* Password */}
                        <div className="space-y-2">
                                            <Label htmlFor="password" className="flex items-center gap-2">
                                                <Lock className="w-4 h-4 text-slate-400" />
                                                رمز عبور
                                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                                onChange={(e) => handleChange("password", e.target.value)}
                                                placeholder="حداقل 6 کاراکتر"
                                                className="h-11"
                                                required
                                            />
                                        </div>

                                        {/* Confirm Password */}
                                        <div className="space-y-2">
                                            <Label htmlFor="confirm_password" className="flex items-center gap-2">
                                                <Lock className="w-4 h-4 text-slate-400" />
                                                تکرار رمز عبور
                                            </Label>
                                            <Input
                                                id="confirm_password"
                                                type="password"
                                                value={formData.confirm_password}
                                                onChange={(e) => handleChange("confirm_password", e.target.value)}
                                                placeholder="تکرار رمز عبور"
                                                className="h-11"
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
                                                    در حال ارسال...
                                                </>
                                            ) : (
                                                <>
                                                    مرحله بعد
                                                    <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
                                                </>
                                            )}
                        </Button>

                        <div className="text-center text-sm text-slate-600">
                                            قبلا ثبت‌نام کرده‌اید؟{" "}
                                            <Link to="/login" className="text-[#1e3a5f] hover:underline font-medium">
                                وارد شوید
                            </Link>
                        </div>
                    </CardFooter>
                </form>
                            </motion.div>
                        )}

                        {/* Step 2: OTP Verification */}
                        {step === "otp" && (
                            <motion.div
                                key="otp"
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
                                                        className="w-12 h-14 text-center text-xl font-bold"
                                                        disabled={isLoading}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Countdown / Resend */}
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
                                                    در حال ثبت‌نام...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle2 className="w-5 h-5 ml-2" />
                                                    تایید و ثبت‌نام
                                                </>
                                            )}
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={handleBackToInfo}
                                            disabled={isLoading}
                                            className="w-full text-slate-500"
                                        >
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                            بازگشت و ویرایش اطلاعات
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
