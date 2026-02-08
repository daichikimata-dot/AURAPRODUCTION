import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const res = await fetch('http://127.0.0.1:8000/trends', {
            cache: 'no-store' // Always fetch fresh data
        });

        if (!res.ok) {
            throw new Error('Failed to fetch trends');
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("API Proxy Error [Trends]:", error);
        // Fallback for demo if Engine is offline
        return NextResponse.json({
            keywords: [
                "(Fallback) 韓国肌管理", "ピコシュア", "ポテンツァ", "リジュラン", "脂肪吸引注射",
                "白玉点滴", "エクソソーム", "ショートスレッド", "GLP-1ダイエット", "眉アートメイク"
            ]
        }, { status: 200 });
    }
}
