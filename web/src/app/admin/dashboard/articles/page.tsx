'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, subDays, isAfter } from 'date-fns';
import { Trash2, Eye, FileText, BarChart3, Calendar, MoreHorizontal, Edit, ExternalLink } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";

export default function ArticlesPage() {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'published', 'draft', 'deleted'

    // KPI States
    const [stats, setStats] = useState({
        total: 0,
        weekly: 0,
        published: 0,
        draft: 0,
        deleted: 0
    });

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
            const fetchedArticles = data || [];
            setArticles(fetchedArticles);

            // Calculate KPIs
            const now = new Date();
            const oneWeekAgo = subDays(now, 7);
            const weeklyCount = fetchedArticles.filter(a => isAfter(new Date(a.created_at), oneWeekAgo)).length;

            setStats({
                total: fetchedArticles.length,
                weekly: weeklyCount,
                published: fetchedArticles.filter(a => a.status === 'published').length,
                draft: fetchedArticles.filter(a => a.status === 'draft').length,
                deleted: fetchedArticles.filter(a => a.status === 'deleted').length
            });
        }
        setLoading(false);
    };

    const handleSoftDelete = async (id: string) => {
        if (!window.confirm("ゴミ箱に移動しますか？")) return;
        try {
            const { error } = await supabase.from('articles').update({ status: 'deleted' }).eq('id', id);
            if (error) throw error;
            fetchArticles(); // Re-fetch to update lists
        } catch (e) {
            alert("移動に失敗しました");
        }
    };

    const handleRestore = async (id: string) => {
        if (!window.confirm("下書きとして復元しますか？")) return;
        try {
            const { error } = await supabase.from('articles').update({ status: 'draft' }).eq('id', id);
            if (error) throw error;
            fetchArticles();
        } catch (e) {
            alert("復元に失敗しました");
        }
    };

    const handlePermanentDelete = async (id: string) => {
        if (!window.confirm("完全に削除しますか？この操作は取り消せません。")) return;
        try {
            const { error } = await supabase.from('articles').delete().eq('id', id);
            if (error) throw error;
            setArticles(articles.filter(a => a.id !== id));
        } catch (e) {
            alert("完全削除に失敗しました");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published': return 'bg-emerald-500 hover:bg-emerald-600';
            case 'approved': return 'bg-blue-500 hover:bg-blue-600';
            case 'draft': return 'bg-slate-500 hover:bg-slate-600';
            case 'pending_review': return 'bg-amber-500 hover:bg-amber-600';
            case 'deleted': return 'bg-red-500 hover:bg-red-600';
            default: return 'bg-gray-400';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'published': return '公開中';
            case 'approved': return '承認済';
            case 'draft': return '下書き';
            case 'pending_review': return 'レビュー待ち';
            case 'deleted': return '削除済み';
            default: return status;
        }
    };

    // Filter Logic
    const filteredArticles = articles.filter(article => {
        if (filter === 'all') return article.status !== 'deleted'; // All usually excludes deleted unless specified? Or maybe 'All' means active.
        // Let's make 'all' = everything EXCEPT deleted. And 'deleted' = ONLY deleted.
        if (filter === 'deleted') return article.status === 'deleted';
        return article.status === filter;
    });

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">記事管理</h2>
                    <p className="text-sm text-slate-500">作成された記事の確認、編集、削除が行えます</p>
                </div>
                <Button onClick={fetchArticles} variant="outline" size="sm" className="gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    データ更新
                </Button>
            </header>

            {/* KPI Dashboard */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">全記事 (Active)</CardTitle>
                        <FileText className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{stats.total - stats.deleted}</div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">公開中</CardTitle>
                        <Eye className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{stats.published}</div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">下書き</CardTitle>
                        <Edit className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{stats.draft}</div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">ゴミ箱</CardTitle>
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{stats.deleted}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs / Filters */}
            <div className="flex gap-2 border-b border-slate-200 pb-1">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${filter === 'all' ? 'bg-white text-rose-600 border-b-2 border-rose-500' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    すべて
                </button>
                <button
                    onClick={() => setFilter('published')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${filter === 'published' ? 'bg-white text-rose-600 border-b-2 border-rose-500' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    公開中
                    <Badge variant="secondary" className="ml-2 bg-emerald-100 text-emerald-700">{stats.published}</Badge>
                </button>
                <button
                    onClick={() => setFilter('draft')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${filter === 'draft' ? 'bg-white text-rose-600 border-b-2 border-rose-500' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    下書き
                    <Badge variant="secondary" className="ml-2 bg-slate-100 text-slate-700">{stats.draft}</Badge>
                </button>
                <button
                    onClick={() => setFilter('deleted')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${filter === 'deleted' ? 'bg-white text-rose-600 border-b-2 border-rose-500' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    ゴミ箱
                    <Badge variant="secondary" className="ml-2 bg-red-100 text-red-700">{stats.deleted}</Badge>
                </button>
            </div>

            {/* Article List */}
            <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="p-12 text-center text-slate-400">
                        <div className="animate-spin h-6 w-6 border-2 border-slate-300 border-t-rose-500 rounded-full mx-auto mb-2" />
                        読み込み中...
                    </div>
                ) : filteredArticles.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                        記事が見つかりません。
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {filteredArticles.map((article) => (
                            <div key={article.id} className={`group flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors ${article.status === 'deleted' ? 'opacity-60 bg-slate-50' : ''}`}>
                                {/* Thumbnail */}
                                <div className="shrink-0 w-32 h-20 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 relative">
                                    {article.thumbnail_url ? (
                                        <img src={article.thumbnail_url} alt="" className="w-full h-full object-cover grayscale-[30%]" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <FileText className="h-8 w-8" />
                                        </div>
                                    )}
                                    <div className="absolute top-1 left-1">
                                        <Badge className={`text-[10px] px-1.5 py-0 h-5 border-0 ${getStatusColor(article.status)}`}>
                                            {getStatusLabel(article.status)}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Content Info */}
                                <div className="flex-1 min-w-0 py-0.5">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="text-xs text-slate-400 font-mono">
                                            {format(new Date(article.created_at), 'yyyy.MM.dd HH:mm')}
                                        </span>
                                        {article.generated_by && (
                                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">
                                                By {article.generated_by}
                                            </span>
                                        )}
                                    </div>

                                    <Link href={`/admin/dashboard/articles/${article.id}`} className="group-hover:text-rose-600 transition-colors">
                                        <h4 className="text-base font-bold text-slate-800 leading-snug mb-1 line-clamp-1">
                                            {article.title}
                                        </h4>
                                    </Link>
                                    <p className="text-xs text-slate-500 line-clamp-1">
                                        {article.content ? article.content.replace(/[#*`]/g, '').slice(0, 80) : 'No content...'}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 pt-1">
                                    {article.status === 'deleted' ? (
                                        <>
                                            <Button variant="ghost" size="sm" onClick={() => handleRestore(article.id)} className="h-8 px-2 text-emerald-600 hover:bg-emerald-50">
                                                復元
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handlePermanentDelete(article.id)} className="h-8 px-2 text-rose-600 hover:bg-rose-50">
                                                完全削除
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Link href={`/admin/dashboard/articles/${article.id}`}>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                                                onClick={() => handleSoftDelete(article.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem className="text-slate-600">
                                                        <ExternalLink className="mr-2 h-4 w-4" /> プレビュー
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-slate-600">
                                                        <Eye className="mr-2 h-4 w-4" /> 公開ページを確認
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => handleSoftDelete(article.id)}>
                                                        <Trash2 className="mr-2 h-4 w-4" /> ゴミ箱へ
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
