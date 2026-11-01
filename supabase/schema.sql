-- =====================================================================
-- PRESTIGE MOTORS — struktura e databazës (Supabase / PostgreSQL)
-- Ekzekutoje të gjithë këtë skedar një herë te Supabase → SQL Editor → Run
-- =====================================================================

-- ---------- Administratorët ----------
-- Vetëm përdoruesit që janë në këtë tabelë mund të ndryshojnë të dhënat.
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------- Makinat ----------
create table if not exists public.cars (
  id            uuid primary key default gen_random_uuid(),
  brand         text not null,
  model         text not null,
  version       text,
  year          int  not null check (year between 1950 and 2100),
  price         int  not null check (price >= 0),
  old_price     int  check (old_price is null or old_price >= 0),  -- çmimi para uljes (oferta)
  on_offer      boolean generated always as (old_price is not null and old_price > price) stored,
  fuel          text not null default 'Naftë',
  transmission  text not null default 'Manuale',
  mileage       int  check (mileage is null or mileage >= 0),       -- km
  engine_cc     int,                                                -- cilindrata
  power_hp      int,                                                -- fuqia (kuaj fuqi)
  drive         text,                                               -- 2WD / 4WD / AWD
  body_type     text,                                               -- SUV, Sedan...
  color         text,
  doors         int,
  seats         int,
  condition     text,                                               -- gjendja teknike
  location      text,
  vin           text,                                               -- shfaqet publikisht VETËM nëse admini e zgjedh
  features      text[] not null default '{}',                        -- opsionet
  description   text,
  images        text[] not null default '{}',                        -- URL-të e fotove, sipas radhës
  video_url     text,
  status        text not null default 'active' check (status in ('active', 'reserved', 'sold')),
  featured      boolean not null default false,
  published     boolean not null default true,
  sold_at       timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists cars_public_idx on public.cars (published, status, created_at desc);
create index if not exists cars_brand_idx on public.cars (brand);

-- VIN-i i plotë ruhet këtu, i dukshëm vetëm për adminin
create table if not exists public.car_private (
  car_id uuid primary key references public.cars (id) on delete cascade,
  vin    text,
  notes  text            -- shënime të brendshme (blerja, kosto etj.)
);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  if new.status = 'sold' and (old.status is distinct from 'sold') then
    new.sold_at = now();
  end if;
  return new;
end;
$$;

drop trigger if exists cars_touch on public.cars;
create trigger cars_touch before update on public.cars
for each row execute function public.touch_updated_at();

-- ---------- Kërkesat e klientëve ----------
create table if not exists public.inquiries (
  id          uuid primary key default gen_random_uuid(),
  car_id      uuid references public.cars (id) on delete set null,
  name        text not null check (char_length(name) between 1 and 120),
  phone       text check (phone is null or char_length(phone) <= 40),
  email       text check (email is null or char_length(email) <= 200),
  message     text check (message is null or char_length(message) <= 3000),
  handled     boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ---------- Cilësimet e faqes (një rresht i vetëm) ----------
create table if not exists public.settings (
  id          int primary key default 1 check (id = 1),
  site_name   text not null default 'PRESTIGE MOTORS',
  tagline     text default 'European Brands | Global Luxury — Koleksion ekskluziv i automjeteve premium.',
  phone       text default '+355 69 444 8881',
  whatsapp    text default '355694448881',
  email       text,
  address     text default 'Tiranë, Shqipëri',
  hours       text default 'E hënë – E shtunë, 09:00 – 19:00',
  about       text default 'Prestige Motors Albania sjell në Tiranë një koleksion ekskluziv automjetesh premium nga markat më të njohura europiane. Çdo automjet përzgjidhet dhe kontrollohet me kujdes para se të ofrohet.',
  logo_url    text,
  facebook    text,
  instagram   text default 'https://instagram.com/prestige.motors.al',
  map_url     text,
  updated_at  timestamptz not null default now()
);
insert into public.settings (id) values (1) on conflict (id) do nothing;

-- =====================================================================
-- SIGURIA (Row Level Security)
-- Publiku: lexon vetëm makinat e publikuara dhe cilësimet; mund të dërgojë kërkesë.
-- Admini: gjithçka.
-- =====================================================================
alter table public.admins      enable row level security;
alter table public.cars        enable row level security;
alter table public.car_private enable row level security;
alter table public.inquiries   enable row level security;
alter table public.settings    enable row level security;

-- admins
drop policy if exists "admin sheh adminët" on public.admins;
create policy "admin sheh adminët" on public.admins
  for select to authenticated using (user_id = auth.uid() or public.is_admin());

-- cars
drop policy if exists "publiku lexon makinat e publikuara" on public.cars;
create policy "publiku lexon makinat e publikuara" on public.cars
  for select to anon, authenticated using (published = true or public.is_admin());

drop policy if exists "admini shton makina" on public.cars;
create policy "admini shton makina" on public.cars
  for insert to authenticated with check (public.is_admin());

drop policy if exists "admini ndryshon makina" on public.cars;
create policy "admini ndryshon makina" on public.cars
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admini fshin makina" on public.cars;
create policy "admini fshin makina" on public.cars
  for delete to authenticated using (public.is_admin());

-- car_private
drop policy if exists "vetëm admini" on public.car_private;
create policy "vetëm admini" on public.car_private
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- inquiries
drop policy if exists "kushdo dërgon kërkesë" on public.inquiries;
create policy "kushdo dërgon kërkesë" on public.inquiries
  for insert to anon, authenticated with check (handled = false);

drop policy if exists "admini lexon kërkesat" on public.inquiries;
create policy "admini lexon kërkesat" on public.inquiries
  for select to authenticated using (public.is_admin());

drop policy if exists "admini ndryshon kërkesat" on public.inquiries;
create policy "admini ndryshon kërkesat" on public.inquiries
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admini fshin kërkesat" on public.inquiries;
create policy "admini fshin kërkesat" on public.inquiries
  for delete to authenticated using (public.is_admin());

-- settings
drop policy if exists "publiku lexon cilësimet" on public.settings;
create policy "publiku lexon cilësimet" on public.settings
  for select to anon, authenticated using (true);

drop policy if exists "admini ndryshon cilësimet" on public.settings;
create policy "admini ndryshon cilësimet" on public.settings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- FOTOGRAFITË (Supabase Storage)
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('car-images', 'car-images', true)
on conflict (id) do update set public = true;

drop policy if exists "admini ngarkon foto" on storage.objects;
create policy "admini ngarkon foto" on storage.objects
  for insert to authenticated with check (bucket_id = 'car-images' and public.is_admin());

drop policy if exists "admini ndryshon foto" on storage.objects;
create policy "admini ndryshon foto" on storage.objects
  for update to authenticated using (bucket_id = 'car-images' and public.is_admin());

drop policy if exists "admini fshin foto" on storage.objects;
create policy "admini fshin foto" on storage.objects
  for delete to authenticated using (bucket_id = 'car-images' and public.is_admin());

-- =====================================================================
-- HAPI I FUNDIT: bëje veten admin
-- 1) Supabase → Authentication → Users → Add user (email + fjalëkalim)
-- 2) Ndrysho email-in më poshtë dhe ekzekuto vetëm këtë rresht:
--
-- insert into public.admins (user_id)
-- select id from auth.users where email = 'emaili-yt@gmail.com';
-- =====================================================================
