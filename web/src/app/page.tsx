import Link from "next/link";
import ConversionBanner from "@/components/ConversionBanner";
import AuraLogo from "@/components/AuraLogo";
import ArticleListContainer from "@/components/ArticleListContainer";
import { supabase } from "@/lib/supabase";
import ScrollToLatestButton from "@/components/ScrollToLatestButton";

export const revalidate = 60;

export default async function Home() {
    const { data: clinicLink } = await supabase
        .from('links')
        .select('url')
        .eq('type', 'clinic')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(); // Use maybeSingle to avoid error if empty

    const clinicUrl = clinicLink?.url || "/clinics";

    return (
        <main className="min-h-screen flex flex-col items-center relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-secondary/30 to-transparent -z-10" />
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-secondary/40 rounded-full blur-3xl -z-10" />

            {/* Header / Nav */}
            <nav className="w-full max-w-6xl px-6 py-6 flex justify-between items-center relative z-20">
                <div className="flex-1" /> {/* Spacer */}

                {/* Logo - Center Cutout Effect */}
                <div className="flex-none -mb-16 z-20 relative group cursor-pointer">
                    <div className="w-28 h-28 rounded-full bg-[#fffafb] flex items-center justify-center p-2 shadow-xl border border-stone-100">
                        {/* Fallback to text if image fails loading, or use Image component */}
                        <div className="w-full h-full rounded-full bg-primary text-white flex items-center justify-center border-2 border-[#fffafb] shadow-inner overflow-hidden">
                            <AuraLogo />
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex justify-end gap-6 text-sm font-medium text-stone-600">
                    {/* Menu items removed as per request */}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center text-center mt-24 mb-32 px-4 relative z-10">
                <p className="text-primary font-serif tracking-[0.2em] mb-6 animate-fade-in-up">
                    BIKATSU CLUB
                </p>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-800 mb-8 tracking-wide leading-relaxed animate-fade-in-up delay-100">
                    美しさは、<br />
                    日々の積み重ねから
                </h1>
                <p className="text-stone-500 max-w-lg leading-loose mb-10 animate-fade-in-up delay-200">
                    美に投資する人のための美活コラム。<br />
                    AIが最新トレンドを分析し、専門家が監修してお届けします。
                </p>

                <div className="flex gap-4 animate-fade-in-up delay-300">
                    <ScrollToLatestButton />
                </div>
            </section>

            {/* In-feed Conversion Banner (Clinic) */}
            <section className="w-full max-w-4xl px-4 animate-fade-in-up delay-500 my-16">
                <ConversionBanner
                    type="clinic"
                    title="厳選！おすすめクリニック"
                    description="AURA編集部が自信を持って推薦する、技術と信頼のパートナー・クリニックをご紹介します。"
                    linkUrl={clinicUrl}
                />
            </section>

            {/* Interactive Article List */}
            <section id="latest-topics-section" className="w-full max-w-6xl px-6 pb-24">
                <ArticleListContainer limit={8} />
            </section>

            <footer className="w-full border-t border-stone-200 bg-white/50 backdrop-blur-sm py-12 text-center text-stone-400 text-sm">
                <p className="font-serif">&copy; 2026 Bikatsu Club AURA. All rights reserved.</p>
                <div className="mt-4 flex justify-center gap-4 text-xs font-medium text-stone-500">
                    <Link href="/privacy">Privacy Policy</Link>
                    <Link href="/contact">Contact</Link>
                    <Link href="/admin/login" className="opacity-50 hover:opacity-100">Admin</Link>
                </div>
            </footer>
        </main>
    );
}
