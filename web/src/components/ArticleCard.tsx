import Link from "next/link";
import { format } from "date-fns";

interface Article {
    id: string;
    title: string;
    excerpt?: string;
    thumbnail_url?: string;
    category?: string;
    created_at: string;
}

export default function ArticleCard({ article }: { article: Article }) {
    return (
        <Link href={`/blog/${article.id}`} className="group block h-full">
            <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-stone-100">
                <div className="relative aspect-[4/3] overflow-hidden">
                    {/* Thumbnail with zoom effect */}
                    <div
                        className="absolute inset-0 bg-stone-200 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                        style={{ backgroundImage: `url(${article.thumbnail_url || 'https://placehold.co/600x400/fce7f3/7c0a27?text=No+Image'})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Category Badge */}
                    {article.category && (
                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-primary text-xs font-serif font-bold px-3 py-1 rounded-full shadow-sm">
                            {article.category}
                        </span>
                    )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                    <div className="mb-2 flex items-center gap-2 text-xs text-stone-400 font-medium">
                        <span className="font-serif">{format(new Date(article.created_at), "yyyy.MM.dd")}</span>
                    </div>

                    <h3 className="text-lg font-bold text-stone-800 mb-3 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                        {article.title}
                    </h3>

                    {article.excerpt && (
                        <p className="text-sm text-stone-500 line-clamp-2 mb-4 leading-relaxed flex-1">
                            {article.excerpt}
                        </p>
                    )}

                    <div className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-primary font-bold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <span>Read More</span>
                        <span>&rarr;</span>
                    </div>
                </div>
            </article>
        </Link>
    );
}
