import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function BasicInfoForm({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
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
          <Label htmlFor="fiscal_year_end_date">تاریخ پایان سال مالی <span className="text-red-500">*</span></Label>
          <Input
            id="fiscal_year_end_date"
            type="date"
            value={data.fiscal_year_end_date || ""}
            onChange={(e) => handleChange("fiscal_year_end_date", e.target.value)}
            className="h-12"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="activity_subject">موضوع فعالیت <span className="text-red-500">*</span></Label>
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
          <p className="text-sm text-slate-500 mt-1">آیا شرکت صورتهای مالی حسابرسی شده میان‌دوره‌ای (۳ یا ۶ ماهه) تهیه می‌کند؟</p>
        </div>
        <Switch
          checked={data.prepares_interim_fs || false}
          onCheckedChange={(checked) => handleChange("prepares_interim_fs", checked)}
        />
      </div>
    </div>
  );
}
