import ArticleListContainer from "@/components/ArticleListContainer";
import SiteHeader from "@/components/SiteHeader";

export const metadata = {
    title: "記事一覧 | 美活クラブAURA",
    description: "全ての美容・医療コラムをご覧いただけます。",
};

export default function BlogArchivePage() {
    return (
        <main className="min-h-screen bg-[#fffafb] pb-24">
            <SiteHeader />
            <div className="pt-24">
                {/* We reuse ArticleListContainer which handles fetching and filtering */}
                {/* If we want to show ALL articles, we don't pass a limit */}
                <ArticleListContainer />
            </div>
        </main>
    );
}
