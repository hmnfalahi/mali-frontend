import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Plus,
    Trash2,
    Save,
    Loader2,
    AlertCircle,
    CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Dynamic Form Component
 * Renders form fields based on configuration from the backend
 * 
 * @param {Object} props
 * @param {Array} props.fields - Array of field configurations
 * @param {Object} props.initialData - Initial form data
 * @param {Function} props.onSave - Callback when form is saved
 * @param {boolean} props.isLoading - Whether form is currently saving
 * @param {boolean} props.canEdit - Whether form can be edited
 * @param {boolean} props.isConsultantView - Whether to use consultant theme colors
 */
export default function DynamicForm({ 
    fields = [], 
    initialData = {}, 
    onSave, 
    isLoading = false,
    canEdit = true,
    isConsultantView = false
}) {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [isDirty, setIsDirty] = useState(false);

    // Initialize form data from initialData
    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setFormData(initialData);
        } else {
            // Initialize with defaults
            const defaults = {};
            fields.forEach(field => {
                if (field.field_type === 'DATA_GRID') {
                    defaults[field.field_key] = [];
                } else {
                    defaults[field.field_key] = '';
                }
            });
            setFormData(defaults);
        }
    }, [initialData, fields]);

    const handleFieldChange = (fieldKey, value) => {
        setFormData(prev => ({ ...prev, [fieldKey]: value }));
        setIsDirty(true);
        // Clear error when user starts typing
        if (errors[fieldKey]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldKey];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        const newErrors = {};
        fields.forEach(field => {
            if (field.is_mandatory) {
                const value = formData[field.field_key];
                if (value === null || value === undefined || value === '' || 
                    (Array.isArray(value) && value.length === 0)) {
                    newErrors[field.field_key] = `فیلد «${field.label}» الزامی است`;
                }
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (onSave) {
            await onSave(formData);
            setIsDirty(false);
        }
    };

    // Theme colors
    const themeColors = isConsultantView ? {
        primary: 'from-[#0f766e] to-[#14b8a6]',
        button: 'bg-gradient-to-l from-[#0f766e] to-[#14b8a6]',
        accent: 'text-[#0f766e]',
        border: 'border-[#0f766e]/30',
        bg: 'bg-[#0f766e]/5',
    } : {
        primary: 'from-[#1e3a5f] to-[#2d5a8a]',
        button: 'bg-gradient-to-l from-[#1e3a5f] to-[#2d5a8a]',
        accent: 'text-[#1e3a5f]',
        border: 'border-[#1e3a5f]/30',
        bg: 'bg-[#1e3a5f]/5',
    };

    if (!fields || fields.length === 0) {
        return null;
    }

    // Render different field types
    const renderField = (field) => {
        const value = formData[field.field_key];
        const error = errors[field.field_key];
        const disabled = !canEdit || isLoading;

        switch (field.field_type) {
            case 'TEXT':
                return (
                    <Input
                        id={field.field_key}
                        value={value || ''}
                        onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
                        placeholder={field.placeholder || ''}
                        disabled={disabled}
                        className={error ? 'border-red-500' : ''}
                    />
                );

            case 'TEXTAREA':
                return (
                    <Textarea
                        id={field.field_key}
                        value={value || ''}
                        onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
                        placeholder={field.placeholder || ''}
                        disabled={disabled}
                        rows={3}
                        className={error ? 'border-red-500' : ''}
                    />
                );

            case 'NUMBER':
                return (
                    <Input
                        id={field.field_key}
                        type="number"
                        value={value || ''}
                        onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
                        placeholder={field.placeholder || ''}
                        disabled={disabled}
                        min={field.meta_options?.min}
                        max={field.meta_options?.max}
                        className={`text-left dir-ltr ${error ? 'border-red-500' : ''}`}
                    />
                );

            case 'DATE':
                return (
                    <Input
                        id={field.field_key}
                        type="date"
                        value={value || ''}
                        onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
                        disabled={disabled}
                        className={error ? 'border-red-500' : ''}
                    />
                );

            case 'SELECT':
                const options = field.meta_options?.options || [];
                return (
                    <Select
                        value={value || ''}
                        onValueChange={(val) => handleFieldChange(field.field_key, val)}
                        disabled={disabled}
                    >
                        <SelectTrigger className={error ? 'border-red-500' : ''}>
                            <SelectValue placeholder={field.placeholder || 'انتخاب کنید...'} />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );

            case 'DATA_GRID':
                return (
                    <DataGrid
                        field={field}
                        value={value || []}
                        onChange={(val) => handleFieldChange(field.field_key, val)}
                        disabled={disabled}
                        error={error}
                        themeColors={themeColors}
                    />
                );

            default:
                return (
                    <Input
                        id={field.field_key}
                        value={value || ''}
                        onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
                        placeholder={field.placeholder || ''}
                        disabled={disabled}
                    />
                );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form Fields */}
            <div className="space-y-4">
                {fields.map((field, index) => (
                    <motion.div
                        key={field.field_key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 rounded-xl border ${
                            errors[field.field_key] 
                                ? 'border-red-200 bg-red-50/50' 
                                : 'border-slate-200 bg-white'
                        }`}
                    >
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label 
                                    htmlFor={field.field_key}
                                    className={`font-medium ${themeColors.accent}`}
                                >
                                    {field.label}
                                    {field.is_mandatory && (
                                        <span className="text-red-500 mr-1">*</span>
                                    )}
                                </Label>
                                {formData[field.field_key] && field.field_type !== 'DATA_GRID' && (
                                    <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                                        <CheckCircle2 className="w-3 h-3 ml-1" />
                                        تکمیل شده
                                    </Badge>
                                )}
                            </div>

                            {renderField(field)}

                            {/* Help Text */}
                            {field.help_text && (
                                <p className="text-xs text-slate-500 mt-1">
                                    {field.help_text}
                                </p>
                            )}

                            {/* Error */}
                            {errors[field.field_key] && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors[field.field_key]}
                                </p>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Save Button */}
            {canEdit && (
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button
                        type="submit"
                        disabled={isLoading || !isDirty}
                        className={themeColors.button}
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin ml-2" />
                        ) : (
                            <Save className="w-4 h-4 ml-2" />
                        )}
                        ذخیره اطلاعات
                    </Button>
                </div>
            )}
        </form>
    );
}

/**
 * Data Grid Component for table-like data entry
 */
function DataGrid({ field, value, onChange, disabled, error, themeColors }) {
    const columns = field.meta_options?.columns || [];
    const minRows = field.meta_options?.min_rows || 0;
    const maxRows = field.meta_options?.max_rows || 50;

    const addRow = () => {
        if (value.length >= maxRows) return;
        
        const newRow = {};
        columns.forEach(col => {
            newRow[col.key] = '';
        });
        onChange([...value, newRow]);
    };

    const removeRow = (index) => {
        if (value.length <= minRows) return;
        const newValue = [...value];
        newValue.splice(index, 1);
        onChange(newValue);
    };

    const updateCell = (rowIndex, columnKey, cellValue) => {
        const newValue = [...value];
        newValue[rowIndex] = {
            ...newValue[rowIndex],
            [columnKey]: cellValue
        };
        onChange(newValue);
    };

    return (
        <div className={`rounded-lg border ${error ? 'border-red-200' : 'border-slate-200'} overflow-hidden`}>
            {/* Table Header */}
            <div className={`grid gap-2 p-3 ${themeColors.bg} border-b border-slate-200`}
                style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr) 40px` }}
            >
                {columns.map(col => (
                    <div key={col.key} className={`text-sm font-medium ${themeColors.accent}`}>
                        {col.label}
                        {col.required !== false && <span className="text-red-500 mr-1">*</span>}
                    </div>
                ))}
                <div></div>
            </div>

            {/* Table Body */}
            <div className="p-2 space-y-2">
                <AnimatePresence>
                    {value.map((row, rowIndex) => (
                        <motion.div
                            key={rowIndex}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="grid gap-2 items-center"
                            style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr) 40px` }}
                        >
                            {columns.map(col => (
                                <Input
                                    key={col.key}
                                    type={col.type === 'number' ? 'number' : 'text'}
                                    value={row[col.key] || ''}
                                    onChange={(e) => updateCell(rowIndex, col.key, e.target.value)}
                                    disabled={disabled}
                                    placeholder={col.label}
                                    className={`text-sm ${col.type === 'number' ? 'text-left dir-ltr' : ''}`}
                                />
                            ))}
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeRow(rowIndex)}
                                disabled={disabled || value.length <= minRows}
                                className="text-red-500 hover:bg-red-50 h-8 w-8"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Empty State */}
                {value.length === 0 && (
                    <div className="text-center py-6 text-slate-400 text-sm">
                        هیچ آیتمی وجود ندارد. دکمه زیر را برای افزودن آیتم کلیک کنید.
                    </div>
                )}
            </div>

            {/* Add Row Button */}
            {!disabled && value.length < maxRows && (
                <div className="p-2 border-t border-slate-100">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addRow}
                        className={`w-full ${themeColors.accent} ${themeColors.border}`}
                    >
                        <Plus className="w-4 h-4 ml-2" />
                        افزودن سطر جدید
                    </Button>
                </div>
            )}

            {/* Row Count Info */}
            <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
                {value.length} از {maxRows} سطر
                {minRows > 0 && ` (حداقل ${minRows} سطر الزامی)`}
            </div>
        </div>
    );
}

