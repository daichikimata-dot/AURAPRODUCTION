import { notFound } from "next/navigation";
// import { createClient } from "@/lib/supabase";
import Link from "next/link";
import ReactMarkdown from 'react-markdown';
import ConversionBanner from "@/components/ConversionBanner";
import ArticleCard from "@/components/ArticleCard"; // For related articles in future
import ArticleImage from "@/components/ArticleImage";
import SiteHeader from "@/components/SiteHeader";



interface ArticlePageProps {
    params: Promise<{
        id: string;
    }>;
}

import { createClient } from "@supabase/supabase-js";

// Real fetch function from Supabase
export const revalidate = 0; // Disable cache for dev/preview purposes (or use ISR with revalidatePath)

async function getArticle(id: string) {
    // Create Admin Client to bypass RLS (needed to view 'draft' articles)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: article, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error("[getArticle] Supabase Error:", JSON.stringify(error, null, 2));
        return null;
    }
    if (!article) {
        console.error(`[getArticle] Article not found for ID: ${id}`);
        return null;
    }

    // Adapt DB fields to UI expectation if needed
    return {
        ...article,
        // Generate summary if missing
        summary: article.summary || (article.content ? article.content.substring(0, 100) + "..." : "No summary available"),
        // Use placeholder if no thumbnail
        thumbnail_url: (article.thumbnail_url as string | null) || "/article_header_water_glow.png",
        // Default category
        category: article.category || "Beauty",
        // Ensure content is not null
        content: article.content || "*(本文がありません)*"
    };
}


export default async function ArticlePage({ params }: ArticlePageProps) {
    const { id } = await params;
    const article = await getArticle(id);

    if (!article) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#fffafb] pb-24">
            {/* Global Header */}
            <SiteHeader />

            {/* Header Spacer (Adjusted for fixed header) */}
            <div className="h-28" />

            {/* Article Header */}
            <header className="w-full max-w-4xl mx-auto px-4 text-center mb-12">
                <div className="inline-block bg-primary/10 text-primary text-sm font-serif font-bold px-4 py-1 rounded-full mb-6">
                    {article.category}
                </div>
                <h1 className="text-2xl md:text-4xl font-serif font-bold text-stone-800 leading-snug mb-6">
                    {article.title}
                </h1>
                <div className="flex items-center justify-center gap-4 text-stone-500 text-sm">
                    <time className="font-serif">{new Date(article.created_at).toLocaleDateString()}</time>
                </div>
            </header>

            {/* Article Thumbnail */}
            <div className="w-full max-w-5xl mx-auto px-4 mb-12">
                <div className="aspect-[21/9] w-full rounded-3xl overflow-hidden shadow-xl border border-stone-100">
                    {/* Fallback to generated image or placeholder if file logic fails (handled by browser) */}
                    <ArticleImage
                        src={article.thumbnail_url}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-center gap-12 max-w-[1400px] mx-auto px-4 mb-24 relative">

                {/* Left Spacer for Balancing (Visible on XL screens to perfectly center the article) */}
                <div className="hidden xl:block w-80 shrink-0" aria-hidden="true" />

                {/* Main Content */}
                <article className="w-full max-w-3xl shrink-0">
                    {/* Summary Box */}
                    <div className="bg-white p-6 md:p-8 rounded-2xl border border-primary/20 shadow-sm mb-12 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
                        <h3 className="text-lg font-bold text-primary mb-3 font-serif flex items-center gap-2">
                            <span>✦</span> Point
                        </h3>
                        <p className="text-stone-700 leading-relaxed font-medium">
                            {article.summary}
                        </p>
                    </div>

                    <div className="prose prose-stone prose-lg max-w-none 
                prose-headings:font-serif prose-headings:text-primary prose-headings:font-bold
                prose-h1:text-4xl prose-h1:mb-8
                prose-h2:text-3xl prose-h2:border-b-2 prose-h2:border-primary/10 prose-h2:pb-3 prose-h2:mt-16 prose-h2:mb-8 prose-h2:leading-snug
                prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-6 prose-h3:text-stone-800
                prose-p:leading-loose prose-p:text-stone-700
                prose-strong:text-primary/90 prose-strong:font-bold
                prose-li:text-stone-700 prose-li:marker:text-primary
                prose-a:text-primary hover:prose-a:text-[#9f1239] prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-2xl prose-img:shadow-lg prose-img:border prose-img:border-stone-100
                prose-blockquote:border-l-4 prose-blockquote:border-primary/30 prose-blockquote:bg-rose-50/30 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:font-medium prose-blockquote:text-stone-700 prose-blockquote:italic">
                        <ReactMarkdown
                            components={{
                                h1: ({ node, ...props }) => <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mt-12 mb-6 leading-snug" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary mt-16 mb-8 pb-3 border-b-2 border-primary/10 leading-snug" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="text-xl md:text-2xl font-serif font-bold text-stone-800 mt-10 mb-5" {...props} />,
                                p: ({ node, ...props }) => <p className="text-stone-700 leading-loose mb-6 text-lg" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-6 space-y-2 text-stone-700" {...props} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-stone-700" {...props} />,
                                li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                strong: ({ node, ...props }) => <strong className="text-primary font-bold" {...props} />,
                                blockquote: ({ node, ...props }) => (
                                    <blockquote className="border-l-4 border-primary/30 bg-rose-50/30 py-4 px-6 rounded-r-lg font-medium text-stone-700 italic my-8" {...props} />
                                ),
                                img: ({ node, ...props }) => (
                                    <ArticleImage
                                        src={props.src as string}
                                        alt={props.alt || ""}
                                        className="w-full h-auto rounded-xl shadow-md my-8 border border-stone-100"
                                    />
                                )
                            }}
                        >
                            {article.content}
                        </ReactMarkdown>
                    </div>

                    {/* CTA in Article (Affiliate/Campaign) */}
                    <div className="my-16">
                        <ConversionBanner
                            type="campaign"
                            title="初回限定キャンペーン"
                            description="今ならLINE登録で、提携クリニックの施術が最大20%OFFになるクーポンをプレゼント中。"
                            linkUrl="#"
                            buttonText="クーポンを受け取る"
                        />
                    </div>
                </article>

                {/* Sidebar - Sticky */}
                <aside className="hidden lg:block w-80 shrink-0">
                    <div className="sticky top-32 space-y-6">

                        {/* Clinic Referral Banner (Sticky Top) - Green & Compact */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 text-center group cursor-pointer hover:shadow-md transition-all duration-300">
                            <span className="inline-block bg-emerald-600/10 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full mb-3 tracking-wider">
                                RECOMMENDED CLINIC
                            </span>
                            <h3 className="text-sm font-bold text-emerald-950 mb-2 font-serif">
                                失敗しないクリニック選び
                            </h3>
                            {/* Compact Image/Icon Area */}
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <div className="w-10 h-10 rounded-full bg-stone-50 overflow-hidden border border-emerald-50">
                                    <img src="https://placehold.co/100x100/ecfdf5/047857?text=Dr" className="w-full h-full rounded-full object-cover" />
                                </div>
                                <div className="w-10 h-10 rounded-full bg-stone-50 overflow-hidden border border-emerald-50">
                                    <img src="https://placehold.co/100x100/ecfdf5/047857?text=Clinic" className="w-full h-full rounded-full object-cover" />
                                </div>
                            </div>
                            <p className="text-[11px] text-stone-500 mb-4 leading-relaxed">
                                AURA編集部厳選の<br />信頼できる提携クリニック。
                            </p>

                            <button className="w-full py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 text-xs">
                                <span>提携クリニックを見る</span>
                            </button>
                        </div>

                    </div>
                </aside>
            </div>

            {/* Latest Posts (Moved to Bottom) */}
            <section className="w-full max-w-6xl mx-auto px-4 pb-20">
                <div className="border-t border-stone-200 pt-16">
                    <h2 className="text-2xl font-serif font-bold text-center text-stone-800 mb-10">
                        Latest Posts
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <Link key={i} href="#" className="group block">
                                <div className="aspect-[4/3] rounded-2xl bg-stone-100 overflow-hidden mb-4 relative">
                                    <img
                                        src={`https://placehold.co/600x400/f3f4f6/9ca3af?text=Post+${i}`}
                                        alt=""
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary">
                                        Category
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-stone-800 group-hover:text-primary transition-colors leading-snug mb-2">
                                    おすすめの美容治療特集：第{i}弾
                                </h3>
                                <p className="text-sm text-stone-500 line-clamp-2 mb-3">
                                    最新のトレンドを取り入れたおすすめの施術をご紹介。効果やダウンタイムについても解説します。
                                </p>
                                <time className="text-xs text-stone-400 font-serif">2026.02.0{i}</time>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

        </main>
    );
}
