import Link from "next/link";
import AuraLogo from "./AuraLogo";

export default function SiteHeader() {
    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-primary/10 transition-all duration-300">
            <div className="max-w-[1400px] mx-auto px-4 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    {/* Logo Container - optimizing for the circular logo */}
                    <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center border border-stone-100 overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300">
                        <div className="w-full h-full bg-primary flex items-center justify-center">
                            <AuraLogo />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className="font-serif font-bold text-lg text-stone-800 tracking-widest leading-none group-hover:text-primary transition-colors">
                            AURA
                        </span>
                        <span className="text-[10px] text-stone-400 font-medium tracking-wider">
                            BIKATSU CLUB
                        </span>
                    </div>
                </Link>

                {/* Simple Nav */}
                <nav className="flex gap-8 text-sm font-medium text-stone-500">
                    <Link href="/" className="hover:text-primary transition-colors hidden md:block">Top</Link>
                    <Link href="/#latest-topics-section" className="hover:text-primary transition-colors text-primary font-bold">Column</Link>
                </nav>
            </div>
        </header>
    );
}
