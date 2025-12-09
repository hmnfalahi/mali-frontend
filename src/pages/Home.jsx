import React, { useState } from "react";
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
    X,
    Phone,
    Mail,
    MapPin,
    FileText,
    Briefcase,
    Target,
    Wallet,
    ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Home() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const features = [
        {
            icon: Zap,
            title: "فرآیند سریع",
            description: "پاسخ‌گویی در کمتر از ۴۸ ساعت",
            highlight: "۴۸ ساعت"
        },
        {
            icon: Shield,
            title: "امنیت بالا",
            description: "رمزنگاری پیشرفته و حفاظت کامل",
            highlight: "۱۰۰٪"
        },
        {
            icon: Users,
            title: "مشاوره تخصصی",
            description: "تیم کارشناسان با بیش از ۱۰ سال تجربه",
            highlight: "۱۰+ سال"
        },
        {
            icon: BarChart3,
            title: "تحلیل هوشمند",
            description: "ارائه بهترین روش متناسب با نیاز شما",
            highlight: "هوش مصنوعی"
        }
    ];

    const methods = [
        {
            name: "اوراق مرابحه",
            icon: CreditCard,
            desc: "تأمین مالی با نرخ سود مشخص و از پیش تعیین شده",
            benefits: ["نرخ سود ثابت", "بازپرداخت منعطف", "بدون ریسک نوسان"],
            suitable: "مناسب برای سرمایه در گردش"
        },
        {
            name: "صکوک اجاره",
            icon: Building2,
            desc: "تأمین مالی با پشتوانه دارایی‌های ثابت شرکت",
            benefits: ["پشتوانه دارایی", "بلندمدت", "هزینه پایین"],
            suitable: "مناسب برای توسعه زیرساخت"
        },
        {
            name: "صکوک استصناع",
            icon: TrendingUp,
            desc: "تأمین مالی ویژه پروژه‌های تولیدی و صنعتی",
            benefits: ["پرداخت مرحله‌ای", "تطبیق با پروژه", "بدون سود مرکب"],
            suitable: "مناسب برای پروژه‌های صنعتی"
        },
    ];

    const stats = [
        { number: "۵۰۰+", label: "شرکت متقاضی", icon: Building2, suffix: "شرکت" },
        { number: "۱۰.۰۰۰", label: "میلیارد ریال تأمین مالی", icon: Wallet, suffix: "میلیارد ریال" },
        { number: "۹۵٪", label: "رضایت مشتریان", icon: Award, suffix: "" },
        { number: "۴۸", label: "ساعت پاسخ‌گویی", icon: Clock, suffix: "ساعت" },
    ];

    const steps = [
        {
            number: "۱",
            title: "ثبت‌نام رایگان",
            desc: "در کمتر از ۲ دقیقه حساب کاربری ایجاد کنید",
            time: "۲ دقیقه"
        },
        {
            number: "۲",
            title: "تکمیل اطلاعات",
            desc: "اطلاعات شرکت و مستندات مالی را بارگذاری کنید",
            time: "۱۵ دقیقه"
        },
        {
            number: "۳",
            title: "انتخاب روش",
            desc: "روش مناسب تأمین مالی را با مشاوره کارشناسان انتخاب کنید",
            time: "۲۴ ساعت"
        },
        {
            number: "۴",
            title: "دریافت تأمین مالی",
            desc: "پس از بررسی و تأیید، تأمین مالی را دریافت کنید",
            time: "۷-۳۰ روز"
        },
    ];

    const testimonials = [
        {
            text: "با استفاده از پلتفرم مالی، توانستیم در کوتاه‌ترین زمان تأمین مالی پروژه توسعه کارخانه را انجام دهیم.",
            author: "شرکت صنایع فلزی البرز",
            role: "مدیر مالی"
        },
        {
            text: "فرآیند ساده و شفاف بود. مشاوران بسیار حرفه‌ای و پاسخگو بودند.",
            author: "هلدینگ ساختمانی آریا",
            role: "مدیرعامل"
        }
    ];

    return (
        <div dir="rtl" className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="fixed top-0 right-0 left-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a] flex items-center justify-center shadow-lg">
                                <CreditCard className="w-5 h-5 text-white" />
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-base font-bold text-[#1e3a5f]">مالی</h1>
                                <p className="text-xs text-slate-500">پلتفرم تأمین مالی</p>
                            </div>
                        </div>

                        <nav className="hidden md:flex items-center gap-6">
                            <a href="#features" className="text-sm text-slate-600 hover:text-[#1e3a5f] transition-colors font-medium">ویژگی‌ها</a>
                            <a href="#methods" className="text-sm text-slate-600 hover:text-[#1e3a5f] transition-colors font-medium">روش‌های تأمین مالی</a>
                            <a href="#process" className="text-sm text-slate-600 hover:text-[#1e3a5f] transition-colors font-medium">نحوه کار</a>
                            <a href="#contact" className="text-sm text-slate-600 hover:text-[#1e3a5f] transition-colors font-medium">تماس با ما</a>
                        </nav>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                onClick={() => apiService.auth.redirectToLogin(createPageUrl("Dashboard"))}
                                className="hidden sm:flex text-sm"
                            >
                                ورود
                            </Button>
                            <Button
                                onClick={() => apiService.auth.redirectToLogin(createPageUrl("Dashboard"))}
                                className="bg-gradient-to-l from-[#1e3a5f] to-[#2d5a8a] text-sm h-9"
                            >
                                شروع رایگان
                                <ArrowLeft className="w-4 h-4 mr-1" />
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
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:hidden border-t border-slate-200 bg-white shadow-lg"
                    >
                        <div className="px-4 py-3 space-y-1">
                            <a href="#features" className="block px-4 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg text-sm">ویژگی‌ها</a>
                            <a href="#methods" className="block px-4 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg text-sm">روش‌های تأمین مالی</a>
                            <a href="#process" className="block px-4 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg text-sm">نحوه کار</a>
                            <a href="#contact" className="block px-4 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg text-sm">تماس با ما</a>
                        </div>
                    </motion.div>
                )}
            </header>

            {/* Hero Section - Simplified */}
            <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center max-w-3xl mx-auto mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-l from-[#1e3a5f]/10 to-[#2d5a8a]/10 text-[#1e3a5f] text-sm font-medium mb-6 border border-[#1e3a5f]/10">
                            <Sparkles className="w-4 h-4 text-[#d4af37]" />
                            پلتفرم جامع تأمین مالی
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
                            تأمین مالی <span className="text-[#1e3a5f]">سریع</span> و <span className="text-[#2d5a8a]">مطمئن</span>
                            <br className="hidden sm:block" />
                            برای رشد کسب‌وکار شما
                        </h1>

                        <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
                            با استفاده از ابزارهای مالی اسلامی، به سرمایه مورد نیاز خود دسترسی پیدا کنید.
                            از ثبت‌نام تا دریافت تأمین مالی، ما در کنار شما هستیم.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button
                                size="lg"
                                onClick={() => apiService.auth.redirectToLogin(createPageUrl("Dashboard"))}
                                className="bg-gradient-to-l from-[#1e3a5f] to-[#2d5a8a] h-12 text-base px-6 shadow-lg shadow-blue-900/20"
                            >
                                شروع رایگان
                                <ArrowLeft className="w-5 h-5 mr-2" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-12 text-base px-6 border-slate-300"
                                onClick={() => document.getElementById('methods').scrollIntoView({ behavior: 'smooth' })}
                            >
                                <Phone className="w-4 h-4 ml-2" />
                                درخواست مشاوره
                            </Button>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1e3a5f]/10 to-[#2d5a8a]/10 flex items-center justify-center mx-auto mb-3">
                                    {React.createElement(stat.icon, { className: "w-5 h-5 text-[#1e3a5f]" })}
                                </div>
                                <p className="text-2xl sm:text-3xl font-bold text-[#1e3a5f]">{stat.number}</p>
                                <p className="text-xs sm:text-sm text-slate-500 mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                            چرا ما را انتخاب کنید؟
                        </h2>
                        <p className="text-slate-600 max-w-xl mx-auto">
                            با تکنولوژی پیشرفته و تیم متخصص، بهترین تجربه تأمین مالی را برای شما فراهم می‌کنیم
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
                                    <Card className="border border-slate-100 shadow-sm hover:shadow-lg transition-all h-full group">
                                        <CardContent className="p-5">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="inline-block px-2 py-1 rounded-md bg-[#d4af37]/10 text-[#d4af37] text-xs font-bold mb-2">
                                                {feature.highlight}
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-1">{feature.title}</h3>
                                            <p className="text-sm text-slate-600">{feature.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Methods Section */}
            <section id="methods" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#1e3a5f] text-sm font-medium mb-3 border border-slate-200">
                            <CreditCard className="w-4 h-4" />
                            ابزارهای مالی اسلامی
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                            روش‌های تأمین مالی
                        </h2>
                        <p className="text-slate-600 max-w-xl mx-auto">
                            با توجه به نیاز و ماهیت پروژه شما، بهترین روش تأمین مالی را انتخاب کنید
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {methods.map((method, index) => {
                            const Icon = method.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="border-0 shadow-md hover:shadow-xl transition-all h-full group bg-white overflow-hidden">
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                                    <Icon className="w-7 h-7 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900 mb-1">{method.name}</h3>
                                                    <p className="text-sm text-slate-600">{method.desc}</p>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50 rounded-xl p-4 mb-4">
                                                <p className="text-xs text-slate-500 mb-2">مزایا:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {method.benefits.map((benefit, i) => (
                                                        <span key={i} className="inline-flex items-center gap-1 text-xs bg-white px-2 py-1 rounded-md border border-slate-200 text-slate-700">
                                                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                                                            {benefit}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 text-[#1e3a5f] text-sm">
                                                <Target className="w-4 h-4" />
                                                <span>{method.suitable}</span>
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
            <section id="process" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-[#1e3a5f] text-sm font-medium mb-3">
                            <Clock className="w-4 h-4" />
                            فرآیند ساده
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                            چگونه شروع کنیم؟
                        </h2>
                        <p className="text-slate-600 max-w-xl mx-auto">
                            در چهار مرحله ساده، درخواست تأمین مالی خود را ثبت کنید
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="relative"
                            >
                                <div className="bg-slate-50 rounded-2xl p-6 h-full border border-slate-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a] flex items-center justify-center text-white font-bold text-lg">
                                            {step.number}
                                        </div>
                                        <span className="text-xs bg-white px-3 py-1 rounded-full text-slate-500 border border-slate-200">
                                            {step.time}
                                        </span>
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                                    <p className="text-sm text-slate-600">{step.desc}</p>
                                </div>

                                {index < steps.length - 1 && (
                                    <div className="hidden lg:flex absolute top-1/2 -left-3 w-6 h-6 items-center justify-center">
                                        <ChevronLeft className="w-5 h-5 text-slate-300" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                            نظرات مشتریان
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="border-0 shadow-md h-full bg-white">
                                    <CardContent className="p-6">
                                        <div className="flex gap-1 mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Award key={i} className="w-4 h-4 text-[#d4af37] fill-[#d4af37]" />
                                            ))}
                                        </div>
                                        <p className="text-slate-700 mb-4 leading-relaxed">"{testimonial.text}"</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a] flex items-center justify-center">
                                                <Building2 className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900 text-sm">{testimonial.author}</p>
                                                <p className="text-xs text-slate-500">{testimonial.role}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-[#1e3a5f] via-[#2d5a8a] to-[#1e3a5f] p-8 sm:p-12 text-center text-white shadow-xl"
                    >
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#d4af37]/10 rounded-full translate-x-1/4 translate-y-1/4" />

                        <div className="relative z-10">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                                آماده شروع هستید؟
                            </h2>
                            <p className="text-blue-100 mb-6 max-w-lg mx-auto">
                                همین حالا رایگان ثبت‌نام کنید و درخواست تأمین مالی خود را ثبت کنید
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Button
                                    size="lg"
                                    onClick={() => apiService.auth.redirectToLogin(createPageUrl("Dashboard"))}
                                    className="bg-white text-[#1e3a5f] hover:bg-white/90 h-12 px-6 shadow-lg"
                                >
                                    شروع رایگان
                                    <ArrowLeft className="w-5 h-5 mr-2" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-white/30 text-white hover:bg-white/10 h-12 px-6"
                                >
                                    <Phone className="w-4 h-4 ml-2" />
                                    تماس با مشاوران
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer id="contact" className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#e8c963] flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold">مالی</h3>
                                    <p className="text-xs text-slate-400">پلتفرم تأمین مالی</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-400">
                                راه‌حل جامع برای تأمین مالی کسب‌وکار با ابزارهای مالی اسلامی
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4 text-sm">دسترسی سریع</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><a href="#features" className="hover:text-white transition-colors">ویژگی‌ها</a></li>
                                <li><a href="#methods" className="hover:text-white transition-colors">روش‌های تأمین مالی</a></li>
                                <li><a href="#process" className="hover:text-white transition-colors">نحوه کار</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4 text-sm">خدمات</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li className="flex items-center gap-2"><FileText className="w-4 h-4" /> اوراق مرابحه</li>
                                <li className="flex items-center gap-2"><Building2 className="w-4 h-4" /> صکوک اجاره</li>
                                <li className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> صکوک استصناع</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4 text-sm">تماس با ما</h4>
                            <ul className="space-y-3 text-sm text-slate-400">
                                <li className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    ۰۲۱-۸۸۸۸۸۸۸۸
                                </li>
                                <li className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    info@mali.ir
                                </li>
                                <li className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 mt-0.5" />
                                    تهران، خیابان ولیعصر
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-400">
                        <p>© ۱۴۰۳ مالی. تمامی حقوق محفوظ است.</p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-white transition-colors">قوانین و مقررات</a>
                            <a href="#" className="hover:text-white transition-colors">حریم خصوصی</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
