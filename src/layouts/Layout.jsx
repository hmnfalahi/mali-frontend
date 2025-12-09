import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/lib/utils";
import {
    LayoutDashboard,
    Building2,
    FileText,
    CreditCard,
    Menu,
    X,
    LogOut,
    User,
    ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Layout({ children, currentPageName }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuth(); // Replaced local state and useEffect with useAuth hook
    const location = useLocation();

    // Landing page doesn't need layout
    if (currentPageName === "Landing" || currentPageName === "Home") {
        return children;
    }

    const navigation = [
        { name: "داشبورد", href: createPageUrl("Dashboard"), icon: LayoutDashboard },
        { name: "اطلاعات شرکت", href: createPageUrl("CompanyProfile"), icon: Building2 },
        { name: "درخواست‌های من", href: createPageUrl("MyRequests"), icon: FileText },
    ];

    const isActive = (href) => {
        // createPageUrl returns path like "/dashboard", location.pathname is "/dashboard"
        // Use simple string comparison or check if href is included in pathname
        return location.pathname === href;
    };

    return (
        <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 right-0 left-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-4 py-3">
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <Menu className="h-6 w-6 text-slate-700" />
                    </Button>
                    <h1 className="text-lg font-bold bg-gradient-to-l from-[#1e3a5f] to-[#2d5a8a] bg-clip-text text-transparent">
                        پلتفرم هوشمند تأمین مالی
                    </h1>
                    <div className="w-10" />
                </div>
            </div>

            {/* Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 right-0 z-50 h-full w-72 bg-white/95 backdrop-blur-xl border-l border-slate-200/50 transform transition-transform duration-300 ease-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "translate-x-full"
                    } lg:transform-none`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="p-6 border-b border-slate-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a] flex items-center justify-center shadow-lg shadow-blue-900/20">
                                    <CreditCard className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-sm font-bold text-[#1e3a5f]">پلتفرم هوشمند</h1>
                                    <p className="text-xs text-slate-500">تأمین مالی و خدمات مالی</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active
                                        ? "bg-gradient-to-l from-[#1e3a5f] to-[#2d5a8a] text-white shadow-lg shadow-blue-900/20"
                                        : "text-slate-600 hover:bg-slate-100"
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 ${active ? "text-white" : "text-slate-400 group-hover:text-[#1e3a5f]"}`} />
                                    <span className="font-medium">{item.name}</span>
                                    {active && <ChevronLeft className="w-4 h-4 mr-auto" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Section */}
                    {user && (
                        <div className="p-4 border-t border-slate-100">
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#e8c963] flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-800 truncate">
                                        {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.phone_number}
                                    </p>
                                    <p className="text-xs text-slate-500 truncate">{user.phone_number}</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                className="w-full mt-2 text-slate-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => logout()}
                            >
                                <LogOut className="w-4 h-4 ml-2" />
                                خروج از حساب
                            </Button>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:mr-72 min-h-screen pt-16 lg:pt-0">
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
