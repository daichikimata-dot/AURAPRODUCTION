import Link from "next/link";

interface ConversionBannerProps {
    type: "clinic" | "campaign";
    title: string;
    description: string;
    linkUrl: string;
    buttonText?: string;
}

export default function ConversionBanner({ type, title, description, linkUrl, buttonText = "詳しく見る" }: ConversionBannerProps) {
    const isClinic = type === "clinic";

    return (
        <div className={`w-full my-8 p-6 md:p-8 rounded-2xl relative overflow-hidden group ${isClinic ? "bg-gradient-to-r from-[#ffe4e6] to-[#fff1f2]" : "bg-gradient-to-r from-[#ecfdf5] to-[#d1fae5]"
            }`}>
            {/* Background Decor */}
            <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 rounded-full blur-2xl opacity-50 ${isClinic ? "bg-primary" : "bg-emerald-400"}`} />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${isClinic ? "bg-primary/10 text-primary" : "bg-emerald-600/10 text-emerald-700"
                        }`}>
                        {isClinic ? "RECOMMENDED CLINIC" : "LIMITED CAMPAIGN"}
                    </span>
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-stone-800 mb-2">
                        {title}
                    </h3>
                    <p className="text-stone-600 text-sm md:text-base">
                        {description}
                    </p>
                </div>

                <Link href={linkUrl} className={`shrink-0 px-8 py-3 rounded-full font-bold shadow-md transition-transform hover:scale-105 ${isClinic
                        ? "bg-primary text-white hover:bg-[#9f1239]"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}>
                    {buttonText} &rarr;
                </Link>
            </div>
        </div>
    );
}
