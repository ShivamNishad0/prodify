'use client';

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { initThreeBackground } from '../utils/threeBackground';

const Welcome = () => {
    const [hoveredButton, setHoveredButton] = useState<string | null>(null);
    const [hoveredLink, setHoveredLink] = useState<string | null>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!canvasContainerRef.current) return;
        const { destroy } = initThreeBackground(canvasContainerRef.current);
        return () => destroy();
    }, []);

    const navLinks = [
        { name: "Product", href: "#" },
        { name: "Solutions", href: "#" },
        { name: "Pricing", href: "/pricing" },
        { name: "Resources", href: "#" },
    ];

    const glassCardStyle: React.CSSProperties = {
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        borderRadius: "20px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.05)",
        padding: "20px",
        position: "absolute",
        zIndex: 10,
    };

    return (
        <div className="min-h-screen w-full bg-white flex flex-col items-center overflow-x-hidden" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;500;600&display=swap');
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(1deg); }
                }
                @keyframes floatSlow {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 0.4; }
                    50% { transform: scale(1.05); opacity: 0.6; }
                }
            `}</style>

            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-brand-primary/10 blur-[120px] opacity-40 animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-brand-primary-light/20 blur-[120px] opacity-40 animate-pulse" />
            </div>

            {/* Header */}
            <header className="w-full max-w-[1400px] px-8 h-20 flex justify-between items-center relative z-50">
                <div className="flex items-center gap-12">
                    <h1 className="text-2xl font-extrabold tracking-tight text-brand-primary m-0" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        prodify
                    </h1>

                    <nav className="hidden lg:flex gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium transition-colors"
                                style={{ color: hoveredLink === link.name ? 'var(--brand-primary)' : 'var(--brand-text-secondary)' }}
                                onMouseEnter={() => setHoveredLink(link.name)}
                                onMouseLeave={() => setHoveredLink(null)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        href="/login"
                        className="px-6 py-2.5 text-sm font-semibold transition-all rounded-full"
                        style={{
                            color: 'var(--brand-text-primary)',
                            background: hoveredButton === 'signin' ? "rgba(0,0,0,0.05)" : "transparent"
                        }}
                        onMouseEnter={() => setHoveredButton('signin')}
                        onMouseLeave={() => setHoveredButton(null)}
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/signup"
                        className="px-7 py-2.5 text-sm font-bold text-white shadow-lg transition-all active:scale-95 rounded-full bg-brand-primary"
                        style={{
                            transform: hoveredButton === 'signup' ? "translateY(-2px)" : "none",
                            boxShadow: hoveredButton === 'signup' ? "0 10px 20px var(--brand-primary-dark)" : "0 4px 12px var(--brand-primary-light)"
                        }}
                        onMouseEnter={() => setHoveredButton('signup')}
                        onMouseLeave={() => setHoveredButton(null)}
                    >
                        Start Free Trial
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <main className="w-full max-w-[1200px] flex-1 flex flex-col items-center justify-center text-center px-6 pt-12 pb-32 relative z-10">

                {/* Three.js animated background canvas */}
                <div
                    ref={canvasContainerRef}
                    aria-hidden="true"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 0,
                        pointerEvents: 'none',
                        overflow: 'hidden',
                    }}
                />

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary-light/10 text-brand-primary-dark text-xs font-bold uppercase tracking-widest mb-8 animate-[fadeIn_0.6s_ease-out] border border-brand-primary/20">
                    <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                    New: AI-Powered Insights are here
                </div>

                <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-brand-text-primary leading-[0.95] mb-8 animate-[fadeIn_0.8s_ease-out]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    The ultimate CRM <br /> for modern teams
                </h1>

                <p className="text-lg md:text-xl text-brand-text-secondary leading-relaxed max-w-2xl mb-12 animate-[fadeIn_1s_ease-out]">
                    Streamline your sales pipeline, automate workflows, and grow your business with our intuitive, data-driven platform.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 animate-[fadeIn_1.2s_ease-out]">
                    <Link
                        href="/signup"
                        className="px-10 py-4 text-base font-bold text-white shadow-xl transition-all hover:brightness-105 active:scale-95 rounded-full bg-brand-primary"
                    >
                        Get Started for Free
                    </Link>
                    <button className="px-10 py-4 text-base font-bold bg-white border border-slate-200 text-brand-text-primary shadow-sm hover:shadow-md transition-all active:scale-95 rounded-full flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        Watch Demo
                    </button>
                </div>

                {/* Floating Glass Cards */}
                <div
                    style={{ ...glassCardStyle, top: '15%', left: "-30px", animation: 'float 8s infinite ease-in-out' }}
                    className="hidden xl:block w-[240px]"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-brand-primary-light/10 rounded-lg">
                            <svg width="15" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                        </div>
                        <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">+12.5%</span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Growth Revenue</div>
                    <div className="text-2xl font-bold text-brand-text-primary tracking-tighter">$42,850</div>
                    <div className="mt-4 flex gap-1 items-end h-[30px]">
                        {[40, 60, 45, 75, 55, 90, 80].map((h, i) => (
                            <div key={i} className="flex-1 bg-brand-primary-light rounded-sm" style={{ height: `${h}%` }} />
                        ))}
                    </div>
                </div>

                <div
                    style={{ ...glassCardStyle, bottom: '25%', right: '0%', animation: 'float 10s infinite ease-in-out 1s' }}
                    className="hidden xl:block w-[220px]"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                            ))}
                        </div>
                        <div className="text-xs font-semibold text-slate-600">Active Now</div>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-primary rounded-full" style={{ width: '75%' }} />
                    </div>
                    <div className="mt-2 flex justify-between text-[10px] font-bold text-slate-400">
                        <span>Optimization</span>
                        <span className="text-brand-primary">75%</span>
                    </div>
                </div>
            </main>

            {/* Trusted By Section */}
            <section className="w-full bg-brand-bg-surface py-20 relative z-10 flex flex-col items-center">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-10">Trusted by 2,000+ fast-growing teams</p>
                <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-30 grayscale contrast-125">
                    {["Logoipsum", "Vercel", "Stripe", "Figma", "Notion"].map(logo => (
                        <div key={logo} className="text-2xl font-black text-brand-text-primary">{logo}</div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full bg-white border-t border-slate-100 pt-24 pb-12 relative z-10">
                <div className="max-w-[1400px] mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">

                    {/* Brand */}
                    <div className="md:col-span-4 flex flex-col gap-6">
                        <h1 className="text-2xl font-extrabold tracking-tight text-brand-primary m-0" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            prodify
                        </h1>
                        <p className="text-brand-text-secondary text-sm leading-relaxed max-w-[300px]">
                            Empowering teams to achieve peak performance through smart CRM analytics and seamless workflow automation.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="md:col-span-2 flex flex-col gap-6">
                        <h3 className="text-xs font-bold text-brand-text-primary uppercase tracking-widest">Product</h3>
                        <div className="flex flex-col gap-4 text-sm font-medium text-brand-text-secondary">
                            {["Features", "Integrations", "Enterprise", "Pricing"].map(item => (
                                <Link key={item} href="#" className="hover:text-brand-primary transition-colors">{item}</Link>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-6">
                        <h3 className="text-xs font-bold text-brand-text-primary uppercase tracking-widest">Company</h3>
                        <div className="flex flex-col gap-4 text-sm font-medium text-brand-text-secondary">
                            {["About Us", "Careers", "Blog", "Contact"].map(item => (
                                <Link key={item} href="#" className="hover:text-brand-primary transition-colors">{item}</Link>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-6">
                        <h3 className="text-xs font-bold text-brand-text-primary uppercase tracking-widest">Support</h3>
                        <div className="flex flex-col gap-4 text-sm font-medium text-brand-text-secondary">
                            {["Documentation", "Help Center", "Community", "Privacy"].map(item => (
                                <Link key={item} href="#" className="hover:text-brand-primary transition-colors">{item}</Link>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-6">
                        <h3 className="text-xs font-bold text-brand-text-primary uppercase tracking-widest">Social</h3>
                        <div className="flex flex-col gap-4 text-sm font-medium text-brand-text-secondary">
                            {["Twitter", "LinkedIn", "Instagram", "GitHub"].map(item => (
                                <Link key={item} href="#" className="hover:text-brand-primary transition-colors">{item}</Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="max-w-[1400px] mx-auto px-8 mt-24 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs font-semibold text-slate-400">
                        &copy; {new Date().getFullYear()} Prodify Inc. All rights reserved. Made for modern teams.
                    </p>
                    <div className="flex gap-6">
                        <span className="text-[10px] font-bold text-slate-400 uppercase cursor-pointer hover:text-brand-text-primary transition-colors">Cookies</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase cursor-pointer hover:text-brand-text-primary transition-colors">Privacy</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase cursor-pointer hover:text-brand-text-primary transition-colors">Terms</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Welcome;
