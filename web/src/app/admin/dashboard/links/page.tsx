"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, ExternalLink } from "lucide-react";

export default function LinksPage() {
    const [links, setLinks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentLink, setCurrentLink] = useState<any>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        url: "",
        type: "affiliate", // 'affiliate', 'line', 'clinic'
        key: "",
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
            console.error("Error fetching links:", error);
        } else {
            setLinks(data || []);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!formData.name || !formData.url) {
            alert("Name and URL are required");
            return;
        }

        // Fix: Convert empty string key to null to avoid unique constraint violation
        // Postgres unique allows multiple NULLs but only one empty string
        const payload = {
            ...formData,
            key: formData.key && formData.key.trim() !== "" ? formData.key.trim() : null
        };

        try {
            if (isEditing && currentLink) {
                const { error } = await supabase
                    .from('links')
                    .update(payload)
                    .eq('id', currentLink.id);
                if (error) throw error;
                alert("Updated successfully");
            } else {
                const { error } = await supabase
                    .from('links')
                    .insert(payload);
                if (error) throw error;
                alert("Created successfully");
            }
            fetchLinks();
            resetForm();
        } catch (e: any) {
            console.error(e);
            alert(`Error: ${e.message}`);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        const { error } = await supabase.from('links').delete().eq('id', id);
        if (error) {
            alert("Failed to delete");
        } else {
            fetchLinks();
        }
    };

    const startEdit = (link: any) => {
        setIsEditing(true);
        setCurrentLink(link);
        setFormData({
            name: link.name,
            url: link.url,
            type: link.type || "affiliate",
            key: link.key || "",
        });
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentLink(null);
        setFormData({ name: "", url: "", type: "affiliate", key: "" });
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'line': return 'LINE公式';
            case 'clinic': return 'クリニック';
            case 'affiliate': return 'アフィリエイト';
            default: return type;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Link Manager</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Form Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>{isEditing ? "Edit Link" : "Add New Link"}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <select
                                className="w-full p-2 border rounded-md"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="affiliate">アフィリエイト (Article Ad)</option>
                                <option value="line">LINE公式 (Footer/CTA)</option>
                                <option value="clinic">おすすめクリニック (Sidebar/Banner)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Name (Display Text)</Label>
                            <Input
                                placeholder="Example Campaign"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>URL</Label>
                            <Input
                                placeholder="https://..."
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Key / ID (Optional - for code reference)</Label>
                            <Input
                                placeholder="campaign-spring-2026"
                                value={formData.key}
                                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-2 pt-4">
                            <Button onClick={handleSave} className="flex-1">
                                {isEditing ? "Update Link" : "Create Link"}
                            </Button>
                            {isEditing && (
                                <Button variant="outline" onClick={resetForm}>Cancel</Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* List Card */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Existing Links</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div>Loading...</div>
                        ) : links.length === 0 ? (
                            <div className="text-stone-400">No links found.</div>
                        ) : (
                            <div className="space-y-4">
                                {links.map(link => (
                                    <div key={link.id} className="flex items-center justify-between p-3 border rounded-lg bg-stone-50">
                                        <div className="min-w-0 flex-1 mr-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold ${link.type === 'line' ? 'bg-green-100 text-green-700' :
                                                    link.type === 'clinic' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-orange-100 text-orange-700'
                                                    }`}>
                                                    {getTypeLabel(link.type)}
                                                </span>
                                                <span className="font-medium truncate">{link.name}</span>
                                            </div>
                                            <div className="text-xs text-stone-500 truncate flex items-center gap-1">
                                                <ExternalLink className="w-3 h-3" />
                                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-500">
                                                    {link.url}
                                                </a>
                                            </div>
                                            {link.key && <div className="text-xs text-stone-400 mt-1 font-mono">{link.key}</div>}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => startEdit(link)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(link.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
