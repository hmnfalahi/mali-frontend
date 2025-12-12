import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiService } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  DollarSign,
  Landmark,
  TrendingUp,
  CreditCard,
  Check,
  ChevronLeft,
  ChevronRight,
  Save,
  Loader2,
  AlertCircle,
  Edit
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { getTodayISO, formatJalaliDate } from "@/utils/jalali";

import BasicInfoForm from "@/components/company/BasicInfoForm";
import FinancialInfoForm from "@/components/company/FinancialInfoForm";
import AssetsInfoForm from "@/components/company/AssetsInfoForm";
import DevelopmentPlanForm from "@/components/company/DevelopmentPlanForm";
import LoansInfoForm from "@/components/company/LoansInfoForm";

const steps = [
  { id: 1, title: "اطلاعات پایه", icon: Building2, component: BasicInfoForm },
  { id: 2, title: "اطلاعات مالی", icon: DollarSign, component: FinancialInfoForm },
  { id: 3, title: "دارایی‌ها", icon: Landmark, component: AssetsInfoForm },
  { id: 4, title: "طرح توسعه", icon: TrendingUp, component: DevelopmentPlanForm },
  { id: 5, title: "تسهیلات", icon: CreditCard, component: LoansInfoForm },
];

const formatNumber = (num) => {
  if (num === undefined || num === null || num === "") return "-";
  return new Intl.NumberFormat('en-US').format(num);
};

const InfoItem = ({ label, value, isNumber = false, suffix = "" }) => (
  <div className="flex flex-col">
    <span className="text-xs text-slate-500 mb-1.5">{label}</span>
    <span className="font-medium text-slate-800 text-sm">
      {isNumber ? formatNumber(value) : (value || "-")}
      {suffix && value ? ` ${suffix}` : ""}
    </span>
  </div>
);

const CompanyDetailView = ({ data, onEdit }) => {
  if (!data) return null;

  return (
    <div className="space-y-8">
      {/* Header Section */}
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
              <Building2 className="w-5 h-5 text-white/80" />
              <span className="text-blue-100 text-sm">پروفایل شرکت</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{data.title || "شرکت بدون نام"}</h1>
            <p className="text-blue-100/80 font-mono text-sm tracking-wider">
              شناسه ملی: {data.national_id || "-"}
            </p>
          </div>
          <Button
            onClick={onEdit}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm transition-all hover:scale-105"
          >
            <Edit className="w-4 h-4 ml-2" />
            ویرایش اطلاعات
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="h-full"
        >
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white rounded-2xl overflow-hidden h-full">
            <div className="bg-slate-50/80 border-b border-slate-100 p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Check className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-800">اطلاعات پایه</h3>
            </div>
            <div className="p-6 grid grid-cols-2 gap-6">
              <InfoItem label="تعداد پرسنل" value={data.personnel_count} suffix="نفر" />
              <InfoItem label="تاریخ پایان سال مالی" value={formatJalaliDate(data.fiscal_year_end_date)} />
              <div className="col-span-2">
                <InfoItem label="موضوع فعالیت" value={data.activity_subject} />
              </div>
              <InfoItem label="وضعیت حسابرس" value={data.audit_opinion_status} />
              <InfoItem label="حسابرس معتمد بورس" value={data.auditor_is_bourse_trusted ? "بله" : "خیر"} />
              <InfoItem label="صورت‌های مالی میان‌دوره‌ای" value={data.prepares_interim_fs ? "بله" : "خیر"} />
            </div>
          </Card>
        </motion.div>

        {/* Financial Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="h-full"
        >
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white rounded-2xl overflow-hidden h-full">
            <div className="bg-slate-50/80 border-b border-slate-100 p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <DollarSign className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-800">اطلاعات مالی</h3>
            </div>
            <div className="p-6 grid grid-cols-2 gap-6">
              <InfoItem label="سرمایه ثبت شده" value={data.registered_capital} isNumber suffix="ریال" />
              <InfoItem label="سود خالص (آخرین دوره)" value={data.latest_net_profit} isNumber suffix="ریال" />
              <InfoItem label="سود عملیاتی" value={data.latest_operating_profit} isNumber suffix="ریال" />
              <InfoItem label="موجودی کالا" value={data.latest_inventory} isNumber suffix="ریال" />
              <InfoItem label="سرمایه در گردش" value={data.avg_working_capital} isNumber suffix="ریال" />
            </div>
          </Card>
        </motion.div>

        {/* Assets Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="h-full"
        >
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white rounded-2xl overflow-hidden h-full">
            <div className="bg-slate-50/80 border-b border-slate-100 p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Landmark className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-800">دارایی‌ها</h3>
            </div>
            <div className="p-6 grid grid-cols-2 gap-6">
              <InfoItem label="جمع دارایی‌ها" value={data.total_assets} isNumber suffix="ریال" />
              <InfoItem label="جمع بدهی‌ها" value={data.total_liabilities} isNumber suffix="ریال" />
              <InfoItem label="دارایی‌های ثابت مشهود" value={data.disclosed_fixed_assets} isNumber suffix="ریال" />
              <InfoItem label="دارایی‌های ثابت بیمه شده" value={data.insured_fixed_assets} isNumber suffix="ریال" />
              <InfoItem label="موجودی نقد" value={data.latest_cash_on_hand} isNumber suffix="ریال" />
            </div>
          </Card>
        </motion.div>

        {/* Loans Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="h-full"
        >
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white rounded-2xl overflow-hidden h-full">
            <div className="bg-slate-50/80 border-b border-slate-100 p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <CreditCard className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-800">تسهیلات و تعهدات</h3>
            </div>
            <div className="p-6 grid grid-cols-2 gap-6">
              <InfoItem label="تسهیلات جاری" value={data.current_facilities} isNumber suffix="ریال" />
              <InfoItem label="تسهیلات غیرجاری" value={data.non_current_facilities} isNumber suffix="ریال" />
              <InfoItem label="تسهیلات معوق" value={data.defaulted_facilities_amount} isNumber suffix="ریال" />
              <div className="col-span-2 bg-slate-50 rounded-xl p-4 mt-2 border border-slate-100">
                <p className="text-xs font-medium text-slate-500 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-3 h-3" />
                  تأمین مالی غیربانکی
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="وضعیت" value={data.non_bank_financing_status ? "دارد" : "ندارد"} />
                  {data.non_bank_financing_status && (
                    <InfoItem label="مبلغ" value={data.non_bank_financing_amount} isNumber suffix="ریال" />
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {data.has_development_plan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="md:col-span-2"
          >
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white rounded-2xl overflow-hidden">
              <div className="bg-slate-50/80 border-b border-slate-100 p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-slate-800">طرح توسعه</h3>
              </div>
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                <InfoItem label="پیشرفت فیزیکی" value={data.dev_plan_progress_percent} suffix="%" />
                <InfoItem label="تاریخ اتمام" value={formatJalaliDate(data.dev_plan_estimated_end_date)} />
                <InfoItem label="هزینه انباشته" value={data.dev_plan_accumulated_cost} isNumber suffix="ریال" />
                <InfoItem label="هزینه باقیمانده" value={data.dev_plan_remaining_cost} isNumber suffix="ریال" />
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default function CompanyProfile() {
  const { user, checkCompanyStatus } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Fetch existing company data
  const { data: company, isLoading } = useQuery({
    queryKey: ["company", user?.phone_number],
    queryFn: async () => {
      const companies = await apiService.entities.Company.list();
      return companies[0] || null;
    },
    enabled: !!user,
  });

  const draftKey = `company_profile_draft_${user?.phone_number}`;

  // Populate form when company data loads
  useEffect(() => {
    if (company) {
      setFormData(company);

      // Check for edit mode in URL
      const params = new URLSearchParams(location.search);
      const shouldEdit = params.get("mode") === "edit";

      // Switch to read-only mode if we have at least a title (company exists) and not forced to edit
      if (company.title && !shouldEdit) {
        setIsEditing(false);
      } else if (shouldEdit) {
        setIsEditing(true);
      }
    } else if (!isLoading && !company) {
      // If no company exists (Create Mode), try to load draft
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          setFormData(parsed);
          // Optional: Notify user
          // setSuccessMessage("پیش‌نویس ذخیره شده بازیابی شد");
          // setTimeout(() => setSuccessMessage(null), 3000);
        } catch (e) {
          console.error("Failed to parse draft", e);
        }
      }
    }
  }, [company, location.search, isLoading, draftKey]);

  // Prepare payload for API
  const preparePayload = (data) => {
    const payload = { ...data };

    const numberFields = [
      "personnel_count", "registered_capital", "latest_net_profit", "latest_operating_profit", "latest_inventory",
      "avg_working_capital", "disclosed_fixed_assets", "insured_fixed_assets", "depreciable_assets",
      "dev_plan_accumulated_cost", "dev_plan_remaining_cost",
      "total_assets", "total_liabilities", "latest_cash_on_hand", "cash_from_operations",
      "cash_from_operations_2y_cumulative", "total_facilities_received", "current_facilities",
      "non_current_facilities", "defaulted_facilities_amount", "bank_financing_amount", "non_bank_financing_amount"
    ];

    numberFields.forEach(field => {
      payload[field] = payload[field] === "" || payload[field] === undefined ? 0 : Number(payload[field]);
    });

    // Handle development plan defaults
    if (!payload.has_development_plan) {
      payload.dev_plan_progress_percent = "0.00";
      payload.dev_plan_accumulated_cost = 0;
      payload.dev_plan_remaining_cost = 0;
      if (!payload.dev_plan_estimated_end_date) {
        payload.dev_plan_estimated_end_date = getTodayISO();
      }
    }

    // Handle non-bank financing defaults
    if (!payload.non_bank_financing_status) {
      payload.non_bank_financing_amount = 0;
    }

    return payload;
  };

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const payload = preparePayload(data);
      if (company?.id) {
        return await apiService.entities.Company.update(company.id, payload);
      } else {
        return await apiService.entities.Company.create(payload);
      }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries(["company"]);
      await checkCompanyStatus();
      setSuccessMessage("اطلاعات با موفقیت ذخیره شد");
      setTimeout(() => setSuccessMessage(null), 3000);
      setIsEditing(false);
      localStorage.removeItem(draftKey);
    },
    onError: (err) => {
      console.error("Save failed", err);
      setError(err.response?.data?.detail || err.message || "خطا در ذخیره اطلاعات");
    },
  });

  // Get required fields for each step
  const getRequiredFieldsForStep = (step) => {
    switch (step) {
      case 1:
        return {
          title: "نام شرکت الزامی است",
          national_id: "شناسه ملی الزامی است",
          personnel_count: "تعداد پرسنل الزامی است",
          activity_subject: "موضوع فعالیت الزامی است",
          fiscal_year_end_date: "تاریخ پایان سال مالی الزامی است",
          audit_opinion_status: "وضعیت اظهارنظر حسابرس الزامی است",
        };
      case 2:
        return {
          registered_capital: "سرمایه ثبت شده الزامی است",
          latest_net_profit: "سود (زیان) خالص الزامی است",
          latest_operating_profit: "سود (زیان) عملیاتی الزامی است",
          latest_inventory: "موجودی کالا و مواد الزامی است",
          avg_working_capital: "میانگین سرمایه در گردش الزامی است",
        };
      case 3:
        return {
          total_assets: "جمع دارایی‌ها الزامی است",
          total_liabilities: "جمع بدهی‌ها الزامی است",
          disclosed_fixed_assets: "دارایی‌های ثابت مشهود الزامی است",
          insured_fixed_assets: "دارایی‌های ثابت بیمه شده الزامی است",
          depreciable_assets: "دارایی‌های استهلاک‌پذیر الزامی است",
          latest_cash_on_hand: "موجودی نقد و بانک الزامی است",
          cash_from_operations: "جریان نقد حاصل از عملیات الزامی است",
          cash_from_operations_2y_cumulative: "جریان نقد عملیاتی تجمعی الزامی است",
        };
      case 4:
        // Only validate if has_development_plan is true
        if (formData.has_development_plan) {
          return {
            dev_plan_progress_percent: "درصد پیشرفت فیزیکی الزامی است",
            dev_plan_estimated_end_date: "تاریخ تخمینی اتمام الزامی است",
            dev_plan_accumulated_cost: "هزینه انباشته الزامی است",
            dev_plan_remaining_cost: "هزینه باقیمانده الزامی است",
          };
        }
        return {};
      case 5:
        const fields = {
          total_facilities_received: "مجموع تسهیلات دریافتی الزامی است",
          current_facilities: "تسهیلات جاری الزامی است",
          non_current_facilities: "تسهیلات غیرجاری الزامی است",
          defaulted_facilities_amount: "مبلغ تسهیلات معوق الزامی است",
          bank_financing_amount: "مبلغ تأمین مالی بانکی الزامی است",
        };
        if (formData.non_bank_financing_status) {
          fields.non_bank_financing_amount = "مبلغ تأمین مالی غیربانکی الزامی است";
        }
        return fields;
      default:
        return {};
    }
  };

  // Validate current step and return field errors
  const validateStep = (step) => {
    const requiredFields = getRequiredFieldsForStep(step);
    const errors = {};

    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!formData[field] && formData[field] !== 0) {
        errors[field] = message;
      }
    });

    // Special validation for national_id length
    if (step === 1 && formData.national_id && formData.national_id.length !== 11) {
      errors.national_id = "شناسه ملی باید 11 رقم باشد";
    }

    return Object.keys(errors).length > 0 ? errors : null;
  };

  const handleSave = () => {
    setError(null);
    setFieldErrors({});
    const stepErrors = validateStep(1); // At minimum validate basic info
    if (stepErrors) {
      setFieldErrors(stepErrors);
      setError("لطفاً فیلدهای الزامی را تکمیل کنید");
      setCurrentStep(1);
      return;
    }
    saveMutation.mutate(formData);
  };

  const handleNext = () => {
    setError(null);
    setFieldErrors({});
    const stepErrors = validateStep(currentStep);
    if (stepErrors) {
      setFieldErrors(stepErrors);
      setError("لطفاً فیلدهای الزامی را تکمیل کنید");
      return;
    }
    setCurrentStep((prev) => Math.min(steps.length, prev + 1));
  };

  const handleFinish = async () => {
    setError(null);
    setFieldErrors({});
    // Validate all required fields
    for (let i = 1; i <= steps.length; i++) {
      const stepErrors = validateStep(i);
      if (stepErrors) {
        setFieldErrors(stepErrors);
        setError("لطفاً فیلدهای الزامی را تکمیل کنید");
        setCurrentStep(i);
        return;
      }
    }

    saveMutation.mutate(formData, {
      onSuccess: async () => {
        await checkCompanyStatus();
        setIsEditing(false);
      }
    });
  };

  // Clear field error when user starts typing
  const handleFormChange = (newData) => {
    setFormData(newData);
    localStorage.setItem(draftKey, JSON.stringify(newData));

    // Clear errors for fields that now have values
    if (Object.keys(fieldErrors).length > 0) {
      const updatedErrors = { ...fieldErrors };
      Object.keys(newData).forEach((field) => {
        if (newData[field] && updatedErrors[field]) {
          delete updatedErrors[field];
        }
      });
      setFieldErrors(updatedErrors);
      if (Object.keys(updatedErrors).length === 0) {
        setError(null);
      }
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;
  const progress = (currentStep / steps.length) * 100;

  if (!user || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin h-12 w-12 text-[#1e3a5f]" />
      </div>
    );
  }

  if (!isEditing) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-2">
            <Check className="w-5 h-5 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
        <CompanyDetailView data={formData} onEdit={() => setIsEditing(true)} />
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {company ? "ویرایش اطلاعات شرکت" : "ثبت اطلاعات شرکت"}
          </h1>
          <p className="text-slate-500 mt-1">اطلاعات شرکت خود را مرحله به مرحله تکمیل کنید</p>
        </div>
        <div className="flex gap-3">
          {company && company.title && (
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              انصراف
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="bg-gradient-to-l from-[#1e3a5f] to-[#2d5a8a]"
          >
            {saveMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin ml-2" />
            ) : (
              <Save className="w-4 h-4 ml-2" />
            )}
            ذخیره موقت
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-2">
          <Check className="w-5 h-5 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Progress Card */}
      <Card className="border-0 shadow-lg shadow-slate-200/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-500">پیشرفت تکمیل فرم</span>
            <span className="text-sm font-medium text-[#1e3a5f]">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />

          {/* Steps Navigation */}
          <div className="flex justify-between mt-6">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className="flex flex-col items-center gap-2 transition-all flex-1"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isActive
                      ? "bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a] text-white shadow-lg"
                      : isCompleted
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-slate-100 text-slate-400"
                      }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span
                    className={`text-xs font-medium hidden md:block text-center ${isActive ? "text-[#1e3a5f]" : "text-slate-500"
                      }`}
                  >
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Form Card */}
      <Card className="border-0 shadow-lg shadow-slate-200/50">
        <CardHeader className="pb-4 border-b">
          <CardTitle className="flex items-center gap-3">
            {React.createElement(steps[currentStep - 1].icon, {
              className: "w-5 h-5 text-[#1e3a5f]",
            })}
            {steps[currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <CurrentStepComponent data={formData} onChange={handleFormChange} errors={fieldErrors} />
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ChevronRight className="w-4 h-4" />
          مرحله قبل
        </Button>

        {currentStep < steps.length ? (
          <Button
            onClick={handleNext}
            className="bg-gradient-to-l from-[#1e3a5f] to-[#2d5a8a] gap-2"
          >
            مرحله بعد
            <ChevronLeft className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleFinish}
            disabled={saveMutation.isPending}
            className="bg-gradient-to-l from-emerald-500 to-emerald-600 gap-2"
          >
            {saveMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            تکمیل و ثبت نهایی
          </Button>
        )}
      </div>
    </motion.div>
  );
}
