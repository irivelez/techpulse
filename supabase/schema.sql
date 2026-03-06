-- TechPulse Intelligence Second Brain
-- Run this in Supabase SQL Editor

-- Enable extensions
create extension if not exists "pg_trgm";

-- Articles: raw ingested content from RSS feeds
create table articles (
  id uuid primary key default gen_random_uuid(),
  source_key text not null,
  source_name text not null,
  source_type text not null default 'trusted_voice', -- trusted_voice, official, community
  title text not null,
  url text not null unique,
  content text,
  summary text,
  published_at timestamptz,
  ingested_at timestamptz default now(),
  signal_weight numeric default 1.0,
  priority text default 'medium', -- critical, high, medium, low
  relevance_score numeric, -- AI-assigned 0-100
  tags text[] default '{}',
  processed boolean default false
);

-- Insights: AI-extracted structured insights from articles
create table insights (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references articles(id) on delete cascade,
  insight_type text not null, -- trend, opportunity, tool, technique, warning, prediction
  title text not null,
  content text not null,
  impact_score integer check (impact_score between 1 and 10),
  actionability text, -- immediate, short_term, long_term, watch
  categories text[] default '{}',
  created_at timestamptz default now()
);

-- Briefings: daily synthesized intelligence reports
create table briefings (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  title text not null,
  executive_summary text not null,
  key_developments jsonb not null default '[]',
  opportunities jsonb not null default '[]',
  threats jsonb not null default '[]',
  action_items jsonb not null default '[]',
  source_count integer default 0,
  created_at timestamptz default now()
);

-- Chat messages: conversation history with the brain
create table chat_messages (
  id uuid primary key default gen_random_uuid(),
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  sources jsonb, -- referenced articles/insights
  created_at timestamptz default now()
);

-- Indexes for performance
create index idx_articles_published on articles(published_at desc);
create index idx_articles_source on articles(source_key);
create index idx_articles_processed on articles(processed) where not processed;
create index idx_articles_relevance on articles(relevance_score desc nulls last);
create index idx_articles_tags on articles using gin(tags);
create index idx_articles_title_trgm on articles using gin(title gin_trgm_ops);
create index idx_insights_type on insights(insight_type);
create index idx_insights_impact on insights(impact_score desc);
create index idx_briefings_date on briefings(date desc);
create index idx_chat_created on chat_messages(created_at desc);

-- RLS policies (enable row level security)
alter table articles enable row level security;
alter table insights enable row level security;
alter table briefings enable row level security;
alter table chat_messages enable row level security;

-- For now, allow all access (single user app, secured by API keys)
create policy "Allow all on articles" on articles for all using (true) with check (true);
create policy "Allow all on insights" on insights for all using (true) with check (true);
create policy "Allow all on briefings" on briefings for all using (true) with check (true);
create policy "Allow all on chat_messages" on chat_messages for all using (true) with check (true);
