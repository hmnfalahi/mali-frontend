import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import { Link } from "react-router-dom";
import { FileText, ChevronLeft, Users, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { formatJalaliDate } from "@/utils/jalali";

// Admin theme colors
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

export default function AdminRequests() {
    const queryClient = useQueryClient();
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [selectedConsultant, setSelectedConsultant] = useState("");

    const { data: requests, isLoading } = useQuery({
        queryKey: ["admin-all-requests"],
        queryFn: () => apiService.admin.getRequests(),
    });

    const { data: consultants } = useQuery({
        queryKey: ["admin-consultants"],
        queryFn: apiService.admin.getConsultants,
    });

    const assignMutation = useMutation({
        mutationFn: ({ requestId, consultantId }) =>
            apiService.entities.FinancingRequest.assignConsultant(requestId, consultantId),
        onSuccess: () => {
            queryClient.invalidateQueries(["admin-all-requests"]);
            setAssignDialogOpen(false);
            setSelectedRequest(null);
            setSelectedConsultant("");
        },
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
                            <FileText className="w-7 h-7 text-[#d4af37]" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">مدیریت درخواست‌ها</h1>
                            <p className="text-white/70 mt-1 text-sm">مشاهده و مدیریت همه درخواست‌های تامین مالی</p>
                        </div>
                    </div>
                    <div className="hidden md:block text-center bg-white/10 rounded-xl px-4 py-2">
                        <div className="text-2xl font-bold">{formatNumber(requests?.length || 0)}</div>
                        <div className="text-xs text-white/70">درخواست</div>
                    </div>
                </div>
            </motion.div>

            {/* Requests List */}
            <Card className="border-0 shadow-lg shadow-purple-100/30 rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-l from-purple-50 to-white">
                    <CardTitle className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5b21b6] to-[#7c3aed] flex items-center justify-center">
                            <FileText className="w-4 h-4 text-white" />
                        </div>
                        همه درخواست‌ها ({formatNumber(requests?.length || 0)})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    {isLoading ? (
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-20 w-full rounded-xl" />
                            ))}
                        </div>
                    ) : requests?.length > 0 ? (
                        <div className="space-y-3">
                            {requests.map((req) => (
                                <motion.div
                                    key={req.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-slate-50 rounded-xl hover:bg-purple-50/50 transition-colors border border-transparent hover:border-purple-100"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-[#5b21b6]">#{req.id}</span>
                                                <span className="font-medium">{req.company_name}</span>
                                                <StatusBadge status={req.status} />
                                            </div>
                                            <div className="text-sm text-slate-500 mt-1">
                                                {req.financing_type_title} • مرحله {req.current_step_order}
                                                {req.requested_amount && ` • ${formatNumber(req.requested_amount)} ریال`}
                                            </div>
                                            <div className="text-xs text-slate-400 mt-1">
                                                {formatJalaliDate(req.created_at)}
                                                {req.consultant_name && ` • مشاور: ${req.consultant_name}`}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {!req.assigned_consultant && req.status === 'IN_PROGRESS' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-[#5b21b6] border-purple-200"
                                                    onClick={() => {
                                                        setSelectedRequest(req);
                                                        setAssignDialogOpen(true);
                                                    }}
                                                >
                                                    <Users className="w-4 h-4 ml-1" />
                                                    ارجاع به مشاور
                                                </Button>
                                            )}
                                            <Link to={`/request/${req.id}`}>
                                                <Button size="sm" variant="ghost">
                                                    <ChevronLeft className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-400">
                            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            هیچ درخواستی ثبت نشده است
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Assign Consultant Dialog */}
            <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>ارجاع به مشاور</DialogTitle>
                        <DialogDescription>
                            درخواست #{selectedRequest?.id} - {selectedRequest?.company_name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label>انتخاب مشاور</Label>
                        <Select value={selectedConsultant} onValueChange={setSelectedConsultant}>
                            <SelectTrigger className="mt-2">
                                <SelectValue placeholder="مشاور را انتخاب کنید" />
                            </SelectTrigger>
                            <SelectContent>
                                {consultants?.map((c) => (
                                    <SelectItem key={c.id} value={String(c.id)}>
                                        {c.name} ({c.assigned_requests} درخواست فعال)
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
                            انصراف
                        </Button>
                        <Button
                            className={`bg-gradient-to-l ${themeColors.gradient}`}
                            onClick={() => {
                                if (selectedConsultant && selectedRequest) {
                                    assignMutation.mutate({
                                        requestId: selectedRequest.id,
                                        consultantId: parseInt(selectedConsultant),
                                    });
                                }
                            }}
                            disabled={!selectedConsultant || assignMutation.isPending}
                        >
                            {assignMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                "ارجاع"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

