"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, FileText, TrendingUp, Users, Search, Sparkles, Loader2, RefreshCw } from "lucide-react";

export default function DashboardPage() {
    const [trends, setTrends] = useState<string[]>([]);
    const [articles, setArticles] = useState<any[]>([]);
    const [loadingTrends, setLoadingTrends] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [generating, setGenerating] = useState(false);
    const [generationMessage, setGenerationMessage] = useState("");

    const fetchTrends = async () => {
        setLoadingTrends(true);
        try {
            const res = await fetch('/api/engine/trends');
            if (res.ok) {
                const data = await res.json();
                setTrends(data.keywords || []);
            } else {
                setTrends([]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingTrends(false);
        }
    };

    const fetchArticles = async () => {
        try {
            const res = await fetch('/api/dashboard/articles');
            if (res.ok) {
                const data = await res.json();
                console.log("Articles Data:", data); // Debug link
                setArticles(data.articles || []);
            }
        } catch (e) {
            console.error(e);
        }
    };

    // Initial Fetch & Real-time Polling
    useEffect(() => {
        fetchTrends();
        fetchArticles();

        // Poll for new articles every 5 seconds
        const interval = setInterval(() => {
            fetchArticles();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const [bulkGenerating, setBulkGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!keyword) return;
        setGenerating(true);
        setGenerationMessage("");
        try {
            const res = await fetch('/api/engine/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keyword })
            });
            if (res.ok) {
                setGenerationMessage(`生成を開始しました: ${keyword}`);
                setKeyword("");
                setTimeout(fetchArticles, 1000);
                setTimeout(() => setGenerationMessage(""), 5000);
            } else {
                setGenerationMessage("エラーが発生しました。");
            }
        } catch (e) {
            setGenerationMessage("通信エラーが発生しました。");
        } finally {
            setGenerating(false);
        }
    };

    const handleBulkGenerate = async () => {
        setBulkGenerating(true);
        try {
            const res = await fetch('/api/engine/generate_bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) {
                const data = await res.json();
                setGenerationMessage(`一括生成を開始しました: ${data.keywords.join(", ")}`);
                setTimeout(fetchArticles, 2000);
                setTimeout(() => setGenerationMessage(""), 8000);
            } else {
                setGenerationMessage("一括生成エラーが発生しました。");
            }
        } catch (e) {
            setGenerationMessage("通信エラーが発生しました。");
        } finally {
            setBulkGenerating(false);
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight font-serif text-stone-800">Dashboard</h2>
                <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-sm text-stone-500">Engine Online (Real-time)</span>
                </div>
            </header>



            <div className="grid gap-6 md:grid-cols-7">
                {/* Main Action Area */}
                <Card className="md:col-span-4 lg:col-span-5 shadow-sm border-stone-100">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            AI Article Generator
                        </CardTitle>
                        <CardDescription>
                            キーワードを入力して、日韓のトレンド記事を自動生成します。<br />
                            生成プロセスはバックグラウンドで実行され、完了すると下部に表示されます。
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="bg-stone-50 p-6 rounded-xl border border-stone-100">
                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                Target Keyword
                            </label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="例: 韓国肌管理, レチノール, 医療ダイエット..."
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                                    />
                                </div>
                                <button
                                    onClick={handleGenerate}
                                    disabled={!keyword || generating}
                                    className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                    Generate
                                </button>
                            </div>

                            {/* Trends - Moved Below Input */}
                            <div className="mt-4">
                                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" /> Trending Now (Click to Auto-Fill)
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {loadingTrends ? (
                                        [1, 2, 3, 4, 5].map(i => <div key={i} className="h-7 w-20 bg-stone-200 rounded-full animate-pulse" />)
                                    ) : trends.slice(0, 10).map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setKeyword(t)}
                                            className="px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-medium text-stone-600 hover:border-primary/50 hover:text-primary hover:bg-rose-50/50 transition-all"
                                        >
                                            #{t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {generationMessage && (
                                <p className="mt-3 text-sm text-emerald-600 font-medium flex items-center gap-2 animate-pulse bg-emerald-50 px-3 py-2 rounded-md border border-emerald-100">
                                    <span className="block h-2 w-2 rounded-full bg-emerald-500" />
                                    {generationMessage}
                                </p>
                            )}
                        </div>

                        {/* Generated Articles List (with Thumbnails) */}
                        <div className="mt-8 pt-2">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-medium text-stone-600">Generated Articles</h4>
                                <RefreshCw className="h-3 w-3 text-stone-400 animate-spin" style={{ animationDuration: '3s' }} />
                            </div>

                            <div className="space-y-3">
                                {articles.length > 0 ? (
                                    articles.slice(0, 5).map((article) => (
                                        <Link href={`/admin/dashboard/articles/${article.id}`} key={article.id} className="block">
                                            <div className="flex items-center p-3 bg-white rounded-lg border border-stone-100 shadow-sm hover:shadow-md transition-all cursor-pointer group gap-4">
                                                {/* Thumbnail Image */}
                                                <div className="shrink-0 w-24 h-16 bg-stone-100 rounded-md overflow-hidden border border-stone-100 relative">
                                                    {article.thumbnail_url ? (
                                                        <img src={article.thumbnail_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                                                            <FileText className="h-6 w-6" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0 py-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className={`w-2 h-2 rounded-full ${article.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded border capitalize ${article.status === 'published'
                                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                            : 'bg-amber-50 text-amber-600 border-amber-100'
                                                            }`}>
                                                            {article.status}
                                                        </span>
                                                        <span className="text-[10px] text-stone-400">{new Date(article.created_at).toLocaleString()}</span>
                                                    </div>
                                                    <h5 className="text-sm font-bold text-stone-800 line-clamp-1 group-hover:text-primary transition-colors">{article.title}</h5>
                                                    <p className="text-xs text-stone-400 mt-1 flex items-center gap-1">
                                                        <Sparkles className="h-3 w-3 text-purple-400" />
                                                        Generated by {article.generated_by || "AI"}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-stone-400 text-sm bg-stone-50/50 rounded-lg border border-dashed border-stone-200">
                                        <Sparkles className="h-8 w-8 mx-auto mb-2 text-stone-200" />
                                        <p>No articles generated yet.</p>
                                        <p className="text-xs mt-1">Enter a keyword above to start.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Sidebar Actions */}
                <Card className="md:col-span-3 lg:col-span-2 shadow-sm border-stone-100 h-fit">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                            <h4 className="font-bold text-indigo-900 mb-1">一括記事生成 (Bulk)</h4>
                            <p className="text-xs text-indigo-700/80 mb-4 leading-relaxed">
                                最新トレンドからAIが最適なキーワードを3つ選定し、自動で記事を作成します。時間がかかります。
                            </p>
                            <button
                                onClick={handleBulkGenerate}
                                disabled={bulkGenerating}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {bulkGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                Generate 3 Articles
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
