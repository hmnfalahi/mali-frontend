/**
 * Jalali (Persian/Shamsi) Calendar Utilities
 * Uses jalaali-js for Gregorian ↔ Jalali conversion
 */
import jalaali from 'jalaali-js';

/**
 * Convert a Gregorian date string (ISO format) to Jalali date object
 * @param {string} gregorianDateString - Date in ISO format (e.g., "2024-12-10" or "2024-12-10T12:30:00Z")
 * @returns {{ jy: number, jm: number, jd: number } | null} Jalali year, month, day or null if invalid
 */
export function gregorianToJalali(gregorianDateString) {
    if (!gregorianDateString) return null;

    try {
        const date = new Date(gregorianDateString);
        if (isNaN(date.getTime())) return null;

        const gy = date.getFullYear();
        const gm = date.getMonth() + 1; // JS months are 0-indexed
        const gd = date.getDate();

        return jalaali.toJalaali(gy, gm, gd);
    } catch {
        return null;
    }
}

/**
 * Convert Jalali date to Gregorian ISO format string
 * @param {number} jy - Jalali year (e.g., 1403)
 * @param {number} jm - Jalali month (1-12)
 * @param {number} jd - Jalali day (1-31)
 * @returns {string | null} ISO date string (e.g., "2024-12-10") or null if invalid
 */
export function jalaliToGregorian(jy, jm, jd) {
    if (!jy || !jm || !jd) return null;

    try {
        const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
        // Format as ISO date string YYYY-MM-DD
        const month = String(gm).padStart(2, '0');
        const day = String(gd).padStart(2, '0');
        return `${gy}-${month}-${day}`;
    } catch {
        return null;
    }
}

/**
 * Format a Gregorian date string as Jalali date for display
 * @param {string} gregorianDateString - Date in ISO format
 * @param {boolean} usePerisanDigits - Use Persian numerals (۰-۹) instead of Arabic (0-9)
 * @returns {string} Formatted Jalali date (e.g., "۱۴۰۳/۰۹/۲۰" or "1403/09/20")
 */
export function formatJalaliDate(gregorianDateString, usePersianDigits = true) {
    const jalali = gregorianToJalali(gregorianDateString);
    if (!jalali) return '-';

    const { jy, jm, jd } = jalali;
    const formatted = `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`;

    if (usePersianDigits) {
        return toPersianDigits(formatted);
    }
    return formatted;
}

/**
 * Format a Gregorian datetime string as Jalali date and time for display
 * @param {string} gregorianDateTimeString - DateTime in ISO format
 * @param {boolean} usePersianDigits - Use Persian numerals
 * @returns {string} Formatted Jalali datetime (e.g., "۱۴۰۳/۰۹/۲۰ ۱۲:۳۰")
 */
export function formatJalaliDateTime(gregorianDateTimeString, usePersianDigits = true) {
    if (!gregorianDateTimeString) return '-';

    const dateStr = formatJalaliDate(gregorianDateTimeString, usePersianDigits);
    if (dateStr === '-') return '-';

    try {
        const date = new Date(gregorianDateTimeString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const timeStr = `${hours}:${minutes}`;

        const formatted = `${dateStr} ${usePersianDigits ? toPersianDigits(timeStr) : timeStr}`;
        return formatted;
    } catch {
        return dateStr;
    }
}

/**
 * Parse a Jalali date string (user input) to Gregorian ISO format
 * @param {string} jalaliString - Jalali date string (e.g., "1403/09/20" or "۱۴۰۳/۰۹/۲۰")
 * @returns {string | null} ISO date string or null if invalid
 */
export function parseJalaliToISO(jalaliString) {
    if (!jalaliString) return null;

    // Convert Persian digits to Arabic if present
    const normalized = toEnglishDigits(jalaliString);

    // Try to parse YYYY/MM/DD or YYYY-MM-DD format
    const match = normalized.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
    if (!match) return null;

    const jy = parseInt(match[1], 10);
    const jm = parseInt(match[2], 10);
    const jd = parseInt(match[3], 10);

    // Validate ranges
    if (jm < 1 || jm > 12 || jd < 1 || jd > 31) return null;

    return jalaliToGregorian(jy, jm, jd);
}

/**
 * Convert Arabic/English digits to Persian digits
 * @param {string} str - String with Arabic digits
 * @returns {string} String with Persian digits
 */
export function toPersianDigits(str) {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(str).replace(/[0-9]/g, (d) => persianDigits[parseInt(d, 10)]);
}

/**
 * Convert Persian digits to Arabic/English digits
 * @param {string} str - String with Persian digits
 * @returns {string} String with Arabic digits
 */
export function toEnglishDigits(str) {
    return String(str)
        .replace(/[۰-۹]/g, (d) => d.charCodeAt(0) - '۰'.charCodeAt(0))
        .replace(/[٠-٩]/g, (d) => d.charCodeAt(0) - '٠'.charCodeAt(0)); // Arabic-Indic numerals
}

/**
 * Get Jalali month names
 * @returns {string[]} Array of Jalali month names in Farsi
 */
export function getJalaliMonthNames() {
    return [
        'فروردین', 'اردیبهشت', 'خرداد',
        'تیر', 'مرداد', 'شهریور',
        'مهر', 'آبان', 'آذر',
        'دی', 'بهمن', 'اسفند'
    ];
}

/**
 * Get the current Jalali date
 * @returns {{ jy: number, jm: number, jd: number }} Current Jalali date
 */
export function getCurrentJalaliDate() {
    const now = new Date();
    return jalaali.toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

/**
 * Check if a Jalali date is valid
 * @param {number} jy - Jalali year
 * @param {number} jm - Jalali month
 * @param {number} jd - Jalali day
 * @returns {boolean} True if valid
 */
export function isValidJalaliDate(jy, jm, jd) {
    return jalaali.isValidJalaaliDate(jy, jm, jd);
}

/**
 * Get the Gregorian ISO string for today
 * @returns {string} Today's date in ISO format
 */
export function getTodayISO() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Convert ISO date to Jalali formatted string for input display
 * @param {string} isoDate - ISO date string (e.g., "2024-12-10")
 * @returns {string} Jalali date string for input (e.g., "1403/09/20")
 */
export function isoToJalaliInput(isoDate) {
    if (!isoDate) return '';
    const jalali = gregorianToJalali(isoDate);
    if (!jalali) return '';
    const { jy, jm, jd } = jalali;
    return `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`;
}
