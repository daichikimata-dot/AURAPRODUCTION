"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ArticleCard from "./ArticleCard";
import { supabase } from "@/lib/supabase";

interface ArticleListContainerProps {
    limit?: number;
}

export default function ArticleListContainer({ limit }: ArticleListContainerProps) {
    const [activeCategoryId, setActiveCategoryId] = useState("All");
    const [categories, setCategories] = useState<any[]>([]);
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchArticles();
    }, [activeCategoryId, limit]);

    const fetchCategories = async () => {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name');

        if (data) {
            setCategories(data);
        }
    };

    const fetchArticles = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('articles')
                .select('*, category:categories(name)')
                .eq('status', 'published')
                .order('created_at', { ascending: false }); // User requested latest first (usually published_at or created_at)

            if (activeCategoryId !== "All") {
                query = query.eq('category_id', activeCategoryId);
            }

            if (limit) {
                query = query.limit(limit);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching articles:', error);
            } else {
                setArticles(data || []);
            }
        } catch (e) {
            console.error('Fetch error:', e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-6xl px-6 pb-24 mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                <h2 className="text-3xl font-serif font-bold text-stone-800 relative inline-block">
                    Latest Topics
                    <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary rounded-full" />
                </h2>

                <div className="flex flex-wrap gap-2 justify-center">
                    <button
                        onClick={() => setActiveCategoryId("All")}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategoryId === "All"
                            ? "bg-primary text-white shadow-md transform scale-105"
                            : "bg-white text-stone-500 border border-stone-200 hover:border-primary/50 hover:text-primary"
                            }`}
                    >
                        All
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategoryId(cat.id)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategoryId === cat.id
                                ? "bg-primary text-white shadow-md transform scale-105"
                                : "bg-white text-stone-500 border border-stone-200 hover:border-primary/50 hover:text-primary"
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="py-20 text-center text-stone-400">Loading articles...</div>
            ) : articles.length === 0 ? (
                <div className="py-20 text-center text-stone-400">現在、公開されている記事はありません。</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {articles.map((article) => (
                        <div key={article.id} className="animate-fade-in-up">
                            <ArticleCard article={article} />
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-12 text-center">
                <Link href="/blog" className="inline-flex items-center gap-2 text-stone-500 hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-1">
                    <span>View All Articles</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
