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
    ChevronLeft,
    Users,
    ClipboardList,
    Settings,
    Layers,
    ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Layout({ children, currentPageName, isConsultant = false, isAdmin = false }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout, isAdmin: userIsAdmin } = useAuth();
    const location = useLocation();

    // Detect if user is admin based on route or auth context
    const showAdminLayout = isAdmin || userIsAdmin;

    // Landing page doesn't need layout
    if (currentPageName === "Landing" || currentPageName === "Home") {
        return children;
    }

    // Navigation items based on role
    const companyNavigation = [
        { name: "داشبورد", href: createPageUrl("Dashboard"), icon: LayoutDashboard },
        { name: "اطلاعات شرکت", href: createPageUrl("CompanyProfile"), icon: Building2 },
        { name: "درخواست‌های من", href: createPageUrl("MyRequests"), icon: FileText },
    ];

    const consultantNavigation = [
        { name: "داشبورد", href: createPageUrl("ConsultantDashboard"), icon: LayoutDashboard },
    ];

    const adminNavigation = [
        { name: "داشبورد", href: createPageUrl("AdminDashboard"), icon: LayoutDashboard },
        { name: "درخواست‌ها", href: createPageUrl("AdminRequests"), icon: FileText },
        { name: "شرکت‌ها", href: createPageUrl("AdminCompanies"), icon: Building2 },
        { name: "انواع تامین مالی", href: createPageUrl("AdminFinancingTypes"), icon: Layers },
    ];

    const navigation = showAdminLayout ? adminNavigation : (isConsultant ? consultantNavigation : companyNavigation);

    const isActive = (href) => {
        return location.pathname === href;
    };

    // Theme colors based on role
    // Admin: Royal Purple + Gold | Consultant: Teal + Gold | Company: Petroleum Blue + Gold
    const themeColors = showAdminLayout ? {
        gradient: "from-[#5b21b6] to-[#7c3aed]",
        gradientFull: "from-[#5b21b6] via-[#7c3aed] to-[#5b21b6]",
        shadow: "shadow-[#5b21b6]/20",
        accent: "text-purple-200",
        bgAccent: "bg-[#5b21b6]/10",
        textAccent: "text-[#5b21b6]",
        gold: "#d4af37",
        roleLabel: "ادمین سیستم",
        roleIcon: ShieldCheck,
    } : isConsultant ? {
        gradient: "from-[#0f766e] to-[#14b8a6]",
        gradientFull: "from-[#0f766e] via-[#14b8a6] to-[#0f766e]",
        shadow: "shadow-[#0f766e]/20",
        accent: "text-teal-200",
        bgAccent: "bg-[#0f766e]/10",
        textAccent: "text-[#0f766e]",
        gold: "#d4af37",
        roleLabel: "مشاور",
        roleIcon: Users,
    } : {
        gradient: "from-[#1e3a5f] to-[#2d5a8a]",
        gradientFull: "from-[#1e3a5f] via-[#2d5a8a] to-[#1e3a5f]",
        shadow: "shadow-[#1e3a5f]/20",
        accent: "text-[#d4af37]",
        bgAccent: "bg-[#1e3a5f]/10",
        textAccent: "text-[#1e3a5f]",
        gold: "#d4af37",
        roleLabel: "شرکت",
        roleIcon: Building2,
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
                    <h1 className={`text-lg font-bold bg-gradient-to-l ${themeColors.gradient} bg-clip-text text-transparent`}>
                        {showAdminLayout ? "پنل مدیریت" : (isConsultant ? "پنل مشاور" : "پلتفرم هوشمند تأمین مالی")}
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
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${themeColors.gradient} flex items-center justify-center shadow-lg ${themeColors.shadow}`}>
                                    {isConsultant ? (
                                        <Users className="w-6 h-6 text-white" />
                                    ) : (
                                        <CreditCard className="w-6 h-6 text-white" />
                                    )}
                                </div>
                                <div>
                                    <h1 className={`text-sm font-bold ${isConsultant ? 'text-teal-700' : 'text-[#1e3a5f]'}`}>
                                        {isConsultant ? "پنل مشاور" : "پلتفرم هوشمند"}
                                    </h1>
                                    <p className="text-xs text-slate-500">
                                        {isConsultant ? "مدیریت درخواست‌ها" : "تأمین مالی و خدمات مالی"}
                                    </p>
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
                                        ? `bg-gradient-to-l ${themeColors.gradient} text-white shadow-lg ${themeColors.shadow}`
                                        : `text-slate-600 hover:bg-slate-100`
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 ${active ? "text-white" : `text-slate-400 group-hover:${themeColors.textAccent}`}`} />
                                    <span className="font-medium">{item.name}</span>
                                    {active && <ChevronLeft className="w-4 h-4 mr-auto" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Section */}
                    {user && (
                        <div className="p-4 border-t border-slate-100">
                            {(() => {
                                const isAccountActive = isActive(createPageUrl("Account"));
                                return (
                                    <Link
                                        to={createPageUrl("Account")}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                            isAccountActive
                                                ? `bg-gradient-to-l ${themeColors.gradient} shadow-lg ${themeColors.shadow}`
                                                : "bg-slate-50 hover:bg-slate-100"
                                        }`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                            isAccountActive
                                                ? "bg-white/20"
                                                : "bg-gradient-to-br from-[#d4af37] to-[#e8c963]"
                                        }`}>
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium truncate ${isAccountActive ? "text-white" : "text-slate-800"}`}>
                                                {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.phone_number}
                                            </p>
                                            <p className={`text-xs truncate ${isAccountActive ? "text-white/70" : "text-slate-500"}`}>{user.phone_number}</p>
                                        </div>
                                        <ChevronLeft className={`w-4 h-4 ${isAccountActive ? "text-white" : "text-slate-400"}`} />
                                    </Link>
                                );
                            })()}
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
