'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link as LinkIcon, ExternalLink, Edit, Save, Plus, X, Copy, Trash2 } from "lucide-react";
import { format } from 'date-fns';

export default function LinksPage() {
    const [links, setLinks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        key: ''
    });

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('links')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching links:', error);
        } else {
            setLinks(data || []);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!formData.name || !formData.url) return alert('名称とURLは必須です');

        try {
            if (isEditing && editId) {
                // Update
                const { error } = await supabase
                    .from('links')
                    .update({
                        name: formData.name,
                        url: formData.url,
                        key: formData.key || null,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', editId);
                if (error) throw error;
            } else {
                // Create
                const { error } = await supabase
                    .from('links')
                    .insert([{
                        name: formData.name,
                        url: formData.url,
                        key: formData.key || null,
                    }]);
                if (error) throw error;
            }

            // Reset
            fetchLinks();
            resetForm();
        } catch (e: any) {
            alert(`エラーが発生しました: ${e.message}`);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('本当に削除しますか？')) return;
        try {
            const { error } = await supabase.from('links').delete().eq('id', id);
            if (error) throw error;
            setLinks(links.filter(l => l.id !== id));
        } catch (e: any) {
            alert(`削除エラー: ${e.message}`);
        }
    };

    const startEdit = (link: any) => {
        setFormData({
            name: link.name,
            url: link.url,
            key: link.key || ''
        });
        setEditId(link.id);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setFormData({ name: '', url: '', key: '' });
        setIsEditing(false);
        setEditId(null);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('コピーしました');
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <LinkIcon className="h-6 w-6 text-indigo-500" />
                        リンク管理
                    </h2>
                    <p className="text-sm text-slate-500">アフィリエイトリンクや内部リンクの一元管理</p>
                </div>
            </header>

            {/* Input Form */}
            <Card className={`border-slate-200 shadow-sm ${isEditing ? 'border-indigo-300 ring-1 ring-indigo-100' : ''}`}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold text-slate-700 flex items-center justify-between">
                        {isEditing ? 'リンクを編集' : '新規リンク登録'}
                        {isEditing && (
                            <Button variant="ghost" size="sm" onClick={resetForm} className="h-6 text-slate-400">
                                <X className="h-4 w-4" /> キャンセル
                            </Button>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3 items-end">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-600">リンク名称 (必須)</label>
                            <Input
                                placeholder="例: 湘南美容外科 脱毛LP"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5 flex-1">
                            <label className="text-xs font-medium text-slate-600">SEO用キー (任意/英数字)</label>
                            <Input
                                placeholder="例: sbc-datsumo"
                                value={formData.key}
                                onChange={e => setFormData({ ...formData, key: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5 md:col-span-1">
                            <label className="text-xs font-medium text-slate-600">遷移先URL (必須)</label>
                            <Input
                                placeholder="https://..."
                                value={formData.url}
                                onChange={e => setFormData({ ...formData, url: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <Button onClick={handleSave} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                            {isEditing ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            {isEditing ? '更新する' : '登録する'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Links List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-700">登録済みリンク</h3>
                    <span className="text-xs text-slate-400">{links.length} items</span>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-slate-400">読み込み中...</div>
                ) : links.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">・リンクはまだ登録されていません</div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {links.map((link) => (
                            <div key={link.id} className="group flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                                <div className="p-2 bg-indigo-50 rounded text-indigo-500">
                                    <LinkIcon className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-slate-800">{link.name}</h4>
                                        {link.key && (
                                            <Badge variant="outline" className="text-[10px] font-mono bg-slate-100 text-slate-500 border-slate-200">
                                                {link.key}
                                            </Badge>
                                        )}
                                        <span className="text-xs text-slate-400 ml-auto mr-4">
                                            {format(new Date(link.updated_at), 'yyyy.MM.dd')} 更新
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                                        <span className="truncate max-w-md">{link.url}</span>
                                        <button onClick={() => copyToClipboard(link.url)} title="URLをコピー" className="hover:text-indigo-600">
                                            <Copy className="h-3 w-3" />
                                        </button>
                                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600">
                                            <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pl-4 border-l border-slate-100">
                                    <div className="text-center px-2">
                                        <div className="text-lg font-bold text-slate-700">{link.clicks || 0}</div>
                                        <div className="text-[10px] text-slate-400">CLICKS</div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <Button variant="ghost" size="sm" onClick={() => startEdit(link)} className="h-7 w-7 p-0 text-slate-400 hover:text-blue-600">
                                            <Edit className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(link.id)} className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
