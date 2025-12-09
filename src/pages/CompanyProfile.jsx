import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2, Save, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function CompanyProfile() {
    const { user, checkCompanyStatus } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [error, setError] = useState(null);

    // Initial form state matches the API requirements
    const [formData, setFormData] = useState({
        title: "",
        activity_subject: "",
        fiscal_year_end_date: "",
        auditor_is_bourse_trusted: false,
        audit_opinion_status: "",
        prepares_interim_fs: false,
        registered_capital: "",
        latest_net_profit: "",
        latest_operating_profit: "",
        latest_inventory: "",
        avg_working_capital: "",
        disclosed_fixed_assets: "",
        insured_fixed_assets: "",
        depreciable_assets: "",
        has_development_plan: false,
        dev_plan_progress_percent: "0.00",
        dev_plan_accumulated_cost: 0,
        dev_plan_remaining_cost: 0,
        dev_plan_estimated_end_date: "",
        total_assets: "",
        total_liabilities: "",
        latest_cash_on_hand: "",
        cash_from_operations: "",
        cash_from_operations_2y_cumulative: "",
        total_facilities_received: "",
        current_facilities: "",
        non_current_facilities: "",
        defaulted_facilities_amount: 0,
        non_bank_financing_status: false,
        bank_financing_amount: "",
        non_bank_financing_amount: 0
    });

    // Fetch existing company
    const { data: company, isLoading: isLoadingCompany } = useQuery({
        queryKey: ["company", user?.phone_number],
        queryFn: async () => {
            const companies = await apiService.entities.Company.list({ created_by: user.phone_number });
            return companies[0] || null;
        },
        enabled: !!user,
        onSuccess: (data) => {
            if (data) {
                // Populate form with existing data
                // Ensure nulls are converted to empty strings or appropriate defaults
                const safeData = { ...data };
                // Format date fields if necessary, assuming API returns YYYY-MM-DD
                setFormData(prev => ({
                    ...prev,
                    ...safeData,
                    // Ensure booleans are booleans
                    auditor_is_bourse_trusted: !!safeData.auditor_is_bourse_trusted,
                    prepares_interim_fs: !!safeData.prepares_interim_fs,
                    has_development_plan: !!safeData.has_development_plan,
                    non_bank_financing_status: !!safeData.non_bank_financing_status,
                }));
            }
        }
    });

    // Sync state when data is loaded (useEffect needed because onSuccess in useQuery v5 is deprecated/removed in some versions or unreliable for form reset)
    useEffect(() => {
        if (company) {
             setFormData(prev => ({
                ...prev,
                ...company,
                fiscal_year_end_date: company.fiscal_year_end_date || "",
                dev_plan_estimated_end_date: company.dev_plan_estimated_end_date || "",
            }));
        }
    }, [company]);


    const createMutation = useMutation({
        mutationFn: apiService.entities.Company.create,
        onSuccess: async () => {
            queryClient.invalidateQueries(["company"]);
            await checkCompanyStatus(); // Update context
            navigate("/dashboard");
        },
        onError: (err) => {
            console.error("Create failed", err);
            setError(err.response?.data?.detail || err.message || "Failed to create company");
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => apiService.entities.Company.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["company"]);
            // Stay on page or show success message?
            alert("اطلاعات شرکت با موفقیت بروزرسانی شد.");
        },
        onError: (err) => {
            console.error("Update failed", err);
            setError(err.response?.data?.detail || err.message || "Failed to update company");
        }
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        // Allow empty or number
        if (value === "" || /^-?\d*$/.test(value)) {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Prepare payload: Convert strings to numbers where needed
        const payload = { ...formData };
        
        const numberFields = [
            "registered_capital", "latest_net_profit", "latest_operating_profit", "latest_inventory",
            "avg_working_capital", "disclosed_fixed_assets", "insured_fixed_assets", "depreciable_assets",
            "dev_plan_accumulated_cost", "dev_plan_remaining_cost", 
            "total_assets", "total_liabilities", "latest_cash_on_hand", "cash_from_operations",
            "cash_from_operations_2y_cumulative", "total_facilities_received", "current_facilities",
            "non_current_facilities", "defaulted_facilities_amount", "bank_financing_amount", "non_bank_financing_amount"
        ];

        numberFields.forEach(field => {
            payload[field] = payload[field] === "" ? 0 : Number(payload[field]);
        });

        // Handle conditionally required fields for Development Plan
        if (!payload.has_development_plan) {
            payload.dev_plan_progress_percent = "0.00";
            payload.dev_plan_accumulated_cost = 0;
            payload.dev_plan_remaining_cost = 0;
            // If date is empty and plan is false, provide a fallback to satisfy 'required' constraint
            if (!payload.dev_plan_estimated_end_date) {
                 payload.dev_plan_estimated_end_date = new Date().toISOString().split('T')[0];
            }
        }

        if (company) {
            updateMutation.mutate({ id: company.id, data: payload });
        } else {
            createMutation.mutate(payload);
        }
    };

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    if (isLoadingCompany) {
        return (
             <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin h-12 w-12 text-[#1e3a5f]" />
            </div>
        );
    }

    const Section = ({ title, children }) => (
        <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4 border-b pb-2">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {children}
            </div>
        </div>
    );

    const renderInput = (name, label, type = "text", required = true) => (
        <div className="space-y-2">
            <Label htmlFor={name}>{label} {required && <span className="text-red-500">*</span>}</Label>
            <Input
                id={name}
                name={name}
                type={type}
                value={formData[name]}
                onChange={type === "number" ? handleNumberChange : handleChange}
                required={required}
                className="text-right"
                dir="auto"
            />
        </div>
    );
    
    // Helper for number inputs that just uses text input but with number validation/handling logic we added
    const renderNumberInput = (name, label, required = true) => (
         <div className="space-y-2">
            <Label htmlFor={name}>{label} {required && <span className="text-red-500">*</span>}</Label>
            <Input
                id={name}
                name={name}
                type="text"
                inputMode="numeric"
                value={formData[name]}
                onChange={handleNumberChange}
                required={required}
                className="text-left font-mono" // Numbers LTR
                placeholder="0"
            />
        </div>
    );

    const renderCheckbox = (name, label) => (
        <div className="flex items-center space-x-2 space-x-reverse h-10 mt-6">
            <input
                type="checkbox"
                id={name}
                name={name}
                checked={formData[name]}
                onChange={handleChange}
                className="h-5 w-5 rounded border-gray-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
            />
            <Label htmlFor={name} className="font-normal cursor-pointer">{label}</Label>
        </div>
    );

    const renderSelect = (name, label, options, required=true) => (
        <div className="space-y-2">
            <Label htmlFor={name}>{label} {required && <span className="text-red-500">*</span>}</Label>
            <select
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required={required}
            >
                <option value="">انتخاب کنید</option>
                {options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a] flex items-center justify-center shadow-lg">
                        <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            {company ? "ویرایش اطلاعات شرکت" : "ثبت اطلاعات شرکت"}
                        </h1>
                        <p className="text-slate-500">لطفاً اطلاعات شرکت خود را با دقت وارد نمایید</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-6">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                )}

                <Card className="border-0 shadow-xl shadow-slate-200/50">
                    <CardContent className="p-6 md:p-8">
                        <form onSubmit={handleSubmit}>
                            <Section title="اطلاعات عمومی">
                                {renderInput("title", "نام شرکت")}
                                {renderInput("activity_subject", "موضوع فعالیت")}
                                {renderInput("fiscal_year_end_date", "تاریخ پایان سال مالی", "date")}
                            </Section>

                            <Section title="حسابرسی و وضعیت">
                                {renderCheckbox("auditor_is_bourse_trusted", "حسابرس معتمد بورس است؟")}
                                {renderSelect("audit_opinion_status", "وضعیت اظهارنظر حسابرس", ["مقبول", "مشروط", "مردود", "عدم اظهارنظر"])}
                                {renderCheckbox("prepares_interim_fs", "تهیه صورت‌های مالی میان‌دوره؟")}
                            </Section>

                            <Section title="اطلاعات مالی (آخرین دوره)">
                                {renderNumberInput("registered_capital", "سرمایه ثبت شده")}
                                {renderNumberInput("latest_net_profit", "سود خالص")}
                                {renderNumberInput("latest_operating_profit", "سود عملیاتی")}
                                {renderNumberInput("latest_inventory", "موجودی کالا")}
                                {renderNumberInput("avg_working_capital", "میانگین سرمایه در گردش")}
                            </Section>

                            <Section title="دارایی‌ها و بدهی‌ها">
                                {renderNumberInput("total_assets", "جمع دارایی‌ها")}
                                {renderNumberInput("total_liabilities", "جمع بدهی‌ها")}
                                {renderNumberInput("disclosed_fixed_assets", "دارایی‌های ثابت مشهود")}
                                {renderNumberInput("insured_fixed_assets", "دارایی‌های ثابت بیمه شده")}
                                {renderNumberInput("depreciable_assets", "دارایی‌های استهلاک‌پذیر")}
                            </Section>

                            <Section title="نقدینگی">
                                {renderNumberInput("latest_cash_on_hand", "موجودی نقد")}
                                {renderNumberInput("cash_from_operations", "جریان نقد عملیاتی")}
                                {renderNumberInput("cash_from_operations_2y_cumulative", "جریان نقد عملیاتی (تجمعی ۲ سال)")}
                            </Section>

                            <Section title="تسهیلات بانکی">
                                {renderNumberInput("total_facilities_received", "کل تسهیلات دریافتی")}
                                {renderNumberInput("current_facilities", "تسهیلات جاری")}
                                {renderNumberInput("non_current_facilities", "تسهیلات غیرجاری")}
                                {renderNumberInput("defaulted_facilities_amount", "مبلغ تسهیلات معوق")}
                                {renderNumberInput("bank_financing_amount", "تأمین مالی بانکی")}
                            </Section>

                             <Section title="تأمین مالی غیربانکی">
                                {renderCheckbox("non_bank_financing_status", "استفاده از تأمین مالی غیربانکی؟")}
                                {formData.non_bank_financing_status && renderNumberInput("non_bank_financing_amount", "مبلغ تأمین مالی غیربانکی")}
                            </Section>

                            <Section title="طرح توسعه">
                                {renderCheckbox("has_development_plan", "دارای طرح توسعه است؟")}
                                {formData.has_development_plan && (
                                    <>
                                        {renderInput("dev_plan_progress_percent", "درصد پیشرفت", "number")}
                                        {renderNumberInput("dev_plan_accumulated_cost", "هزینه انباشته")}
                                        {renderNumberInput("dev_plan_remaining_cost", "هزینه باقیمانده")}
                                        {renderInput("dev_plan_estimated_end_date", "تاریخ برآورد خاتمه", "date")}
                                    </>
                                )}
                            </Section>

                            <div className="flex justify-end pt-6 border-t">
                                <Button 
                                    type="submit" 
                                    className="bg-gradient-to-l from-[#1e3a5f] to-[#2d5a8a] min-w-[150px]"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            در حال ثبت...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            {company ? "بروزرسانی اطلاعات" : "ثبت اطلاعات"}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
