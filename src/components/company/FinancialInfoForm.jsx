import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FinancialInfoForm({ data, onChange }) {
  const handleChange = (field, value) => {
    // Allow empty string or valid numbers (including negative for profit/loss)
    if (value === "" || /^-?\d*$/.test(value)) {
      onChange({ ...data, [field]: value });
    }
  };

  const formatNumber = (value) => {
    if (!value && value !== 0) return "";
    return new Intl.NumberFormat("fa-IR").format(value);
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
      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
        <p className="text-sm text-blue-700">
          💡 تمامی مبالغ را به <strong>ریال</strong> وارد کنید. اعداد منفی برای زیان مجاز است.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderNumberInput("registered_capital", "سرمایه ثبت شده", "مثال: 1000000000")}
        {renderNumberInput("latest_net_profit", "سود (زیان) خالص آخرین دوره", "مثال: 50000000")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderNumberInput("latest_operating_profit", "سود (زیان) عملیاتی آخرین دوره", "مثال: 75000000")}
        {renderNumberInput("latest_inventory", "موجودی کالا و مواد", "مثال: 20000000")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderNumberInput("avg_working_capital", "میانگین سرمایه در گردش", "مثال: 30000000")}
      </div>
    </div>
  );
}
