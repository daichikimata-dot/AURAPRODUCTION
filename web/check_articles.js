const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use SERVICE_ROLE_KEY to bypass RLS for this check if available, otherwise ANON
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkArticles() {
    console.log('Checking articles table...');

    // Get counts by status
    const { data: articles, error } = await supabase
        .from('articles')
        .select('id, title, status, created_at');

    if (error) {
        console.error('Error fetching articles:', error);
        return;
    }

    console.log(`Total articles found: ${articles.length}`);

    const statusCounts = {};
    articles.forEach(a => {
        statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
    });

    console.log('Status counts:', statusCounts);

    console.log('\nSample articles:');
    articles.slice(0, 5).forEach(a => {
        console.log(`- [${a.status}] ${a.title} (${a.id})`);
    });
}

checkArticles();
