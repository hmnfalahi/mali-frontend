import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function LoansInfoForm({ data, onChange, errors = {} }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const handleNumberChange = (field, value) => {
    if (value === "" || /^-?\d*$/.test(value)) {
      onChange({ ...data, [field]: value });
    }
  };

  const formatNumber = (value) => {
    if (!value && value !== 0) return "";
    return new Intl.NumberFormat("en-US").format(value);
  };

  const renderNumberInput = (id, label, placeholder, required = true) => (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type="text"
          inputMode="numeric"
          value={data[id] || ""}
          onChange={(e) => handleNumberChange(id, e.target.value)}
          placeholder={placeholder}
          className={`h-12 text-left font-mono pl-16 ${errors[id] ? "border-red-500 focus-visible:ring-red-500" : ""}`}
          dir="ltr"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
          ریال
        </span>
      </div>
      {errors[id] ? (
        <p className="text-xs text-red-500">{errors[id]}</p>
      ) : data[id] ? (
        <p className="text-xs text-slate-500 text-right">
          {formatNumber(data[id])} ریال
        </p>
      ) : null}
    </div>
  );

  const hasNonBankFinancing = data.non_bank_financing_status || false;

  return (
    <div className="space-y-6">
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
        <h3 className="font-medium text-slate-700 mb-2">تسهیلات بانکی</h3>
        <p className="text-sm text-slate-500">اطلاعات تسهیلات دریافتی از بانک‌ها را وارد کنید.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderNumberInput("total_facilities_received", "مجموع تسهیلات دریافتی", "مثال: 100000000")}
        {renderNumberInput("current_facilities", "تسهیلات جاری", "مثال: 50000000")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderNumberInput("non_current_facilities", "تسهیلات غیرجاری (بلندمدت)", "مثال: 50000000")}
        {renderNumberInput("defaulted_facilities_amount", "مبلغ تسهیلات معوق", "مثال: 0")}
      </div>

      <div className="border-t border-slate-200 pt-6 space-y-6">
        <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50 border border-amber-100">
          <div>
            <Label className="text-base text-amber-800">تأمین مالی غیربانکی</Label>
            <p className="text-sm text-amber-600 mt-1">
              آیا شرکت از روش‌های تأمین مالی غیربانکی (مثل صکوک، اوراق مشارکت و...) استفاده کرده است؟
            </p>
          </div>
          <Switch
            checked={hasNonBankFinancing}
            onCheckedChange={(checked) => handleChange("non_bank_financing_status", checked)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderNumberInput("bank_financing_amount", "مبلغ تأمین مالی بانکی", "مثال: 100000000")}
          
          {hasNonBankFinancing && (
            <div className="space-y-2 animate-in fade-in duration-300">
              <Label htmlFor="non_bank_financing_amount">
                مبلغ تأمین مالی غیربانکی <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="non_bank_financing_amount"
                  type="text"
                  inputMode="numeric"
                  value={data.non_bank_financing_amount || ""}
                  onChange={(e) => handleNumberChange("non_bank_financing_amount", e.target.value)}
                  placeholder="مثال: 50000000"
                  className={`h-12 text-left font-mono pl-16 ${errors.non_bank_financing_amount ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  dir="ltr"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  ریال
                </span>
              </div>
              {errors.non_bank_financing_amount ? (
                <p className="text-xs text-red-500">{errors.non_bank_financing_amount}</p>
              ) : data.non_bank_financing_amount ? (
                <p className="text-xs text-slate-500 text-right">
                  {formatNumber(data.non_bank_financing_amount)} ریال
                </p>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
