'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Save, RefreshCw, AlertTriangle } from "lucide-react";

const DEFAULT_PERSONA_KEY = 'system_prompt_misaki';

export default function AISettingsPage() {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        // Fetch specific key
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .eq('key', DEFAULT_PERSONA_KEY)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" which is fine initially
            console.error('Error fetching settings:', error);
        }

        if (data) {
            setPrompt(data.value);
            setLastUpdated(data.updated_at);
        } else {
            // Set default if not found (Optional: could verify with backend or just leave empty)
            setPrompt("あなたは美容メディア「AURA」の編集長「美咲（みさき）」です...");
        }
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('settings')
                .upsert({
                    key: DEFAULT_PERSONA_KEY,
                    value: prompt,
                    description: 'AI編集長「美咲」のシステムプロンプト',
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            setLastUpdated(new Date().toISOString());
            alert('設定を保存しました。次回の記事生成から反映されます。');
        } catch (e: any) {
            alert(`保存エラー: ${e.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        if (confirm('プロンプトを初期値（デフォルト）に戻しますか？保存するまで反映されません。')) {
            // Hardcoded default fallback or fetch from API
            setPrompt(`あなたは美容メディア「AURA」の編集長「美咲（みさき）」です。
「AURA」は、20代〜40代の美容関心層に向けた、信頼できる美容情報メディアです。
あなたは編集長として、日本の薬機法・景表法・医療広告ガイドラインに最大限配慮しつつ、読者が「理解→納得→行動」できる専門的かつ実践的なコラムを執筆します。

（以下省略... 元のプロンプトを貼り付けてください）`);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <Bot className="h-6 w-6 text-rose-500" />
                        AI人格設定 (Persona)
                    </h2>
                    <p className="text-sm text-slate-500">記事生成に使用するAI「美咲」の振る舞いやルールを設定します</p>
                </div>
                <div className="text-xs text-slate-400">
                    Last Updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Never'}
                </div>
            </header>

            <div className="grid gap-6">
                <Card className="border-rose-100 shadow-sm">
                    <CardHeader className="bg-rose-50/30 border-b border-rose-100 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-base text-rose-800 flex items-center gap-2">
                                    システムプロンプト (System Prompt)
                                    <Badge variant="outline" className="bg-rose-100 text-rose-600 border-rose-200">Critical</Badge>
                                </CardTitle>
                                <CardDescription className="text-rose-600/80">
                                    AIの性格、文体、記事構成のルールを定義します。変更は慎重に行ってください。
                                </CardDescription>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleReset} className="text-slate-500 hover:text-rose-600">
                                <RefreshCw className="mr-2 h-3.5 w-3.5" />
                                リセット
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {loading ? (
                            <div className="h-96 flex items-center justify-center text-slate-400">読み込み中...</div>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex gap-3 text-xs text-amber-800 mb-2">
                                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                                    <p>
                                        プロンプト内の <code>{'{keyword}'}</code> などの波括弧は、生成時に動的に置換されます。
                                        削除しないように注意してください。
                                    </p>
                                </div>
                                <Textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    className="min-h-[500px] font-mono text-sm leading-relaxed"
                                    placeholder="ここにプロンプトを入力..."
                                />
                            </div>
                        )}
                    </CardContent>
                    <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                        <Button
                            onClick={handleSave}
                            disabled={saving || loading}
                            className="bg-rose-600 hover:bg-rose-700 min-w-[150px]"
                        >
                            {saving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            設定を保存
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
