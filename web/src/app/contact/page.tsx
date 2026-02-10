import SiteHeader from "@/components/SiteHeader";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-[#fffafb] pb-24">
            <SiteHeader />
            <div className="max-w-4xl mx-auto px-6 py-24">
                <h1 className="text-3xl font-serif font-bold text-stone-800 mb-8 text-center">お問い合わせ</h1>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 text-center">
                    <p className="text-stone-600 mb-6">
                        当メディアに関するお問い合わせは、以下のメールアドレスまでお願いいたします。
                    </p>
                    <a href="mailto:contact@aura-beauty.jp" className="text-primary font-bold text-lg hover:underline">
                        contact@aura-beauty.jp
                    </a>
                    <p className="text-sm text-stone-400 mt-8">
                        ※通常、3営業日以内に返信いたします。内容によっては回答できない場合もございますのでご了承ください。
                    </p>
                </div>
            </div>
        </main>
    );
}
