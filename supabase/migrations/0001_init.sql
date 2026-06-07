create extension if not exists "pgcrypto";

-- Profiles and roles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'viewer' check (role in ('admin','viewer')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- Content
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title jsonb not null default '{}'::jsonb,
  image text,
  sort int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title jsonb not null default '{}'::jsonb,
  location jsonb not null default '{}'::jsonb,
  system jsonb not null default '{}'::jsonb,
  description jsonb not null default '{}'::jsonb,
  category_id uuid references public.categories(id) on delete set null,
  cover text,
  images text[] not null default '{}',
  sort int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  body jsonb not null default '{}'::jsonb,
  sort int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.faq (
  id uuid primary key default gen_random_uuid(),
  question jsonb not null default '{}'::jsonb,
  answer jsonb not null default '{}'::jsonb,
  sort int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.content_blocks (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  phone text not null,
  comment text,
  locale text,
  page text,
  status text not null default 'new' check (status in ('new','in_progress','done')),
  created_at timestamptz not null default now()
);

-- RLS
alter table public.profiles       enable row level security;
alter table public.categories     enable row level security;
alter table public.projects       enable row level security;
alter table public.testimonials   enable row level security;
alter table public.faq            enable row level security;
alter table public.content_blocks enable row level security;
alter table public.settings       enable row level security;
alter table public.leads          enable row level security;

drop policy if exists "profiles read" on public.profiles;
drop policy if exists "profiles write" on public.profiles;
drop policy if exists "categories read" on public.categories;
drop policy if exists "projects read" on public.projects;
drop policy if exists "testimonials read" on public.testimonials;
drop policy if exists "faq read" on public.faq;
drop policy if exists "content read" on public.content_blocks;
drop policy if exists "settings read" on public.settings;
drop policy if exists "categories write" on public.categories;
drop policy if exists "projects write" on public.projects;
drop policy if exists "testimonials write" on public.testimonials;
drop policy if exists "faq write" on public.faq;
drop policy if exists "content write" on public.content_blocks;
drop policy if exists "settings write" on public.settings;
drop policy if exists "leads read" on public.leads;
drop policy if exists "leads update" on public.leads;

create policy "profiles read"  on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles write" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

create policy "categories read"   on public.categories   for select using (is_published or public.is_admin());
create policy "projects read"     on public.projects     for select using (is_published or public.is_admin());
create policy "testimonials read" on public.testimonials for select using (is_published or public.is_admin());
create policy "faq read"          on public.faq          for select using (is_published or public.is_admin());
create policy "content read"      on public.content_blocks for select using (true);
create policy "settings read"     on public.settings     for select using (true);

create policy "categories write"   on public.categories   for all using (public.is_admin()) with check (public.is_admin());
create policy "projects write"     on public.projects     for all using (public.is_admin()) with check (public.is_admin());
create policy "testimonials write" on public.testimonials for all using (public.is_admin()) with check (public.is_admin());
create policy "faq write"          on public.faq          for all using (public.is_admin()) with check (public.is_admin());
create policy "content write"      on public.content_blocks for all using (public.is_admin()) with check (public.is_admin());
create policy "settings write"     on public.settings     for all using (public.is_admin()) with check (public.is_admin());

create policy "leads read"   on public.leads for select using (public.is_admin());
create policy "leads update" on public.leads for update using (public.is_admin()) with check (public.is_admin());

-- Storage
insert into storage.buckets (id, name, public)
values ('media','media', true)
on conflict (id) do nothing;

drop policy if exists "media read" on storage.objects;
drop policy if exists "media write" on storage.objects;

create policy "media read" on storage.objects for select using (bucket_id = 'media');
create policy "media write" on storage.objects for all
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());
