import React, { useState, useEffect } from "react";
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
    CreditCard,
    AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const statusConfig = {
    "در انتظار بررسی": { color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
    "در حال بررسی": { color: "bg-blue-100 text-blue-700 border-blue-200", icon: TrendingUp },
    "تأیید شده": { color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
    "رد شده": { color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
    "نیاز به اصلاح": { color: "bg-orange-100 text-orange-700 border-orange-200", icon: AlertCircle },
};

export default function Dashboard() {
    const { user } = useAuth(); // Use AuthContext
    const { data: userData } = useQuery({
        // Optional: Fetch fresh user data if needed, but context user should suffice for display
        queryKey: ["me"],
        initialData: user
    });

    const { data: company, isLoading: companyLoading } = useQuery({
        queryKey: ["company", user?.phone_number], // Use phone_number as identifier
        queryFn: async () => {
            // Assuming API will support filtering by current user implicitly or we pass identifier
            const companies = await apiService.entities.Company.filter({ created_by: user.phone_number });
            return companies[0] || null;
        },
        enabled: !!user,
    });

    const { data: requests = [], isLoading: requestsLoading } = useQuery({
        queryKey: ["requests", user?.phone_number],
        queryFn: async () => {
            return await apiService.entities.FinancingRequest.filter({ created_by: user.phone_number }, "-created_date");
        },
        enabled: !!user,
    });

    const { data: methods = [] } = useQuery({
        queryKey: ["methods"],
        queryFn: () => apiService.entities.FinancingMethod.filter({ is_active: true }),
    });

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1e3a5f] border-t-transparent" />
            </div>
        );
    }

    const stats = [
        {
            title: "درخواست‌های فعال",
            value: requests.filter(r => r.status !== "تأیید شده" && r.status !== "رد شده").length,
            icon: FileText,
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "تأیید شده",
            value: requests.filter(r => r.status === "تأیید شده").length,
            icon: CheckCircle2,
            color: "from-emerald-500 to-emerald-600",
            bgColor: "bg-emerald-50",
        },
        {
            title: "در انتظار بررسی",
            value: requests.filter(r => r.status === "در انتظار بررسی").length,
            icon: Clock,
            color: "from-amber-500 to-amber-600",
            bgColor: "bg-amber-50",
        },
    ];

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
                        به پلتفرم هوشمند تأمین مالی و خدمات مالی خوش آمدید. از اینجا می‌توانید اطلاعات شرکت خود را ثبت کرده و درخواست تأمین مالی دهید.
                    </p>
                </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-slate-500 mb-1">{stat.title}</p>
                                            {requestsLoading ? (
                                                <Skeleton className="h-8 w-16" />
                                            ) : (
                                                <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                                            )}
                                        </div>
                                        <div className={`w-14 h-14 rounded-2xl ${stat.bgColor} flex items-center justify-center`}>
                                            <Icon className={`w-7 h-7 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} style={{ color: stat.color.includes('blue') ? '#3b82f6' : stat.color.includes('emerald') ? '#10b981' : '#f59e0b' }} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Company Status & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Company Status */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="border-0 shadow-lg shadow-slate-200/50 h-full">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-3 text-lg">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a] flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-white" />
                                </div>
                                وضعیت شرکت
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {companyLoading ? (
                                <div className="space-y-4">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            ) : company ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                                        <div>
                                            <p className="font-semibold text-slate-800">{company.title}</p>
                                            <p className="text-sm text-slate-500 mt-1">{company.activity_subject || "موضوع فعالیت ثبت نشده"}</p>
                                        </div>
                                        <Badge className={company.title ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
                                            {company.title ? "اطلاعات ثبت شده" : "در حال تکمیل"}
                                        </Badge>
                                    </div>
                                    <Link to={createPageUrl("CompanyProfile")}>
                                        <Button variant="outline" className="w-full group">
                                            ویرایش اطلاعات شرکت
                                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                        <Building2 className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <p className="text-slate-600 mb-4">هنوز اطلاعات شرکتی ثبت نکرده‌اید</p>
                                    <Link to={createPageUrl("CompanyProfile")}>
                                        <Button className="bg-gradient-to-l from-[#1e3a5f] to-[#2d5a8a] hover:opacity-90">
                                            ثبت اطلاعات شرکت
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="border-0 shadow-lg shadow-slate-200/50 h-full">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-3 text-lg">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#e8c963] flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-white" />
                                </div>
                                دسترسی سریع
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-3">
                                <Link to={createPageUrl("FinancingMethods")}>
                                    <div className="p-4 rounded-xl border border-slate-200 hover:border-[#1e3a5f]/30 hover:bg-slate-50 transition-all cursor-pointer group">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                                    <CreditCard className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-800">روش‌های تأمین مالی</p>
                                                    <p className="text-xs text-slate-500">{methods.length} روش فعال</p>
                                                </div>
                                            </div>
                                            <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-[#1e3a5f] group-hover:-translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                </Link>

                                <Link to={createPageUrl("MyRequests")}>
                                    <div className="p-4 rounded-xl border border-slate-200 hover:border-[#1e3a5f]/30 hover:bg-slate-50 transition-all cursor-pointer group">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                                                    <FileText className="w-5 h-5 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-800">درخواست‌های من</p>
                                                    <p className="text-xs text-slate-500">{requests.length} درخواست</p>
                                                </div>
                                            </div>
                                            <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-[#1e3a5f] group-hover:-translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Recent Requests */}
            {requests.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card className="border-0 shadow-lg shadow-slate-200/50">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">آخرین درخواست‌ها</CardTitle>
                                <Link to={createPageUrl("MyRequests")}>
                                    <Button variant="ghost" size="sm" className="text-[#1e3a5f]">
                                        مشاهده همه
                                        <ArrowLeft className="w-4 h-4 mr-1" />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {requests.slice(0, 3).map((request) => {
                                    const config = statusConfig[request.status] || statusConfig["در انتظار بررسی"];
                                    const Icon = config.icon;
                                    const method = methods.find(m => m.id === request.financing_method_id);

                                    return (
                                        <div
                                            key={request.id}
                                            className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-lg ${config.color.split(' ')[0]} flex items-center justify-center`}>
                                                    <Icon className={`w-5 h-5 ${config.color.split(' ')[1]}`} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-800">{method?.name || "روش تأمین مالی"}</p>
                                                    <p className="text-sm text-slate-500">
                                                        {new Intl.NumberFormat("fa-IR").format(request.requested_amount)} میلیون ریال
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge className={`${config.color} border`}>
                                                {request.status}
                                            </Badge>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}
