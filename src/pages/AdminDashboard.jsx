import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import { Link } from "react-router-dom";
import {
    Building2,
    FileText,
    Users,
    Settings,
    ChevronLeft,
    ChevronDown,
    ChevronUp,
    Plus,
    Trash2,
    Edit,
    Check,
    X,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Clock,
    BarChart3,
    Layers,
    FileSpreadsheet,
    Upload,
    Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
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
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { formatJalaliDate } from "@/utils/jalali";

// Admin theme colors - Purple/Indigo + Gold
const themeColors = {
    primary: '#4f46e5',
    primaryLight: '#6366f1',
    gold: '#d4af37',
    gradientFull: 'from-[#4f46e5] via-[#6366f1] to-[#4f46e5]',
    gradient: 'from-[#4f46e5] to-[#6366f1]',
};

// Format number with separators
const formatNumber = (num) => {
    if (!num) return '۰';
    return new Intl.NumberFormat('fa-IR').format(num);
};

// Status badge component
const StatusBadge = ({ status }) => {
    const styles = {
        IN_PROGRESS: 'bg-blue-100 text-blue-700 border-blue-200',
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
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("overview");
    const [expandedType, setExpandedType] = useState(null);

    // Fetch admin stats
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ["admin-stats"],
        queryFn: apiService.admin.getStats,
    });

    // Fetch financing types for management
    const { data: financingTypes, isLoading: typesLoading, refetch: refetchTypes } = useQuery({
        queryKey: ["admin-financing-types"],
        queryFn: apiService.admin.financingTypes.list,
    });

    // Fetch all requests
    const { data: allRequests, isLoading: requestsLoading } = useQuery({
        queryKey: ["admin-all-requests"],
        queryFn: () => apiService.admin.getRequests(),
    });

    // Fetch all companies
    const { data: allCompanies, isLoading: companiesLoading } = useQuery({
        queryKey: ["admin-all-companies"],
        queryFn: apiService.admin.getCompanies,
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

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-6 bg-white shadow-sm p-1 rounded-xl">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white rounded-lg">
                        <BarChart3 className="w-4 h-4 ml-2" />
                        نمای کلی
                    </TabsTrigger>
                    <TabsTrigger value="requests" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white rounded-lg">
                        <FileText className="w-4 h-4 ml-2" />
                        درخواست‌ها
                    </TabsTrigger>
                    <TabsTrigger value="companies" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white rounded-lg">
                        <Building2 className="w-4 h-4 ml-2" />
                        شرکت‌ها
                    </TabsTrigger>
                    <TabsTrigger value="financing-types" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white rounded-lg">
                        <Settings className="w-4 h-4 ml-2" />
                        نوع تامین مالی
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard
                            title="شرکت‌ها"
                            value={stats?.stats?.total_companies}
                            icon={Building2}
                            color="bg-blue-500"
                            loading={statsLoading}
                        />
                        <StatCard
                            title="درخواست‌ها"
                            value={stats?.stats?.total_requests}
                            icon={FileText}
                            color="bg-emerald-500"
                            loading={statsLoading}
                        />
                        <StatCard
                            title="مشاوران"
                            value={stats?.stats?.total_consultants}
                            icon={Users}
                            color="bg-purple-500"
                            loading={statsLoading}
                        />
                        <StatCard
                            title="انواع تامین مالی"
                            value={stats?.stats?.total_financing_types}
                            icon={Layers}
                            color="bg-amber-500"
                            loading={statsLoading}
                        />
                    </div>

                    {/* Request Status Distribution */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                                    وضعیت درخواست‌ها
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <RequestStatusRow
                                        label="در حال انجام"
                                        value={stats?.request_stats?.in_progress || 0}
                                        total={stats?.stats?.total_requests || 1}
                                        color="bg-blue-500"
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
                                            <Badge className="bg-amber-100 text-amber-700">
                                                {stats?.request_stats?.pending_consultant || 0}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between text-sm mt-2">
                                            <span className="text-slate-600">در انتظار پلتفرم</span>
                                            <Badge className="bg-indigo-100 text-indigo-700">
                                                {stats?.request_stats?.pending_platform || 0}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Consultants */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Users className="w-5 h-5 text-purple-600" />
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
                                            <div key={c.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                                                        {c.name?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-sm">{c.name}</div>
                                                        <div className="text-xs text-slate-500 dir-ltr text-right">{c.phone_number}</div>
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className="text-xs">
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
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-600" />
                                آخرین درخواست‌ها
                            </CardTitle>
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
                                            className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
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
                </TabsContent>

                {/* Requests Tab */}
                <TabsContent value="requests">
                    <RequestsSection requests={allRequests} loading={requestsLoading} consultants={consultants} />
                </TabsContent>

                {/* Companies Tab */}
                <TabsContent value="companies">
                    <CompaniesSection companies={allCompanies} loading={companiesLoading} />
                </TabsContent>

                {/* Financing Types Tab */}
                <TabsContent value="financing-types">
                    <FinancingTypesSection
                        financingTypes={financingTypes}
                        loading={typesLoading}
                        expandedType={expandedType}
                        setExpandedType={setExpandedType}
                        refetchTypes={refetchTypes}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}

// Stat Card Component
function StatCard({ title, value, icon: Icon, color, loading }) {
    return (
        <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        {loading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="text-2xl font-bold text-slate-800">{formatNumber(value || 0)}</div>
                        )}
                        <div className="text-sm text-slate-500">{title}</div>
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

// Requests Section Component
function RequestsSection({ requests, loading, consultants }) {
    const queryClient = useQueryClient();
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [selectedConsultant, setSelectedConsultant] = useState("");

    const assignMutation = useMutation({
        mutationFn: ({ requestId, consultantId }) =>
            apiService.entities.FinancingRequest.assignConsultant(requestId, consultantId),
        onSuccess: () => {
            queryClient.invalidateQueries(["admin-all-requests"]);
            queryClient.invalidateQueries(["admin-stats"]);
            setAssignDialogOpen(false);
            setSelectedRequest(null);
            setSelectedConsultant("");
        },
    });

    if (loading) {
        return (
            <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-20 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-0 shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    همه درخواست‌ها ({formatNumber(requests?.length || 0)})
                </CardTitle>
            </CardHeader>
            <CardContent>
                {requests?.length > 0 ? (
                    <div className="space-y-3">
                        {requests.map((req) => (
                            <div
                                key={req.id}
                                className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-indigo-600">#{req.id}</span>
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
                                                className="text-indigo-600 border-indigo-200"
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
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-slate-400">
                        هیچ درخواستی ثبت نشده است
                    </div>
                )}

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
            </CardContent>
        </Card>
    );
}

// Companies Section Component
function CompaniesSection({ companies, loading }) {
    if (loading) {
        return (
            <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-20 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-0 shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    همه شرکت‌ها ({formatNumber(companies?.length || 0)})
                </CardTitle>
            </CardHeader>
            <CardContent>
                {companies?.length > 0 ? (
                    <div className="space-y-3">
                        {companies.map((company) => (
                            <div
                                key={company.id}
                                className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">{company.title}</div>
                                        <div className="text-sm text-slate-500">
                                            شناسه ملی: {company.national_id} • مالک: {company.owner_name}
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">
                                            {company.personnel_count} پرسنل • سرمایه: {formatNumber(company.registered_capital)} ریال
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="text-indigo-600 border-indigo-200">
                                        {company.requests_count} درخواست
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-slate-400">
                        هیچ شرکتی ثبت نشده است
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// Financing Types Section Component
function FinancingTypesSection({ financingTypes, loading, expandedType, setExpandedType, refetchTypes }) {
    const queryClient = useQueryClient();
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [createStepDialogOpen, setCreateStepDialogOpen] = useState(false);
    const [selectedFinancingType, setSelectedFinancingType] = useState(null);
    const [selectedStep, setSelectedStep] = useState(null);
    const [createDocDialogOpen, setCreateDocDialogOpen] = useState(false);
    const [createFieldDialogOpen, setCreateFieldDialogOpen] = useState(false);

    // Create financing type form
    const [newType, setNewType] = useState({
        title: '',
        slug: '',
        description: '',
        is_active: true,
    });

    // Create step form
    const [newStep, setNewStep] = useState({
        financing_type: null,
        step_order: 1,
        title: '',
        actor_role: 'COMPANY',
        description: '',
    });

    // Create document config form
    const [newDocConfig, setNewDocConfig] = useState({
        workflow_template: null,
        title: '',
        description: '',
        uploader_role: 'COMPANY',
        allowed_formats: 'pdf',
        is_mandatory: true,
        max_size_mb: 10,
        display_order: 0,
    });

    // Create form field config form
    const [newFieldConfig, setNewFieldConfig] = useState({
        workflow_template: null,
        label: '',
        field_key: '',
        field_type: 'TEXT',
        is_mandatory: true,
        placeholder: '',
        help_text: '',
        sort_order: 0,
        meta_options: {},
    });

    // Mutations
    const createTypeMutation = useMutation({
        mutationFn: apiService.admin.financingTypes.create,
        onSuccess: () => {
            refetchTypes();
            setCreateDialogOpen(false);
            setNewType({ title: '', slug: '', description: '', is_active: true });
        },
    });

    const createStepMutation = useMutation({
        mutationFn: apiService.admin.workflowTemplates.create,
        onSuccess: () => {
            refetchTypes();
            setCreateStepDialogOpen(false);
            setNewStep({ financing_type: null, step_order: 1, title: '', actor_role: 'COMPANY', description: '' });
        },
    });

    const createDocMutation = useMutation({
        mutationFn: apiService.admin.documentConfigs.create,
        onSuccess: () => {
            refetchTypes();
            setCreateDocDialogOpen(false);
            setNewDocConfig({
                workflow_template: null, title: '', description: '',
                uploader_role: 'COMPANY', allowed_formats: 'pdf',
                is_mandatory: true, max_size_mb: 10, display_order: 0,
            });
        },
    });

    const createFieldMutation = useMutation({
        mutationFn: apiService.admin.formFieldConfigs.create,
        onSuccess: () => {
            refetchTypes();
            setCreateFieldDialogOpen(false);
            setNewFieldConfig({
                workflow_template: null, label: '', field_key: '',
                field_type: 'TEXT', is_mandatory: true, placeholder: '',
                help_text: '', sort_order: 0, meta_options: {},
            });
        },
    });

    const deleteStepMutation = useMutation({
        mutationFn: apiService.admin.workflowTemplates.delete,
        onSuccess: refetchTypes,
    });

    const deleteDocMutation = useMutation({
        mutationFn: apiService.admin.documentConfigs.delete,
        onSuccess: refetchTypes,
    });

    const deleteFieldMutation = useMutation({
        mutationFn: apiService.admin.formFieldConfigs.delete,
        onSuccess: refetchTypes,
    });

    if (loading) {
        return (
            <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-24 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-amber-600" />
                        انواع تامین مالی ({formatNumber(financingTypes?.length || 0)})
                    </CardTitle>
                    <Button
                        className={`bg-gradient-to-l ${themeColors.gradient}`}
                        onClick={() => setCreateDialogOpen(true)}
                    >
                        <Plus className="w-4 h-4 ml-2" />
                        نوع جدید
                    </Button>
                </CardHeader>
                <CardContent>
                    {financingTypes?.length > 0 ? (
                        <div className="space-y-4">
                            {financingTypes.map((type) => (
                                <div key={type.id} className="border border-slate-200 rounded-xl overflow-hidden">
                                    {/* Type Header */}
                                    <div
                                        className="p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                                        onClick={() => setExpandedType(expandedType === type.id ? null : type.id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${themeColors.gradient} flex items-center justify-center`}>
                                                    <Layers className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="font-medium flex items-center gap-2">
                                                        {type.title}
                                                        {type.is_active ? (
                                                            <Badge className="bg-emerald-100 text-emerald-700 text-xs">فعال</Badge>
                                                        ) : (
                                                            <Badge className="bg-slate-100 text-slate-700 text-xs">غیرفعال</Badge>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-slate-500">
                                                        {type.workflow_count} مرحله • slug: {type.slug}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedFinancingType(type);
                                                        setNewStep({
                                                            ...newStep,
                                                            financing_type: type.id,
                                                            step_order: (type.workflow_templates?.length || 0) + 1,
                                                        });
                                                        setCreateStepDialogOpen(true);
                                                    }}
                                                >
                                                    <Plus className="w-4 h-4 ml-1" />
                                                    مرحله جدید
                                                </Button>
                                                {expandedType === type.id ? (
                                                    <ChevronUp className="w-5 h-5 text-slate-400" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-slate-400" />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Content - Steps */}
                                    <AnimatePresence>
                                        {expandedType === type.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-4 border-t border-slate-200 space-y-4">
                                                    {type.workflow_templates?.length > 0 ? (
                                                        type.workflow_templates.map((step) => (
                                                            <StepCard
                                                                key={step.id}
                                                                step={step}
                                                                onAddDoc={() => {
                                                                    setSelectedStep(step);
                                                                    setNewDocConfig({
                                                                        ...newDocConfig,
                                                                        workflow_template: step.id,
                                                                        display_order: (step.document_configs?.length || 0) + 1,
                                                                    });
                                                                    setCreateDocDialogOpen(true);
                                                                }}
                                                                onAddField={() => {
                                                                    setSelectedStep(step);
                                                                    setNewFieldConfig({
                                                                        ...newFieldConfig,
                                                                        workflow_template: step.id,
                                                                        sort_order: (step.form_field_configs?.length || 0) + 1,
                                                                    });
                                                                    setCreateFieldDialogOpen(true);
                                                                }}
                                                                onDeleteStep={() => deleteStepMutation.mutate(step.id)}
                                                                onDeleteDoc={(id) => deleteDocMutation.mutate(id)}
                                                                onDeleteField={(id) => deleteFieldMutation.mutate(id)}
                                                            />
                                                        ))
                                                    ) : (
                                                        <div className="text-center py-8 text-slate-400">
                                                            هیچ مرحله‌ای تعریف نشده است
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-400">
                            هیچ نوع تامین مالی تعریف نشده است
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Create Financing Type Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>ایجاد نوع تامین مالی جدید</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label>عنوان</Label>
                            <Input
                                value={newType.title}
                                onChange={(e) => setNewType({ ...newType, title: e.target.value })}
                                placeholder="مثال: اوراق مرابحه"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label>شناسه (slug)</Label>
                            <Input
                                value={newType.slug}
                                onChange={(e) => setNewType({ ...newType, slug: e.target.value })}
                                placeholder="مثال: murabaha"
                                className="mt-1 dir-ltr text-left"
                            />
                        </div>
                        <div>
                            <Label>توضیحات</Label>
                            <Textarea
                                value={newType.description}
                                onChange={(e) => setNewType({ ...newType, description: e.target.value })}
                                placeholder="توضیحات مختصر..."
                                className="mt-1"
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                            انصراف
                        </Button>
                        <Button
                            className={`bg-gradient-to-l ${themeColors.gradient}`}
                            onClick={() => createTypeMutation.mutate(newType)}
                            disabled={!newType.title || !newType.slug || createTypeMutation.isPending}
                        >
                            {createTypeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "ایجاد"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Step Dialog */}
            <Dialog open={createStepDialogOpen} onOpenChange={setCreateStepDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>افزودن مرحله جدید</DialogTitle>
                        <DialogDescription>{selectedFinancingType?.title}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>ترتیب مرحله</Label>
                                <Input
                                    type="number"
                                    value={newStep.step_order}
                                    onChange={(e) => setNewStep({ ...newStep, step_order: parseInt(e.target.value) || 1 })}
                                    min={1}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label>مسئول انجام</Label>
                                <Select
                                    value={newStep.actor_role}
                                    onValueChange={(v) => setNewStep({ ...newStep, actor_role: v })}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="COMPANY">شرکت</SelectItem>
                                        <SelectItem value="CONSULTANT">مشاور</SelectItem>
                                        <SelectItem value="PLATFORM">پلتفرم</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <Label>عنوان مرحله</Label>
                            <Input
                                value={newStep.title}
                                onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
                                placeholder="مثال: ارسال مدارک مالی"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label>توضیحات</Label>
                            <Textarea
                                value={newStep.description}
                                onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                                placeholder="توضیحات مرحله..."
                                className="mt-1"
                                rows={2}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateStepDialogOpen(false)}>
                            انصراف
                        </Button>
                        <Button
                            className={`bg-gradient-to-l ${themeColors.gradient}`}
                            onClick={() => createStepMutation.mutate(newStep)}
                            disabled={!newStep.title || createStepMutation.isPending}
                        >
                            {createStepMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "افزودن"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Document Config Dialog */}
            <Dialog open={createDocDialogOpen} onOpenChange={setCreateDocDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>افزودن مدرک جدید</DialogTitle>
                        <DialogDescription>{selectedStep?.title}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label>عنوان مدرک</Label>
                            <Input
                                value={newDocConfig.title}
                                onChange={(e) => setNewDocConfig({ ...newDocConfig, title: e.target.value })}
                                placeholder="مثال: صورت‌های مالی"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label>مسئول آپلود</Label>
                            <Select
                                value={newDocConfig.uploader_role}
                                onValueChange={(v) => setNewDocConfig({ ...newDocConfig, uploader_role: v })}
                            >
                                <SelectTrigger className="mt-1">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="COMPANY">شرکت</SelectItem>
                                    <SelectItem value="CONSULTANT">مشاور</SelectItem>
                                    <SelectItem value="PLATFORM">پلتفرم</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>فرمت‌های مجاز</Label>
                                <Input
                                    value={newDocConfig.allowed_formats}
                                    onChange={(e) => setNewDocConfig({ ...newDocConfig, allowed_formats: e.target.value })}
                                    placeholder="pdf,jpg"
                                    className="mt-1 dir-ltr text-left"
                                />
                            </div>
                            <div>
                                <Label>حداکثر حجم (MB)</Label>
                                <Input
                                    type="number"
                                    value={newDocConfig.max_size_mb}
                                    onChange={(e) => setNewDocConfig({ ...newDocConfig, max_size_mb: parseInt(e.target.value) || 10 })}
                                    min={1}
                                    className="mt-1"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_mandatory"
                                checked={newDocConfig.is_mandatory}
                                onChange={(e) => setNewDocConfig({ ...newDocConfig, is_mandatory: e.target.checked })}
                                className="rounded"
                            />
                            <Label htmlFor="is_mandatory">الزامی</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateDocDialogOpen(false)}>
                            انصراف
                        </Button>
                        <Button
                            className={`bg-gradient-to-l ${themeColors.gradient}`}
                            onClick={() => createDocMutation.mutate(newDocConfig)}
                            disabled={!newDocConfig.title || createDocMutation.isPending}
                        >
                            {createDocMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "افزودن"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Form Field Config Dialog */}
            <Dialog open={createFieldDialogOpen} onOpenChange={setCreateFieldDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>افزودن فیلد فرم جدید</DialogTitle>
                        <DialogDescription>{selectedStep?.title}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>عنوان فیلد</Label>
                                <Input
                                    value={newFieldConfig.label}
                                    onChange={(e) => setNewFieldConfig({ ...newFieldConfig, label: e.target.value })}
                                    placeholder="مثال: نام پروژه"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label>کلید فیلد</Label>
                                <Input
                                    value={newFieldConfig.field_key}
                                    onChange={(e) => setNewFieldConfig({ ...newFieldConfig, field_key: e.target.value })}
                                    placeholder="project_name"
                                    className="mt-1 dir-ltr text-left"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>نوع فیلد</Label>
                                <Select
                                    value={newFieldConfig.field_type}
                                    onValueChange={(v) => setNewFieldConfig({ ...newFieldConfig, field_type: v })}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="TEXT">متن کوتاه</SelectItem>
                                        <SelectItem value="TEXTAREA">متن بلند</SelectItem>
                                        <SelectItem value="NUMBER">عدد</SelectItem>
                                        <SelectItem value="DATE">تاریخ</SelectItem>
                                        <SelectItem value="SELECT">انتخابی</SelectItem>
                                        <SelectItem value="DATA_GRID">جدول داده</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>ترتیب نمایش</Label>
                                <Input
                                    type="number"
                                    value={newFieldConfig.sort_order}
                                    onChange={(e) => setNewFieldConfig({ ...newFieldConfig, sort_order: parseInt(e.target.value) || 0 })}
                                    min={0}
                                    className="mt-1"
                                />
                            </div>
                        </div>
                        <div>
                            <Label>متن راهنما (Placeholder)</Label>
                            <Input
                                value={newFieldConfig.placeholder}
                                onChange={(e) => setNewFieldConfig({ ...newFieldConfig, placeholder: e.target.value })}
                                placeholder="متنی که در فیلد خالی نمایش داده می‌شود"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label>توضیحات کمکی</Label>
                            <Input
                                value={newFieldConfig.help_text}
                                onChange={(e) => setNewFieldConfig({ ...newFieldConfig, help_text: e.target.value })}
                                placeholder="توضیحاتی که زیر فیلد نمایش داده می‌شود"
                                className="mt-1"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="field_mandatory"
                                checked={newFieldConfig.is_mandatory}
                                onChange={(e) => setNewFieldConfig({ ...newFieldConfig, is_mandatory: e.target.checked })}
                                className="rounded"
                            />
                            <Label htmlFor="field_mandatory">الزامی</Label>
                        </div>
                        {/* Meta options for SELECT and DATA_GRID */}
                        {(newFieldConfig.field_type === 'SELECT' || newFieldConfig.field_type === 'DATA_GRID') && (
                            <div>
                                <Label>تنظیمات پیشرفته (JSON)</Label>
                                <Textarea
                                    value={JSON.stringify(newFieldConfig.meta_options, null, 2)}
                                    onChange={(e) => {
                                        try {
                                            setNewFieldConfig({ ...newFieldConfig, meta_options: JSON.parse(e.target.value) });
                                        } catch { }
                                    }}
                                    placeholder={newFieldConfig.field_type === 'SELECT'
                                        ? '{"options": [{"value": "1", "label": "گزینه ۱"}]}'
                                        : '{"columns": [{"key": "name", "label": "نام", "type": "text"}], "min_rows": 1}'
                                    }
                                    className="mt-1 dir-ltr text-left font-mono text-sm"
                                    rows={4}
                                />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateFieldDialogOpen(false)}>
                            انصراف
                        </Button>
                        <Button
                            className={`bg-gradient-to-l ${themeColors.gradient}`}
                            onClick={() => createFieldMutation.mutate(newFieldConfig)}
                            disabled={!newFieldConfig.label || !newFieldConfig.field_key || createFieldMutation.isPending}
                        >
                            {createFieldMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "افزودن"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

// Step Card Component
function StepCard({ step, onAddDoc, onAddField, onDeleteStep, onDeleteDoc, onDeleteField }) {
    const [expanded, setExpanded] = useState(false);

    const actorStyles = {
        COMPANY: 'bg-blue-100 text-blue-700',
        CONSULTANT: 'bg-purple-100 text-purple-700',
        PLATFORM: 'bg-slate-100 text-slate-700',
    };

    return (
        <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div
                className="p-3 bg-white cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                            {step.step_order}
                        </div>
                        <div>
                            <div className="font-medium text-sm">{step.title}</div>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge className={`${actorStyles[step.actor_role]} text-xs`}>
                                    {step.actor_role_display}
                                </Badge>
                                <span className="text-xs text-slate-400">
                                    {step.document_configs?.length || 0} مدرک • {step.form_field_configs?.length || 0} فیلد
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:bg-red-50 h-8 w-8 p-0"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('آیا از حذف این مرحله مطمئن هستید؟')) {
                                    onDeleteStep();
                                }
                            }}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                        {expanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-4">
                            {/* Document Configs */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <Label className="text-xs font-medium text-slate-600 flex items-center gap-1">
                                        <Upload className="w-3 h-3" />
                                        مدارک مورد نیاز
                                    </Label>
                                    <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={onAddDoc}>
                                        <Plus className="w-3 h-3 ml-1" />
                                        افزودن
                                    </Button>
                                </div>
                                {step.document_configs?.length > 0 ? (
                                    <div className="space-y-1">
                                        {step.document_configs.map((doc) => (
                                            <div key={doc.id} className="flex items-center justify-between p-2 bg-white rounded text-xs">
                                                <div className="flex items-center gap-2">
                                                    <span>{doc.title}</span>
                                                    <Badge variant="outline" className="text-xs">{doc.uploader_role_display}</Badge>
                                                    {doc.is_mandatory && <Badge className="bg-red-100 text-red-700 text-xs">الزامی</Badge>}
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-6 w-6 p-0 text-red-500"
                                                    onClick={() => onDeleteDoc(doc.id)}
                                                >
                                                    <X className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-xs text-slate-400 text-center py-2">بدون مدرک</div>
                                )}
                            </div>

                            {/* Form Field Configs */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <Label className="text-xs font-medium text-slate-600 flex items-center gap-1">
                                        <FileSpreadsheet className="w-3 h-3" />
                                        فیلدهای فرم
                                    </Label>
                                    <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={onAddField}>
                                        <Plus className="w-3 h-3 ml-1" />
                                        افزودن
                                    </Button>
                                </div>
                                {step.form_field_configs?.length > 0 ? (
                                    <div className="space-y-1">
                                        {step.form_field_configs.map((field) => (
                                            <div key={field.id} className="flex items-center justify-between p-2 bg-white rounded text-xs">
                                                <div className="flex items-center gap-2">
                                                    <span>{field.label}</span>
                                                    <Badge variant="outline" className="text-xs">{field.field_type_display}</Badge>
                                                    {field.is_mandatory && <Badge className="bg-red-100 text-red-700 text-xs">الزامی</Badge>}
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-6 w-6 p-0 text-red-500"
                                                    onClick={() => onDeleteField(field.id)}
                                                >
                                                    <X className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-xs text-slate-400 text-center py-2">بدون فیلد</div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

