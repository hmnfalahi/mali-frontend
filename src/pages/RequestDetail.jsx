import React, { useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { apiService } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    FileText,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ArrowRight,
    Upload,
    Send,
    Loader2,
    X,
    Download,
    Trash2,
    MessageSquare,
    ChevronDown,
    ChevronUp,
    Building2,
    User,
    Settings,
    Check,
    RotateCcw,
    File,
    FileImage,
    FileSpreadsheet
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { formatJalaliDate } from "@/utils/jalali";

// Theme colors - Dynamic based on user role
const getThemeColors = (isConsultantView) => ({
    // Consultant: Teal | Company: Petroleum Blue
    primary: isConsultantView ? '#0f766e' : '#1e3a5f',
    primaryLight: isConsultantView ? '#14b8a6' : '#2d5a8a',
    gold: '#d4af37',
    goldLight: '#e8c963',
    // Gradient classes
    headerGradient: isConsultantView 
        ? 'from-[#0f766e] via-[#14b8a6] to-[#0f766e]' 
        : 'from-[#1e3a5f] via-[#2d5a8a] to-[#1e3a5f]',
    iconGradient: isConsultantView
        ? 'from-[#0f766e] to-[#14b8a6]'
        : 'from-[#1e3a5f] to-[#2d5a8a]',
    stepGradient: isConsultantView
        ? 'from-[#0f766e] to-[#14b8a6]'
        : 'from-[#1e3a5f] to-[#2d5a8a]',
    progressGradient: isConsultantView
        ? 'from-[#d4af37] to-[#0f766e]'
        : 'from-[#d4af37] to-[#1e3a5f]',
    textAccent: isConsultantView ? 'text-teal-200' : 'text-blue-200',
});

// Status config for request status - Dynamic based on user role
const getRequestStatusConfig = (isConsultantView) => ({
    "IN_PROGRESS": { 
        label: "در حال انجام", 
        color: isConsultantView 
            ? "bg-[#0f766e]/10 text-[#0f766e] border-[#0f766e]/30" 
            : "bg-[#1e3a5f]/10 text-[#1e3a5f] border-[#1e3a5f]/30", 
        icon: Clock 
    },
    "APPROVED": { label: "تأیید شده", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
    "REJECTED": { label: "رد شده", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
    "CANCELED": { label: "لغو شده", color: "bg-gray-100 text-gray-700 border-gray-200", icon: XCircle },
});

// Status config for activity status - Dynamic based on user role
const getActivityStatusConfig = (isConsultantView) => ({
    "PENDING": { label: "در انتظار", color: "bg-slate-100 text-slate-600 border-slate-200", icon: Clock },
    "ACTION_REQUIRED": { label: "نیاز به اقدام", color: "bg-[#d4af37]/20 text-[#b8962d] border-[#d4af37]/40", icon: AlertCircle },
    "REVIEWING": { 
        label: "در حال بررسی", 
        color: isConsultantView 
            ? "bg-[#0f766e]/10 text-[#0f766e] border-[#0f766e]/30" 
            : "bg-[#1e3a5f]/10 text-[#1e3a5f] border-[#1e3a5f]/30", 
        icon: Clock 
    },
    "COMPLETED": { label: "تکمیل شده", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
    "REJECTED": { label: "رد شده", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
});

// Actor role icons
const actorIcons = {
    "COMPANY": Building2,
    "CONSULTANT": User,
    "PLATFORM": Settings,
};

const actorLabels = {
    "COMPANY": "شرکت",
    "CONSULTANT": "مشاور",
    "PLATFORM": "پلتفرم",
};

// Get file icon based on type
const getFileIcon = (fileType) => {
    if (!fileType) return File;
    const type = fileType.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(type)) return FileImage;
    if (['xls', 'xlsx', 'csv'].includes(type)) return FileSpreadsheet;
    return FileText;
};

// Uploader role labels
const uploaderRoleLabels = {
    "COMPANY": "شرکت",
    "CONSULTANT": "مشاور",
    "PLATFORM": "پلتفرم",
};

// Document Upload Card Component - Handles bidirectional document flow
function DocumentUploadCard({ 
    config, 
    isUploaded, 
    documentId, 
    documentFile,
    fileName,
    onUpload, 
    onDelete,
    isUploading,
    userRole,
    activityStatus,
    isCurrentStep,
    isConsultantView = false
}) {
    const fileInputRef = useRef(null);
    const FileIcon = isUploaded ? getFileIcon(documentFile?.split('.').pop()) : Upload;
    
    // Determine if user can upload this document
    // User can upload if their role matches the uploader_role
    const isUploader = (
        (userRole === 'COMPANY' && config.uploader_role === 'COMPANY') ||
        ((userRole === 'CONSULTANT' || userRole === 'ADMIN') && config.uploader_role === 'CONSULTANT') ||
        (userRole === 'ADMIN' && config.uploader_role === 'PLATFORM')
    );
    
    // Can edit if: current step, is uploader, and activity is in right status
    const canEdit = isCurrentStep && isUploader && ['ACTION_REQUIRED', 'REVIEWING', 'PENDING'].includes(activityStatus);
    
    // Can download if file is uploaded
    const canDownload = isUploaded && documentFile;

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            onUpload(config.config_id, file);
            e.target.value = "";
        }
    };

    // Determine the visual style based on uploader role
    const getRoleBadgeStyle = () => {
        switch (config.uploader_role) {
            case 'COMPANY':
                return 'bg-[#1e3a5f]/10 text-[#1e3a5f] border-[#1e3a5f]/30';
            case 'CONSULTANT':
                return 'bg-[#d4af37]/15 text-[#b8962d] border-[#d4af37]/40';
            case 'PLATFORM':
                return 'bg-slate-50 text-slate-600 border-slate-200';
            default:
                return 'bg-slate-50 text-slate-600 border-slate-200';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative rounded-xl border-2 transition-all ${
                isUploaded 
                    ? 'border-emerald-200 bg-emerald-50/50' 
                    : config.is_mandatory && isUploader
                        ? 'border-amber-200 bg-amber-50/50'
                        : 'border-slate-200 bg-slate-50/50'
            }`}
        >
            <div className="p-4">
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        isUploaded 
                            ? 'bg-emerald-500 text-white' 
                            : config.is_mandatory && isUploader
                                ? 'bg-amber-100 text-amber-600'
                                : 'bg-slate-100 text-slate-400'
                    }`}>
                        <FileIcon className="w-6 h-6" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2 mb-1">
                            <h5 className="font-medium text-slate-800 truncate">
                                {config.title}
                            </h5>
                            {/* Uploader role badge */}
                            <Badge variant="outline" className={`text-xs shrink-0 ${getRoleBadgeStyle()}`}>
                                آپلود: {uploaderRoleLabels[config.uploader_role]}
                            </Badge>
                            {config.is_mandatory && (
                                <Badge variant="outline" className="text-xs bg-amber-100 text-amber-700 border-amber-200 shrink-0">
                                    الزامی
                                </Badge>
                            )}
                            {isUploaded && (
                                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs shrink-0">
                                    <Check className="w-3 h-3 ml-1" />
                                    آپلود شده
                                </Badge>
                            )}
                        </div>
                        
                        {config.description && (
                            <p className="text-xs text-slate-500 mb-2">{config.description}</p>
                        )}

                        {/* File Info - Only show for uploaders */}
                        {isUploader && (
                            <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                                <span>فرمت‌ها: {config.allowed_formats.join(', ')}</span>
                                <span>•</span>
                                <span>حداکثر: {config.max_size_mb} مگابایت</span>
                            </div>
                        )}

                        {/* Waiting message for non-uploaders when file not uploaded */}
                        {!isUploaded && !isUploader && (
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                                <Clock className="w-3 h-3" />
                                <span>در انتظار آپلود توسط {uploaderRoleLabels[config.uploader_role]}</span>
                            </div>
                        )}

                        {/* Uploaded File Display */}
                        {canDownload && (
                            <div className="mt-3 flex items-center gap-2 bg-white p-2 rounded-lg border border-emerald-100">
                                <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span className="text-sm text-slate-700 truncate flex-1">
                                    {fileName || documentFile?.split('/').pop()}
                                </span>
                                <a
                                    href={documentFile}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 hover:bg-emerald-100 rounded-lg transition-colors shrink-0"
                                    title="دانلود"
                                >
                                    <Download className="w-4 h-4 text-emerald-600" />
                                </a>
                                {canEdit && (
                                    <button
                                        onClick={() => onDelete(documentId)}
                                        className="p-1.5 hover:bg-red-100 rounded-lg transition-colors shrink-0"
                                        title="حذف"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Upload Button - Only for uploaders */}
                    {canEdit && (
                        <div className="shrink-0">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={config.allowed_formats.map(f => `.${f}`).join(',')}
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <Button
                                size="sm"
                                variant={isUploaded ? "outline" : "default"}
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className={isUploaded 
                                    ? "border-emerald-300 text-emerald-700 hover:bg-emerald-50" 
                                    : isConsultantView
                                        ? "bg-gradient-to-l from-[#0f766e] to-[#14b8a6]"
                                        : "bg-gradient-to-l from-[#1e3a5f] to-[#2d5a8a]"
                                }
                            >
                                {isUploading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4 ml-1" />
                                        {isUploaded ? "جایگزینی" : "آپلود"}
                                    </>
                                )}
                            </Button>
                        </div>
                    )}

                    {/* Download button for non-uploaders when file is available */}
                    {!isUploader && canDownload && (
                        <div className="shrink-0">
                            <a
                                href={documentFile}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                                >
                                    <Download className="w-4 h-4 ml-1" />
                                    دانلود
                                </Button>
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default function RequestDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isConsultant, isAdmin, isCompany } = useAuth();
    const queryClient = useQueryClient();
    const fileInputRef = useRef(null);
    
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [expandedActivity, setExpandedActivity] = useState(null);
    const [showActionModal, setShowActionModal] = useState(null); // 'reject' | 'revision' | null
    const [actionNotes, setActionNotes] = useState("");
    const [rejectionReason, setRejectionReason] = useState("");
    const [uploadingConfigId, setUploadingConfigId] = useState(null);
    const [fileDescription, setFileDescription] = useState("");

    // Fetch request detail
    const { data: request, isLoading, refetch } = useQuery({
        queryKey: ["financing-request", id],
        queryFn: async () => {
            return await apiService.entities.FinancingRequest.get(id);
        },
        enabled: !!id && !!user,
    });

    // Submit activity mutation (for company)
    const submitMutation = useMutation({
        mutationFn: async ({ requestId, activityId }) => {
            return await apiService.entities.FinancingRequest.submitActivity(requestId, activityId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["financing-request", id]);
            setSuccessMessage("مرحله با موفقیت ارسال شد");
            setTimeout(() => setSuccessMessage(null), 3000);
        },
        onError: (err) => {
            setError(err.response?.data?.detail || "خطا در ارسال مرحله");
        }
    });

    // Complete activity mutation (for consultant)
    const completeMutation = useMutation({
        mutationFn: async ({ requestId, activityId }) => {
            return await apiService.entities.FinancingRequest.completeActivity(requestId, activityId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["financing-request", id]);
            setSuccessMessage("مرحله با موفقیت تکمیل شد");
            setTimeout(() => setSuccessMessage(null), 3000);
        },
        onError: (err) => {
            setError(err.response?.data?.detail || "خطا در تکمیل مرحله");
        }
    });

    // Reject activity mutation
    const rejectMutation = useMutation({
        mutationFn: async ({ requestId, activityId, reason, notes }) => {
            return await apiService.entities.FinancingRequest.rejectActivity(requestId, activityId, reason, notes);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["financing-request", id]);
            setShowActionModal(null);
            setRejectionReason("");
            setActionNotes("");
            setSuccessMessage("درخواست رد شد");
            setTimeout(() => setSuccessMessage(null), 3000);
        },
        onError: (err) => {
            setError(err.response?.data?.detail || "خطا در رد درخواست");
        }
    });

    // Revision activity mutation
    const revisionMutation = useMutation({
        mutationFn: async ({ requestId, activityId, notes }) => {
            return await apiService.entities.FinancingRequest.revisionActivity(requestId, activityId, notes);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["financing-request", id]);
            setShowActionModal(null);
            setActionNotes("");
            setSuccessMessage("درخواست اصلاح ارسال شد");
            setTimeout(() => setSuccessMessage(null), 3000);
        },
        onError: (err) => {
            setError(err.response?.data?.detail || "خطا در درخواست اصلاح");
        }
    });

    // Upload document mutation
    const uploadMutation = useMutation({
        mutationFn: async ({ requestId, activityId, file, description, documentConfigId }) => {
            return await apiService.entities.FinancingRequest.uploadDocument(
                requestId, activityId, file, description, documentConfigId
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["financing-request", id]);
            setFileDescription("");
            setUploadingConfigId(null);
            setSuccessMessage("فایل با موفقیت آپلود شد");
            setTimeout(() => setSuccessMessage(null), 3000);
        },
        onError: (err) => {
            setUploadingConfigId(null);
            setError(err.response?.data?.detail || "خطا در آپلود فایل");
        }
    });

    // Delete document mutation
    const deleteDocMutation = useMutation({
        mutationFn: async ({ requestId, documentId }) => {
            return await apiService.entities.FinancingRequest.deleteDocument(requestId, documentId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["financing-request", id]);
            setSuccessMessage("فایل با موفقیت حذف شد");
            setTimeout(() => setSuccessMessage(null), 3000);
        },
        onError: (err) => {
            setError(err.response?.data?.detail || "خطا در حذف فایل");
        }
    });

    // Cancel request mutation
    const cancelMutation = useMutation({
        mutationFn: async (requestId) => {
            return await apiService.entities.FinancingRequest.cancel(requestId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["financing-request", id]);
            setSuccessMessage("درخواست لغو شد");
            setTimeout(() => setSuccessMessage(null), 3000);
        },
        onError: (err) => {
            setError(err.response?.data?.detail || "خطا در لغو درخواست");
        }
    });

    // Handle file upload for a specific document config
    const handleConfigUpload = async (configId, file, activityId) => {
        setUploadingConfigId(configId);
        try {
            await uploadMutation.mutateAsync({
                requestId: id,
                activityId,
                file,
                description: null,
                documentConfigId: configId
            });
        } catch (e) {
            // Error handled by mutation
        }
    };

    const handleSubmit = (activityId) => {
        submitMutation.mutate({ requestId: id, activityId });
    };

    const handleComplete = (activityId) => {
        completeMutation.mutate({ requestId: id, activityId });
    };

    const handleReject = (activityId) => {
        if (!rejectionReason.trim()) {
            setError("لطفاً دلیل رد را وارد کنید");
            return;
        }
        rejectMutation.mutate({
            requestId: id,
            activityId,
            reason: rejectionReason,
            notes: actionNotes
        });
    };

    const handleRevision = (activityId) => {
        if (!actionNotes.trim()) {
            setError("لطفاً توضیحات اصلاحات مورد نیاز را وارد کنید");
            return;
        }
        revisionMutation.mutate({
            requestId: id,
            activityId,
            notes: actionNotes
        });
    };

    const handleDeleteDocument = (documentId) => {
        deleteDocMutation.mutate({ requestId: id, documentId });
    };

    // Get current activity
    const currentActivity = request?.activities?.find(
        a => a.step_template_detail?.step_order === request.current_step_order
    );

    // Get theme colors based on user role
    const themeColors = getThemeColors(isConsultant || isAdmin);
    const requestStatusConfig = getRequestStatusConfig(isConsultant || isAdmin);
    const activityStatusConfig = getActivityStatusConfig(isConsultant || isAdmin);

    // Check if current user can act on current activity
    const canAct = () => {
        if (!currentActivity || !user) return false;
        
        const actorRole = currentActivity.step_template_detail?.actor_role;
        const status = currentActivity.status;
        
        // Company can act on COMPANY steps when ACTION_REQUIRED
        if (isCompany && actorRole === "COMPANY" && status === "ACTION_REQUIRED") {
            return true;
        }
        
        // Consultant/Admin can act on CONSULTANT/PLATFORM steps when REVIEWING or PENDING
        if ((isConsultant || isAdmin) && 
            (actorRole === "CONSULTANT" || actorRole === "PLATFORM") && 
            (status === "REVIEWING" || status === "PENDING")) {
            return true;
        }
        
        // Consultant/Admin can also review COMPANY steps when they're in REVIEWING status
        if ((isConsultant || isAdmin) && actorRole === "COMPANY" && status === "REVIEWING") {
            return true;
        }
        
        return false;
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <Skeleton className="h-48 w-full rounded-2xl" />
                <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
        );
    }

    if (!request) {
        return (
            <div className="max-w-4xl mx-auto text-center py-16">
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-10 h-10 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-3">درخواست یافت نشد</h2>
                <Button onClick={() => navigate(-1)} variant="outline">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    بازگشت
                </Button>
            </div>
        );
    }

    const statusInfo = requestStatusConfig[request.status] || requestStatusConfig["IN_PROGRESS"];
    const StatusIcon = statusInfo.icon;
    const totalSteps = request.financing_type_detail?.workflow_templates?.length || 0;
    const completedSteps = request.activities?.filter(a => a.status === "COMPLETED").length || 0;
    const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
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

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Card className="border-0 shadow-lg overflow-hidden">
                    <div className={`bg-gradient-to-l ${themeColors.headerGradient} p-6 text-white`}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => navigate(-1)}
                                        className="text-white/70 hover:text-white hover:bg-white/10 -mr-2"
                                    >
                                        <ArrowRight className="w-4 h-4 ml-1" />
                                        بازگشت
                                    </Button>
                                </div>
                                <h1 className="text-xl md:text-2xl font-bold">
                                    {request.financing_type_detail?.title || "درخواست تأمین مالی"}
                                </h1>
                                <p className={`${themeColors.textAccent} text-sm mt-1`}>
                                    شناسه درخواست: {request.id} | {formatJalaliDate(request.created_at)}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge className={`${statusInfo.color} border text-sm px-3 py-1`}>
                                    <StatusIcon className="w-4 h-4 ml-1" />
                                    {statusInfo.label}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    
                    <CardContent className="p-6">
                        {/* Progress Bar */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-slate-600">پیشرفت کار</span>
                                <span className="text-sm font-medium text-slate-800">
                                    {completedSteps} از {totalSteps} مرحله
                                </span>
                            </div>
                                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className={`h-full bg-gradient-to-l ${themeColors.progressGradient} rounded-full`}
                                />
                                            </div>
                        </div>

                        {/* Request Info */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl">
                            <div>
                                <p className="text-xs text-slate-400 mb-1">مبلغ درخواستی</p>
                                <p className="font-bold text-slate-800">
                                    {request.requested_amount 
                                        ? new Intl.NumberFormat("fa-IR").format(request.requested_amount)
                                        : "-"
                                    } <span className="text-xs font-normal text-slate-400">ریال</span>
                                </p>
                            </div>
                            {request.approved_amount && (
                                <div>
                                    <p className="text-xs text-slate-400 mb-1">مبلغ تأیید شده</p>
                                    <p className="font-bold text-emerald-600">
                                        {new Intl.NumberFormat("fa-IR").format(request.approved_amount)}
                                        <span className="text-xs font-normal text-slate-400"> ریال</span>
                                    </p>
                                </div>
                            )}
                            <div>
                                <p className="text-xs text-slate-400 mb-1">مرحله فعلی</p>
                                <p className="font-medium text-slate-800">{request.current_step_order} از {totalSteps}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 mb-1">هدف</p>
                                <p className="font-medium text-slate-800 truncate">{request.purpose || "-"}</p>
                            </div>
                        </div>

                        {/* Rejection Reason */}
                        {request.rejection_reason && (
                            <div className="mt-4 bg-red-50 border border-red-200 p-4 rounded-xl">
                                <p className="text-xs text-red-600 font-medium mb-1">دلیل رد درخواست:</p>
                                <p className="text-sm text-red-700">{request.rejection_reason}</p>
                            </div>
                        )}

                        {/* Cancel Button for Company */}
                        {isCompany && request.status === "IN_PROGRESS" && (
                            <div className="mt-4 flex justify-end">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => cancelMutation.mutate(id)}
                                    disabled={cancelMutation.isPending}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    {cancelMutation.isPending ? (
                                        <Loader2 className="w-4 h-4 animate-spin ml-1" />
                                    ) : (
                                        <XCircle className="w-4 h-4 ml-1" />
                                    )}
                                    لغو درخواست
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Workflow Timeline */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card className="border-0 shadow-lg">
                    <CardHeader className="border-b border-slate-100">
                        <CardTitle className="flex items-center gap-3 text-lg text-slate-800">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${themeColors.iconGradient} flex items-center justify-center`}>
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            مراحل کار
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {request.financing_type_detail?.workflow_templates?.map((template, idx) => {
                                const activity = request.activities?.find(
                                    a => a.step_template_detail?.step_order === template.step_order
                                );
                                const activityStatus = activity?.status || "PENDING";
                                const statusInfo = activityStatusConfig[activityStatus];
                                const StatusIcon = statusInfo?.icon || Clock;
                                const ActorIcon = actorIcons[template.actor_role] || User;
                                const isCurrentStep = template.step_order === request.current_step_order;
                                const isExpanded = expandedActivity === template.step_order;
                                const canActOnThis = isCurrentStep && canAct();

                                // Get document upload status from activity
                                const docUploadStatus = activity?.document_upload_status;
                                const hasDocConfigs = docUploadStatus?.total_configs > 0;
                                const allMandatoryUploaded = docUploadStatus?.all_mandatory_uploaded;
                                
                                // Per-role mandatory document status
                                const companyDocsReady = docUploadStatus?.by_role?.COMPANY?.all_mandatory_uploaded ?? true;
                                const consultantDocsReady = docUploadStatus?.by_role?.CONSULTANT?.all_mandatory_uploaded ?? true;
                                const platformDocsReady = docUploadStatus?.by_role?.PLATFORM?.all_mandatory_uploaded ?? true;

                                return (
                                    <motion.div
                                        key={template.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <div 
                                            className={`relative rounded-2xl border-2 transition-all ${
                                                isCurrentStep 
                                                    ? 'border-[#d4af37]/50 bg-[#d4af37]/5 shadow-md shadow-[#d4af37]/20' 
                                                    : activityStatus === "COMPLETED"
                                                        ? 'border-emerald-200 bg-emerald-50/30'
                                                        : 'border-slate-100 bg-white'
                                            }`}
                                        >
                                            {/* Step Header */}
                                            <div 
                                                className="p-4 cursor-pointer"
                                                onClick={() => setExpandedActivity(isExpanded ? null : template.step_order)}
                                            >
                                                <div className="flex items-center gap-4">
                                                    {/* Step Number */}
                                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                                                        activityStatus === "COMPLETED"
                                                            ? 'bg-emerald-500 text-white'
                                                            : isCurrentStep
                                                                ? `bg-gradient-to-br ${themeColors.stepGradient} text-white`
                                                                : 'bg-slate-200 text-slate-500'
                                                    }`}>
                                                        {activityStatus === "COMPLETED" ? (
                                                            <Check className="w-6 h-6" />
                                                        ) : (
                                                            template.step_order
                                                        )}
                                                    </div>

                                                    {/* Step Info */}
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-bold text-slate-800">{template.title}</h4>
                                                                    {isCurrentStep && (
                                                                                <Badge className="bg-gradient-to-l from-[#d4af37] to-[#e8c963] text-slate-900 text-xs font-medium">مرحله فعلی</Badge>
                                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-3 text-sm text-slate-500">
                                                            <span className="flex items-center gap-1">
                                                                <ActorIcon className="w-3 h-3" />
                                                                {actorLabels[template.actor_role]}
                                                            </span>
                                                            {hasDocConfigs && (
                                                                <span className="flex items-center gap-1">
                                                                    <Upload className="w-3 h-3" />
                                                                    {docUploadStatus.uploaded_count}/{docUploadStatus.total_configs} مدرک
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Status Badge */}
                                                    <Badge className={`${statusInfo?.color} border shrink-0`}>
                                                        <StatusIcon className="w-3 h-3 ml-1" />
                                                        {statusInfo?.label}
                                                    </Badge>

                                                    {/* Expand Icon */}
                                                    {isExpanded ? (
                                                        <ChevronUp className="w-5 h-5 text-slate-400" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5 text-slate-400" />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Expanded Content */}
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="px-4 pb-4 border-t border-slate-100 pt-4">
                                                            {/* Description */}
                                                            {template.description && (
                                                                <p className="text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg">
                                                                    {template.description}
                                                                </p>
                                                            )}

                                                            {/* Admin Notes */}
                                                            {activity?.admin_notes && (
                                                                <div className="mb-4 bg-amber-50 border border-amber-200 p-3 rounded-lg">
                                                                    <p className="text-xs text-amber-600 font-medium mb-1 flex items-center gap-1">
                                                                        <MessageSquare className="w-3 h-3" />
                                                                        توضیحات مشاور:
                                                                    </p>
                                                                    <p className="text-sm text-amber-700">{activity.admin_notes}</p>
                                                                </div>
                                                            )}

                                                            {/* Document Configs - Dynamic Upload Section */}
                                                            {hasDocConfigs && (
                                                                <div className="mb-4">
                                                                    <div className="flex items-center justify-between mb-3">
                                                                        <h5 className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                                                            <FileText className="w-4 h-4" />
                                                                            مدارک مورد نیاز
                                                                        </h5>
                                                                        {docUploadStatus.mandatory_count > 0 && (
                                                                            <Badge variant="outline" className={
                                                                                allMandatoryUploaded 
                                                                                    ? "text-emerald-600 border-emerald-200 bg-emerald-50"
                                                                                    : "text-amber-600 border-amber-200 bg-amber-50"
                                                                            }>
                                                                                {docUploadStatus.mandatory_uploaded_count}/{docUploadStatus.mandatory_count} مدرک الزامی
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    <div className="space-y-3">
                                                                        {docUploadStatus.configs.map((config) => {
                                                                            return (
                                                                                <DocumentUploadCard
                                                                                    key={config.config_id}
                                                                                    config={config}
                                                                                    isUploaded={config.is_uploaded}
                                                                                    documentId={config.document_id}
                                                                                    documentFile={config.file_url}
                                                                                    fileName={config.file_name}
                                                                                    onUpload={(configId, file) => handleConfigUpload(configId, file, activity.id)}
                                                                                    onDelete={handleDeleteDocument}
                                                                                    isUploading={uploadingConfigId === config.config_id}
                                                                                    userRole={user?.role}
                                                                                    activityStatus={activityStatus}
                                                                                    isCurrentStep={isCurrentStep}
                                                                                    isConsultantView={isConsultant || isAdmin}
                                                                                />
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Legacy Documents (without config) */}
                                                            {activity?.documents?.filter(d => !d.document_config).length > 0 && (
                                                                <div className="mb-4">
                                                                    <h5 className="text-sm font-medium text-slate-700 mb-2">سایر مدارک:</h5>
                                                                    <div className="space-y-2">
                                                                        {activity.documents.filter(d => !d.document_config).map((doc) => (
                                                                            <div key={doc.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                                                                                <div className="flex items-center gap-2">
                                                                                    <FileText className="w-4 h-4 text-slate-400" />
                                                                                    <div>
                                                                                        <p className="text-sm font-medium text-slate-700">
                                                                                            {doc.file.split('/').pop()}
                                                                                        </p>
                                                                                        {doc.description && (
                                                                                            <p className="text-xs text-slate-500">{doc.description}</p>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex items-center gap-2">
                                                                                    <a
                                                                                        href={doc.file}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                                                                                    >
                                                                                        <Download className="w-4 h-4 text-slate-600" />
                                                                                    </a>
                                                                                    {canActOnThis && isCompany && (
                                                                                        <button
                                                                                            onClick={() => handleDeleteDocument(doc.id)}
                                                                                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                                                                            disabled={deleteDocMutation.isPending}
                                                                                        >
                                                                                            <Trash2 className="w-4 h-4 text-red-600" />
                                                                                        </button>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Action Buttons */}
                                                            {canActOnThis && (
                                                                <div className="space-y-4">
                                                                    {/* Submit Button for Company */}
                                                                    {isCompany && activityStatus === "ACTION_REQUIRED" && (
                                                                        <div>
                                                                            {/* Warning if mandatory company docs missing */}
                                                                            {hasDocConfigs && !companyDocsReady && (
                                                                                <div className="mb-3 bg-amber-50 border border-amber-200 p-3 rounded-lg text-sm text-amber-700 flex items-center gap-2">
                                                                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                                                                    لطفاً ابتدا مدارک الزامی خود را آپلود کنید.
                                                                                </div>
                                                                            )}
                                                                            <Button
                                                                                onClick={() => handleSubmit(activity.id)}
                                                                                disabled={submitMutation.isPending || (hasDocConfigs && !companyDocsReady)}
                                                                                className={`w-full bg-gradient-to-l ${themeColors.headerGradient}`}
                                                                            >
                                                                                {submitMutation.isPending ? (
                                                                                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                                                                                ) : (
                                                                                    <Send className="w-4 h-4 ml-2" />
                                                                                )}
                                                                                ارسال برای بررسی
                                                                            </Button>
                                                                        </div>
                                                                    )}

                                                                    {/* Consultant Actions */}
                                                                    {(isConsultant || isAdmin) && (activityStatus === "REVIEWING" || activityStatus === "PENDING") && (
                                                                        <div className="space-y-3">
                                                                            {/* Warning if consultant needs to upload docs for CONSULTANT steps */}
                                                                            {template.actor_role === "CONSULTANT" && hasDocConfigs && !consultantDocsReady && (
                                                                                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-sm text-amber-700 flex items-center gap-2">
                                                                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                                                                    لطفاً ابتدا مدارک الزامی خود را آپلود کنید.
                                                                                </div>
                                                                            )}
                                                                            {/* Warning if admin needs to upload docs for PLATFORM steps */}
                                                                            {template.actor_role === "PLATFORM" && hasDocConfigs && !platformDocsReady && (
                                                                                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-sm text-amber-700 flex items-center gap-2">
                                                                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                                                                    لطفاً ابتدا مدارک الزامی پلتفرم را آپلود کنید.
                                                                                </div>
                                                                            )}
                                                                            <div className="flex flex-col sm:flex-row gap-2">
                                                                                <Button
                                                                                    onClick={() => handleComplete(activity.id)}
                                                                                    disabled={
                                                                                        completeMutation.isPending || 
                                                                                        (template.actor_role === "CONSULTANT" && hasDocConfigs && !consultantDocsReady) ||
                                                                                        (template.actor_role === "PLATFORM" && hasDocConfigs && !platformDocsReady)
                                                                                    }
                                                                                    className="flex-1 bg-gradient-to-l from-[#0f766e] to-[#14b8a6] hover:from-[#14b8a6] hover:to-[#0f766e]"
                                                                                >
                                                                                    {completeMutation.isPending ? (
                                                                                        <Loader2 className="w-4 h-4 animate-spin ml-2" />
                                                                                    ) : (
                                                                                        <CheckCircle2 className="w-4 h-4 ml-2" />
                                                                                    )}
                                                                                    تأیید و تکمیل
                                                                                </Button>
                                                                                {/* Revision button only for COMPANY steps (when reviewing company's submission) */}
                                                                                {template.actor_role === "COMPANY" && (
                                                                                    <Button
                                                                                        onClick={() => setShowActionModal('revision')}
                                                                                        variant="outline"
                                                                                        className="flex-1 text-[#d4af37] border-[#d4af37]/40 hover:bg-[#d4af37]/10"
                                                                                    >
                                                                                        <RotateCcw className="w-4 h-4 ml-2" />
                                                                                        درخواست اصلاح
                                                                                    </Button>
                                                                                )}
                                                                                <Button
                                                                                    onClick={() => setShowActionModal('reject')}
                                                                                    variant="outline"
                                                                                    className="flex-1 text-red-600 hover:bg-red-50"
                                                                                >
                                                                                    <XCircle className="w-4 h-4 ml-2" />
                                                                                    رد کردن
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {/* Completion Info */}
                                                            {activity?.completed_at && (
                                                                <div className="mt-4 text-sm text-slate-500 flex items-center gap-2">
                                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                                    تکمیل شده در {formatJalaliDate(activity.completed_at)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Action Modals */}
            <AnimatePresence>
                {showActionModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={(e) => e.target === e.currentTarget && setShowActionModal(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
                        >
                            <div className="p-6 border-b border-slate-100">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-slate-800">
                                        {showActionModal === 'reject' ? 'رد درخواست' : 'درخواست اصلاح'}
                                    </h2>
                                    <button
                                        onClick={() => setShowActionModal(null)}
                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-slate-500" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                {showActionModal === 'reject' && (
                                    <div>
                                        <Label htmlFor="rejectionReason">دلیل رد <span className="text-red-500">*</span></Label>
                                        <Textarea
                                            id="rejectionReason"
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            placeholder="دلیل رد درخواست را توضیح دهید..."
                                            rows={3}
                                            className="mt-1"
                                        />
                                    </div>
                                )}
                                <div>
                                    <Label htmlFor="actionNotes">
                                        {showActionModal === 'reject' ? 'یادداشت داخلی (اختیاری)' : 'توضیحات اصلاحات مورد نیاز'}
                                        {showActionModal === 'revision' && <span className="text-red-500"> *</span>}
                                    </Label>
                                    <Textarea
                                        id="actionNotes"
                                        value={actionNotes}
                                        onChange={(e) => setActionNotes(e.target.value)}
                                        placeholder={
                                            showActionModal === 'reject' 
                                                ? "یادداشت برای تیم..."
                                                : "توضیح دهید چه اصلاحاتی لازم است..."
                                        }
                                        rows={3}
                                        className="mt-1"
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowActionModal(null)}
                                        className="flex-1"
                                    >
                                        انصراف
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            if (showActionModal === 'reject') {
                                                handleReject(currentActivity?.id);
                                            } else {
                                                handleRevision(currentActivity?.id);
                                            }
                                        }}
                                        disabled={rejectMutation.isPending || revisionMutation.isPending}
                                        className={`flex-1 ${
                                            showActionModal === 'reject' 
                                                ? 'bg-red-600 hover:bg-red-700' 
                                                : 'bg-amber-500 hover:bg-amber-600'
                                        }`}
                                    >
                                        {(rejectMutation.isPending || revisionMutation.isPending) ? (
                                            <Loader2 className="w-4 h-4 animate-spin ml-2" />
                                        ) : null}
                                        {showActionModal === 'reject' ? 'رد کردن' : 'ارسال درخواست اصلاح'}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
