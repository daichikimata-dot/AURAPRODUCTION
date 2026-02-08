-- Profiles table (linked to Auth)
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  role text default 'owner',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Categories table
create table categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Sources table
create table sources (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  url text not null,
  type text not null, -- 'japanese_media', 'korean_media'
  is_active boolean default true,
  last_crawled_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Articles table
create table articles (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text, -- Markdown/HTML
  status text default 'draft', -- 'draft', 'pending_review', 'approved', 'published'
  thumbnail_url text,
  source_url text,
  category_id uuid references categories(id),
  generated_by text default 'ai',
  admin_feedback text,
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS)
alter table profiles enable row level security;
alter table categories enable row level security;
alter table sources enable row level security;
alter table articles enable row level security;

-- Policies
-- (For simplicity in this setup phase, we might want to allow authenticated users full access, 
-- but in production we need specific policies)
create policy "Authenticated users can do everything" on profiles for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on categories for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on sources for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on articles for all using (auth.role() = 'authenticated');

-- Public read access for published articles
create policy "Public can view published articles" on articles for select using (status = 'published');
create policy "Public can view categories" on categories for select using (true);

-- Links table (for Affiliate/Internal links)
create table links (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  url text not null,
  key text unique, -- Shortcode key e.g. 'sbc-lp'
  clicks integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Settings table (Key-Value store)
create table settings (
  key text primary key,
  value text, -- JSON or plain text
  description text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for new tables
alter table links enable row level security;
alter table settings enable row level security;

create policy "Authenticated users can do everything" on links for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on settings for all using (auth.role() = 'authenticated');

