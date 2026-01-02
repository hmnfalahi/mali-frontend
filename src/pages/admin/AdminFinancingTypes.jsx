import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import {
    Settings,
    ChevronDown,
    ChevronUp,
    Plus,
    Trash2,
    X,
    Loader2,
    AlertCircle,
    Layers,
    FileSpreadsheet,
    Upload,
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
    DialogFooter,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

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

export default function AdminFinancingTypes() {
    const queryClient = useQueryClient();
    const [expandedType, setExpandedType] = useState(null);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [createStepDialogOpen, setCreateStepDialogOpen] = useState(false);
    const [selectedFinancingType, setSelectedFinancingType] = useState(null);
    const [selectedStep, setSelectedStep] = useState(null);
    const [createDocDialogOpen, setCreateDocDialogOpen] = useState(false);
    const [createFieldDialogOpen, setCreateFieldDialogOpen] = useState(false);
    const [metaOptionsText, setMetaOptionsText] = useState('{}');
    const [metaOptionsError, setMetaOptionsError] = useState(false);

    // Fetch financing types
    const { data: financingTypes, isLoading, refetch: refetchTypes } = useQuery({
        queryKey: ["admin-financing-types"],
        queryFn: apiService.admin.financingTypes.list,
    });

    // Form states
    const [newType, setNewType] = useState({
        title: '',
        slug: '',
        description: '',
        is_active: true,
    });

    const [newStep, setNewStep] = useState({
        financing_type: null,
        step_order: 1,
        title: '',
        actor_role: 'COMPANY',
        description: '',
    });

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
                            <Settings className="w-7 h-7 text-[#d4af37]" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">انواع تامین مالی</h1>
                            <p className="text-white/70 mt-1 text-sm">تعریف و مدیریت انواع تامین مالی و مراحل آن‌ها</p>
                        </div>
                    </div>
                    <Button
                        className="bg-white/10 hover:bg-white/20 border border-white/20"
                        onClick={() => setCreateDialogOpen(true)}
                    >
                        <Plus className="w-4 h-4 ml-2" />
                        نوع جدید
                    </Button>
                </div>
            </motion.div>

            {/* Financing Types List */}
            <Card className="border-0 shadow-lg shadow-purple-100/30 rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-l from-purple-50 to-white">
                    <CardTitle className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5b21b6] to-[#7c3aed] flex items-center justify-center">
                            <Layers className="w-4 h-4 text-white" />
                        </div>
                        انواع تامین مالی ({formatNumber(financingTypes?.length || 0)})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    {isLoading ? (
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <Skeleton key={i} className="h-24 w-full rounded-xl" />
                            ))}
                        </div>
                    ) : financingTypes?.length > 0 ? (
                        <div className="space-y-4">
                            {financingTypes.map((type) => (
                                <div key={type.id} className="border border-purple-100 rounded-2xl overflow-hidden shadow-sm">
                                    {/* Type Header */}
                                    <div
                                        className="p-4 bg-gradient-to-l from-purple-50/50 to-white cursor-pointer hover:from-purple-100/50 transition-colors"
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
                                                                    setMetaOptionsText('{}');
                                                                    setMetaOptionsError(false);
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
                            <Layers className="w-12 h-12 mx-auto mb-3 opacity-50" />
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
                                <Label className="flex items-center justify-between">
                                    <span>تنظیمات پیشرفته (JSON)</span>
                                    {metaOptionsError && (
                                        <span className="text-xs text-red-500 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            فرمت JSON نامعتبر است
                                        </span>
                                    )}
                                </Label>
                                <Textarea
                                    value={metaOptionsText}
                                    onChange={(e) => {
                                        const text = e.target.value;
                                        setMetaOptionsText(text);
                                        try {
                                            const parsed = JSON.parse(text);
                                            setNewFieldConfig({ ...newFieldConfig, meta_options: parsed });
                                            setMetaOptionsError(false);
                                        } catch {
                                            setMetaOptionsError(true);
                                        }
                                    }}
                                    placeholder={newFieldConfig.field_type === 'SELECT'
                                        ? '{"options": [{"value": "1", "label": "گزینه ۱"}]}'
                                        : '{"columns": [{"key": "name", "label": "نام", "type": "text"}], "min_rows": 1}'
                                    }
                                    className={`mt-1 dir-ltr text-left font-mono text-sm ${metaOptionsError ? 'border-red-500' : ''}`}
                                    rows={6}
                                />
                                {newFieldConfig.field_type === 'DATA_GRID' && (
                                    <div className="mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded">
                                        <p className="font-medium mb-1">نمونه برای جدول داده:</p>
                                        <pre className="text-xs overflow-x-auto whitespace-pre-wrap">{`{
  "columns": [
    {"key": "item_name", "label": "نام کالا", "type": "text", "required": true},
    {"key": "quantity", "label": "تعداد", "type": "number", "required": true}
  ],
  "min_rows": 1,
  "max_rows": 50
}`}</pre>
                                    </div>
                                )}
                                {newFieldConfig.field_type === 'SELECT' && (
                                    <div className="mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded">
                                        <p className="font-medium mb-1">نمونه برای فیلد انتخابی:</p>
                                        <pre className="text-xs overflow-x-auto whitespace-pre-wrap">{`{
  "options": [
    {"value": "12", "label": "۱۲ ماه"},
    {"value": "24", "label": "۲۴ ماه"}
  ]
}`}</pre>
                                    </div>
                                )}
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
                            disabled={!newFieldConfig.label || !newFieldConfig.field_key || createFieldMutation.isPending || metaOptionsError}
                        >
                            {createFieldMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "افزودن"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// Step Card Component
function StepCard({ step, onAddDoc, onAddField, onDeleteStep, onDeleteDoc, onDeleteField }) {
    const [expanded, setExpanded] = useState(false);

    const actorStyles = {
        COMPANY: 'bg-[#d4af37]/20 text-[#b8963a] border border-[#d4af37]/30',
        CONSULTANT: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
        PLATFORM: 'bg-purple-100 text-[#5b21b6] border border-purple-200',
    };

    return (
        <div className="border border-purple-100 rounded-xl overflow-hidden bg-white shadow-sm">
            <div
                className="p-3 bg-white cursor-pointer hover:bg-purple-50/30 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5b21b6] to-[#7c3aed] text-white flex items-center justify-center font-bold text-sm shadow-md">
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

