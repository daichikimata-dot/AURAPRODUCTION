'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, ExternalLink, Edit, Save, Plus, X, Trash2, Database, Play, Loader2 } from "lucide-react";
import { format } from 'date-fns';

export default function MediaPage() {
    const [sources, setSources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [crawling, setCrawling] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        type: 'japanese_media' // Default
    });

    useEffect(() => {
        fetchSources();
    }, []);

    const fetchSources = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('sources')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching sources:', error);
        } else {
            setSources(data || []);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!formData.name || !formData.url) return alert('名称とURLは必須です');

        try {
            if (isEditing && editId) {
                // Update
                const { error } = await supabase
                    .from('sources')
                    .update({
                        name: formData.name,
                        url: formData.url,
                        type: formData.type,
                    })
                    .eq('id', editId);
                if (error) throw error;
            } else {
                // Create
                const { error } = await supabase
                    .from('sources')
                    .insert([{
                        name: formData.name,
                        url: formData.url,
                        type: formData.type,
                        is_active: true
                    }]);
                if (error) throw error;
            }

            // Reset
            fetchSources();
            resetForm();
        } catch (e: any) {
            alert(`エラーが発生しました: ${e.message}`);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('本当に削除しますか？')) return;
        try {
            const { error } = await supabase.from('sources').delete().eq('id', id);
            if (error) throw error;
            setSources(sources.filter(s => s.id !== id));
        } catch (e: any) {
            alert(`削除エラー: ${e.message}`);
        }
    };

    const handleCrawl = async () => {
        if (!window.confirm('学習データの構築を開始しますか？\n登録されている全ての有効なメディアをクローリングします。これには時間がかかる場合があります。')) return;

        setCrawling(true);
        try {
            // Use internal API proxy
            console.log("Requesting crawl via /api/engine/media/crawl");
            const res = await fetch('/api/engine/media/crawl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await res.json().catch(() => ({}));

            if (res.ok) {
                alert(`開始しました: ${data.message}`);
            } else {
                console.error("API Error Response:", data);
                throw new Error(data.detail || data.error || res.statusText || 'API Error');
            }
        } catch (e: any) {
            console.error("Crawl Error:", e);
            alert(`クローリング開始エラー: ${e.message}\n(詳細なログはコンソールを確認してください)`);
        } finally {
            setCrawling(false);
            // Optionally fetch sources again specifically to check timestamps later, but for now just clear loading state
        }
    };

    const startEdit = (source: any) => {
        setFormData({
            name: source.name,
            url: source.url,
            type: source.type
        });
        setEditId(source.id);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setFormData({ name: '', url: '', type: 'japanese_media' });
        setIsEditing(false);
        setEditId(null);
    };

    // Recommendations Logic
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [loadingRecs, setLoadingRecs] = useState(false);

    const fetchRecommendations = async () => {
        setLoadingRecs(true);
        try {
            // Use internal API proxy which handles the API Key
            console.log("Fetching recommendations via /api/engine/media/recommendations");
            const res = await fetch('/api/engine/media/recommendations');

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.detail || err.error || res.statusText || "Fetch failed");
            }

            const data = await res.json();
            if (data.recommendations) {
                setRecommendations(data.recommendations);
            } else {
                alert("おすすめの取得に失敗しました (空のデータ)");
            }
        } catch (e: any) {
            console.error(e);
            alert(`取得エラー: ${e.message}`);
        } finally {
            setLoadingRecs(false);
        }
    };

    const addRecommendation = async (rec: any) => {
        try {
            const { error } = await supabase
                .from('sources')
                .insert([{
                    name: rec.name,
                    url: rec.url,
                    type: 'japanese_media', // Assuming mostly JP for now via search
                    is_active: true
                }]);

            if (error) throw error;

            alert(`「${rec.name}」を追加しました`);
            setRecommendations(prev => prev.filter(r => r.url !== rec.url));
            fetchSources();
        } catch (e: any) {
            alert(`追加エラー: ${e.message}`);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <header className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <Globe className="h-6 w-6 text-rose-500" />
                        メディア管理
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        クローリング対象の主要メディア一覧と学習データの構築
                    </p>
                </div>
                <div>
                    <Button
                        onClick={handleCrawl}
                        disabled={crawling || sources.length === 0}
                        className="bg-slate-900 hover:bg-slate-800 text-white gap-2 shadow-lg shadow-slate-200"
                    >
                        {crawling ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
                        学習データを構築する
                    </Button>
                </div>
            </header>

            {/* Input Form */}
            <Card className={`border-slate-200 shadow-sm ${isEditing ? 'border-indigo-300 ring-1 ring-indigo-100' : ''}`}>
                <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/30">
                    <CardTitle className="text-sm font-bold text-slate-700 flex items-center justify-between">
                        {isEditing ? 'メディアを編集' : '新規メディア登録'}
                        {isEditing && (
                            <Button variant="ghost" size="sm" onClick={resetForm} className="h-6 text-slate-400">
                                <X className="h-4 w-4" /> キャンセル
                            </Button>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid gap-6 md:grid-cols-4 items-end">
                        <div className="space-y-1.5 md:col-span-1">
                            <label className="text-xs font-bold text-slate-600">メディア名称 (必須)</label>
                            <Input
                                placeholder="例: VoCE公式サイト"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="bg-white"
                            />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-bold text-slate-600">URL (必須)</label>
                            <Input
                                placeholder="https://..."
                                value={formData.url}
                                onChange={e => setFormData({ ...formData, url: e.target.value })}
                                className="bg-white"
                            />
                        </div>
                        <div className="space-y-1.5 md:col-span-1">
                            <label className="text-xs font-bold text-slate-600">種別</label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="japanese_media">国内メディア</option>
                                <option value="korean_media">韓国メディア</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <Button onClick={handleSave} className="gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold">
                            {isEditing ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            {isEditing ? '更新する' : '登録する'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Recommendations Section */}
            <Card className="border-teal-200 bg-teal-50/30 shadow-sm">
                <CardHeader className="pb-3 border-b border-teal-100/50">
                    <CardTitle className="text-sm font-bold text-teal-800 flex items-center gap-2">
                        <Play className="h-4 w-4 text-teal-600" />
                        AIおすすめメディア (Beta)
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex flex-col gap-4">
                        <p className="text-xs text-teal-600">
                            AIが美容トレンドに基づき、まだ登録されていない有力なメディアを提案します。
                        </p>

                        {recommendations.length === 0 && !loadingRecs ? (
                            <Button
                                variant="outline"
                                onClick={fetchRecommendations}
                                className="w-full border-teal-300 text-teal-700 hover:bg-teal-100"
                            >
                                <Loader2 className="h-4 w-4 mr-2" />
                                おすすめを取得する
                            </Button>
                        ) : null}

                        {loadingRecs && (
                            <div className="flex justify-center p-4">
                                <Loader2 className="h-6 w-6 animate-spin text-teal-500" />
                            </div>
                        )}

                        <div className="space-y-3">
                            {recommendations.map((rec, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-teal-100 shadow-sm">
                                    <div className="min-w-0 flex-1 mr-4">
                                        <h4 className="font-bold text-sm text-slate-800 truncate">{rec.name}</h4>
                                        <p className="text-xs text-slate-500 truncate">{rec.url}</p>
                                        <span className="text-[10px] text-slate-400 bg-slate-50 px-1 rounded block w-fit mt-1">
                                            Keyword: {rec.query_used}
                                        </span>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => addRecommendation(rec)}
                                        className="shrink-0 bg-teal-600 hover:bg-teal-700 text-white h-8"
                                    >
                                        <Plus className="h-3 w-3 mr-1" /> 追加
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-700">登録済みメディア</h3>
                    <span className="text-xs text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">{sources.length} sources</span>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-rose-200" />
                        <span>読み込み中...</span>
                    </div>
                ) : sources.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                        <Globe className="h-12 w-12 mx-auto text-slate-100 mb-2" />
                        メディアはまだ登録されていません
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {sources.map((source) => (
                            <div key={source.id} className="group flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors">
                                <div className={`p-3 rounded-lg ${source.type === 'korean_media' ? 'bg-blue-50 text-blue-500' : 'bg-rose-50 text-rose-500'}`}>
                                    <Globe className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="font-bold text-slate-800">{source.name}</h4>
                                        <Badge variant="outline" className={`text-[10px] font-medium border-0 px-2 py-0.5 ${source.type === 'korean_media' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'}`}>
                                            {source.type === 'korean_media' ? 'KOREA' : 'JAPAN'}
                                        </Badge>
                                        {source.last_crawled_at && (
                                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                <Database className="h-3 w-3" />
                                                Last crawled: {format(new Date(source.last_crawled_at), 'yyyy.MM.dd HH:mm')}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                                        <span className="truncate max-w-lg">{source.url}</span>
                                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 p-1 hover:bg-indigo-50 rounded">
                                            <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pl-4 border-l border-slate-100">
                                    <Button variant="ghost" size="sm" onClick={() => startEdit(source)} className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(source.id)} className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div >
    );
}
