import Script from "next/script";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://www.kireiaura.com"),
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
      <head>
        <meta name="google-site-verification" content="RgpP9k0rA6GynhC6T_CjTaJjYetuzhneaP07r-gd2og" />
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KBBNVHW5');
          `}
        </Script>
      </head>
      <body
        className={`${cinzel.variable} ${notoSansJP.variable} antialiased font-sans text-stone-800 bg-[#fffafb]`}
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KBBNVHW5"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <StickyCTA />
      </body>
    </html>
  );
}
