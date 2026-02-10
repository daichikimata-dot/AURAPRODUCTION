import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://aura-beauty.jp";

    // Initialize Supabase Client (Admin access needed? No, public RLS should allow fetching content, but sitemap generator mimics server side)
    // safe to use service role key if available, or just public/anon if RLS is correct.
    // Using service role key for reliability in build/ISR
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all published articles
    const { data: articles } = await supabase
        .from('articles')
        .select('id, updated_at')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

    const articleEntries: MetadataRoute.Sitemap = (articles || []).map((article) => ({
        url: `${baseUrl}/blog/${article.id}`,
        lastModified: new Date(article.updated_at),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/#latest-topics-section`, // Main content area
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        ...articleEntries,
    ];
}
