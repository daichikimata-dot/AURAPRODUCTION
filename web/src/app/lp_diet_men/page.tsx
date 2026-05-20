'use client';

import { useEffect } from 'react';

const menLpLineUrl =
  "https://liff.line.me/1657922560-1J7Njyb8/landing?follow=%40079icouq&lp=DPFOqe&liff_id=1657922560-1J7Njyb8";

const medicineItems = [
  {
    name: "マンジャロ",
    type: "週1回の自己注射タイプ",
    price: "19,800円〜 / 1ヶ月",
    note: "自己注射",
  },
  {
    name: "リベルサス",
    type: "毎日1回の服用タイプ",
    price: "8,800円〜 / 1ヶ月",
    note: "内服薬",
  },
  {
    name: "オゼンピック",
    type: "週1回の自己注射タイプ",
    price: "23,000円〜 / 1ヶ月",
    note: "自己注射",
  },
  {
    name: "ビクトーザ",
    type: "1日1回の自己注射タイプ",
    price: "15,000円〜 / 1ヶ月",
    note: "自己注射",
  },
  {
    name: "スーグラ錠",
    type: "1日1回の服用タイプ",
    price: "9,800円〜 / 1ヶ月",
    note: "内服薬",
  },
];

const faqItems = [
  {
    q: "医療ダイエットとはなんですか？",
    a: "医師の診察のもと、体質や目的に応じてお薬の選択肢をご案内する自由診療です。",
  },
  {
    q: "通院は必要ですか？",
    a: "基本、オンラインでの完結が可能です。診察内容により異なる場合があります。",
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
    <main className="men-lp-page men-lp-fade-shell relative min-h-screen overflow-hidden bg-gradient-to-b from-[#3f3f3d] via-[#111111] to-[#050505] text-[#f7f7f4]">
      <style jsx global>{`
        div.fixed.bottom-4.right-4.z-50 {
          display: none !important;
        }
      `}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-90px] top-[430px] h-44 w-44 rounded-full bg-[#1f276f]/20 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-[430px] px-4 pb-44 pt-5">
        {/* LP画像 */}
        <div className="men-lp-fade men-lp-delay-0 mb-10">
          <div className="men-lp-card-strong mx-auto overflow-hidden rounded-[12px] border border-white/15 bg-[#111111] shadow-[0_18px_45px_rgba(0,0,0,0.45)]">
            <img
              src="/images/lp-diet-men-hero.png"
              alt="男性向け医療ダイエットLP"
              className="block h-auto w-full"
            />
          </div>
        </div>

        {/* 選ばれる理由 */}
        <section className="men-lp-fade men-lp-delay-1 mb-20">
          <div className="mb-6 text-center">
            <p className="mb-2 text-[12px] font-bold tracking-[0.22em] text-[#cfd3e8]">
              AURA MEDICAL DIET
            </p>
            <h2 className="font-serif text-[18px] font-bold leading-tight text-[#f7f7f4]">
              当サイトからの予約でお得・便利に薬剤を購入
            </h2>
            <span className="mx-auto mt-3 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#6b6b68] via-[#1f276f] to-[#6b6b68]" />
          </div>

          <div className="space-y-5">
            <article className="relative overflow-hidden rounded-[20px] border border-white/12 bg-[#171717]/95 p-6 shadow-[0_12px_28px_rgba(0,0,0,0.32)]">
              <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#555555] via-[#1f276f] to-[#555555]" />
              <p className="mb-3 text-[19px] font-bold leading-relaxed text-[#f7f7f4]">
                最安値保証
              </p>
              <p className="text-[16px] leading-[1.9] text-[#d7d7d4]">
                当サイトが提携している「シェアクリニック」は日本最安値でお薬を提供。
              </p>
            </article>

            <article className="relative overflow-hidden rounded-[20px] border border-white/12 bg-[#171717]/95 p-6 shadow-[0_12px_28px_rgba(0,0,0,0.32)]">
              <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#555555] via-[#1f276f] to-[#555555]" />
              <p className="mb-3 text-[19px] font-bold leading-relaxed text-[#f7f7f4]">
                人に知られにくい
              </p>
              <p className="text-[16px] leading-[1.9] text-[#d7d7d4]">
                来院せずに相談が出来るので、周囲の目も気にならない。
              </p>
            </article>

            <article className="relative overflow-hidden rounded-[20px] border border-white/12 bg-[#171717]/95 p-6 shadow-[0_12px_28px_rgba(0,0,0,0.32)]">
              <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#555555] via-[#1f276f] to-[#555555]" />
              <p className="mb-3 text-[19px] font-bold leading-relaxed text-[#f7f7f4]">
                医師と相談
              </p>
              <p className="text-[16px] leading-[1.9] text-[#d7d7d4]">
                体質や目的に合わせて、医師が適切なお薬をご提案。
              </p>
            </article>

            <article className="relative overflow-hidden rounded-[20px] border border-white/12 bg-[#171717]/95 p-6 shadow-[0_12px_28px_rgba(0,0,0,0.32)]">
              <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#555555] via-[#1f276f] to-[#555555]" />
              <p className="mb-3 text-[19px] font-bold leading-relaxed text-[#f7f7f4]">
                スマホだけで完結
              </p>
              <p className="text-[16px] leading-[1.9] text-[#d7d7d4]">
                LINEで予約し電話カウンセリング。通院時間をつくりにくい方でも始めやすい。
              </p>
            </article>
          </div>
        </section>

        {/* こんな方におすすめ */}
        <section className="men-lp-fade men-lp-delay-2 mb-20">
          <div className="mb-6 text-center">
            <p className="mb-2 text-[12px] font-bold tracking-[0.22em] text-[#cfd3e8]">
              FOR BUSY MEN
            </p>
            <h2 className="font-serif text-[26px] font-bold leading-tight text-[#f7f7f4]">
              こんな方におすすめ
            </h2>
            <span className="mx-auto mt-3 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#6b6b68] via-[#1f276f] to-[#6b6b68]" />
          </div>

          <div className="space-y-6">
            {[
              "食事や不規則な生活で体重管理が難しい",
              "周囲に気づかれたくない",
              "ジム通いが続かない、時間が取れない",
              "価格とスピード感も重視したい",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[18px] border border-white/12 bg-white/[0.06] px-5 py-4 shadow-[0_8px_22px_rgba(0,0,0,0.24)]"
              >
                <p className="text-[15px] text-[#f7f7f4]">
                  <span className="text-[#cfd3e8]">✓</span> {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* お取り扱い薬剤 */}
        <section className="men-lp-fade men-lp-delay-3 mb-24">
          <div className="mb-8 text-center">
            <p className="mb-2 text-[12px] font-bold tracking-[0.22em] text-[#cfd3e8]">
              LINEUP
            </p>
            <h2 className="font-serif text-[30px] font-bold leading-tight text-[#f7f7f4]">
              お取り扱い薬剤
            </h2>
            <span className="mx-auto mt-3 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#6b6b68] via-[#1f276f] to-[#6b6b68]" />
            <p className="mt-4 text-[14px] leading-[1.8] text-[#bdbdb8]">
              ※薬剤は医師の診察のうえ、用法用量を守って正しくお使いください。
            </p>
          </div>

          <div className="space-y-4">
            {medicineItems.map((item) => (
              <article
                key={item.name}
                className="relative overflow-hidden rounded-[22px] border border-white/12 bg-[#171717]/95 p-5 shadow-[0_12px_28px_rgba(0,0,0,0.35)]"
              >
                <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#555555] via-[#1f276f] to-[#555555]" />
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[21px] font-bold leading-tight text-[#f7f7f4]">
                      {item.name}
                    </h3>
                    <p className="mt-2 inline-flex rounded-full border border-[#cfd3e8]/40 px-3 py-1 text-[12px] font-bold text-[#cfd3e8]">
                      {item.type}
                    </p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[12px] font-bold text-[#f7f7f4]">
                    {item.note}
                  </span>
                </div>

                <p className="text-[24px] font-bold leading-tight text-[#cfd3e8]">
                  {item.price}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-[22px] border border-white/12 bg-[#171717]/90 p-5 text-center shadow-[0_10px_24px_rgba(0,0,0,0.28)]">
            <p className="text-[16px] leading-[1.9] text-[#d7d7d4]">
              上記以外にも複数のダイエット薬を取り扱っています。医師とご相談のうえ、お悩みに応じてご案内します。
            </p>
          </div>
        </section>

        {/* 5%OFF CTA */}
        <section className="men-lp-fade men-lp-delay-4 relative mb-24 overflow-hidden rounded-[24px] border border-[#26338f]/60 bg-gradient-to-br from-[#1f276f] via-[#151a4f] to-[#050505] px-5 py-8 text-center shadow-[0_16px_34px_rgba(0,0,0,0.45)]">
          <div
            aria-hidden
            className="pointer-events-none absolute right-[-28px] top-[-30px] h-24 w-24 rounded-full bg-white/15 blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-[-36px] left-[-20px] h-24 w-24 rounded-full bg-[#cfd3e8]/20 blur-2xl"
          />
          <p className="mb-3 text-[16px] font-bold leading-relaxed text-white">
            当サイトからのLINE登録＆予約で
          </p>
          <p className="font-serif text-[36px] font-bold leading-tight text-white">
            さらに5%OFF
          </p>
        </section>

        {/* よくある質問 */}
        <section className="men-lp-fade men-lp-delay-5 mb-24">
          <div className="mb-8 text-center">
            <p className="mb-2 text-[12px] font-bold tracking-[0.22em] text-[#cfd3e8]">
              FAQ
            </p>
            <h2 className="font-serif text-[30px] font-bold leading-tight text-[#f7f7f4]">
              よくある質問
            </h2>
            <span className="mx-auto mt-3 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#6b6b68] via-[#1f276f] to-[#6b6b68]" />
          </div>

          <div className="space-y-5">
            {faqItems.map((item, index) => (
              <article
                key={item.q}
                className="rounded-[22px] border border-white/12 bg-[#171717]/95 p-6 shadow-[0_12px_28px_rgba(0,0,0,0.35)]"
              >
                <p className="mb-4 flex gap-3 text-[18px] font-bold leading-[1.7] text-[#f7f7f4]">
                  <span className="text-[24px] leading-none text-[#cfd3e8]">
                    Q{index + 1}.
                  </span>
                  <span>{item.q}</span>
                </p>
                <p className="flex gap-3 text-[16px] leading-[1.9] text-[#d7d7d4]">
                  <span className="text-[22px] font-bold leading-none text-[#cfd3e8]">
                    A.
                  </span>
                  <span>{item.a}</span>
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* 購入までのフロー */}
        <section className="men-lp-fade men-lp-delay-6 mb-24">
          <div className="mb-8 text-center">
            <p className="mb-2 text-[12px] font-bold tracking-[0.22em] text-[#cfd3e8]">
              FLOW
            </p>
            <h2 className="font-serif text-[30px] font-bold leading-tight text-[#f7f7f4]">
              購入までの流れ
            </h2>
            <span className="mx-auto mt-3 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#6b6b68] via-[#1f276f] to-[#6b6b68]" />
          </div>

          <div className="space-y-5">
            {flowItems.map((item) => (
              <article
                key={item.step}
                className="rounded-[22px] border border-white/12 bg-[#171717]/95 p-6 shadow-[0_12px_28px_rgba(0,0,0,0.35)]"
              >
                <p className="mb-2 text-[13px] font-bold tracking-[0.16em] text-[#cfd3e8]">
                  {item.step}
                </p>
                <h3 className="mb-3 text-[20px] font-bold leading-tight text-[#f7f7f4]">
                  {item.title}
                </h3>
                <p className="text-[16px] leading-[1.9] text-[#d7d7d4]">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* 注意事項 */}
        <section className="men-lp-fade men-lp-delay-7 rounded-[24px] border border-white/12 bg-[#171717]/95 p-6 shadow-[0_12px_28px_rgba(0,0,0,0.35)]">
          <div className="mb-5 text-center">
            <p className="mb-2 text-[12px] font-bold tracking-[0.22em] text-[#cfd3e8]">
              NOTICE
            </p>
            <h2 className="font-serif text-[28px] font-bold leading-tight text-[#f7f7f4]">
              注意事項
            </h2>
          </div>

          <ul className="space-y-3 text-[15px] leading-[1.8] text-[#d7d7d4]">
            <li>・医療ダイエットは自由診療です。</li>
            <li>・効果や感じ方には個人差があります。</li>
            <li>・副作用や禁忌事項の詳細は、診察時に医師へご確認ください。</li>
            <li>
              ・妊娠中・授乳中の方、既往歴のある方、服薬中の方は事前にご相談ください。
            </li>
            <li>
              ・掲載の料金・取り扱い・診療内容は、診察内容・在庫状況により変更される場合があります。
            </li>
          </ul>
        </section>
      </div>

      {/* 追従CTA */}
      <div className="men-lp-fade men-lp-delay-8 fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <div className="mx-auto w-full max-w-[430px] rounded-[18px] border border-white/20 bg-[#111111]/95 p-[2px] shadow-[0_12px_30px_rgba(0,0,0,0.55)] backdrop-blur-md">
          <a
            href={menLpLineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-[16px] bg-gradient-to-b from-[#26338f] to-[#141b5f] px-4 py-4 text-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_8px_20px_rgba(31,39,111,0.45)] transition duration-200 hover:brightness-110 active:translate-y-[1px]"
          >
            <span className="block text-[12px] font-bold leading-tight tracking-[0.08em] text-white/90 sm:text-[13px]">
              当サイトからの登録でさらに5%OFF
            </span>

            <span className="mt-1 block text-[20px] font-black leading-snug tracking-[0.03em] sm:text-[22px]">
              LINEで無料カウンセリング
            </span>
          </a>
        </div>
      </div>
    </main>
  );
}
