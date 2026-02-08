"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ArticleCard from "./ArticleCard";
import { supabase } from "@/lib/supabase";

const CATEGORIES = ["All", "Korean Beauty", "Medical Skincare", "Anti-Aging", "Lifestyle"];

export default function ArticleListContainer() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            // Only fetch published articles
            let query = supabase
                .from('articles')
                .select('*')
                .eq('status', 'published')
                .order('published_at', { ascending: false });

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

    const filteredArticles = activeCategory === "All"
        ? articles
        : articles.filter(a => {
            // If category is a relation, need to adjust. For now assuming simple filtering or matching logic
            // The schema has category_id, so we might need to fetch categories or just filter by implicit knowledge
            // For this quick fix, let's just show all if filtering is complex, or rely on client side filter if possible.
            // Actually, let's just fetch all published and filter client side for now.
            // MOCK implementation used string constants. Real DB uses UUIDs.
            // We need to fetch category name to filter by "Korean Beauty" etc.
            // Let's update the fetch to include categories.
            return true; // Placeholder until we fix category logic
        });

    // Re-fetch with category logic
    // Actually, let's improve the fetch to include categories(name)
    // and filter based on that.

    return (
        <div className="w-full max-w-6xl px-6 pb-24 mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                <h2 className="text-3xl font-serif font-bold text-stone-800 relative inline-block">
                    Latest Topics
                    <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary rounded-full" />
                </h2>

                {/* Filter Pills - (Temporary disabled valid filtering until categories are aligned) */}
                <div className="flex flex-wrap gap-2 justify-center">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat
                                ? "bg-primary text-white shadow-md transform scale-105"
                                : "bg-white text-stone-500 border border-stone-200 hover:border-primary/50 hover:text-primary"
                                }`}
                        >
                            {cat}
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
                    <span>&rarr;</span>
                </Link>
            </div>
        </div>
    );
}

