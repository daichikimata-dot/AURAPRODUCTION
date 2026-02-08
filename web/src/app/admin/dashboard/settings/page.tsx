'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Save, RefreshCw, Settings, Globe } from "lucide-react";

const SETTINGS_KEY = 'site_settings';

interface SiteSettings {
    title: string;
    description: string;
    ogImage: string;
    twitterHandle: string;
}

export default function GeneralSettingsPage() {
    const [settings, setSettings] = useState<SiteSettings>({
        title: 'Bikatsu Club AURA',
        description: '美容医療・韓国美容の最新情報をお届けする信頼のメディア',
        ogImage: 'https://placehold.co/1200x630.png',
        twitterHandle: '@aura_beauty'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .eq('key', SETTINGS_KEY)
            .single();

        if (data && data.value) {
            try {
                const parsed = JSON.parse(data.value);
                setSettings({ ...settings, ...parsed });
            } catch (e) {
                console.error('JSON parse error:', e);
            }
        }
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('settings')
                .upsert({
                    key: SETTINGS_KEY,
                    value: JSON.stringify(settings),
                    description: 'サイト全体の設定（SEO, Meta）',
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            alert('設定を保存しました。');
        } catch (e: any) {
            alert(`保存エラー: ${e.message}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <header>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                    <Settings className="h-6 w-6 text-slate-600" />
                    一般設定 (General Settings)
                </h2>
                <p className="text-sm text-slate-500">Webサイトの基本情報やSEO設定を管理します</p>
            </header>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Globe className="h-5 w-5 text-blue-500" />
                        基本情報 & SEO
                    </CardTitle>
                    <CardDescription>
                        検索エンジンやSNSで表示されるサイト全体の情報を設定します。
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="title">サイトタイトル</Label>
                        <Input
                            id="title"
                            value={settings.title}
                            onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                            placeholder="Bikatsu Club AURA"
                        />
                        <p className="text-xs text-slate-400">ブラウザのタブや検索結果のタイトルに表示されます。</p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">サイト説明文 (Meta Description)</Label>
                        <Textarea
                            id="description"
                            value={settings.description}
                            onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                            placeholder="サイトの概要を入力..."
                            rows={3}
                        />
                        <p className="text-xs text-slate-400">検索結果の下部に表示される説明文（スニペット）です。120文字程度が推奨です。</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="ogImage">デフォルトOGP画像 URL</Label>
                            <Input
                                id="ogImage"
                                value={settings.ogImage}
                                onChange={(e) => setSettings({ ...settings, ogImage: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="twitter">X (Twitter) アカウント</Label>
                            <Input
                                id="twitter"
                                value={settings.twitterHandle}
                                onChange={(e) => setSettings({ ...settings, twitterHandle: e.target.value })}
                                placeholder="@username"
                            />
                        </div>
                    </div>
                </CardContent>
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                    <Button
                        onClick={handleSave}
                        disabled={saving || loading}
                        className="bg-blue-600 hover:bg-blue-700 min-w-[150px]"
                    >
                        {saving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        設定を保存
                    </Button>
                </div>
            </Card>

            <div className="text-center text-xs text-slate-400 mt-8">
                <p>Engine Version: 1.0.2 / Web Version: 0.8.5</p>
                <p>© 2026 Antigravity Inc.</p>
            </div>
        </div>
    );
}
