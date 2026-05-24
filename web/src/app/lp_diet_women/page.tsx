'use client';

import { useEffect } from 'react';

const womenLpLineUrl =
  "https://liff.line.me/1657922560-1J7Njyb8/landing?follow=%40079icouq&lp=DPFOqe&liff_id=1657922560-1J7Njyb8";

const medicineItems = [
  {
    name: "マンジャロ",
    type: "週1回の自己注射タイプ",
    price: "19,800円〜 / 1ヶ月",
    note: "自己注射",
    description:
      "週1回の自己注射タイプのGLP-1薬剤。スピード重視で体重管理を進めたい方に。",
  },
  {
    name: "リベルサス",
    type: "毎日1回の服用タイプ",
    price: "8,800円〜 / 1ヶ月",
    note: "内服薬",
    description:
      "1日1回飲むタイプのGLP-1薬剤。注射に抵抗がある方や、手間を抑えてスムーズに始めたい方に。",
  },
  {
    name: "ビクトーザ",
    type: "1日1回の自己注射タイプ",
    price: "15,000円〜 / 1ヶ月",
    note: "自己注射",
    description:
      "1日1回の自己注射タイプのGLP-1薬剤。予定や食欲に合わせて調節出来る事が特徴です。",
  },
  {
    name: "オゼンピック",
    type: "週1回の自己注射タイプ",
    price: "23,000円〜 / 1ヶ月",
    note: "自己注射",
    description:
      "週1回の自己注射タイプのGLP-1薬剤。ビクトーザよりもオゼンピックの方が減量効果に優れていると言われています。",
  },
  {
    name: "スーグラ錠",
    type: "1日1回の服用タイプ",
    price: "9,800円〜 / 1ヶ月",
    note: "内服薬",
    description:
      "1日1回の内服タイプ。食事で摂取したカロリーを尿によって体外に排出し、糖分の吸収を抑えてくれる薬です。",
  },
];

const faqItems = [
  {
    q: "医療ダイエットとはなんですか？",
    a: "医師の診察のもと、体質や目的に応じてお薬の選択肢をご案内する自由診療です。",
  },
  {
    q: "副作用はありますか？",
    a: "副作用の出方には個人差があります。ご不安な点は診察時に医師へご相談ください。",
  },
  {
    q: "どの薬剤を選べばいいですか？",
    a: "医師がお悩みに応じて適切な薬剤をご案内します。",
  },
  {
    q: "通院は必要ですか？",
    a: "基本、オンラインでの完結が可能です。診療内容により異なる場合があります。",
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

export default function LpDietWomenPage() {
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
    <main className="women-lp-page women-lp-fade-shell relative min-h-screen overflow-hidden bg-gradient-to-b from-[#fff7fa] via-[#fffaf8] to-[#fff4f5] text-[#35292d]">
      {/* CSSでも強制非表示 */}
      <style jsx global>{`
        div.fixed.bottom-4.right-4.z-50 {
          display: none !important;
        }
      `}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#ffdbe8]/50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-88px] top-[420px] h-40 w-40 rounded-full bg-[#ffe7c8]/50 blur-3xl"
      />
      <div className="relative mx-auto w-full max-w-[430px] px-4 pb-44 pt-5">
        {/* LP画像 */}
        <div className="women-lp-fade women-lp-delay-0 mb-10">
          <div className="women-lp-card-strong mx-auto overflow-hidden rounded-[28px] bg-white shadow-[0_18px_45px_rgba(180,80,120,0.18)]">
            <img
              src="/images/lp-diet-women-hero.png"
              alt="女性向け医療ダイエットLP"
              className="block h-auto w-full"
            />
          </div>
        </div>

        {/* 選ばれる理由 */}
        <section className="women-lp-fade women-lp-delay-1 mb-20">
          <div className="mb-3 text-center">
            <p className="mb-2 text-[18px] font-bold tracking-[0.22em] text-[#e05283]">
              AURA MEDICAL DIET
            </p>
            <h2 className="font-serif text-[15px] font-bold leading-tight text-[#35292d]">
              当サイトからの予約でお得・安全にお薬を購入
            </h2>
            <span className="mx-auto mt-3 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#f7c1d7] via-[#e97aa7] to-[#f7c1d7]" />
          </div>

          <div className="space-y-5">
            <article className="relative overflow-hidden rounded-[24px] border border-pink-100 bg-white/90 p-6 shadow-[0_12px_28px_rgba(180,80,120,0.10)]">
              <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#ffd4e5] via-[#e05283] to-[#ffd4e5]" />
              <p className="mb-3 text-[19px] font-bold leading-relaxed text-[#e05283]">
                最安値保証
              </p>
              <p className="text-[16px] leading-[1.9] text-[#5d4a50]">
                当サイトが提携している「シェアクリニック」は日本最安値でお薬をご提供。
              </p>
            </article>

            <article className="relative overflow-hidden rounded-[24px] border border-pink-100 bg-white/90 p-6 shadow-[0_12px_28px_rgba(180,80,120,0.10)]">
              <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#ffd4e5] via-[#e05283] to-[#ffd4e5]" />
              <p className="mb-3 text-[19px] font-bold leading-relaxed text-[#e05283]">
                来院不要
              </p>
              <p className="text-[16px] leading-[1.9] text-[#5d4a50]">
                オンラインでカウンセリングから購入まで完結。忙しい方でも続けやすい。
              </p>
            </article>

            <article className="relative overflow-hidden rounded-[24px] border border-pink-100 bg-white/90 p-6 shadow-[0_12px_28px_rgba(180,80,120,0.10)]">
              <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#ffd4e5] via-[#e05283] to-[#ffd4e5]" />
              <p className="mb-3 text-[19px] font-bold leading-relaxed text-[#e05283]">
                医師と相談
              </p>
              <p className="text-[16px] leading-[1.9] text-[#5d4a50]">
                体質や目的に合わせて、医師が適切なお薬をご提案。
              </p>
            </article>

            <article className="relative overflow-hidden rounded-[24px] border border-pink-100 bg-white/90 p-6 shadow-[0_12px_28px_rgba(180,80,120,0.10)]">
              <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#ffd4e5] via-[#e05283] to-[#ffd4e5]" />
              <p className="mb-3 text-[19px] font-bold leading-relaxed text-[#e05283]">
                国内承認薬
              </p>
              <p className="text-[16px] leading-[1.9] text-[#5d4a50]">
                国内承認薬のみ取り扱っているため、安心安全。
              </p>
            </article>
          </div>
        </section>

        {/* こんな方におすすめ */}
        <section className="women-lp-fade women-lp-delay-2 mb-24">
          <div className="mb-8 text-center">
            <p className="mb-2 text-[12px] font-bold tracking-[0.22em] text-[#e05283]">
              RECOMMEND
            </p>
            <h2 className="font-serif text-[30px] font-bold leading-tight text-[#35292d]">
              こんな方におすすめ
            </h2>
            <span className="mx-auto mt-3 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#f7c1d7] via-[#e97aa7] to-[#f7c1d7]" />
          </div>

          <div className="space-y-3">
            {[
              "忙しくて通院の時間が取りにくい",
              "自宅で相談から購入まで進めたい",
              "食事や生活習慣が不規則になりがち",
              "無理のないペースで体重管理を始めたい",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[20px] border border-pink-100 bg-white/90 px-5 py-4 shadow-[0_10px_24px_rgba(180,80,120,0.08)]"
              >
                <p className="text-[16px] font-bold leading-[1.8] text-[#5d4a50]">
                  ✓ {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* お取り扱い薬剤 */}
        <section className="women-lp-fade women-lp-delay-3 mb-24">
          <div className="mb-8 text-center">
            <p className="mb-2 text-[12px] font-bold tracking-[0.22em] text-[#e05283]">
              LINEUP
            </p>
            <h2 className="font-serif text-[30px] font-bold leading-tight text-[#35292d]">
              お取り扱い薬剤
            </h2>
            <span className="mx-auto mt-3 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#f7c1d7] via-[#e97aa7] to-[#f7c1d7]" />
            <p className="mt-4 text-[14px] leading-[1.8] text-[#7a666d]">
              ※薬剤は医師の診察のうえ、用法用量を守って正しくお使いください。
            </p>
          </div>

          <div className="space-y-4">
            {medicineItems.map((item) => (
              <article
                key={item.name}
                className="relative overflow-hidden rounded-[24px] border border-pink-100 bg-white/90 p-5 shadow-[0_12px_28px_rgba(180,80,120,0.10)]"
              >
                <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#ffd4e5] via-[#e05283] to-[#ffd4e5]" />
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[21px] font-bold leading-tight text-[#35292d]">
                      {item.name}
                    </h3>
                    <p className="mt-2 inline-flex rounded-full border border-pink-200 px-3 py-1 text-[12px] font-bold text-[#e05283]">
                      {item.type}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#ffe7ef] px-3 py-1 text-[12px] font-bold text-[#e05283]">
                    {item.note}
                  </span>
                </div>

                {/* 説明文の追加（既存の文字色・ライン高のスタイルを維持） */}
                <p className="mb-4 text-[15px] leading-[1.8] text-[#5d4a50]">
                  {item.description}
                </p>

                <p className="text-[24px] font-bold leading-tight text-[#e05283]">
                  {item.price}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-[22px] border border-pink-100 bg-white/80 p-5 text-center shadow-[0_10px_24px_rgba(180,80,120,0.08)]">
            <p className="text-[16px] leading-[1.9] text-[#5d4a50]">
              上記以外にも複数のダイエット薬を取り扱っています。医師とご相談のうえ、お悩みに応じてご案内します。
            </p>
          </div>
        </section>

        {/* 5%OFF CTA */}
        <section className="women-lp-fade women-lp-delay-4 relative mb-24 overflow-hidden rounded-[28px] border border-[#e9c17d] bg-gradient-to-br from-[#fffdf6] to-[#fff1d9] px-5 py-8 text-center shadow-[0_16px_34px_rgba(180,120,60,0.12)]">
          <div
            aria-hidden
            className="pointer-events-none absolute right-[-36px] top-[-30px] h-24 w-24 rounded-full bg-[#ffe8c1]/70 blur-xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-[-42px] left-[-30px] h-24 w-24 rounded-full bg-[#ffd7ea]/70 blur-xl"
          />
          <p className="mb-3 text-[16px] font-bold leading-relaxed text-[#5d4a50]">
            当サイトからのLINE登録＆カウンセリングで
          </p>
          <p className="font-serif text-[36px] font-bold leading-tight text-[#e05283]">
            さらに5%OFF
          </p>
        </section>

        {/* よくある質問 */}
        <section className="women-lp-fade women-lp-delay-5 mb-24">
          <div className="mb-8 text-center">
            <p className="mb-2 text-[12px] font-bold tracking-[0.22em] text-[#e05283]">
              FAQ
            </p>
            <h2 className="font-serif text-[30px] font-bold leading-tight text-[#35292d]">
              よくある質問
            </h2>
            <span className="mx-auto mt-3 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#f7c1d7] via-[#e97aa7] to-[#f7c1d7]" />
          </div>

          <div className="space-y-5">
            {faqItems.map((item, index) => (
              <article
                key={item.q}
                className="rounded-[24px] border border-pink-100 bg-white/90 p-6 shadow-[0_12px_28px_rgba(180,80,120,0.10)]"
              >
                <p className="mb-4 flex gap-3 text-[18px] font-bold leading-[1.7] text-[#35292d]">
                  <span className="text-[24px] leading-none text-[#e05283]">
                    Q{index + 1}.
                  </span>
                  <span>{item.q}</span>
                </p>
                <p className="flex gap-3 text-[16px] leading-[1.9] text-[#5d4a50]">
                  <span className="text-[22px] font-bold leading-none text-[#e05283]">
                    A.
                  </span>
                  <span>{item.a}</span>
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* 購入までの流れ */}
        <section className="women-lp-fade women-lp-delay-6 mb-24">
          <div className="mb-8 text-center">
            <p className="mb-2 text-[12px] font-bold tracking-[0.22em] text-[#e05283]">
              FLOW
            </p>
            <h2 className="font-serif text-[30px] font-bold leading-tight text-[#35292d]">
              購入までの流れ
            </h2>
            <span className="mx-auto mt-3 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#f7c1d7] via-[#e97aa7] to-[#f7c1d7]" />
          </div>

          <div className="space-y-5">
            {flowItems.map((item) => (
              <article
                key={item.step}
                className="rounded-[24px] border border-pink-100 bg-white/90 p-6 shadow-[0_12px_28px_rgba(180,80,120,0.10)]"
              >
                <p className="mb-2 text-[13px] font-bold tracking-[0.16em] text-[#e05283]">
                  {item.step}
                </p>
                <h3 className="mb-3 text-[20px] font-bold leading-tight text-[#35292d]">
                  {item.title}
                </h3>
                <p className="text-[16px] leading-[1.9] text-[#5d4a50]">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* 注意事項 */}
        <section className="women-lp-fade women-lp-delay-7 rounded-[28px] border border-pink-100 bg-white/90 p-6 shadow-[0_12px_28px_rgba(180,80,120,0.10)]">
          <div className="mb-5 text-center">
            <p className="mb-2 text-[12px] font-bold tracking-[0.22em] text-[#e05283]">
              NOTICE
            </p>
            <h2 className="font-serif text-[28px] font-bold leading-tight text-[#35292d]">
              注意事項
            </h2>
          </div>

          <ul className="space-y-3 text-[15px] leading-[1.8] text-[#5d4a50]">
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
      <div className="women-lp-fade women-lp-delay-8 fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <div className="mx-auto w-full max-w-[430px] rounded-[22px] border border-pink-200 bg-gradient-to-r from-[#e05283] via-[#d83f78] to-[#b92f61] p-[2px] shadow-[0_12px_30px_rgba(185,47,97,0.35)]">
          <a
            href={womenLpLineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-[20px] bg-gradient-to-b from-[#e85a91] to-[#bf2f66] px-4 py-4 text-center text-white"
          >
            <span className="block text-[12px] font-bold leading-tight tracking-[0.08em] text-white/90 sm:text-[13px]">
              当サイトからの登録でさらに5%OFF
            </span>

            <span className="mt-1 block text-[18px] font-black leading-snug tracking-[0.03em] sm:text-[20px]">
              LINEで無料カウンセリング
            </span>
          </a>
        </div>
      </div>
    </main>
  );
}
