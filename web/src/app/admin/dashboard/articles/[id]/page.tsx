'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { format } from 'date-fns';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Save, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import ArticleImage from "@/components/ArticleImage";

export default function ArticleDetailPage() {
    const router = useRouter();
    const params = useParams();
    // In Next.js App Router client components, params can be used directly but type safety is loose.
    // Casting or checking existence is good practice.
    const id = params?.id as string;

    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [prompt, setPrompt] = useState('');
    const [isRevising, setIsRevising] = useState(false);

    // Category State
    const [categories, setCategories] = useState<any[]>([]);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);

    useEffect(() => {
        if (id) {
            fetchArticle();
            fetchCategories();
        }
    }, [id]);

    const fetchCategories = async () => {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name');
        if (data) setCategories(data);
    };

    const fetchArticle = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('articles')
            .select('*, category:categories(id, name)')
            .eq('id', id)
            .single();

        if (error) {
            console.error(error);
            alert('Failed to fetch article');
        } else {
            setArticle(data);
        }
        setLoading(false);
    };

    const handleStatusChange = async (newStatus: string) => {
        if (!article) return;
        const { error } = await supabase
            .from('articles')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', article.id);

        if (error) {
            alert('更新に失敗しました');
        } else {
            setArticle({ ...article, status: newStatus });
            alert(`記事のステータスを ${newStatus} に更新しました`);
        }
    };

    const handleRevisionRequest = async () => {
        if (!prompt.trim()) return alert("修正指示を入力してください。");

        setIsRevising(true);
        try {
            // 1. Call Engine via Proxy
            const res = await fetch('/api/engine/revise', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: article.content,
                    feedback: prompt
                })
            });

            if (!res.ok) throw new Error("AI修正リクエストに失敗しました");
            const data = await res.json();
            const revisedContent = data.revised_content;

            if (!revisedContent) throw new Error("修正されたコンテンツが空でした");

            // 2. Update Supabase with new content AND feedback record
            const { error } = await supabase
                .from('articles')
                .update({
                    content: revisedContent,
                    admin_feedback: prompt,
                    updated_at: new Date().toISOString()
                })
                .eq('id', article.id);

            if (error) throw error;

            alert("AIによる修正が完了しました！");
            setPrompt('');
            fetchArticle(); // Refresh to show new content
        } catch (e) {
            console.error(e);
            alert("修正に失敗しました: " + (e as Error).message);
        } finally {
            setIsRevising(false);
        }
    };

    const handleCategoryChange = async (categoryId: string) => {
        if (!article) return;

        // Update local state first
        const selectedCat = categories.find(c => c.id === categoryId);
        setArticle({ ...article, category_id: categoryId, category: selectedCat });

        const { error } = await supabase
            .from('articles')
            .update({ category_id: categoryId })
            .eq('id', id);

        if (error) {
            console.error("Failed to update category:", error);
            alert("カテゴリー更新に失敗しました");
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;
        setIsCreatingCategory(true);

        try {
            // Check if exists
            const existing = categories.find(c => c.name.toLowerCase() === newCategoryName.toLowerCase());
            if (existing) {
                await handleCategoryChange(existing.id);
                setNewCategoryName("");
                return;
            }

            // Create new
            const slug = newCategoryName.toLowerCase().replace(/\s+/g, '-');
            const { data, error } = await supabase
                .from('categories')
                .insert({ name: newCategoryName, slug })
                .select()
                .single();

            if (error) throw error;
            if (data) {
                setCategories([...categories, data]);
                await handleCategoryChange(data.id);
                setNewCategoryName("");
            }
        } catch (e) {
            console.error(e);
            alert("カテゴリー作成に失敗しました");
        } finally {
            setIsCreatingCategory(false);
        }
    };

    if (loading) return <div className="p-10 text-center">記事を読み込み中...</div>;
    if (!article) return <div className="p-10 text-center">記事が見つかりません</div>;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard/articles">
                        <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold truncate max-w-xl">{article.title}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{article.status}</Badge>
                            <span className="text-sm text-muted-foreground">{format(new Date(article.created_at), 'yyyy/MM/dd HH:mm')}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => window.open(article.source_url, '_blank')}>
                        <ExternalLink className="mr-2 h-4 w-4" /> ソース
                    </Button>
                    {article.status !== 'published' && (
                        <Button className="bg-rose-500 hover:bg-rose-600" onClick={() => handleStatusChange('published')}>
                            公開する
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Preview */}
                <div className="lg:col-span-2 space-y-6">



                    <Card>
                        <CardContent className="p-8 max-w-none">
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
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Controls */}
                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-4 space-y-4">
                            <h3 className="font-semibold text-lg">AI修正依頼</h3>
                            <p className="text-sm text-muted-foreground">
                                美咲（AI）への修正指示を入力してください。
                            </p>
                            <Textarea
                                placeholder="例: もっとテンションを高くして！価格についての情報を追加して。"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="min-h-[120px]"
                            />
                            <Button
                                onClick={handleRevisionRequest}
                                disabled={isRevising}
                                className="w-full"
                            >
                                {isRevising ? "送信中..." : "AIへ修正を依頼"}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 space-y-4">
                            <h3 className="font-semibold text-lg">カテゴリー</h3>
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-stone-600 block">カテゴリー選択</label>
                                <select
                                    className="w-full p-2 border border-stone-200 rounded-md text-sm bg-white"
                                    value={article.category_id || ""}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                >
                                    <option value="">未設定</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>

                                <div className="pt-2 border-t border-stone-100">
                                    <label className="text-xs text-stone-400 block mb-1">新規作成</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="新しいカテゴリー名"
                                            className="flex-1 p-2 border border-stone-200 rounded-md text-sm"
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                        />
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={handleCreateCategory}
                                            disabled={!newCategoryName || isCreatingCategory}
                                        >
                                            作成
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 space-y-4">
                            <h3 className="font-semibold text-lg">メタデータ</h3>
                            <div className="grid grid-cols-1 gap-2 text-sm">
                                <div className="font-medium">サムネイル</div>
                                <div className="aspect-video bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                                    {article.thumbnail_url ? (
                                        <img src={article.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-gray-400">画像なし</span>
                                    )}
                                </div>

                                <div className="font-medium mt-2">生成モデル</div>
                                <div>{article.generated_by}</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
