import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JalaliDatePicker } from "@/components/ui/JalaliDatePicker";

export default function BasicInfoForm({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const handleNationalIdChange = (value) => {
    // Only allow digits and max 11 characters
    const cleaned = value.replace(/\D/g, '').slice(0, 11);
    onChange({ ...data, national_id: cleaned });
  };

  const handlePersonnelCountChange = (value) => {
    // Only allow positive integers
    if (value === "" || /^\d+$/.test(value)) {
      onChange({ ...data, personnel_count: value });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">نام شرکت <span className="text-red-500">*</span></Label>
          <Input
            id="title"
            value={data.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="نام شرکت را وارد کنید"
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="national_id">شناسه ملی شرکت <span className="text-red-500">*</span></Label>
          <Input
            id="national_id"
            type="text"
            inputMode="numeric"
            value={data.national_id || ""}
            onChange={(e) => handleNationalIdChange(e.target.value)}
            placeholder="11 رقمی (مثال: 10123456789)"
            className="h-12 text-left font-mono"
            dir="ltr"
            maxLength={11}
          />
          {data.national_id && data.national_id.length !== 11 && (
            <p className="text-xs text-amber-600">شناسه ملی باید 11 رقم باشد ({data.national_id.length}/11)</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="personnel_count">تعداد پرسنل <span className="text-red-500">*</span></Label>
          <div className="relative">
            <Input
              id="personnel_count"
              type="text"
              inputMode="numeric"
              value={data.personnel_count || ""}
              onChange={(e) => handlePersonnelCountChange(e.target.value)}
              placeholder="مثال: 50"
              className="h-12 text-left font-mono pl-12"
              dir="ltr"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              نفر
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fiscal_year_end_date">تاریخ پایان سال مالی <span className="text-red-500">*</span></Label>
          <JalaliDatePicker
            id="fiscal_year_end_date"
            value={data.fiscal_year_end_date || ""}
            onChange={(value) => handleChange("fiscal_year_end_date", value)}
            placeholder="انتخاب تاریخ"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="activity_subject">موضوع فعالیت مطابق اساسنامه <span className="text-red-500">*</span></Label>
        <Textarea
          id="activity_subject"
          value={data.activity_subject || ""}
          onChange={(e) => handleChange("activity_subject", e.target.value)}
          placeholder="موضوع فعالیت شرکت را شرح دهید (مثال: تولید نرم‌افزار، ساختمان‌سازی و...)"
          className="min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
          <div>
            <Label className="text-base">حسابرس معتمد بورس</Label>
            <p className="text-sm text-slate-500 mt-1">آیا حسابرس شرکت جزء حسابرسان معتمد سازمان بورس است؟</p>
          </div>
          <Switch
            checked={data.auditor_is_bourse_trusted || false}
            onCheckedChange={(checked) => handleChange("auditor_is_bourse_trusted", checked)}
          />
        </div>

        <div className="space-y-2">
          <Label>وضعیت اظهارنظر حسابرس <span className="text-red-500">*</span></Label>
          <Select
            value={data.audit_opinion_status || ""}
            onValueChange={(value) => handleChange("audit_opinion_status", value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="انتخاب کنید" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="مقبول">مقبول</SelectItem>
              <SelectItem value="مشروط">مشروط</SelectItem>
              <SelectItem value="مردود">مردود</SelectItem>
              <SelectItem value="عدم اظهارنظر">عدم اظهارنظر</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
        <div>
          <Label className="text-base">صورت‌های مالی میان‌دوره‌ای</Label>
          <p className="text-sm text-slate-500 mt-1">آیا شرکت صورتهای مالی حسابرسی شده میان‌دوره‌ای (3 یا 6 ماهه) تهیه می‌کند؟</p>
        </div>
        <Switch
          checked={data.prepares_interim_fs || false}
          onCheckedChange={(checked) => handleChange("prepares_interim_fs", checked)}
        />
      </div>
    </div>
  );
}
