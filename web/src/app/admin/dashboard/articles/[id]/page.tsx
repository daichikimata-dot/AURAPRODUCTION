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

    useEffect(() => {
        if (id) {
            fetchArticle();
        }
    }, [id]);

    const fetchArticle = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('articles')
            .select('*')
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
        // In a real implementation, this would trigger a backend job or API call to Python Engine.
        // For now, we simulate saving the feedback and changing status to 'pending_review' or a new 'revision_requested' status.

        const { error } = await supabase
            .from('articles')
            .update({
                admin_feedback: prompt,
                status: 'draft', // Reset to draft or keep current? Let's say we keep it draft but mark feedback.
                updated_at: new Date().toISOString()
            })
            .eq('id', article.id);

        if (error) alert("フィードバックの送信に失敗しました");
        else {
            alert("フィードバックを送信しました！AIが修正を行います（シミュレーション）。");
            setPrompt('');
            fetchArticle();
        }
        setIsRevising(false);
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
                        <CardContent className="p-8 prose prose-rose max-w-none">
                            {/* Safe to render markdown in real app using react-markdown, here plain text for now or valid HTML */}
                            <div className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                                {article.content}
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
