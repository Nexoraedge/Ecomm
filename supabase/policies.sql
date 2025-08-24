-- Enable RLS
alter table public.users enable row level security;
alter table public.product_analyses enable row level security;
alter table public.competitor_data enable row level security;
alter table public.generated_content enable row level security;
alter table public.bug_reports enable row level security;
alter table public.usage_analytics enable row level security;

-- Drop existing policies to avoid duplicates and type mismatches
drop policy if exists "Users select own" on public.users;
drop policy if exists "Users update own" on public.users;
drop policy if exists "Analyses owner select" on public.product_analyses;
drop policy if exists "Analyses owner insert" on public.product_analyses;
drop policy if exists "Analyses owner update" on public.product_analyses;
drop policy if exists "Competitor owner select" on public.competitor_data;
drop policy if exists "Generated owner select" on public.generated_content;
drop policy if exists "Bug reports insert" on public.bug_reports;
drop policy if exists "Bug reports select own" on public.bug_reports;
drop policy if exists "Usage insert" on public.usage_analytics;
drop policy if exists "Usage select own" on public.usage_analytics;

-- Users: user can read/update own row, insert via server role
create policy "Users select own" on public.users
  for select using (auth_user_id::uuid = auth.uid());
create policy "Users update own" on public.users
  for update using (auth_user_id::uuid = auth.uid());

-- Product analyses: owner access
create policy "Analyses owner select" on public.product_analyses
  for select using (user_id in (select id from public.users where auth_user_id::uuid = auth.uid()));
create policy "Analyses owner insert" on public.product_analyses
  for insert with check (user_id in (select id from public.users where auth_user_id::uuid = auth.uid()));
create policy "Analyses owner update" on public.product_analyses
  for update using (user_id in (select id from public.users where auth_user_id::uuid = auth.uid()));

-- Competitor data: visible to analysis owner
create policy "Competitor owner select" on public.competitor_data
  for select using (analysis_id in (select id from public.product_analyses where user_id in (select id from public.users where auth_user_id::uuid = auth.uid())));

-- Generated content: visible to analysis owner
create policy "Generated owner select" on public.generated_content
  for select using (analysis_id in (select id from public.product_analyses where user_id in (select id from public.users where auth_user_id::uuid = auth.uid())));

-- Bug reports: user can insert and read own
create policy "Bug reports insert" on public.bug_reports
  for insert with check (user_id in (select id from public.users where auth_user_id::uuid = auth.uid()));
create policy "Bug reports select own" on public.bug_reports
  for select using (user_id in (select id from public.users where auth_user_id::uuid = auth.uid()));

-- Usage analytics: user can insert and read own
create policy "Usage insert" on public.usage_analytics
  for insert with check (user_id in (select id from public.users where auth_user_id::uuid = auth.uid()));
create policy "Usage select own" on public.usage_analytics
  for select using (user_id in (select id from public.users where auth_user_id::uuid = auth.uid()));
