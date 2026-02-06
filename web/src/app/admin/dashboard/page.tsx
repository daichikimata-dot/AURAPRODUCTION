import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, FileText, TrendingUp, Users } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">ダッシュボード</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">総記事数</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">24</div>
                        <p className="text-xs text-muted-foreground">昨日比 +2</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">下書き（承認待ち）</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5</div>
                        <p className="text-xs text-muted-foreground">要確認</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">アクティブユーザー</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">573</div>
                        <p className="text-xs text-muted-foreground">先月比 +201</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">トレンドキーワード</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium text-rose-500">#レチノール #CICA</div>
                        <p className="text-xs text-muted-foreground">本日の急上昇</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>最近の記事</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">最近のアクティビティリスト（プレースホルダー）</p>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>クイックアクション</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <button className="w-full bg-slate-900 text-white p-2 rounded text-sm hover:bg-slate-800">手動で記事を作成</button>
                        <button className="w-full border border-slate-200 p-2 rounded text-sm hover:bg-slate-50">トレンド情報を更新</button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
