import React from "react";
import { Link } from "react-router-dom";
import { apiService } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import {
    Users,
    FileText,
    TrendingUp,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowLeft,
    Sparkles,
    AlertCircle,
    Building2,
    ClipboardList,
    Eye
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { formatJalaliDate } from "@/utils/jalali";

// Status config for request status
const requestStatusConfig = {
    "IN_PROGRESS": { label: "در حال انجام", color: "bg-blue-100 text-blue-700 border-blue-200", icon: TrendingUp },
    "APPROVED": { label: "تأیید شده", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
    "REJECTED": { label: "رد شده", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
    "CANCELED": { label: "لغو شده", color: "bg-gray-100 text-gray-700 border-gray-200", icon: XCircle },
};

// Status config for activity status
const activityStatusConfig = {
    "PENDING": { label: "در انتظار", color: "bg-slate-100 text-slate-700" },
    "ACTION_REQUIRED": { label: "نیاز به اقدام شرکت", color: "bg-amber-100 text-amber-700" },
    "REVIEWING": { label: "در حال بررسی شما", color: "bg-purple-100 text-purple-700" },
    "COMPLETED": { label: "تکمیل شده", color: "bg-emerald-100 text-emerald-700" },
    "REJECTED": { label: "رد شده", color: "bg-red-100 text-red-700" },
};

export default function ConsultantDashboard() {
    const { user } = useAuth();

    // Fetch all assigned requests
    const { data: requests = [], isLoading: requestsLoading } = useQuery({
        queryKey: ["consultant-requests"],
        queryFn: async () => {
            return await apiService.entities.FinancingRequest.list();
        },
        enabled: !!user,
    });

    // Calculate stats
    const stats = {
        total: requests.length,
        inProgress: requests.filter(r => r.status === "IN_PROGRESS").length,
        needsReview: requests.filter(r => 
            r.current_activity?.status === "REVIEWING" &&
            (r.current_activity?.step_template_detail?.actor_role === "CONSULTANT" || 
             r.current_activity?.step_template_detail?.actor_role === "PLATFORM")
        ).length,
        completed: requests.filter(r => r.status === "APPROVED").length,
    };

    // Get requests that need consultant's action
    const pendingReviewRequests = requests.filter(r => 
        r.status === "IN_PROGRESS" && 
        r.current_activity?.status === "REVIEWING"
    );

    // Get all in-progress requests
    const inProgressRequests = requests.filter(r => r.status === "IN_PROGRESS");

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
                className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-[#0f766e] via-[#14b8a6] to-[#0f766e] p-8 text-white"
            >
                <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full translate-x-1/4 translate-y-1/4" />

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-teal-200" />
                        <span className="text-sm text-teal-100">پنل مشاور</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">
                        سلام، {user.first_name || "مشاور"} {user.last_name || ""}
                    </h1>
                    <p className="text-teal-100 text-sm md:text-base max-w-xl">
                        مدیریت و بررسی درخواست‌های تأمین مالی شرکت‌ها
                    </p>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "کل درخواست‌ها", value: stats.total, icon: FileText, color: "bg-slate-100 text-slate-700" },
                    { label: "در حال انجام", value: stats.inProgress, icon: Clock, color: "bg-blue-100 text-blue-700" },
                    { label: "نیاز به بررسی", value: stats.needsReview, icon: AlertCircle, color: "bg-amber-100 text-amber-700" },
                    { label: "تکمیل شده", value: stats.completed, icon: CheckCircle2, color: "bg-emerald-100 text-emerald-700" },
                ].map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                    >
                        <Card className="border-0 shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-slate-800">{requestsLoading ? "-" : stat.value}</p>
                                        <p className="text-xs text-slate-500">{stat.label}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Pending Review Section */}
            {stats.needsReview > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="border-0 shadow-lg shadow-amber-200/30 border-amber-200/50 bg-gradient-to-br from-amber-50 to-white">
                        <CardHeader className="border-b border-amber-100">
                            <CardTitle className="flex items-center gap-3 text-lg text-amber-800">
                                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                                    <AlertCircle className="w-5 h-5 text-amber-600" />
                                </div>
                                درخواست‌های منتظر بررسی شما
                                <Badge className="bg-amber-500 text-white mr-2">{stats.needsReview}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="space-y-3">
                                {pendingReviewRequests.slice(0, 5).map((request) => (
                                    <div key={request.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-amber-100 hover:border-amber-200 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
                                                <Building2 className="w-6 h-6 text-amber-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">
                                                    {request.financing_type_detail?.title || "درخواست تأمین مالی"}
                                                </h4>
                                                <p className="text-sm text-slate-500">
                                                    مرحله {request.current_step_order}: {request.current_activity?.step_template_detail?.title}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    {formatJalaliDate(request.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                        <Link to={`/request/${request.id}`}>
                                            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
                                                <Eye className="w-4 h-4 ml-1" />
                                                بررسی
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* All Requests List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card className="border-0 shadow-lg shadow-slate-200/50">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                        <CardTitle className="flex items-center gap-3 text-lg text-slate-800">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a] flex items-center justify-center">
                                <ClipboardList className="w-5 h-5 text-white" />
                            </div>
                            همه درخواست‌ها
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        {requestsLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="p-4 border rounded-xl">
                                        <Skeleton className="h-6 w-1/3 mb-2" />
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                ))}
                            </div>
                        ) : requests.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-800 mb-2">هنوز درخواستی وجود ندارد</h3>
                                <p className="text-slate-500">درخواست‌های تأمین مالی اختصاص داده شده به شما اینجا نمایش داده می‌شوند.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {requests.map((request, idx) => {
                                    const statusInfo = requestStatusConfig[request.status] || requestStatusConfig["IN_PROGRESS"];
                                    const StatusIcon = statusInfo.icon;
                                    const activityStatus = activityStatusConfig[request.current_activity?.status] || activityStatusConfig["PENDING"];
                                    
                                    return (
                                        <motion.div
                                            key={request.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.03 }}
                                            className="group"
                                        >
                                            <Link to={`/request/${request.id}`}>
                                                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all">
                                                    <div className="flex items-center gap-4 flex-1">
                                                        <div className={`w-12 h-12 rounded-xl ${statusInfo.color} flex items-center justify-center`}>
                                                            <StatusIcon className="w-6 h-6" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="font-bold text-slate-800 truncate">
                                                                    {request.financing_type_detail?.title || "درخواست تأمین مالی"}
                                                                </h4>
                                                                <Badge variant="outline" className={`${statusInfo.color} border text-xs shrink-0`}>
                                                                    {statusInfo.label}
                                                                </Badge>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" />
                                                                    {formatJalaliDate(request.created_at)}
                                                                </span>
                                                                {request.requested_amount && (
                                                                    <span>
                                                                        مبلغ: {new Intl.NumberFormat("fa-IR").format(request.requested_amount)} ریال
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {request.status === "IN_PROGRESS" && request.current_activity && (
                                                                <div className="flex items-center gap-2 mt-2">
                                                                    <span className="text-xs text-slate-400">مرحله فعلی:</span>
                                                                    <Badge className={`${activityStatus.color} text-xs`}>
                                                                        {request.current_activity.step_template_detail?.title}
                                                                    </Badge>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <ArrowLeft className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

