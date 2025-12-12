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
    Edit3,
    Trash2,
    Send,
    ArrowRight,
    Loader2,
    DollarSign,
    Calendar,
    Target,
    X,
    Percent,
    Shield,
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

// Method choices from API
const methodChoices = [
    { value: "BONDS", label: "اوراق بدهی" },
    { value: "BANK_LOAN", label: "تسهیلات بانکی" },
    { value: "PRIVATE_PLACEMENT", label: "پذیره نویسی خصوصی" },
    { value: "CROWDFUNDING", label: "تامین مالی جمعی" },
    { value: "LEASING", label: "لیزینگ" },
    { value: "OTHER", label: "سایر" },
];

// Status configuration with API values
const statusConfig = {
    "DRAFT": { label: "پیش‌نویس", color: "bg-slate-100 text-slate-700 border-slate-200", icon: Edit3 },
    "PENDING": { label: "در انتظار بررسی", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
    "UNDER_REVIEW": { label: "در حال بررسی", color: "bg-blue-100 text-blue-700 border-blue-200", icon: TrendingUp },
    "ADDITIONAL_INFO_REQUIRED": { label: "نیاز به اطلاعات تکمیلی", color: "bg-orange-100 text-orange-700 border-orange-200", icon: AlertCircle },
    "APPROVED": { label: "تایید شده", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
    "REJECTED": { label: "رد شده", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
    "COMPLETED": { label: "تکمیل شده", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2 },
    "CANCELLED": { label: "لغو شده", color: "bg-gray-100 text-gray-700 border-gray-200", icon: XCircle },
};

const getMethodLabel = (value) => {
    const method = methodChoices.find(m => m.value === value);
    return method ? method.label : value;
};

const initialFormData = {
    method: "",
    requested_amount: "",
    purpose: "",
    repayment_period_months: "",
    proposed_interest_rate: "",
    collateral_description: "",
    collateral_value: "",
    notes: ""
};

export default function MyRequests() {
    const { user, hasCompany, companyId } = useAuth();
    const queryClient = useQueryClient();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingRequest, setEditingRequest] = useState(null);
    const [formData, setFormData] = useState(initialFormData);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    // Fetch company data to get company ID
    const { data: company } = useQuery({
        queryKey: ["company", user?.phone_number],
        queryFn: async () => {
            const companies = await apiService.entities.Company.list();
            return companies[0] || null;
        },
        enabled: !!user,
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
                method: data.method,
                requested_amount: Number(data.requested_amount) || 0,
                purpose: data.purpose,
                repayment_period_months: Number(data.repayment_period_months) || 0,
                proposed_interest_rate: data.proposed_interest_rate ? String(data.proposed_interest_rate) : null,
                collateral_description: data.collateral_description || "",
                collateral_value: data.collateral_value ? Number(data.collateral_value) : null,
                notes: data.notes || ""
            };
            return await apiService.entities.FinancingRequest.create(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["financing-requests"]);
            setIsFormOpen(false);
            setFormData(initialFormData);
            setSuccessMessage("درخواست با موفقیت ایجاد شد");
            setTimeout(() => setSuccessMessage(null), 3000);
        },
        onError: (err) => {
            const errorData = err.response?.data;
            if (typeof errorData === 'object' && !errorData.detail) {
                // Field-level validation errors
                const messages = Object.entries(errorData).map(([field, msgs]) =>
                    `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`
                ).join('\n');
                setError(messages);
            } else {
                setError(errorData?.detail || err.message || "خطا در ایجاد درخواست");
            }
        }
    });

    // Update Mutation
    const updateMutation = useMutation({
        mutationFn: async ({ id, data }) => {
            const payload = {
                method: data.method,
                requested_amount: Number(data.requested_amount) || 0,
                purpose: data.purpose,
                repayment_period_months: Number(data.repayment_period_months) || 0,
                proposed_interest_rate: data.proposed_interest_rate ? String(data.proposed_interest_rate) : null,
                collateral_description: data.collateral_description || "",
                collateral_value: data.collateral_value ? Number(data.collateral_value) : null,
                notes: data.notes || ""
            };
            return await apiService.entities.FinancingRequest.update(id, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["financing-requests"]);
            setIsFormOpen(false);
            setEditingRequest(null);
            setFormData(initialFormData);
            setSuccessMessage("درخواست با موفقیت به‌روزرسانی شد");
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
                setError(errorData?.detail || err.message || "خطا در به‌روزرسانی درخواست");
            }
        }
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            return await apiService.entities.FinancingRequest.delete(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["financing-requests"]);
            setDeleteConfirmId(null);
            setSuccessMessage("درخواست با موفقیت حذف شد");
            setTimeout(() => setSuccessMessage(null), 3000);
        },
        onError: (err) => {
            setError(err.response?.data?.detail || err.message || "خطا در حذف درخواست");
        }
    });

    // Submit Mutation
    const submitMutation = useMutation({
        mutationFn: async (id) => {
            return await apiService.entities.FinancingRequest.submit(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["financing-requests"]);
            setSuccessMessage("درخواست با موفقیت ارسال شد");
            setTimeout(() => setSuccessMessage(null), 3000);
        },
        onError: (err) => {
            setError(err.response?.data?.detail || err.message || "خطا در ارسال درخواست");
        }
    });

    const handleOpenCreate = () => {
        setEditingRequest(null);
        setFormData(initialFormData);
        setError(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (request) => {
        setEditingRequest(request);
        setFormData({
            method: request.method || "",
            requested_amount: request.requested_amount || "",
            purpose: request.purpose || "",
            repayment_period_months: request.repayment_period_months || "",
            proposed_interest_rate: request.proposed_interest_rate || "",
            collateral_description: request.collateral_description || "",
            collateral_value: request.collateral_value || "",
            notes: request.notes || ""
        });
        setError(null);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingRequest(null);
        setFormData(initialFormData);
        setError(null);
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();
        setError(null);

        if (!formData.method) {
            setError("نوع تأمین مالی الزامی است");
            return;
        }
        if (!formData.requested_amount || formData.requested_amount <= 0) {
            setError("مبلغ درخواستی الزامی است");
            return;
        }
        if (!formData.purpose?.trim()) {
            setError("هدف تأمین مالی الزامی است");
            return;
        }
        if (!formData.repayment_period_months || formData.repayment_period_months <= 0) {
            setError("مدت بازپرداخت الزامی است");
            return;
        }

        if (editingRequest) {
            updateMutation.mutate({ id: editingRequest.id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const handleDelete = (id) => {
        deleteMutation.mutate(id);
    };

    const handleSubmitRequest = (id) => {
        submitMutation.mutate(id);
    };

    const isDraft = (request) => request.status === "DRAFT" || !request.status;
    const isPending = createMutation.isPending || updateMutation.isPending;

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
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 border-b border-slate-100">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-slate-800">
                                        {editingRequest ? "ویرایش درخواست" : "درخواست جدید"}
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
                                {/* Method Selection */}
                                <div className="space-y-2">
                                    <Label htmlFor="method" className="flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-slate-400" />
                                        نوع تأمین مالی <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={formData.method}
                                        onValueChange={(value) => setFormData({ ...formData, method: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="انتخاب کنید..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {methodChoices.map((method) => (
                                                <SelectItem key={method.value} value={method.value}>
                                                    {method.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Requested Amount */}
                                    <div className="space-y-2">
                                        <Label htmlFor="requested_amount" className="flex items-center gap-2">
                                            <DollarSign className="w-4 h-4 text-slate-400" />
                                            مبلغ درخواستی (ریال) <span className="text-red-500">*</span>
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

                                    {/* Repayment Period */}
                                    <div className="space-y-2">
                                        <Label htmlFor="repayment_period_months" className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            مدت بازپرداخت (ماه) <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="repayment_period_months"
                                            type="number"
                                            value={formData.repayment_period_months}
                                            onChange={(e) => setFormData({ ...formData, repayment_period_months: e.target.value })}
                                            placeholder="مثلا 24 ماه"
                                            className="text-left dir-ltr"
                                        />
                                    </div>
                                </div>

                                {/* Purpose */}
                                <div className="space-y-2">
                                    <Label htmlFor="purpose" className="flex items-center gap-2">
                                        <Target className="w-4 h-4 text-slate-400" />
                                        هدف تأمین مالی <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="purpose"
                                        value={formData.purpose}
                                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                        placeholder="هدف از درخواست تأمین مالی را شرح دهید"
                                        rows={2}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Proposed Interest Rate */}
                                    <div className="space-y-2">
                                        <Label htmlFor="proposed_interest_rate" className="flex items-center gap-2">
                                            <Percent className="w-4 h-4 text-slate-400" />
                                            نرخ سود پیشنهادی (درصد)
                                        </Label>
                                        <Input
                                            id="proposed_interest_rate"
                                            type="number"
                                            step="0.01"
                                            value={formData.proposed_interest_rate}
                                            onChange={(e) => setFormData({ ...formData, proposed_interest_rate: e.target.value })}
                                            placeholder="مثلا 18"
                                            className="text-left dir-ltr"
                                        />
                                    </div>

                                    {/* Collateral Value */}
                                    <div className="space-y-2">
                                        <Label htmlFor="collateral_value" className="flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-slate-400" />
                                            ارزش وثیقه (ریال)
                                        </Label>
                                        <Input
                                            id="collateral_value"
                                            type="number"
                                            value={formData.collateral_value}
                                            onChange={(e) => setFormData({ ...formData, collateral_value: e.target.value })}
                                            placeholder="ارزش تقریبی وثیقه"
                                            className="text-left dir-ltr"
                                        />
                                    </div>
                                </div>

                                {/* Collateral Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="collateral_description" className="flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-slate-400" />
                                        توضیحات وثیقه
                                    </Label>
                                    <Input
                                        id="collateral_description"
                                        value={formData.collateral_description}
                                        onChange={(e) => setFormData({ ...formData, collateral_description: e.target.value })}
                                        placeholder="نوع و مشخصات وثیقه"
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
                                        {editingRequest ? "ذخیره تغییرات" : "ایجاد درخواست"}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirmId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={(e) => e.target === e.currentTarget && setDeleteConfirmId(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
                        >
                            <div className="text-center">
                                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                                    <Trash2 className="w-7 h-7 text-red-600" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">حذف درخواست</h3>
                                <p className="text-slate-500 mb-6">
                                    آیا از حذف این درخواست اطمینان دارید؟ این عملیات قابل بازگشت نیست.
                                </p>
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setDeleteConfirmId(null)}
                                        className="flex-1"
                                    >
                                        انصراف
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete(deleteConfirmId)}
                                        disabled={deleteMutation.isPending}
                                        className="flex-1 bg-red-600 hover:bg-red-700"
                                    >
                                        {deleteMutation.isPending ? (
                                            <Loader2 className="w-4 h-4 animate-spin ml-2" />
                                        ) : null}
                                        حذف
                                    </Button>
                                </div>
                            </div>
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
                        const statusInfo = statusConfig[request.status] || statusConfig["DRAFT"];
                        const StatusIcon = statusInfo.icon;
                        const canEdit = isDraft(request);

                        return (
                            <motion.div
                                key={request.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white rounded-2xl overflow-hidden">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                            {/* Main Info */}
                                            <div className="flex-1 space-y-3">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-xl ${statusInfo.color} flex items-center justify-center`}>
                                                            <StatusIcon className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-slate-800">
                                                                {getMethodLabel(request.method)}
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

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl">
                                                    <div>
                                                        <p className="text-xs text-slate-400 mb-1">مبلغ درخواستی</p>
                                                        <p className="font-bold text-[#1e3a5f]">
                                                            {request.requested_amount
                                                                ? new Intl.NumberFormat("en-US").format(request.requested_amount)
                                                                : "-"}
                                                            <span className="text-xs font-normal text-slate-400 mr-1">ریال</span>
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-400 mb-1">مدت بازپرداخت</p>
                                                        <p className="font-medium text-slate-700">
                                                            {request.repayment_period_months ? `${request.repayment_period_months} ماه` : "-"}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-400 mb-1">نرخ سود پیشنهادی</p>
                                                        <p className="font-medium text-slate-700">
                                                            {request.proposed_interest_rate ? `${request.proposed_interest_rate}%` : "-"}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-400 mb-1">هدف</p>
                                                        <p className="font-medium text-slate-700 truncate">
                                                            {request.purpose || "-"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Approved info if available */}
                                                {request.approved_amount && (
                                                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                                                        <div className="flex items-center gap-4">
                                                            <div>
                                                                <p className="text-xs text-emerald-600 mb-1">مبلغ تایید شده</p>
                                                                <p className="font-bold text-emerald-700">
                                                                    {new Intl.NumberFormat("en-US").format(request.approved_amount)} ریال
                                                                </p>
                                                            </div>
                                                            {request.approved_interest_rate && (
                                                                <div>
                                                                    <p className="text-xs text-emerald-600 mb-1">نرخ سود تایید شده</p>
                                                                    <p className="font-bold text-emerald-700">{request.approved_interest_rate}%</p>
                                                                </div>
                                                            )}
                                                        </div>
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

                                            {/* Actions */}
                                            <div className="flex flex-row lg:flex-col gap-2 lg:w-auto justify-end">
                                                {canEdit && (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleOpenEdit(request)}
                                                            className="gap-1"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                            <span className="hidden sm:inline">ویرایش</span>
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleSubmitRequest(request.id)}
                                                            disabled={submitMutation.isPending}
                                                            className="bg-gradient-to-l from-emerald-500 to-emerald-600 gap-1"
                                                        >
                                                            {submitMutation.isPending ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <Send className="w-4 h-4" />
                                                            )}
                                                            <span className="hidden sm:inline">ارسال</span>
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setDeleteConfirmId(request.id)}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-1"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            <span className="hidden sm:inline">حذف</span>
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
