import type { Metadata } from "next";
import { Cinzel, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import StickyCTA from "@/components/ConversionCTA";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://aura-beauty.jp"),
  title: {
    default: "美活クラブAURA | Beauty & Medical Column",
    template: "%s | 美活クラブAURA"
  },
  description: "最新の美容・医療トレンド、クリニック選びのポイントを専門家監修でお届けする公式ブログメディア。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "/",
    siteName: "美活クラブAURA",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${cinzel.variable} ${notoSansJP.variable} antialiased font-sans text-stone-800 bg-[#fffafb]`}
      >
        {children}
        <StickyCTA />
      </body>
    </html>
  );
}
