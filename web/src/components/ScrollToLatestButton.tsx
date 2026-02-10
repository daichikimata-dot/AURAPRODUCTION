"use client";

import { Button } from "@/components/ui/button";

export default function ScrollToLatestButton() {
    const scrollToLatest = () => {
        const uniqueId = "latest-topics-section";
        const element = document.getElementById(uniqueId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        } else {
            // Fallback if ID not found (though it should be there)
            console.warn("Element #latest-topics-section not found");
        }
    };

    return (
        <button
            onClick={scrollToLatest}
            className="px-10 py-3 bg-primary text-white rounded-full hover:bg-[#9f1239] transition-all shadow-lg shadow-primary/20 tracking-wider hover:scale-105 active:scale-95"
        >
            Latest Topics
        </button>
    );
}
