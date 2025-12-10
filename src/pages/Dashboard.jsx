import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/lib/utils";
import { apiService } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import {
    Building2,
    FileText,
    TrendingUp,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowLeft,
    Sparkles,
    AlertCircle,
    Plus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { formatJalaliDate } from "@/utils/jalali";

const statusConfig = {
    "DRAFT": { label: "پیش‌نویس", color: "bg-slate-100 text-slate-700 border-slate-200", icon: Clock },
    "PENDING": { label: "در انتظار بررسی", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
    "UNDER_REVIEW": { label: "در حال بررسی", color: "bg-blue-100 text-blue-700 border-blue-200", icon: TrendingUp },
    "APPROVED": { label: "تأیید شده", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
    "REJECTED": { label: "رد شده", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
    "ADDITIONAL_INFO_REQUIRED": { label: "نیاز به اصلاح", color: "bg-orange-100 text-orange-700 border-orange-200", icon: AlertCircle },
    "COMPLETED": { label: "تکمیل شده", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2 },
    "CANCELLED": { label: "لغو شده", color: "bg-gray-100 text-gray-700 border-gray-200", icon: XCircle },
};

export default function Dashboard() {
    const { user } = useAuth();

    // Fetch Company Data
    const { data: company, isLoading: companyLoading } = useQuery({
        queryKey: ["company", user?.phone_number],
        queryFn: async () => {
            const companies = await apiService.entities.Company.filter({ created_by: user.phone_number });
            return companies[0] || null;
        },
        enabled: !!user,
    });

    // Fetch Requests
    const { data: requests = [], isLoading: requestsLoading } = useQuery({
        queryKey: ["requests", user?.phone_number],
        queryFn: async () => {
            return await apiService.entities.FinancingRequest.filter({ created_by: user.phone_number }, "-created_date");
        },
        enabled: !!user,
    });

    // Determine Active Request (Most recent one that is not Rejected/Approved if we want to be strict, or just the latest one)
    // Based on user query "we allow only 1 active request", we assume the top one is the active one if exists.
    // If the latest one is rejected/approved, then maybe there is no active request.
    const activeRequest = requests.length > 0 ? requests[0] : null;
    const isActive = activeRequest && activeRequest.status !== "REJECTED" && activeRequest.status !== "APPROVED" && activeRequest.status !== "COMPLETED" && activeRequest.status !== "CANCELLED";

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1e3a5f] border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-[#1e3a5f] via-[#2d5a8a] to-[#1e3a5f] p-8 text-white"
            >
                <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full translate-x-1/4 translate-y-1/4" />

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-[#d4af37]" />
                        <span className="text-sm text-blue-200">خوش آمدید</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">
                        سلام، {user.first_name || "کاربر"} {user.last_name || ""}
                    </h1>
                    <p className="text-blue-200 text-sm md:text-base max-w-xl">
                        پنل مدیریت تأمین مالی شرکت شما
                    </p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Company Information Card - Takes up 2 columns on large screens */}
                <motion.div
                    className="lg:col-span-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="border-0 shadow-lg shadow-slate-200/50 h-full overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-3 text-lg text-[#1e3a5f]">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a] flex items-center justify-center">
                                        <Building2 className="w-5 h-5 text-white" />
                                    </div>
                                    اطلاعات شرکت
                                </CardTitle>
                                {company && (
                                    <Link to={createPageUrl("CompanyProfile")}>
                                        <Button variant="outline" size="sm" className="h-8">
                                            ویرایش
                                            <ArrowLeft className="w-3 h-3 mr-1" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            {companyLoading ? (
                                <div className="space-y-4">
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-20 w-full" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            ) : company ? (
                                <div className="space-y-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-800">{company.title}</h2>
                                            <p className="text-slate-500 mt-1">{company.activity_subject}</p>
                                        </div>
                                        <Badge variant="outline" className="w-fit bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1">
                                            {company.title ? "اطلاعات کامل" : "نقص اطلاعات"}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <div>
                                            <p className="text-xs text-slate-400 mb-1">سرمایه ثبت شده</p>
                                            <p className="font-medium text-slate-700">
                                                {company.registered_capital ? new Intl.NumberFormat("en-US").format(company.registered_capital) : "-"} <span className="text-xs text-slate-400">ریال</span>
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 mb-1">شناسه ملی</p>
                                            <p className="font-medium text-slate-700 font-mono tracking-wider">{company.national_id || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 mb-1">سود خالص (آخرین دوره)</p>
                                            <p className="font-medium text-slate-700">
                                                {company.latest_net_profit ? new Intl.NumberFormat("en-US").format(company.latest_net_profit) : "-"} <span className="text-xs text-slate-400">ریال</span>
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 mb-1">تعداد پرسنل</p>
                                            <p className="font-medium text-slate-700">{company.personnel_count || "-"}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                        <Building2 className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-slate-800 mb-2">هنوز شرکتی ثبت نکرده‌اید</h3>
                                    <p className="text-slate-500 mb-6 max-w-sm mx-auto">برای دسترسی به خدمات تأمین مالی، ابتدا باید اطلاعات شرکت خود را تکمیل کنید.</p>
                                    <Link to={createPageUrl("CompanyProfile")}>
                                        <Button className="bg-gradient-to-l from-[#1e3a5f] to-[#2d5a8a]">
                                            ثبت شرکت جدید
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Active Request Card */}
                <motion.div
                    className="lg:col-span-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="border-0 shadow-lg shadow-slate-200/50 h-full flex flex-col">
                        <CardHeader className={`border-b ${isActive ? 'bg-blue-50/50 border-blue-100' : 'bg-slate-50/50 border-slate-100'}`}>
                            <CardTitle className="flex items-center gap-3 text-lg text-[#1e3a5f]">
                                <div className={`w-10 h-10 rounded-xl ${isActive ? 'bg-blue-100' : 'bg-slate-200'} flex items-center justify-center`}>
                                    <FileText className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                                </div>
                                درخواست جاری
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 flex-1 flex flex-col justify-center">
                            {requestsLoading ? (
                                <div className="space-y-4">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-20 w-full" />
                                </div>
                            ) : activeRequest ? (
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-sm text-slate-500">وضعیت درخواست</p>
                                            <Badge className={statusConfig[activeRequest.status]?.color || "bg-slate-100 text-slate-700"}>
                                                {statusConfig[activeRequest.status]?.label || activeRequest.status}
                                            </Badge>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-slate-500">مبلغ درخواستی:</span>
                                                <span className="font-bold text-[#1e3a5f]">
                                                    {new Intl.NumberFormat("en-US").format(activeRequest.requested_amount)} <span className="text-xs font-normal">ریال</span>
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-slate-500">تاریخ ثبت:</span>
                                                <span className="text-sm text-slate-700">
                                                    {formatJalaliDate(activeRequest.created_at)}
                                                </span>
                                            </div>
                                            <div className="pt-2 border-t border-slate-200">
                                                <p className="text-sm text-slate-500 mb-1">نوع درخواست:</p>
                                                <p className="font-medium text-[#1e3a5f]">
                                                    درخواست تأمین مالی
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <Link to={createPageUrl("MyRequests")}>
                                        <Button variant="outline" className="w-full">
                                            مشاهده جزئیات
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                                        <FileText className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <p className="text-slate-600 mb-6 text-sm">شما در حال حاضر درخواست فعالی ندارید.</p>
                                    {company ? (
                                        <Link to={createPageUrl("MyRequests")}>
                                            <Button className="w-full bg-gradient-to-l from-[#1e3a5f] to-[#2d5a8a]">
                                                <Plus className="w-4 h-4 mr-2" />
                                                ثبت درخواست جدید
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button disabled className="w-full opacity-50 cursor-not-allowed" title="ابتدا شرکت را ثبت کنید">
                                            <Plus className="w-4 h-4 mr-2" />
                                            ثبت درخواست جدید
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Recent History (Optional - simplified) */}
            {requests.length > 1 && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4">تاریخچه درخواست‌ها</h3>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        {requests.slice(1, 4).map((request, idx) => (
                            <div key={request.id} className={`flex items-center justify-between p-4 ${idx !== requests.slice(1, 4).length - 1 ? 'border-b border-slate-100' : ''}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${request.status === 'APPROVED' || request.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                        {request.status === 'APPROVED' || request.status === 'COMPLETED' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-800">
                                            درخواست تأمین مالی
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {formatJalaliDate(request.created_at)}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-slate-700">
                                        {new Intl.NumberFormat("en-US").format(request.requested_amount)} <span className="text-xs font-normal text-slate-400">ریال</span>
                                    </p>
                                    <Badge variant="outline" className="text-xs h-5 px-2 bg-slate-50">
                                        {statusConfig[request.status]?.label || request.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
