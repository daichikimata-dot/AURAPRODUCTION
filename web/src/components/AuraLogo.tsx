"use client";

import { useState } from "react";

export default function AuraLogo() {
    const [error, setError] = useState(false);

    if (error) {
        return (
            <span className="font-serif text-2xl font-bold text-white tracking-widest">
                AURA
            </span>
        );
    }

    return (
        <img
            src="/aura_logo_circle.png"
            alt="AURA"
            className="w-full h-full object-cover opacity-90"
            onError={() => setError(true)}
        />
    );
}
