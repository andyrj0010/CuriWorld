create extension if not exists pgcrypto;
create table if not exists articles (
 id uuid primary key default gen_random_uuid(), slug text unique not null, title text not null,
 excerpt text not null, category text not null, language text not null default 'es',
 body jsonb not null, sources jsonb not null default '[]'::jsonb, image_url text,
 image_credit text, video_id text, status text not null default 'draft' check(status in ('draft','published','archived')),
 created_at timestamptz not null default now(), published_at timestamptz
);
create index if not exists articles_status_date on articles(status,published_at desc);
create index if not exists articles_category on articles(category);

alter table articles enable row level security;
create policy "public published articles" on articles for select using (status='published');
-- El service role del servidor puede insertar/actualizar. Nunca expongas SUPABASE_SERVICE_ROLE_KEY al navegador.
