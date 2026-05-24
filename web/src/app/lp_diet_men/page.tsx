'use client';

import { useEffect } from 'react';

const menLpLineUrl =
  "https://liff.me/1657922560-1J7Njyb8/landing?follow=%40079icouq&lp=DPFOqe&liff_id=1657922560-1J7Njyb8";

const medicineItems = [
  {
    name: "マンジャロ",
    type: "週1回の自己注射タイプ",
    badge: "自己注射",
    price: "19,800円〜 / 1ヶ月",
    description:
      "週1回の自己注射タイプのGLP-1薬剤。スピード重視で体重管理を進めたい方に。",
  },
  {
    name: "リベルサス",
    type: "毎日1回の服用タイプ",
    badge: "内服薬",
    price: "8,800円〜 / 1ヶ月",
    description:
      "1日1回飲むタイプのGLP-1薬剤。注射に抵抗がある方や、手間を抑えてスムーズに始めたい方に。",
  },
  {
    name: "ビクトーザ",
    type: "1日1回の自己注射タイプ",
    badge: "自己注射",
    price: "15,000円〜 / 1ヶ月",
    description:
      "1日1回の自己注射タイプのGLP-1薬剤。予定や食欲に合わせて調節出来る事が特徴です。",
  },
  {
    name: "オゼンピック",
    type: "週1回の自己注射タイプ",
    badge: "自己注射",
    price: "23,000円〜 / 1ヶ月",
    description:
      "週1回の自己注射タイプのGLP-1薬剤。ビクトーザよりもオゼンピックの方が減量効果に優れていると言われています。",
  },
  {
    name: "スーグラ錠",
    type: "1日1回の服用タイプ",
    badge: "内服薬",
    price: "9,800円〜 / 1ヶ月",
    description:
      "1日1回の内服タイプ。食事で摂取したカロリーを尿によって体外に排出し、糖分の吸収を抑えてくれる薬です。",
  },
];

const recommendItems = [
  "営業職や経営者など、昼間に時間が取りにくい",
  "食事や不規則な生活で体重管理が難しい",
  "周囲に気づかれにくく始めたい",
  "夜職・接客業で体型や見た目を整えたい",
  "ジム通いが続かない、時間が取れない",
  "価格とスピード感も重視したい",
];

const faqItems = [
  {
    q: "医療ダイエットとはなんですか？",
    a: "医師の診察のもと、体質や目的に応じてお薬の選択肢をご案内する自由診療です。",
  },
  {
    q: "仕事が忙しくても相談できますか？",
    a: "オンラインで相談できるため、来院の時間が取りづらい方でも進めやすい流れです。",
  },
  {
    q: "どの薬剤を選べばいいですか？",
    a: "医師がお悩みに応じて適切な薬剤をご案内します。",
  },
  {
    q: "副作用はありますか？",
    a: "副作用の出方には個人差があります。ご不安な点は診察時に医師へご相談ください。",
  },
];

const flowItems = [
  {
    step: "STEP 1",
    title: "LINEで相談",
    text: "LINEを追加し、カウンセリングを予約します。",
  },
  {
    step: "STEP 2",
    title: "医師の診察",
    text: "予約日時に医師またはカウンセラーから電話が入ります。",
  },
  {
    step: "STEP 3",
    title: "ご決済",
    text: "診断後に届いた決済フォームからお支払いへ進みます。",
  },
  {
    step: "STEP 4",
    title: "発送・受け取り",
    text: "決済完了後、発送手続きへ進みます。",
  },
];

export default function LpDietMenPage() {
  // 共通バナーをこのページだけ非表示にする処理
  useEffect(() => {
    const commonBanner = document.querySelector('div.fixed.bottom-4.right-4');
    if (commonBanner) {
      (commonBanner as HTMLElement).style.display = 'none';
    }
    return () => {
      if (commonBanner) {
        (commonBanner as HTMLElement).style.display = '';
      }
    };
  }, []);

  return (
    <main className="men-lp-page min-h-screen bg-gradient-to-b from-[#03070d] via-[#07111d] to-[#03070d] text-[#f3f8ff]">
      {/* CSSでも強制非表示 */}
      <style dangerouslySetInnerHTML={{ __html: `
        div.fixed.bottom-4.right-4.z-50 {
          display: none !important;
        }
      `}} />

      <div className="mx-auto w-full max-w-[430px] px-4 pb-44 pt-5">
        {/* LP画像 */}
        <div className="mb-10">
          <div className="mx-auto overflow-hidden rounded-[24px] border border-[#2f5f8f]/70 bg-[#07111d] shadow-[0_18px_45px_rgba(0,0,0,0.55)]">
            <img
              src="/images/lp-diet-men-hero.png"
              alt="男性向け医療ダイエットLP"
              className="block h-auto w-full"
            />
          </div>
        </div>

        {/* 選ばれる理由 */}
        <section className="mb-20">
          <div className="mb-6 text-center">
            <p className="mb-2 text-[12px] font-bold tracking-[0.22em] text-[#7fbfff]">
              AURA MEN&apos;S MEDICAL DIET
            </p>
            <h2 className="font-serif text-[26px] font-bold leading-tight text-[#f3f8ff]">
              忙しい男性に選ばれる理由
            </h2>
          </div>

          <div className="space-y-5">
            <article className="rounded-[22px] border border-[#2f5f8f]/70 bg-[#0d1724]/95 p-6 shadow-[0_12px_28px_rgba(0,0,0,0.35)]">
              <p className="mb-3 text-[19px] font-bold leading-relaxed text-[#8ec9ff]">
                スマホだけで完結
              </p>
              <p className="text-[16px] leading-[1.9] text-[#d6e6f7]">
                LINEで予約し、予約時間内に電話カウンセリング。通院時間をつくりにくい方でも始めやすい流れです。
              </p>
            </article>

            <article className="rounded-[22px] border border-[#2f5f8f]/70 bg-[#0d1724]/95 p-6 shadow-[0_12px_28px_rgba(0,0,0,0.35)]">
              <p className="mb-3 text-[19px] font-bold leading-relaxed text-[#8ec9ff]">
                人に知られにくい導線
              </p>
              <p className="text-[16px] leading-[1.9] text-[#d6e6f7]">
                来院せずに相談しやすいので、仕事関係や周囲の目が気になる方にも向いています。
              </p>
            </article>

            <article className="rounded-[22px] border border-[#2f5f8f]/70 bg-[#0d1724]/95 p-6 shadow-[0_12px_28px_rgba(0,0,0,0.35)]">
              <p className="mb-3 text-[19px] font-bold leading-relaxed text-[#8ec9ff]">
                医師と相談して選択
              </p>
              <p className="text-[16px] leading-[1.9] text-[#d6e6f7]">
                体質や目的に合わせて、医師が適切なお薬をご提案します。
              </p>
            </article>

            <article className="rounded-[22px] border border-[#2f5f8f]/70 bg-[#0d1724]/95 p-6 shadow-[0_12px_28px_rgba(0,0,0,0.35)]">
              <p className="mb-3 text-[19px] font-bold leading-relaxed text-[#8ec9ff]">
                価格面も比較しやすい
              </p>
              <p className="text-[16px] leading-[1.9] text-[#d6e6f7]">
                LINE登録＆予約で5%OFF。さらに最安値保証で、始めやすさをサポートします。
              </p>
            </article>
          </div>
        </section>

        {/* こんな方におすすめ */}
        <section className="mb-20">
          <div className="mb-6 text-center">
            <p className="mb-2 text-[12px] font-bold tracking-[0.22em] text-[#7fbfff]">
              FOR BUSY MEN
            </p>
            <h2 className="font-serif text-[26px] font-bold leading-tight text-[#f3f8ff]">
              こんな方におすすめ
            </h2>
          </div>

          <div className="space-y-3">
            {recommendItems.map((item) => (
              <div
                key={item}
                className="rounded-[18px] border border-[#2f5f8f]/70 bg-[#0d1724] px-5 py-4 shadow-[0_8px_22px_rgba(0,0,0,0.28)]"
              >
                <p className="text-[15px] font-bold leading-[1.8] text-[#e7f3ff]">
                  ✓ {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* お取り扱い薬剤 */}
        <section className="mb-24">
          <div className="mb-8 text-center">
            <p className="mb-2 text-[12px] font-bold tracking-[0.22em] text-[#7fbfff]">
              LINEUP
            </p>
            <h2 className="font-serif text-[30px] font-bold leading-tight text-[#f3f8ff]">
              お取り扱い薬剤
            </h2>
            <p className="mt-4 text-[14px] leading-[1.8] text-[#c9d8e8]">
              ※薬剤は医師の診察のうえ、用法用量を守って正しくお使いください。
            </p>
          </div>

          <div className="space-y-4">
            {medicineItems.map((item) => (
              <article
                key={item.name}
                className="rounded-[24px] border border-[#2f5f8f]/70 bg-[#111722] p-5 shadow-[0_12px_28px_rgba(0,0,0,0.35)]"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[25px] font-black leading-tight text-white">
                      {item.name}
                    </h3>
                    <p className="mt-3 inline-flex rounded-full border border-[#6fa8dc]/70 bg-[#102235] px-3 py-1 text-[13px] font-bold text-[#b9dcff]">
                      {item.type}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-[#18304a] px-3 py-2 text-[13px] font-bold text-[#b9dcff]">
                    {item.badge}
                  </span>
                </div>

                <p className="mb-4 text-[15px] leading-[1.8] text-[#d6e6f7]">
                  {item.description}
                </p>

                <p className="text-[28px] font-black leading-tight text-[#b9dcff]">
                  {item.price}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-[22px] border border-[#2f5f8f]/60 bg-[#111722]/90 p-5 text-center shadow-[0_10px_24px_rgba(0,0,0,0.28)]">
            <p className="text-[16px] leading-[1.9] text-[#d6e6f7]">
              上記以外にも複数のダイエット薬を取り扱っています。
              <br />
              医師とご相談のうえ、お悩みに応じてご案内します。
            </p>
          </div>
        </section>

        {/* 5%OFF CTA */}
        <section className="mb-24 rounded-[24px] border border-[#6fa8dc]/70 bg-gradient-to-br from-[#102235] to-[#07111d] px-5 py-8 text-center shadow-[0_16px_34px_rgba(0,0,0,0.45)]">
          <p className="mb-3 text-[16px] font-bold leading-relaxed text-[#e7f3ff]">
            当サイトからのLINE登録＆LINE予約で
          </p>
          <p className="font-serif text-[36px] font-bold leading-tight text-[#b9dcff]">
            さらに5%OFF
          </p>
        </section>

        {/* よくある質問 */}
        <section className="mb-24">
          <div className="mb-8 text-center">
            <p className="mb-2 text-[12px] font-bold tracking-[0.22em] text-[#7fbfff]">
              FAQ
            </p>
            <h2 className="font-serif text-[30px] font-bold leading-tight text-[#f3f8ff]">
              よくある質問
            </h2>
          </div>

          <div className="space-y-5">
            {faqItems.map((item, index) => (
              <article
                key={item.q}
                className="rounded-[22px] border border-[#2f5f8f]/70 bg-[#0d1724]/95 p-6 shadow-[0_12px_28px_rgba(0,0,0,0.35)]"
              >
                <p className="mb-4 flex gap-3 text-[18px] font-bold leading-[1.7] text-[#f3f8ff]">
                  <span className="text-[24px] leading-none text-[#8ec9ff]">
                    Q{index + 1}.
                  </span>
                  <span>{item.q}</span>
                </p>
                <p className="flex gap-3 text-[16px] leading-[1.9] text-[#d6e6f7]">
                  <span className="text-[22px] font-bold leading-none text-[#8ec9ff]">
                    A.
                  </span>
                  <span>{item.a}</span>
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* 購入までのフロー */}
        <section className="mb-24">
          <div className="mb-8 text-center">
            <p className="mb-2 text-[12px] font-bold tracking-[0.22em] text-[#7fbfff]">
              FLOW
            </p>
            <h2 className="font-serif text-[30px] font-bold leading-tight text-[#f3f8ff]">
              購入までの流れ
            </h2>
          </div>

          <div className="space-y-5">
            {flowItems.map((item) => (
              <article
                key={item.step}
                className="rounded-[22px] border border-[#2f5f8f]/70 bg-[#0d1724]/95 p-6 shadow-[0_12px_28px_rgba(0,0,0,0.35)]"
              >
                <p className="mb-2 text-[13px] font-bold tracking-[0.16em] text-[#8ec9ff]">
                  {item.step}
                </p>
                <h3 className="mb-3 text-[20px] font-bold leading-tight text-[#f3f8ff]">
                  {item.title}
                </h3>
                <p className="text-[16px] leading-[1.9] text-[#d6e6f7]">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* 注意事項 */}
        <section className="rounded-[24px] border border-[#2f5f8f]/70 bg-[#0d1724]/95 p-6 shadow-[0_12px_28px_rgba(0,0,0,0.35)]">
          <div className="mb-5 text-center">
            <p className="mb-2 text-[12px] font-bold tracking-[0.22em] text-[#7fbfff]">
              NOTICE
            </p>
            <h2 className="font-serif text-[28px] font-bold leading-tight text-[#f3f8ff]">
              注意事項
            </h2>
          </div>

          <ul className="space-y-3 text-[15px] leading-[1.8] text-[#d6e6f7]">
            <li>・医療ダイエットは自由診療です。</li>
            <li>・効果や感じ方には個人差があります。</li>
            <li>
              ・副作用や禁忌事項の詳細は、診察時に医師へご確認ください。
            </li>
            <li>
              ・既往歴のある方、服薬中の方は事前にご相談ください。
            </li>
            <li>
              ・掲載の料金・取り扱い・診療内容は、診察内容・在庫状況により変更される場合があります。
            </li>
          </ul>
        </section>
      </div>

      {/* LP専用 追従CTA */}
      <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <div className="mx-auto w-full max-w-[430px] rounded-[18px] border border-[#6fa8dc]/70 bg-gradient-to-r from-[#07111d] via-[#102235] to-[#07111d] p-[2px] shadow-[0_12px_30px_rgba(0,0,0,0.55)]">
          <a
            href={menLpLineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-[16px] bg-gradient-to-b from-[#21c75a] to-[#0d9639] px-4 py-4 text-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
          >
            <span className="block text-[12px] font-bold leading-tight tracking-[0.08em] text-white/90 sm:text-[13px]">
              当サイトからのLINE登録＆LINE予約で5%OFF
            </span>

            <span className="mt-1 block text-[20px] font-black leading-snug tracking-[0.03em] sm:text-[22px]">
              LINEで予約する
            </span>
          </a>
        </div>
      </div>
    </main>
  );
}
