import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AssetsInfoForm({ data, onChange }) {
  const handleChange = (field, value) => {
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
          onChange={(e) => handleChange(id, e.target.value)}
          placeholder={placeholder}
          className="h-12 text-left font-mono pl-16"
          dir="ltr"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
          ریال
        </span>
      </div>
      {data[id] && (
        <p className="text-xs text-slate-500 text-right">
          {formatNumber(data[id])} ریال
        </p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
        <h3 className="font-medium text-slate-700 mb-2">دارایی‌ها و بدهی‌ها</h3>
        <p className="text-sm text-slate-500">اطلاعات ترازنامه‌ای شرکت را وارد کنید.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderNumberInput("total_assets", "جمع دارایی‌ها", "مثال: 500000000")}
        {renderNumberInput("total_liabilities", "جمع بدهی‌ها", "مثال: 200000000")}
      </div>

      <div className="border-t border-slate-200 pt-6">
        <h4 className="font-medium text-slate-700 mb-4">دارایی‌های ثابت</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderNumberInput("disclosed_fixed_assets", "دارایی‌های ثابت مشهود", "مثال: 150000000")}
          {renderNumberInput("insured_fixed_assets", "دارایی‌های ثابت بیمه شده", "مثال: 150000000")}
          {renderNumberInput("depreciable_assets", "دارایی‌های استهلاک‌پذیر", "مثال: 120000000")}
        </div>
      </div>

      <div className="border-t border-slate-200 pt-6">
        <h4 className="font-medium text-slate-700 mb-4">جریان وجه نقد</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderNumberInput("latest_cash_on_hand", "موجودی نقد و بانک", "مثال: 50000000")}
          {renderNumberInput("cash_from_operations", "جریان نقد حاصل از عملیات", "مثال: 60000000")}
          {renderNumberInput("cash_from_operations_2y_cumulative", "جریان نقد عملیاتی (تجمعی 2 سال)", "مثال: 110000000")}
        </div>
      </div>
    </div>
  );
}
