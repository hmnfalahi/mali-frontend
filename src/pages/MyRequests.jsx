import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/lib/utils";
import { apiService } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    FileText,
    Plus,
    Clock,
    CheckCircle2,
    XCircle,
    TrendingUp,
    AlertCircle,
    ArrowRight,
    ArrowLeft,
    Loader2,
    X,
    Eye,
    Building2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { formatJalaliDate } from "@/utils/jalali";

// Color constants - Company theme: Petroleum Blue + Gold
const COLORS = {
    primary: '#1e3a5f',
    primaryLight: '#2d5a8a',
    gold: '#d4af37',
    goldLight: '#e8c963',
};

// Status configuration for request status
const statusConfig = {
    "IN_PROGRESS": { label: "در حال انجام", color: "bg-[#1e3a5f]/10 text-[#1e3a5f] border-[#1e3a5f]/30", icon: TrendingUp },
    "APPROVED": { label: "تأیید شده", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
    "REJECTED": { label: "رد شده", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
    "CANCELED": { label: "لغو شده", color: "bg-gray-100 text-gray-700 border-gray-200", icon: XCircle },
};

// Activity status for showing current step status
const activityStatusConfig = {
    "PENDING": { label: "در انتظار", color: "bg-slate-100 text-slate-600" },
    "ACTION_REQUIRED": { label: "نیاز به اقدام شما", color: "bg-[#d4af37]/20 text-[#b8962d]" },
    "REVIEWING": { label: "در حال بررسی", color: "bg-[#1e3a5f]/10 text-[#1e3a5f]" },
    "COMPLETED": { label: "تکمیل شده", color: "bg-emerald-100 text-emerald-700" },
    "REJECTED": { label: "رد شده", color: "bg-red-100 text-red-700" },
};

export default function MyRequests() {
    const { user, hasCompany, companyId } = useAuth();
    const queryClient = useQueryClient();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        financing_type: "",
        requested_amount: "",
        purpose: "",
        notes: ""
    });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Fetch company data
    const { data: company } = useQuery({
        queryKey: ["company", user?.phone_number],
        queryFn: async () => {
            const companies = await apiService.entities.Company.list();
            return companies[0] || null;
        },
        enabled: !!user,
    });

    // Fetch financing types
    const { data: financingTypes = [] } = useQuery({
        queryKey: ["financing-types"],
        queryFn: async () => {
            return await apiService.entities.FinancingType.list();
        },
    });

    // Fetch Requests
    const { data: requests = [], isLoading } = useQuery({
        queryKey: ["financing-requests"],
        queryFn: async () => {
            return await apiService.entities.FinancingRequest.list();
        },
        enabled: !!user && hasCompany,
    });

    // Create Mutation
    const createMutation = useMutation({
        mutationFn: async (data) => {
            const payload = {
                company: company?.id,
                financing_type: parseInt(data.financing_type),
                requested_amount: Number(data.requested_amount) || null,
                purpose: data.purpose || null,
                notes: data.notes || null
            };
            return await apiService.entities.FinancingRequest.create(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["financing-requests"]);
            setIsFormOpen(false);
            setFormData({ financing_type: "", requested_amount: "", purpose: "", notes: "" });
            setSuccessMessage("درخواست با موفقیت ایجاد شد");
            setTimeout(() => setSuccessMessage(null), 3000);
        },
        onError: (err) => {
            const errorData = err.response?.data;
            if (typeof errorData === 'object' && !errorData.detail) {
                const messages = Object.entries(errorData).map(([field, msgs]) =>
                    `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`
                ).join('\n');
                setError(messages);
            } else {
                setError(errorData?.detail || err.message || "خطا در ایجاد درخواست");
            }
        }
    });

    const handleOpenCreate = () => {
        setFormData({ financing_type: "", requested_amount: "", purpose: "", notes: "" });
        setError(null);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setFormData({ financing_type: "", requested_amount: "", purpose: "", notes: "" });
        setError(null);
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();
        setError(null);

        if (!formData.financing_type) {
            setError("نوع تأمین مالی الزامی است");
            return;
        }

        createMutation.mutate(formData);
    };

    const isPending = createMutation.isPending;

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1e3a5f] border-t-transparent" />
            </div>
        );
    }

    if (!hasCompany) {
        return (
            <div className="max-w-2xl mx-auto text-center py-16">
                <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-3">ابتدا شرکت خود را ثبت کنید</h2>
                <p className="text-slate-500 mb-8">
                    برای ثبت درخواست تأمین مالی، باید ابتدا اطلاعات شرکت خود را تکمیل کنید.
                </p>
                <Link to={createPageUrl("CompanyProfile")}>
                    <Button className="bg-gradient-to-l from-[#1e3a5f] to-[#2d5a8a]">
                        ثبت اطلاعات شرکت
                        <ArrowRight className="w-4 h-4 mr-2" />
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-[#1e3a5f] via-[#2d5a8a] to-[#1e3a5f] p-8 text-white shadow-lg shadow-blue-900/20"
            >
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#d4af37]/20 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-5 h-5 text-white/80" />
                            <span className="text-blue-100 text-sm">مدیریت درخواست‌ها</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">درخواست‌های تأمین مالی</h1>
                        <p className="text-blue-100/80 text-sm">
                            مدیریت و پیگیری درخواست‌های تأمین مالی شرکت
                        </p>
                    </div>
                    <Button
                        onClick={handleOpenCreate}
                        className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm h-12 px-6 rounded-xl transition-all hover:scale-105"
                    >
                        <Plus className="w-5 h-5 ml-2" />
                        درخواست جدید
                    </Button>
                </div>
            </motion.div>

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
                        <span className="whitespace-pre-line">{error}</span>
                        <button onClick={() => setError(null)} className="mr-auto">
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

            {/* Form Modal */}
            <AnimatePresence>
                {isFormOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={(e) => e.target === e.currentTarget && handleCloseForm()}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 border-b border-slate-100">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-slate-800">
                                        درخواست جدید تأمین مالی
                                    </h2>
                                    <button
                                        onClick={handleCloseForm}
                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-slate-500" />
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmitForm} className="p-6 space-y-5">
                                {/* Financing Type Selection */}
                                <div className="space-y-2">
                                    <Label htmlFor="financing_type" className="flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-slate-400" />
                                        نوع تأمین مالی <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={formData.financing_type}
                                        onValueChange={(value) => setFormData({ ...formData, financing_type: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="انتخاب کنید..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {financingTypes.filter(ft => ft.is_active).map((type) => (
                                                <SelectItem key={type.id} value={String(type.id)}>
                                                    {type.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {formData.financing_type && financingTypes.find(ft => ft.id === parseInt(formData.financing_type))?.description && (
                                        <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                                            {financingTypes.find(ft => ft.id === parseInt(formData.financing_type))?.description}
                                        </p>
                                    )}
                                </div>

                                {/* Requested Amount */}
                                <div className="space-y-2">
                                    <Label htmlFor="requested_amount" className="flex items-center gap-2">
                                        مبلغ درخواستی (ریال)
                                    </Label>
                                    <Input
                                        id="requested_amount"
                                        type="number"
                                        value={formData.requested_amount}
                                        onChange={(e) => setFormData({ ...formData, requested_amount: e.target.value })}
                                        placeholder="مبلغ مورد نیاز را وارد کنید"
                                        className="text-left dir-ltr"
                                    />
                                </div>

                                {/* Purpose */}
                                <div className="space-y-2">
                                    <Label htmlFor="purpose" className="flex items-center gap-2">
                                        هدف تأمین مالی
                                    </Label>
                                    <Textarea
                                        id="purpose"
                                        value={formData.purpose}
                                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                        placeholder="هدف از درخواست تأمین مالی را شرح دهید"
                                        rows={2}
                                    />
                                </div>

                                {/* Notes */}
                                <div className="space-y-2">
                                    <Label htmlFor="notes" className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-slate-400" />
                                        توضیحات تکمیلی
                                    </Label>
                                    <Textarea
                                        id="notes"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        placeholder="توضیحات اضافی (اختیاری)"
                                        rows={2}
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCloseForm}
                                        className="flex-1"
                                    >
                                        انصراف
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isPending}
                                        className="flex-1 bg-gradient-to-l from-[#1e3a5f] to-[#2d5a8a]"
                                    >
                                        {isPending ? (
                                            <Loader2 className="w-4 h-4 animate-spin ml-2" />
                                        ) : null}
                                        ایجاد درخواست
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Requests List */}
            {isLoading ? (
                <div className="grid gap-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="border-0 shadow-lg shadow-slate-200/50">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <Skeleton className="h-6 w-1/3" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : requests.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                <Card className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden">
                    <CardContent className="p-12 text-center">
                        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                            <FileText className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">هنوز درخواستی ثبت نکرده‌اید</h3>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                            اولین درخواست تأمین مالی خود را ثبت کنید و از خدمات مالی بهره‌مند شوید.
                        </p>
                        <Button
                            onClick={handleOpenCreate}
                            className="bg-gradient-to-l from-[#1e3a5f] to-[#2d5a8a]"
                        >
                            <Plus className="w-4 h-4 ml-2" />
                            ثبت اولین درخواست
                        </Button>
                    </CardContent>
                </Card>
                </motion.div>
            ) : (
                <div className="grid gap-4">
                    {requests.map((request, index) => {
                        const statusInfo = statusConfig[request.status] || statusConfig["IN_PROGRESS"];
                        const StatusIcon = statusInfo.icon;
                        const activityStatus = activityStatusConfig[request.current_activity?.status];
                        const totalSteps = request.financing_type_detail?.workflow_templates?.length || 0;

                        return (
                            <motion.div
                                key={request.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link to={`/request/${request.id}`}>
                                    <Card className="border-0 shadow-sm hover:shadow-md transition-all bg-white rounded-2xl overflow-hidden group cursor-pointer">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                                {/* Main Info */}
                                                <div className="flex-1 space-y-3">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-12 h-12 rounded-xl ${statusInfo.color} flex items-center justify-center`}>
                                                                <StatusIcon className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-slate-800">
                                                                    {request.financing_type_detail?.title || "درخواست تأمین مالی"}
                                                                </h3>
                                                                <p className="text-sm text-slate-500">
                                                                    {request.created_at ? formatJalaliDate(request.created_at) : '-'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Badge className={`${statusInfo.color} border shrink-0`}>
                                                            {statusInfo.label}
                                                        </Badge>
                                                    </div>

                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl">
                                                        <div>
                                                            <p className="text-xs text-slate-400 mb-1">مبلغ درخواستی</p>
                                                            <p className="font-bold text-[#1e3a5f]">
                                                                {request.requested_amount
                                                                    ? new Intl.NumberFormat("fa-IR").format(request.requested_amount)
                                                                    : "-"}
                                                                <span className="text-xs font-normal text-slate-400 mr-1">ریال</span>
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-slate-400 mb-1">مرحله فعلی</p>
                                                            <p className="font-medium text-slate-700">
                                                                {request.current_step_order} از {totalSteps}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-slate-400 mb-1">هدف</p>
                                                            <p className="font-medium text-slate-700 truncate">
                                                                {request.purpose || "-"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Current Activity Status */}
                                                    {request.status === "IN_PROGRESS" && request.current_activity && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-slate-500">وضعیت مرحله فعلی:</span>
                                                            <Badge className={`${activityStatus?.color || 'bg-slate-100 text-slate-600'} text-xs`}>
                                                                {request.current_activity.step_template_detail?.title}
                                                                {activityStatus && ` - ${activityStatus.label}`}
                                                            </Badge>
                                                        </div>
                                                    )}

                                                    {/* Rejection reason if rejected */}
                                                    {request.status === "REJECTED" && request.rejection_reason && (
                                                        <div className="bg-red-50 border border-red-200 p-3 rounded-xl">
                                                            <p className="text-xs text-red-600 mb-1">دلیل رد</p>
                                                            <p className="text-sm text-red-700">{request.rejection_reason}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* View Button */}
                                                <div className="flex items-center">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="gap-2 group-hover:bg-[#1e3a5f] group-hover:text-white group-hover:border-[#1e3a5f] transition-all"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        مشاهده جزئیات
                                                        <ArrowLeft className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
