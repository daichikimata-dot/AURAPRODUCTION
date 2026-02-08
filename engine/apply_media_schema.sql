
-- Run this in Supabase SQL Editor or via client if setup permits
create table if not exists crawled_articles (
  id uuid default gen_random_uuid() primary key,
  source_id uuid references sources(id),
  title text,
  content text,
  url text unique not null,
  crawled_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table crawled_articles enable row level security;
create policy "Authenticated users can do everything" on crawled_articles for all using (auth.role() = 'authenticated');
