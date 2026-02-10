"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function StickyCTA() {
    const [isVisible, setIsVisible] = useState(false);
    const [lineUrl, setLineUrl] = useState("https://line.me/"); // Fallback

    useEffect(() => {
        const fetchLineLink = async () => {
            const { data } = await supabase
                .from('links')
                .select('url')
                .eq('type', 'line')
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (data?.url) {
                setLineUrl(data.url);
            }
        };
        fetchLineLink();

        const handleScroll = () => {
            // Show after scrolling 100px
            if (window.scrollY > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            className={`fixed bottom-4 right-4 z-50 flex flex-col gap-3 transition-all duration-300 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
                }`}
        >
            {/* LINE Button */}
            <Link
                href={lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#06c755] text-white px-5 py-3 rounded-full shadow-lg hover:bg-[#05b34c] transition-all hover:scale-105 animate-bounce-subtle"
            >
                {/* LINE Icon (Simple SVG) */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.28 12.33C22.28 6.94 17.29 2.56 11.14 2.56C4.99 2.56 0 6.94 0 12.33C0 16.68 3.4 20.37 8.16 21.64C8.47 21.78 8.65 21.84 8.71 22.09C8.75 22.25 8.74 22.45 8.7 22.78C8.7 22.78 8.52 23.77 8.5 23.86C7.57 26.32 12.69 23.82 12.69 23.82C16.89 21.43 22.28 17.65 22.28 12.33Z" />
                </svg>
                <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] font-bold opacity-90">限定クーポン配布中</span>
                    <span className="text-sm font-bold">LINEで無料相談</span>
                </div>
            </Link>
        </div>
    );
}
