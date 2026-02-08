"use client";

import { useState } from "react";

interface ArticleImageProps {
    src?: string;
    alt: string;
    className?: string;
}

export default function ArticleImage({ src, alt, className }: ArticleImageProps) {
    const [error, setError] = useState(false);

    // Default fallback image
    const fallbackSrc = "https://placehold.co/1200x600/fce7f3/7c0a27?text=No+Image";

    return (
        <img
            src={error || !src ? fallbackSrc : src}
            alt={alt}
            className={className}
            onError={() => setError(true)}
        />
    );
}
