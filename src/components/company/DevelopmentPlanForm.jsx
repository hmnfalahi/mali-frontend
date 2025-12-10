import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { JalaliDatePicker } from "@/components/ui/JalaliDatePicker";

export default function DevelopmentPlanForm({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const handleNumberChange = (field, value) => {
    if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
      onChange({ ...data, [field]: value });
    }
  };

  const formatNumber = (value) => {
    if (!value && value !== 0) return "";
    return new Intl.NumberFormat("fa-IR").format(value);
  };

  const hasPlan = data.has_development_plan || false;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-l from-blue-50 to-slate-50 border border-blue-100">
        <div>
          <Label className="text-lg font-medium text-slate-800">طرح توسعه</Label>
          <p className="text-sm text-slate-500 mt-2">
            آیا شرکت دارای طرح توسعه یا پروژه سرمایه‌گذاری در دست اجرا است؟
          </p>
        </div>
        <Switch
          checked={hasPlan}
          onCheckedChange={(checked) => handleChange("has_development_plan", checked)}
        />
      </div>

      {hasPlan && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="dev_plan_progress_percent">
                درصد پیشرفت فیزیکی <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="dev_plan_progress_percent"
                  type="text"
                  inputMode="decimal"
                  value={data.dev_plan_progress_percent || ""}
                  onChange={(e) => handleNumberChange("dev_plan_progress_percent", e.target.value)}
                  placeholder="مثال: 50.5"
                  className="h-12 text-left font-mono pl-12"
                  dir="ltr"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  %
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dev_plan_estimated_end_date">
                تاریخ تخمینی اتمام <span className="text-red-500">*</span>
              </Label>
              <JalaliDatePicker
                id="dev_plan_estimated_end_date"
                value={data.dev_plan_estimated_end_date || ""}
                onChange={(value) => handleChange("dev_plan_estimated_end_date", value)}
                placeholder="۱۴۰۳/۱۲/۲۹"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="dev_plan_accumulated_cost">
                هزینه انباشته تا کنون <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="dev_plan_accumulated_cost"
                  type="text"
                  inputMode="numeric"
                  value={data.dev_plan_accumulated_cost || ""}
                  onChange={(e) => handleNumberChange("dev_plan_accumulated_cost", e.target.value)}
                  placeholder="مثال: 100000000"
                  className="h-12 text-left font-mono pl-16"
                  dir="ltr"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  ریال
                </span>
              </div>
              {data.dev_plan_accumulated_cost && (
                <p className="text-xs text-slate-500 text-right">
                  {formatNumber(data.dev_plan_accumulated_cost)} ریال
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dev_plan_remaining_cost">
                هزینه باقیمانده تا اتمام <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="dev_plan_remaining_cost"
                  type="text"
                  inputMode="numeric"
                  value={data.dev_plan_remaining_cost || ""}
                  onChange={(e) => handleNumberChange("dev_plan_remaining_cost", e.target.value)}
                  placeholder="مثال: 50000000"
                  className="h-12 text-left font-mono pl-16"
                  dir="ltr"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  ریال
                </span>
              </div>
              {data.dev_plan_remaining_cost && (
                <p className="text-xs text-slate-500 text-right">
                  {formatNumber(data.dev_plan_remaining_cost)} ریال
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {!hasPlan && (
        <div className="text-center py-8 text-slate-500">
          <p>در صورت داشتن طرح توسعه، گزینه بالا را فعال کنید.</p>
        </div>
      )}
    </div>
  );
}
