'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';

export default function ArticlesPage() {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('articles')
            .select('*, categories(name)')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching articles:', error);
        } else {
            setArticles(data || []);
        }
        setLoading(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published': return 'bg-green-500';
            case 'approved': return 'bg-blue-500';
            case 'draft': return 'bg-gray-400';
            case 'pending_review': return 'bg-orange-500';
            default: return 'bg-gray-400';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">記事一覧</h2>
                <Button onClick={fetchArticles} variant="outline" size="sm">更新</Button>
            </div>

            <div className="grid gap-4">
                {loading ? (
                    <div className="text-center p-10">読み込み中...</div>
                ) : articles.length === 0 ? (
                    <Card>
                        <CardContent className="p-10 text-center text-muted-foreground">
                            記事が見つかりません。エンジンを起動して記事を生成してください。
                        </CardContent>
                    </Card>
                ) : (
                    articles.map((article) => (
                        <Card key={article.id} className="hover:shadow-md transition">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Badge className={getStatusColor(article.status)}>{article.status}</Badge>
                                            <span className="text-xs text-muted-foreground">{format(new Date(article.created_at), 'yyyy-MM-dd HH:mm')}</span>
                                        </div>
                                        <h3 className="text-lg font-semibold">{article.title}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            ソース: {article.source_url}
                                        </p>
                                    </div>
                                    <Link href={`/admin/dashboard/articles/${article.id}`}>
                                        <Button variant="secondary">編集 / レビュー</Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
