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
  title: "美活クラブAURA | Beauty & Medical Column",
  description: "最新の美容・医療トレンドをお届けする公式ブログ",
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
