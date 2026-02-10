import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { content, feedback } = body;

        if (!content || !feedback) {
            return NextResponse.json({ error: "Missing content or feedback" }, { status: 400 });
        }

        const engineUrl = process.env.ENGINE_API_URL || 'http://127.0.0.1:8000';

        const res = await fetch(`${engineUrl}/revise`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content, feedback }),
        });

        if (!res.ok) {
            console.error(`Engine API Error: ${res.status} ${await res.text()}`);
            throw new Error(`Engine API error: ${res.status}`);
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("API Proxy Error [Revise]:", error);
        return NextResponse.json(
            { error: "Failed to revise article" },
            { status: 500 }
        );
    }
}
