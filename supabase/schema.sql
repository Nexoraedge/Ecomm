-- Schema for AI eCommerce SEO SaaS
create extension if not exists pgcrypto;

-- 1. users
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id varchar unique not null,
  email varchar not null,
  full_name varchar,
  subscription_plan varchar default 'free',
  analyses_remaining integer default 5,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. product_analyses
create table if not exists public.product_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  product_name varchar not null,
  product_description text,
  product_features text,
  category varchar,
  target_platform varchar not null,
  status varchar default 'pending',
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- 3. competitor_data
create table if not exists public.competitor_data (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid references public.product_analyses(id) on delete cascade,
  competitor_title varchar not null,
  competitor_url varchar,
  extracted_keywords text[],
  ranking_position integer,
  price decimal,
  rating decimal,
  scraped_at timestamptz default now()
);

-- 4. generated_content
create table if not exists public.generated_content (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid references public.product_analyses(id) on delete cascade,
  optimized_title varchar not null,
  optimized_description text not null,
  recommended_keywords text[],
  seo_score integer,
  gemini_prompt text,
  gemini_response text,
  created_at timestamptz default now()
);

-- 5. bug_reports
create table if not exists public.bug_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  title varchar not null,
  description text not null,
  category varchar,
  priority varchar default 'medium',
  status varchar default 'open',
  user_email varchar,
  screenshot_url varchar,
  browser_info jsonb,
  created_at timestamptz default now()
);

-- 6. usage_analytics
create table if not exists public.usage_analytics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  action varchar not null,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_users_auth_user_id on public.users(auth_user_id);
create index if not exists idx_analyses_user_id on public.product_analyses(user_id);
create index if not exists idx_competitor_analysis_id on public.competitor_data(analysis_id);
create index if not exists idx_generated_analysis_id on public.generated_content(analysis_id);
create index if not exists idx_usage_user_id on public.usage_analytics(user_id);
