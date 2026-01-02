import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function createPageUrl(page) {
    const mapping = {
        "Dashboard": "/dashboard",
        "ConsultantDashboard": "/consultant-dashboard",
        "AdminDashboard": "/admin-dashboard",
        "AdminRequests": "/admin/requests",
        "AdminCompanies": "/admin/companies",
        "AdminFinancingTypes": "/admin/financing-types",
        "Home": "/",
        "Landing": "/",
        "CompanyProfile": "/company-profile",
        "MyRequests": "/my-requests",
        "RequestDetail": "/request",
        "Account": "/account"
    };
    return mapping[page] || "#";
}

// Format number with Persian separators
export function formatNumber(num) {
    if (num === null || num === undefined) return "-";
    return new Intl.NumberFormat("fa-IR").format(num);
}

// Format currency (Rial)
export function formatCurrency(amount) {
    if (amount === null || amount === undefined) return "-";
    return `${new Intl.NumberFormat("fa-IR").format(amount)} ریال`;
}
