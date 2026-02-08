"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Settings, Users, LogOut, Link as LinkIcon, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navItems = [
        { name: "ダッシュボード", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "記事管理", href: "/admin/dashboard/articles", icon: FileText },
        { name: "リンク管理", href: "/admin/dashboard/links", icon: LinkIcon },
        { name: "AI人格設定", href: "/admin/dashboard/ai-settings", icon: Users }, // Reuse Users icon for Persona
        { name: "一般設定", href: "/admin/dashboard/settings", icon: Settings },
        { name: "メディア管理", href: "/admin/dashboard/media", icon: Globe },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md hidden md:flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold text-rose-500">AURA Admin</h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={`w-full justify-start ${isActive ? "bg-rose-50 text-rose-600" : ""}`}
                                >
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.name}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t">
                    <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                        <LogOut className="mr-2 h-4 w-4" />
                        ログアウト
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
