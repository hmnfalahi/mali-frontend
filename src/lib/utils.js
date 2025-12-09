import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function createPageUrl(page) {
    // Simple mapping for now
    const mapping = {
        "Dashboard": "/dashboard",
        "Home": "/",
        "Landing": "/",
        "CompanyProfile": "/company-profile",
        "MyRequests": "/my-requests"
    };
    return mapping[page] || "#";
}
