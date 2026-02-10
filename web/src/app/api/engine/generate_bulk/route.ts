import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const engineUrl = process.env.ENGINE_API_URL || 'http://127.0.0.1:8000';
        console.log(`Proxying bulk generation request to: ${engineUrl}/generate_bulk`);

        const res = await fetch(`${engineUrl}/generate_bulk`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ENGINE_API_KEY || '',
            },
            // Add a longer timeout via signal if fetch supports it, or just rely on default
            // Node fetch defaults are generous.
        });

        if (!res.ok) {
            console.error(`Engine API Error: ${res.status} ${await res.text()}`);
            throw new Error(`Engine API error: ${res.status}`);
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Bulk Generate Proxy Error:', error);
        return NextResponse.json(
            { error: 'Failed to trigger bulk generation' },
            { status: 500 }
        );
    }
}
