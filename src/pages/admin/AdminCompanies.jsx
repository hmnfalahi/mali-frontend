import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import { Building2, ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

// Admin theme colors - Royal Purple + Gold
const themeColors = {
    primary: '#5b21b6',
    primaryLight: '#7c3aed',
    gold: '#d4af37',
    gradient: 'from-[#5b21b6] to-[#7c3aed]',
    gradientFull: 'from-[#5b21b6] via-[#7c3aed] to-[#5b21b6]',
};

const formatNumber = (num) => {
    if (!num) return '۰';
    return new Intl.NumberFormat('fa-IR').format(num);
};

export default function AdminCompanies() {
    const { data: companies, isLoading } = useQuery({
        queryKey: ["admin-all-companies"],
        queryFn: apiService.admin.getCompanies,
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
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                            <Building2 className="w-7 h-7 text-[#d4af37]" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">مدیریت شرکت‌ها</h1>
                            <p className="text-white/70 mt-1 text-sm">مشاهده و مدیریت همه شرکت‌های ثبت شده</p>
                        </div>
                    </div>
                    <div className="hidden md:block text-center bg-white/10 rounded-xl px-4 py-2">
                        <div className="text-2xl font-bold">{formatNumber(companies?.length || 0)}</div>
                        <div className="text-xs text-white/70">شرکت</div>
                    </div>
                </div>
            </motion.div>

            {/* Companies List */}
            <Card className="border-0 shadow-lg shadow-purple-100/30 rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-l from-[#d4af37]/10 to-white">
                    <CardTitle className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#e8c963] flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-white" />
                        </div>
                        همه شرکت‌ها ({formatNumber(companies?.length || 0)})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    {isLoading ? (
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-20 w-full rounded-xl" />
                            ))}
                        </div>
                    ) : companies?.length > 0 ? (
                        <div className="space-y-3">
                            {companies.map((company) => (
                                <motion.div
                                    key={company.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-slate-50 rounded-xl hover:bg-purple-50/50 transition-colors border border-transparent hover:border-purple-100"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5b21b6] to-[#7c3aed] flex items-center justify-center text-white font-bold shadow-md">
                                                {company.title?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-800">{company.title}</div>
                                                <div className="text-sm text-slate-500">
                                                    شناسه ملی: {company.national_id} • مالک: {company.owner_name}
                                                </div>
                                                <div className="text-xs text-slate-400 mt-1">
                                                    {company.personnel_count} پرسنل • سرمایه: {formatNumber(company.registered_capital)} ریال
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-[#5b21b6] border-purple-200">
                                            {company.requests_count} درخواست
                                        </Badge>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-400">
                            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            هیچ شرکتی ثبت نشده است
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

