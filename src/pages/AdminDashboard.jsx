import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import { Link } from "react-router-dom";
import {
    Building2,
    FileText,
    Users,
    Clock,
    BarChart3,
    Layers,
    Sparkles,
    ChevronLeft,
    ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { formatJalaliDate } from "@/utils/jalali";

// Admin theme colors - Royal Purple + Gold
const themeColors = {
    primary: '#5b21b6',
    primaryLight: '#7c3aed',
    gold: '#d4af37',
    goldLight: '#e8c963',
    gradientFull: 'from-[#5b21b6] via-[#7c3aed] to-[#5b21b6]',
    gradient: 'from-[#5b21b6] to-[#7c3aed]',
};

const formatNumber = (num) => {
    if (!num) return '۰';
    return new Intl.NumberFormat('fa-IR').format(num);
};

const StatusBadge = ({ status }) => {
    const styles = {
        IN_PROGRESS: 'bg-purple-100 text-[#5b21b6] border-purple-200',
        APPROVED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        REJECTED: 'bg-red-100 text-red-700 border-red-200',
        CANCELED: 'bg-slate-100 text-slate-700 border-slate-200',
    };
    const labels = {
        IN_PROGRESS: 'در حال انجام',
        APPROVED: 'تایید شده',
        REJECTED: 'رد شده',
        CANCELED: 'لغو شده',
    };
    return (
        <Badge variant="outline" className={styles[status] || styles.IN_PROGRESS}>
            {labels[status] || status}
        </Badge>
    );
};

export default function AdminDashboard() {
    // Fetch admin stats
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ["admin-stats"],
        queryFn: apiService.admin.getStats,
    });

    // Fetch all consultants
    const { data: consultants, isLoading: consultantsLoading } = useQuery({
        queryKey: ["admin-consultants"],
        queryFn: apiService.admin.getConsultants,
    });

    return (
        <div className="p-4 md:p-6 space-y-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen" dir="rtl">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-l ${themeColors.gradientFull} p-6 text-white shadow-xl`}
            >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
                <div className="relative flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles className={`w-5 h-5 text-[#d4af37]`} />
                            <span className="text-sm text-white/80">پنل مدیریت</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold">داشبورد ادمین</h1>
                        <p className="text-white/70 mt-1 text-sm">مدیریت کامل پلتفرم تامین مالی</p>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <div className="text-center bg-white/10 rounded-xl px-4 py-2">
                            <div className="text-2xl font-bold">{formatNumber(stats?.stats?.total_requests || 0)}</div>
                            <div className="text-xs text-white/70">کل درخواست‌ها</div>
                        </div>
                        <div className="text-center bg-white/10 rounded-xl px-4 py-2">
                            <div className="text-2xl font-bold">{formatNumber(stats?.stats?.total_companies || 0)}</div>
                            <div className="text-xs text-white/70">شرکت‌ها</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/admin/companies">
                    <StatCard
                        title="شرکت‌ها"
                        value={stats?.stats?.total_companies}
                        icon={Building2}
                        color="bg-gradient-to-br from-[#5b21b6] to-[#7c3aed]"
                        loading={statsLoading}
                    />
                </Link>
                <Link to="/admin/requests">
                    <StatCard
                        title="درخواست‌ها"
                        value={stats?.stats?.total_requests}
                        icon={FileText}
                        color="bg-gradient-to-br from-[#d4af37] to-[#e8c963]"
                        loading={statsLoading}
                    />
                </Link>
                <StatCard
                    title="مشاوران"
                    value={stats?.stats?.total_consultants}
                    icon={Users}
                    color="bg-gradient-to-br from-emerald-500 to-teal-500"
                    loading={statsLoading}
                />
                <Link to="/admin/financing-types">
                    <StatCard
                        title="انواع تامین مالی"
                        value={stats?.stats?.total_financing_types}
                        icon={Layers}
                        color="bg-gradient-to-br from-[#5b21b6]/80 to-[#7c3aed]/80"
                        loading={statsLoading}
                    />
                </Link>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
                <Link to="/admin/requests">
                    <Card className="border-0 shadow-lg shadow-purple-100/30 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#5b21b6] to-[#7c3aed] flex items-center justify-center shadow-lg">
                                        <FileText className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800">مدیریت درخواست‌ها</div>
                                        <div className="text-sm text-slate-500">مشاهده و ارجاع درخواست‌ها</div>
                                    </div>
                                </div>
                                <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-[#5b21b6] transition-colors" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
                <Link to="/admin/companies">
                    <Card className="border-0 shadow-lg shadow-purple-100/30 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#e8c963] flex items-center justify-center shadow-lg">
                                        <Building2 className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800">مدیریت شرکت‌ها</div>
                                        <div className="text-sm text-slate-500">مشاهده شرکت‌های ثبت شده</div>
                                    </div>
                                </div>
                                <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-[#d4af37] transition-colors" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
                <Link to="/admin/financing-types">
                    <Card className="border-0 shadow-lg shadow-purple-100/30 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                                        <Layers className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800">انواع تامین مالی</div>
                                        <div className="text-sm text-slate-500">تعریف و مدیریت مراحل</div>
                                    </div>
                                </div>
                                <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Request Status & Consultants */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg shadow-purple-100/30 rounded-2xl overflow-hidden">
                    <CardHeader className="pb-2 bg-gradient-to-l from-purple-50 to-white">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5b21b6] to-[#7c3aed] flex items-center justify-center">
                                <BarChart3 className="w-4 h-4 text-white" />
                            </div>
                            وضعیت درخواست‌ها
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <RequestStatusRow
                                label="در حال انجام"
                                value={stats?.request_stats?.in_progress || 0}
                                total={stats?.stats?.total_requests || 1}
                                color="bg-[#7c3aed]"
                            />
                            <RequestStatusRow
                                label="تایید شده"
                                value={stats?.request_stats?.approved || 0}
                                total={stats?.stats?.total_requests || 1}
                                color="bg-emerald-500"
                            />
                            <RequestStatusRow
                                label="رد شده"
                                value={stats?.request_stats?.rejected || 0}
                                total={stats?.stats?.total_requests || 1}
                                color="bg-red-500"
                            />
                            <div className="pt-2 border-t">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">در انتظار مشاور</span>
                                    <Badge className="bg-[#d4af37]/20 text-[#b8963a] border border-[#d4af37]/30">
                                        {stats?.request_stats?.pending_consultant || 0}
                                    </Badge>
                                </div>
                                <div className="flex justify-between text-sm mt-2">
                                    <span className="text-slate-600">در انتظار پلتفرم</span>
                                    <Badge className="bg-purple-100 text-[#5b21b6]">
                                        {stats?.request_stats?.pending_platform || 0}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg shadow-purple-100/30 rounded-2xl overflow-hidden">
                    <CardHeader className="pb-2 bg-gradient-to-l from-purple-50 to-white">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                                <Users className="w-4 h-4 text-white" />
                            </div>
                            مشاوران
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {consultantsLoading ? (
                            <div className="space-y-2">
                                {[...Array(3)].map((_, i) => (
                                    <Skeleton key={i} className="h-12 w-full" />
                                ))}
                            </div>
                        ) : consultants?.length > 0 ? (
                            <div className="space-y-2">
                                {consultants.slice(0, 5).map((c) => (
                                    <div key={c.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-purple-50/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5b21b6] to-[#7c3aed] flex items-center justify-center text-white font-bold text-sm shadow-md">
                                                {c.name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm">{c.name}</div>
                                                <div className="text-xs text-slate-500 dir-ltr text-right">{c.phone_number}</div>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-xs border-purple-200 text-[#5b21b6]">
                                            {c.assigned_requests} درخواست فعال
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-slate-400">
                                هیچ مشاوری ثبت نشده است
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Recent Requests */}
            <Card className="border-0 shadow-lg shadow-purple-100/30 rounded-2xl overflow-hidden">
                <CardHeader className="pb-2 bg-gradient-to-l from-[#d4af37]/10 to-white flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#e8c963] flex items-center justify-center">
                            <Clock className="w-4 h-4 text-white" />
                        </div>
                        آخرین درخواست‌ها
                    </CardTitle>
                    <Link to="/admin/requests">
                        <Button variant="ghost" size="sm" className="text-[#5b21b6]">
                            مشاهده همه
                            <ChevronLeft className="w-4 h-4 mr-1" />
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    {statsLoading ? (
                        <div className="space-y-2">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    ) : stats?.recent_requests?.length > 0 ? (
                        <div className="space-y-2">
                            {stats.recent_requests.map((req) => (
                                <Link
                                    key={req.id}
                                    to={`/request/${req.id}`}
                                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-purple-50/50 transition-colors"
                                >
                                    <div>
                                        <div className="font-medium">{req.company_name}</div>
                                        <div className="text-sm text-slate-500">{req.financing_type_title}</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <StatusBadge status={req.status} />
                                        <ChevronLeft className="w-4 h-4 text-slate-400" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 text-slate-400">
                            هیچ درخواستی ثبت نشده است
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// Stat Card Component
function StatCard({ title, value, icon: Icon, color, loading }) {
    return (
        <Card className="border-0 shadow-lg shadow-purple-100/30 overflow-hidden rounded-2xl hover:shadow-xl transition-shadow">
            <CardContent className="p-5">
                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        {loading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="text-2xl font-bold text-slate-800">{formatNumber(value || 0)}</div>
                        )}
                        <div className="text-sm text-slate-500 mt-0.5">{title}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Request Status Row Component
function RequestStatusRow({ label, value, total, color }) {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">{label}</span>
                <span className="font-medium">{formatNumber(value)}</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
}
