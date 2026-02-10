import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const engineUrl = process.env.ENGINE_API_URL || 'http://127.0.0.1:8000';
        const res = await fetch(`${engineUrl}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ENGINE_API_KEY || '',
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`Engine API Error: ${res.status} ${errorText}`);
            return NextResponse.json(
                { error: `Engine API Error: ${res.status}`, details: errorText },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("API Proxy Error [Generate]:", error);
        return NextResponse.json({ error: "Failed to connect to engine", details: String(error) }, { status: 500 });
    }
}
