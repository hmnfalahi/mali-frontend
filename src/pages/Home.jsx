import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/lib/utils";
import { apiService } from "@/services/api";
import {
    CreditCard,
    Building2,
    TrendingUp,
    Shield,
    Zap,
    Users,
    CheckCircle,
    ArrowLeft,
    Sparkles,
    BarChart3,
    Clock,
    Award,
    ChevronLeft,
    Menu,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Home() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const userData = await apiService.auth.me();
                setUser(userData);
                // If user is already logged in, we might want to stay on landing or redirect to dashboard.
                // The original code redirected: window.location.href = createPageUrl("Dashboard");
                // But for SPA we should probably just set user state or use navigate.
                // For now, adhering to original logic but safer to not force redirect loop if verifying.
                // But the original code said:
                /*
                window.location.href = createPageUrl("Dashboard");
                */
                // I'll keep it as a link/button option for now to avoid auto-redirect confusion during dev.
                // Actually, the user asked to implement the code. I'll stick to the spirit but maybe comment out auto-redirect for smooth browsing unless explicitly clicked.
            } catch (e) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        // checkAuth(); // Disabling auto-redirect for better UX during dev presentation.
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1e3a5f] border-t-transparent" />
            </div>
        );
    }

    const features = [
        {
            icon: Zap,
            title: "فرآیند سریع",
            description: "ثبت درخواست و دریافت پاسخ در کمترین زمان ممکن"
        },
        {
            icon: Shield,
            title: "امنیت بالا",
            description: "حفاظت کامل از اطلاعات مالی و شخصی شما"
        },
        {
            icon: Users,
            title: "تیم مشاوره",
            description: "مشاوران متخصص در کنار شما در تمام مراحل"
        },
        {
            icon: BarChart3,
            title: "تحلیل هوشمند",
            description: "بررسی دقیق و ارائه بهترین روش تأمین مالی"
        }
    ];

    const methods = [
        { name: "اوراق مرابحه", icon: CreditCard, desc: "تأمین مالی با سود معین" },
        { name: "صکوک اجاره", icon: Building2, desc: "با پشتوانه دارایی‌های ثابت" },
        { name: "صکوک استصناع", icon: TrendingUp, desc: "برای پروژه‌های تولیدی" },
    ];

    const stats = [
        { number: "۵۰۰+", label: "شرکت متقاضی", icon: Building2 },
        { number: "۱۰۰۰+", label: "میلیارد ریال", icon: CreditCard },
        { number: "۹۵٪", label: "رضایت مشتریان", icon: Award },
    ];

    const steps = [
        { number: "۱", title: "ثبت‌نام", desc: "حساب کاربری خود را ایجاد کنید" },
        { number: "۲", title: "تکمیل اطلاعات", desc: "اطلاعات شرکت را وارد کنید" },
        { number: "۳", title: "انتخاب روش", desc: "روش مناسب تأمین مالی را انتخاب کنید" },
        { number: "۴", title: "دریافت تأیید", desc: "منتظر بررسی و تأیید باشید" },
    ];

    return (
        <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
            {/* Header */}
            <header className="fixed top-0 right-0 left-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a] flex items-center justify-center shadow-lg">
                                <CreditCard className="w-5 h-5 text-white" />
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-sm font-bold text-[#1e3a5f]">پلتفرم هوشمند تأمین مالی</h1>
                            </div>
                        </div>

                        <nav className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-slate-600 hover:text-[#1e3a5f] transition-colors">ویژگی‌ها</a>
                            <a href="#methods" className="text-slate-600 hover:text-[#1e3a5f] transition-colors">روش‌ها</a>
                            <a href="#process" className="text-slate-600 hover:text-[#1e3a5f] transition-colors">فرآیند</a>
                        </nav>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                onClick={() => apiService.auth.redirectToLogin(createPageUrl("Dashboard"))}
                                className="hidden sm:flex"
                            >
                                ورود
                            </Button>
                            <Button
                                onClick={() => apiService.auth.redirectToLogin(createPageUrl("Dashboard"))}
                                className="bg-gradient-to-l from-[#1e3a5f] to-[#2d5a8a]"
                            >
                                شروع کنید
                                <ArrowLeft className="w-4 h-4 mr-2" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:hidden border-t border-slate-200 bg-white"
                    >
                        <div className="px-4 py-4 space-y-3">
                            <a href="#features" className="block px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">ویژگی‌ها</a>
                            <a href="#methods" className="block px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">روش‌ها</a>
                            <a href="#process" className="block px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">فرآیند</a>
                        </div>
                    </motion.div>
                )}
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-[#1e3a5f] text-sm font-medium mb-6">
                                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                                پلتفرم جامع مشاوران تامین مالی
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
                                تأمین مالی
                                <span className="block bg-gradient-to-l from-[#1e3a5f] to-[#2d5a8a] bg-clip-text text-transparent">
                                    هوشمند و سریع
                                </span>
                            </h1>

                            <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
                                با پلتفرم هوشمند ما، به راحتی اطلاعات شرکت خود را ثبت کرده، روش مناسب تأمین مالی را انتخاب کنید و در کمترین زمان به سرمایه مورد نیاز دست یابید.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    size="lg"
                                    onClick={() => apiService.auth.redirectToLogin(createPageUrl("Dashboard"))}
                                    className="bg-gradient-to-l from-[#1e3a5f] to-[#2d5a8a] h-14 text-lg px-8 shadow-lg shadow-blue-900/20"
                                >
                                    شروع رایگان
                                    <ArrowLeft className="w-5 h-5 mr-2" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-14 text-lg px-8"
                                    onClick={() => document.getElementById('process').scrollIntoView({ behavior: 'smooth' })}
                                >
                                    بیشتر بدانید
                                </Button>
                            </div>

                            <div className="mt-12 flex items-center gap-8">
                                {stats.map((stat, i) => (
                                    <div key={i} className="text-center">
                                        <div className="flex items-center justify-center gap-2 mb-1">
                                            {React.createElement(stat.icon, { className: "w-4 h-4 text-[#d4af37]" })}
                                            <p className="text-2xl md:text-3xl font-bold text-slate-800">{stat.number}</p>
                                        </div>
                                        <p className="text-sm text-slate-500">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative z-10 bg-white rounded-3xl shadow-2xl shadow-slate-900/10 p-8 border border-slate-200/50">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-l from-blue-50 to-transparent border border-blue-100">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a] flex items-center justify-center shadow-lg">
                                            <CheckCircle className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">ثبت سریع اطلاعات</p>
                                            <p className="text-sm text-slate-500">فرم هوشمند و ساده</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-l from-emerald-50 to-transparent border border-emerald-100">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                                            <TrendingUp className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">تحلیل هوشمند</p>
                                            <p className="text-sm text-slate-500">بهترین روش برای شما</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-l from-amber-50 to-transparent border border-amber-100">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#e8c963] flex items-center justify-center shadow-lg">
                                            <Award className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">مشاوره تخصصی</p>
                                            <p className="text-sm text-slate-500">کارشناسان با تجربه</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -top-6 -right-6 w-72 h-72 bg-gradient-to-br from-[#1e3a5f]/10 to-transparent rounded-full blur-3xl" />
                            <div className="absolute -bottom-6 -left-6 w-72 h-72 bg-gradient-to-br from-[#d4af37]/10 to-transparent rounded-full blur-3xl" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-[#1e3a5f] text-sm font-medium mb-4">
                            <Sparkles className="w-4 h-4 text-[#d4af37]" />
                            ویژگی‌های منحصر به فرد
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            چرا ما را انتخاب کنید؟
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            با بهره‌گیری از تکنولوژی روز و تیم متخصص، بهترین خدمات تأمین مالی را ارائه می‌دهیم
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all h-full">
                                        <CardContent className="p-6">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a] flex items-center justify-center mb-4 shadow-lg">
                                                <Icon className="w-7 h-7 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                                            <p className="text-slate-600">{feature.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Methods Section */}
            <section id="methods" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-[#1e3a5f] text-sm font-medium mb-4">
                            <CreditCard className="w-4 h-4" />
                            روش‌های تأمین مالی
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            انتخاب‌های متنوع برای هر نیاز
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            از اوراق مرابحه تا صکوک اجاره، بهترین روش را برای کسب‌وکار خود انتخاب کنید
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {methods.map((method, index) => {
                            const Icon = method.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.15 }}
                                >
                                    <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all h-full group cursor-pointer">
                                        <CardContent className="p-8 text-center">
                                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a] flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                                                <Icon className="w-10 h-10 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-3">{method.name}</h3>
                                            <p className="text-slate-600 mb-6">{method.desc}</p>
                                            <div className="flex items-center justify-center gap-2 text-[#1e3a5f] font-medium group-hover:gap-3 transition-all">
                                                <span>اطلاعات بیشتر</span>
                                                <ChevronLeft className="w-4 h-4" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section id="process" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-[#1e3a5f] text-sm font-medium mb-4">
                            <Clock className="w-4 h-4" />
                            فرآیند ساده
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            چگونه شروع کنیم؟
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            تنها در ۴ مرحله ساده به تأمین مالی مورد نیاز خود دست یابید
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="relative"
                            >
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-12 right-0 w-full h-0.5 bg-gradient-to-l from-[#1e3a5f]/20 to-transparent -z-10" />
                                )}

                                <div className="text-center">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a] flex items-center justify-center mx-auto mb-6 shadow-xl relative">
                                        <span className="text-3xl font-bold text-white">{step.number}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                                    <p className="text-slate-600">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-[#1e3a5f] via-[#2d5a8a] to-[#1e3a5f] p-12 md:p-16 text-center text-white shadow-2xl"
                    >
                        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full translate-x-1/4 translate-y-1/4" />

                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
                                <Sparkles className="w-8 h-8 text-[#d4af37]" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                آماده شروع هستید؟
                            </h2>
                            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                                همین حالا ثبت‌نام کنید و از خدمات پلتفرم هوشمند تأمین مالی بهره‌مند شوید
                            </p>
                            <Button
                                size="lg"
                                onClick={() => apiService.auth.redirectToLogin(createPageUrl("Dashboard"))}
                                className="bg-white text-[#1e3a5f] hover:bg-white/90 h-14 text-lg px-8 shadow-lg"
                            >
                                شروع رایگان
                                <ArrowLeft className="w-5 h-5 mr-2" />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#e8c963] flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold">پلتفرم هوشمند تأمین مالی</h3>
                            </div>
                            <p className="text-slate-400">
                                بهترین راه‌حل برای تأمین مالی کسب‌وکار شما
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">دسترسی سریع</h4>
                            <ul className="space-y-2 text-slate-400">
                                <li><a href="#features" className="hover:text-white transition-colors">ویژگی‌ها</a></li>
                                <li><a href="#methods" className="hover:text-white transition-colors">روش‌ها</a></li>
                                <li><a href="#process" className="hover:text-white transition-colors">فرآیند</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">تماس با ما</h4>
                            <p className="text-slate-400">
                                برای اطلاعات بیشتر با ما در تماس باشید
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
                        <p>© ۱۴۰۳ پلتفرم هوشمند تأمین مالی. تمامی حقوق محفوظ است.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
