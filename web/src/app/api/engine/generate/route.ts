import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const res = await fetch('http://127.0.0.1:8000/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            throw new Error('Failed to start generation');
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("API Proxy Error [Generate]:", error);
        return NextResponse.json({ error: "Failed to connect to engine" }, { status: 500 });
    }
}
