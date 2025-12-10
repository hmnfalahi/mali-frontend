import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Calendar, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    gregorianToJalali,
    jalaliToGregorian,
    getJalaliMonthNames,
    getCurrentJalaliDate,
    isValidJalaliDate,
    toEnglishDigits,
    parseJalaliToISO,
    isoToJalaliInput
} from "@/utils/jalali";
import jalaali from "jalaali-js";

/**
 * JalaliDatePicker - A beautiful date picker component for Jalali (Persian) calendar
 * 
 * @param {Object} props
 * @param {string} props.value - The date value in ISO format (e.g., "2024-12-10")
 * @param {function} props.onChange - Callback with ISO date string when date is selected
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.id - Input ID
 * @param {boolean} props.disabled - Whether input is disabled
 * @param {boolean} props.required - Whether input is required
 * @param {string} props.minDate - Minimum selectable date in ISO format
 * @param {string} props.maxDate - Maximum selectable date in ISO format
 */
export function JalaliDatePicker({
    value,
    onChange,
    placeholder = "انتخاب تاریخ",
    className = "",
    id,
    disabled = false,
    required = false,
    minDate,
    maxDate,
    ...props
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [isValid, setIsValid] = useState(true);
    const containerRef = useRef(null);

    // Calendar state
    const currentJalali = getCurrentJalaliDate();
    const [viewYear, setViewYear] = useState(currentJalali.jy);
    const [viewMonth, setViewMonth] = useState(currentJalali.jm);
    const [selectedDate, setSelectedDate] = useState(null);

    const monthNames = getJalaliMonthNames();
    const weekDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

    // Sync with external value
    useEffect(() => {
        if (value) {
            const jalali = gregorianToJalali(value);
            if (jalali) {
                setSelectedDate(jalali);
                setViewYear(jalali.jy);
                setViewMonth(jalali.jm);
                setInputValue(isoToJalaliInput(value));
                setIsValid(true);
            }
        } else {
            setSelectedDate(null);
            setInputValue("");
            setIsValid(true);
        }
    }, [value]);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Get days in month
    const getDaysInMonth = (year, month) => {
        return jalaali.jalaaliMonthLength(year, month);
    };

    // Get first day of month (Saturday = 0, Friday = 6)
    const getFirstDayOfMonth = (year, month) => {
        const { gy, gm, gd } = jalaali.toGregorian(year, month, 1);
        const date = new Date(gy, gm - 1, gd);
        // Convert JS day (Sunday = 0) to Persian day (Saturday = 0)
        return (date.getDay() + 1) % 7;
    };

    // Check if date is disabled
    const isDateDisabled = (year, month, day) => {
        if (!isValidJalaliDate(year, month, day)) return true;

        const isoDate = jalaliToGregorian(year, month, day);
        if (!isoDate) return true;

        if (minDate && isoDate < minDate) return true;
        if (maxDate && isoDate > maxDate) return true;

        return false;
    };

    // Check if date is selected
    const isDateSelected = (day) => {
        return selectedDate &&
            selectedDate.jy === viewYear &&
            selectedDate.jm === viewMonth &&
            selectedDate.jd === day;
    };

    // Check if date is today
    const isToday = (day) => {
        return currentJalali.jy === viewYear &&
            currentJalali.jm === viewMonth &&
            currentJalali.jd === day;
    };

    // Handle day selection
    const handleDaySelect = (day) => {
        if (isDateDisabled(viewYear, viewMonth, day)) return;

        const isoDate = jalaliToGregorian(viewYear, viewMonth, day);
        if (isoDate) {
            setSelectedDate({ jy: viewYear, jm: viewMonth, jd: day });
            setInputValue(isoToJalaliInput(isoDate));
            setIsValid(true);
            onChange && onChange(isoDate);
            setIsOpen(false);
        }
    };

    // Navigate months
    const goToPreviousMonth = () => {
        if (viewMonth === 1) {
            setViewMonth(12);
            setViewYear(viewYear - 1);
        } else {
            setViewMonth(viewMonth - 1);
        }
    };

    const goToNextMonth = () => {
        if (viewMonth === 12) {
            setViewMonth(1);
            setViewYear(viewYear + 1);
        } else {
            setViewMonth(viewMonth + 1);
        }
    };

    // Navigate years
    const goToPreviousYear = () => setViewYear(viewYear - 1);
    const goToNextYear = () => setViewYear(viewYear + 1);

    // Go to today
    const goToToday = () => {
        const today = getCurrentJalaliDate();
        setViewYear(today.jy);
        setViewMonth(today.jm);
    };

    // Handle input change
    const handleInputChange = (e) => {
        let rawValue = e.target.value;
        const normalizedValue = toEnglishDigits(rawValue);
        const cleanValue = normalizedValue.replace(/[^0-9\/\-]/g, '');

        // Auto-format
        let formattedValue = cleanValue;
        if (cleanValue.length === 4 && !cleanValue.includes('/')) {
            formattedValue = cleanValue + '/';
        } else if (cleanValue.length === 7 && cleanValue.split('/').length === 2) {
            formattedValue = cleanValue + '/';
        }

        setInputValue(formattedValue);

        if (formattedValue.length >= 8) {
            const isoDate = parseJalaliToISO(formattedValue);
            if (isoDate) {
                setIsValid(true);
                const jalali = gregorianToJalali(isoDate);
                if (jalali) {
                    setSelectedDate(jalali);
                    setViewYear(jalali.jy);
                    setViewMonth(jalali.jm);
                }
                onChange && onChange(isoDate);
            } else {
                setIsValid(false);
            }
        } else if (formattedValue.length === 0) {
            setIsValid(true);
            setSelectedDate(null);
            onChange && onChange("");
        } else {
            setIsValid(true);
        }
    };

    // Handle input blur
    const handleInputBlur = () => {
        if (inputValue && inputValue.length > 0) {
            const isoDate = parseJalaliToISO(inputValue);
            if (isoDate) {
                setIsValid(true);
                const normalizedJalali = isoToJalaliInput(isoDate);
                setInputValue(normalizedJalali);
            } else {
                setIsValid(false);
            }
        }
    };

    // Generate calendar days
    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(viewYear, viewMonth);
        const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
        const days = [];

        // Empty cells for days before the first day
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="w-9 h-9" />);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const isDisabled = isDateDisabled(viewYear, viewMonth, day);
            const isSelected = isDateSelected(day);
            const isTodayDate = isToday(day);

            days.push(
                <button
                    key={day}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleDaySelect(day)}
                    className={`
                        w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200
                        flex items-center justify-center
                        ${isSelected
                            ? 'bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a] text-white shadow-md'
                            : isTodayDate
                                ? 'bg-[#d4af37]/20 text-[#1e3a5f] ring-1 ring-[#d4af37]'
                                : isDisabled
                                    ? 'text-slate-300 cursor-not-allowed'
                                    : 'text-slate-700 hover:bg-slate-100'
                        }
                    `}
                >
                    {day}
                </button>
            );
        }

        return days;
    };

    return (
        <div ref={containerRef} className="relative" dir="rtl">
            {/* Input field */}
            <div className="relative">
                <Input
                    id={id}
                    type="text"
                    inputMode="numeric"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onFocus={() => !disabled && setIsOpen(true)}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    className={`
                        h-12 pl-12 pr-4 text-right font-sans cursor-pointer
                        ${!isValid ? 'border-red-500 focus:ring-red-500' : ''}
                        ${className}
                    `}
                    autoComplete="off"
                    {...props}
                />
                <button
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    className="absolute left-1 top-1/2 -translate-y-1/2 p-2.5 text-slate-400 hover:text-[#1e3a5f] transition-colors rounded-lg hover:bg-slate-100"
                >
                    <Calendar className="w-5 h-5" />
                </button>
            </div>

            {/* Validation error */}
            {!isValid && (
                <p className="text-xs text-red-500 mt-1 text-right">
                    فرمت تاریخ نامعتبر است (مثال: 1403/09/20)
                </p>
            )}

            {/* Calendar dropdown */}
            <AnimatePresence>
                {isOpen && !disabled && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 mt-2 w-[320px] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-l from-[#1e3a5f] to-[#2d5a8a] text-white p-4">
                            <div className="flex items-center justify-between mb-3">
                                <button
                                    type="button"
                                    onClick={goToNextYear}
                                    className="p-1.5 rounded-lg hover:bg-white/20 transition-colors flex items-center"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                    <ChevronRight className="w-5 h-5 -mr-3" />
                                </button>
                                <span className="text-lg font-bold">{viewYear}</span>
                                <button
                                    type="button"
                                    onClick={goToPreviousYear}
                                    className="p-1.5 rounded-lg hover:bg-white/20 transition-colors flex items-center"
                                >
                                    <ChevronLeft className="w-5 h-5 -ml-3" />
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={goToNextMonth}
                                    className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                                <span className="text-base font-medium">{monthNames[viewMonth - 1]}</span>
                                <button
                                    type="button"
                                    onClick={goToPreviousMonth}
                                    className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Calendar body */}
                        <div className="p-4">
                            {/* Week days header */}
                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {weekDays.map((day, index) => (
                                    <div
                                        key={day}
                                        className={`
                                            w-9 h-9 flex items-center justify-center text-xs font-medium
                                            ${index === 6 ? 'text-red-500' : 'text-slate-500'}
                                        `}
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Days grid */}
                            <div className="grid grid-cols-7 gap-1">
                                {generateCalendarDays()}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-slate-100 px-4 py-3 flex items-center justify-between bg-slate-50">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={goToToday}
                                className="text-[#1e3a5f] hover:text-[#1e3a5f] hover:bg-[#1e3a5f]/10 text-xs"
                            >
                                امروز
                            </Button>
                            <div className="flex gap-2">
                                {selectedDate && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedDate(null);
                                            setInputValue("");
                                            onChange && onChange("");
                                        }}
                                        className="text-slate-500 hover:text-red-500 hover:bg-red-50 text-xs"
                                    >
                                        <X className="w-3.5 h-3.5 ml-1" />
                                        پاک کردن
                                    </Button>
                                )}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsOpen(false)}
                                    className="text-slate-500 text-xs"
                                >
                                    بستن
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default JalaliDatePicker;
