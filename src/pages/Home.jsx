import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
    CreditCard,
    Building2,
    TrendingUp,
    Shield,
    Zap,
    Users,
    ArrowLeft,
    Sparkles,
    BarChart3,
    Clock,
    Award,
    Menu,
    X,
    Phone,
    Mail,
    MapPin,
    ArrowUpRight,
    LogOut,
    Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();

    const features = [
        {
            icon: Zap,
            title: "سرعت در پردازش",
            description: "بررسی و پاسخ‌دهی به درخواست‌ها در کمتر از 48 ساعت کاری با سیستم هوشمند."
        },
        {
            icon: Shield,
            title: "امنیت تضمین شده",
            description: "استفاده از پروتکل‌های رمزنگاری پیشرفته برای حفاظت از داده‌های مالی شما."
        },
        {
            icon: Users,
            title: "همراهی متخصصان",
            description: "تیم مشاوران مالی با تجربه، در تمام مراحل کنار شما خواهند بود."
        },
        {
            icon: BarChart3,
            title: "راهکارهای هوشمند",
            description: "تحلیل دقیق نیازهای شما و ارائه بهترین روش تأمین مالی متناسب با کسب‌وکارتان."
        }
    ];

    const methods = [
        {
            name: "اوراق مرابحه",
            icon: CreditCard,
            desc: "تأمین مالی با نرخ سود معین",
            tags: ["سرمایه در گردش", "خرید مواد اولیه"],
            color: "from-blue-500/10 to-blue-600/10",
            iconColor: "text-blue-600"
        },
        {
            name: "صکوک اجاره",
            icon: Building2,
            desc: "تأمین مالی مبتنی بر دارایی",
            tags: ["توسعه زیرساخت", "خرید تجهیزات"],
            color: "from-emerald-500/10 to-emerald-600/10",
            iconColor: "text-emerald-600"
        },
        {
            name: "صکوک استصناع",
            icon: TrendingUp,
            desc: "تأمین مالی پروژه‌های ساخت",
            tags: ["پروژه‌های صنعتی", "تولیدی"],
            color: "from-amber-500/10 to-amber-600/10",
            iconColor: "text-amber-600"
        },
    ];

    const stats = [
        { number: "+500", label: "شرکت موفق" },
        { number: "10T", label: "تأمین مالی (ریال)" },
        { number: "98%", label: "رضایت مشتریان" },
        { number: "48h", label: "میانگین زمان پاسخ" },
    ];

    return (
        <div dir="rtl" className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#1e3a5f]/10">
            {/* Navigation */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-[#1e3a5f] flex items-center justify-center text-white shadow-lg shadow-[#1e3a5f]/20">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-[#1e3a5f]">مالی</span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-[#1e3a5f] transition-colors">ویژگی‌ها</a>
                            <a href="#methods" className="text-sm font-medium text-slate-600 hover:text-[#1e3a5f] transition-colors">روش‌ها</a>
                            <a href="#process" className="text-sm font-medium text-slate-600 hover:text-[#1e3a5f] transition-colors">مراحل</a>
                            <a href="#contact" className="text-sm font-medium text-slate-600 hover:text-[#1e3a5f] transition-colors">تماس</a>
                        </div>

                        {/* Auth Buttons */}
                        <div className="hidden md:flex items-center gap-4">
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-slate-600">
                                        {user.first_name || user.phone_number}
                                    </span>
                                    <Link to="/dashboard">
                                        <Button className="bg-[#1e3a5f] hover:bg-[#162c46] text-white rounded-xl h-10 px-5 shadow-lg shadow-[#1e3a5f]/20 transition-all hover:scale-105 active:scale-95">
                                            داشبورد
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <Link to="/login">
                                        <Button variant="ghost" className="text-slate-600 hover:text-[#1e3a5f] hover:bg-slate-50 rounded-xl">
                                            ورود
                                        </Button>
                                    </Link>
                                    <Link to="/signup">
                                        <Button className="bg-[#1e3a5f] hover:bg-[#162c46] text-white rounded-xl h-10 px-5 shadow-lg shadow-[#1e3a5f]/20 transition-all hover:scale-105 active:scale-95">
                                            شروع کنید
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button 
                            className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-slate-100 bg-white overflow-hidden"
                        >
                            <div className="px-4 py-6 space-y-4">
                                <a href="#features" className="block text-base font-medium text-slate-600 hover:text-[#1e3a5f]" onClick={() => setMobileMenuOpen(false)}>ویژگی‌ها</a>
                                <a href="#methods" className="block text-base font-medium text-slate-600 hover:text-[#1e3a5f]" onClick={() => setMobileMenuOpen(false)}>روش‌ها</a>
                                <a href="#process" className="block text-base font-medium text-slate-600 hover:text-[#1e3a5f]" onClick={() => setMobileMenuOpen(false)}>مراحل</a>
                                <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                                    {user ? (
                                        <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                            <Button className="w-full bg-[#1e3a5f] text-white rounded-xl">داشبورد</Button>
                                        </Link>
                                    ) : (
                                        <>
                                            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                                <Button variant="outline" className="w-full rounded-xl">ورود</Button>
                                            </Link>
                                            <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                                                <Button className="w-full bg-[#1e3a5f] text-white rounded-xl">ثبت‌نام رایگان</Button>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl opacity-50 pointer-events-none translate-x-1/3 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-3xl opacity-50 pointer-events-none -translate-x-1/3 translate-y-1/3" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-medium text-slate-600 mb-8 hover:border-slate-300 transition-colors cursor-default">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            <span>راهکار نوین تأمین مالی اسلامی</span>
                        </div>
                        
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.15]">
                            رشد کسب‌وکار شما با<br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1e3a5f] to-[#3b82f6]"> سرمایه هوشمند</span>
                        </h1>
                        
                        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed">
                            پلتفرم جامع تأمین مالی جمعی با رویکرد اسلامی.
                            سریع‌ترین مسیر برای تأمین نقدینگی مورد نیاز پروژه‌های شما.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to={user ? "/dashboard" : "/signup"}>
                                <Button className="h-14 px-8 text-lg bg-[#1e3a5f] hover:bg-[#162c46] text-white rounded-2xl shadow-xl shadow-[#1e3a5f]/20 transition-all hover:scale-105 active:scale-95 min-w-[180px]">
                                    {user ? "ورود به داشبورد" : "شروع رایگان"}
                                    <ArrowLeft className="w-5 h-5 mr-2" />
                                </Button>
                            </Link>
                            <a href="#methods">
                                <Button variant="outline" className="h-14 px-8 text-lg border-slate-200 text-slate-600 hover:bg-slate-50 rounded-2xl min-w-[180px]">
                                    مشاوره بگیرید
                                </Button>
                            </a>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-10 border-t border-slate-100"
                    >
                        {stats.map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-3xl lg:text-4xl font-bold text-[#1e3a5f] mb-2">{stat.number}</div>
                                <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-slate-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">چرا پلتفرم ما؟</h2>
                        <p className="text-lg text-slate-600">
                            ترکیبی از سرعت، امنیت و تخصص برای تجربه بهترین خدمات مالی
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="w-12 h-12 bg-[#1e3a5f]/5 rounded-2xl flex items-center justify-center mb-6">
                                        <Icon className="w-6 h-6 text-[#1e3a5f]" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                    <p className="text-slate-500 leading-relaxed text-sm">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Methods Section */}
            <section id="methods" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">روش‌های تأمین مالی</h2>
                            <p className="text-lg text-slate-600">
                                ابزارهای متنوع مالی اسلامی متناسب با نیاز کسب‌وکارهای مختلف
                            </p>
                        </div>
                        <Button variant="outline" className="rounded-xl border-slate-200">
                            مشاهده همه روش‌ها <ArrowLeft className="w-4 h-4 mr-2" />
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {methods.map((method, idx) => {
                            const Icon = method.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group relative bg-white rounded-3xl border border-slate-200 p-8 hover:border-[#1e3a5f]/20 transition-all hover:shadow-xl hover:shadow-[#1e3a5f]/5"
                                >
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <Icon className={`w-7 h-7 ${method.iconColor}`} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{method.name}</h3>
                                    <p className="text-slate-500 mb-6">{method.desc}</p>
                                    
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {method.tags.map((tag, i) => (
                                            <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-100">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center text-[#1e3a5f] font-medium text-sm group-hover:gap-2 transition-all">
                                        اطلاعات بیشتر <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section id="process" className="py-24 bg-[#1e3a5f] text-white overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4 tracking-tight">مسیر دریافت سرمایه</h2>
                        <p className="text-blue-100 text-lg opacity-80">
                            فرآیند شفاف و ساده، از ثبت درخواست تا دریافت وجه
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8 relative">
                        <div className="hidden md:block absolute top-12 right-0 left-0 h-0.5 bg-white/10" />
                        
                        {[
                            { step: "01", title: "ثبت‌نام", desc: "ایجاد حساب کاربری در کمتر از 2 دقیقه" },
                            { step: "02", title: "تکمیل مدارک", desc: "بارگذاری مستندات شرکت و صورت‌های مالی" },
                            { step: "03", title: "ارزیابی", desc: "بررسی درخواست توسط کارشناسان ما" },
                            { step: "04", title: "تأمین مالی", desc: "انتشار اوراق و دریافت سرمایه" }
                        ].map((item, idx) => (
                            <div key={idx} className="relative text-center md:text-right">
                                <div className="w-24 h-24 rounded-full bg-[#2d5a8a] border-4 border-[#1e3a5f] flex items-center justify-center text-2xl font-bold mb-6 mx-auto md:mx-0 relative z-10 shadow-xl">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-blue-100/70 text-sm leading-relaxed max-w-[200px] mx-auto md:mx-0">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-slate-50 rounded-[2.5rem] p-12 md:p-20 text-center border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                        
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
                                آماده شروع رشد کسب‌وکارتان هستید؟
                            </h2>
                            <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
                                همین حالا ثبت‌نام کنید و به جمع 500+ شرکت پیشرو بپیوندید که از خدمات ما استفاده می‌کنند.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link to={user ? "/dashboard" : "/signup"}>
                                    <Button className="h-14 px-8 text-lg bg-[#1e3a5f] hover:bg-[#162c46] text-white rounded-2xl shadow-xl shadow-[#1e3a5f]/20 min-w-[200px]">
                                        {user ? "ورود به پنل" : "شروع رایگان"}
                                        <ArrowLeft className="w-5 h-5 mr-2" />
                                    </Button>
                                </Link>
                                <Button variant="ghost" className="h-14 px-8 text-lg text-slate-600 hover:bg-white hover:shadow-md rounded-2xl min-w-[200px]">
                                    <Phone className="w-5 h-5 ml-2" />
                                    تماس با پشتیبانی
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-2xl bg-[#1e3a5f] flex items-center justify-center text-white">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <span className="text-xl font-bold text-slate-900">مالی</span>
                            </div>
                            <p className="text-slate-500 max-w-sm leading-relaxed mb-6">
                                پلتفرم پیشرو در ارائه خدمات تأمین مالی جمعی و ابزارهای نوین مالی اسلامی برای توسعه کسب‌وکارهای ایرانی.
                            </p>
                            <div className="flex gap-4">
                                {/* Social Icons Placeholder */}
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#1e3a5f] hover:text-white transition-colors cursor-pointer">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#1e3a5f] hover:text-white transition-colors cursor-pointer">
                                    <Mail className="w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 mb-6">دسترسی سریع</h4>
                            <ul className="space-y-4 text-slate-500">
                                <li><a href="#" className="hover:text-[#1e3a5f] transition-colors">درباره ما</a></li>
                                <li><a href="#" className="hover:text-[#1e3a5f] transition-colors">روش‌های تأمین مالی</a></li>
                                <li><a href="#" className="hover:text-[#1e3a5f] transition-colors">سوالات متداول</a></li>
                                <li><a href="#" className="hover:text-[#1e3a5f] transition-colors">تماس با ما</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 mb-6">اطلاعات تماس</h4>
                            <ul className="space-y-4 text-slate-500">
                                <li className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-[#1e3a5f]" />
                                    تهران، خیابان ولیعصر، برج فناوری
                                </li>
                                <li className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-[#1e3a5f]" />
                                    021-88880000
                                </li>
                                <li className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-[#1e3a5f]" />
                                    info@mali.ir
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-slate-400">
                            © 1403 تمامی حقوق برای پلتفرم مالی محفوظ است.
                        </p>
                        <div className="flex gap-6 text-sm text-slate-400">
                            <a href="#" className="hover:text-slate-600">قوانین و مقررات</a>
                            <a href="#" className="hover:text-slate-600">حریم خصوصی</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
