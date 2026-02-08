import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client (Admin context for Dashboard)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
    try {
        // Fetch recent articles from Supabase directly in this API route
        // Alternatively, we could ask the Engine, but direct DB access is faster/simpler for read-only lists
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) throw error;

        return NextResponse.json({ articles: data });
    } catch (error) {
        console.error("API Error [Articles]:", error);
        return NextResponse.json({ articles: [] }, { status: 500 });
    }
}
