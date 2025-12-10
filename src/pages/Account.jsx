import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiService } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
    User, 
    Phone, 
    Save, 
    Loader2, 
    CheckCircle2, 
    AlertCircle,
    Edit3,
    X,
    Shield,
    Key
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export default function Account() {
    const { user, logout, updateUserData } = useAuth();
    
    // Edit mode
    const [isEditing, setIsEditing] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: ""
    });
    
    // UI state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Sync form data with user data
    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || "",
                last_name: user.last_name || ""
            });
        }
    }, [user]);

    // Handle input change
    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    // Cancel editing
    const handleCancel = () => {
        setFormData({
            first_name: user?.first_name || "",
            last_name: user?.last_name || ""
        });
        setIsEditing(false);
        setError("");
    };

    // Save profile
    const handleSave = async () => {
        setError("");
        setSuccessMessage("");

        if (!formData.first_name.trim()) {
            setError("نام نمی‌تواند خالی باشد");
            return;
        }
        if (!formData.last_name.trim()) {
            setError("نام خانوادگی نمی‌تواند خالی باشد");
            return;
        }

        setIsLoading(true);
        try {
            const response = await apiService.auth.updateProfile({
                first_name: formData.first_name.trim(),
                last_name: formData.last_name.trim()
            });

            // Update user data in context (updates sidebar immediately)
            updateUserData({
                first_name: response.first_name,
                last_name: response.last_name
            });

            setSuccessMessage("اطلاعات با موفقیت به‌روزرسانی شد");
            setIsEditing(false);
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            const errorData = err.response?.data;
            let errorMsg = "خطا در به‌روزرسانی اطلاعات";
            
            if (errorData) {
                if (errorData.first_name) {
                    errorMsg = errorData.first_name[0];
                } else if (errorData.last_name) {
                    errorMsg = errorData.last_name[0];
                } else if (errorData.detail) {
                    errorMsg = errorData.detail;
                }
            }
            
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin h-12 w-12 text-[#1e3a5f]" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">حساب کاربری</h1>
                <p className="text-slate-500 mt-1">مدیریت اطلاعات حساب کاربری</p>
            </div>

            {/* Messages */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2"
                    >
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                        <button onClick={() => setError("")} className="mr-auto">
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
                {successMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-2"
                    >
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                        <span>{successMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Profile Card */}
            <Card className="border-0 shadow-lg shadow-slate-200/50">
                <CardHeader className="border-b border-slate-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a] flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">اطلاعات شخصی</CardTitle>
                                <CardDescription>نام و مشخصات خود را ویرایش کنید</CardDescription>
                            </div>
                        </div>
                        {!isEditing && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditing(true)}
                                className="gap-2"
                            >
                                <Edit3 className="w-4 h-4" />
                                ویرایش
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-6">
                        {/* Avatar */}
                        <div className="flex justify-center">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#d4af37] to-[#e8c963] flex items-center justify-center shadow-lg">
                                <span className="text-3xl font-bold text-white">
                                    {formData.first_name?.[0] || user.phone_number?.[0] || "?"}
                                </span>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first_name">نام</Label>
                                {isEditing ? (
                                    <Input
                                        id="first_name"
                                        value={formData.first_name}
                                        onChange={(e) => handleChange("first_name", e.target.value)}
                                        placeholder="نام خود را وارد کنید"
                                        className="h-11"
                                    />
                                ) : (
                                    <div className="h-11 px-3 py-2 rounded-md border border-slate-200 bg-slate-50 flex items-center text-slate-700">
                                        {formData.first_name || <span className="text-slate-400">تعیین نشده</span>}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="last_name">نام خانوادگی</Label>
                                {isEditing ? (
                                    <Input
                                        id="last_name"
                                        value={formData.last_name}
                                        onChange={(e) => handleChange("last_name", e.target.value)}
                                        placeholder="نام خانوادگی خود را وارد کنید"
                                        className="h-11"
                                    />
                                ) : (
                                    <div className="h-11 px-3 py-2 rounded-md border border-slate-200 bg-slate-50 flex items-center text-slate-700">
                                        {formData.last_name || <span className="text-slate-400">تعیین نشده</span>}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Phone (read-only) */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-slate-400" />
                                شماره موبایل
                            </Label>
                            <div className="h-11 px-3 py-2 rounded-md border border-slate-200 bg-slate-50 flex items-center text-slate-700 font-mono" dir="ltr">
                                {user.phone_number}
                                <span className="mr-auto text-xs text-slate-400 font-sans" dir="rtl">
                                    (غیرقابل تغییر)
                                </span>
                            </div>
                        </div>

                        {/* Action buttons */}
                        {isEditing && (
                            <div className="flex gap-3 pt-4 border-t border-slate-100">
                                <Button
                                    onClick={handleSave}
                                    disabled={isLoading}
                                    className="flex-1 bg-gradient-to-l from-[#1e3a5f] to-[#2d5a8a]"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin ml-2" />
                                            در حال ذخیره...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 ml-2" />
                                            ذخیره تغییرات
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                >
                                    انصراف
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Security Card */}
            <Card className="border-0 shadow-lg shadow-slate-200/50">
                <CardHeader className="border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">امنیت</CardTitle>
                            <CardDescription>تنظیمات امنیتی حساب کاربری</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {/* Change Password */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-slate-200">
                                    <Key className="w-5 h-5 text-slate-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-800">تغییر رمز عبور</p>
                                    <p className="text-sm text-slate-500">رمز عبور خود را تغییر دهید</p>
                                </div>
                            </div>
                            <Link to="/change-password">
                                <Button variant="outline" size="sm">
                                    تغییر
                                </Button>
                            </Link>
                        </div>

                        {/* Logout */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-red-200">
                                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-red-800">خروج از حساب</p>
                                    <p className="text-sm text-red-600">از حساب کاربری خود خارج شوید</p>
                                </div>
                            </div>
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => logout()}
                                className="border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700"
                            >
                                خروج
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
