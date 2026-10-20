-- ============================================================================
-- 0002 — Tablas
-- Relaciones, claves, unicidad e índices para las consultas habituales.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Perfiles (1:1 con auth.users)
-- `birth_date` NO se concede en lectura a `authenticated`; cada dueño accede
-- a su fila completa mediante la función security definer `get_my_profile()`.
-- ---------------------------------------------------------------------------
create table public.profiles (
  id                uuid primary key references auth.users (id) on delete cascade,
  display_name      text not null check (char_length(display_name) between 2 and 40),
  birth_date        date not null check (birth_date <= current_date),
  age               integer not null check (age between 18 and 120),
  bio               text check (bio is null or char_length(bio) <= 500),
  interests         text[] not null default '{}',
  music_favorites   public.music_genre[] not null default '{}',
  languages         text[] not null default '{}',
  discovery_mode    public.discovery_mode not null default 'both',
  city              text,
  -- Ruta de la foto principal en Storage (bucket 'avatars').
  photo_path        text,
  verified          boolean not null default false,
  share_attendance  boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint interests_len check (array_length(interests, 1) is null or array_length(interests, 1) <= 10),
  constraint music_favorites_len check (array_length(music_favorites, 1) is null or array_length(music_favorites, 1) <= 6),
  constraint languages_len check (array_length(languages, 1) is null or array_length(languages, 1) <= 6)
);

create index profiles_discoverable_idx on public.profiles (discovery_mode, city) where share_attendance;
create index profiles_age_idx on public.profiles (age);

-- Preferencias de descubrimiento y privacidad
create table public.user_preferences (
  user_id           uuid primary key references public.profiles (id) on delete cascade,
  age_min           integer not null default 18 check (age_min between 18 and 99),
  age_max           integer not null default 60 check (age_max between 18 and 99),
  max_distance_km   integer not null default 25 check (max_distance_km between 1 and 200),
  genres            public.music_genre[] not null default '{}',
  discoverable      boolean not null default true,
  share_attendance  boolean not null default true,
  show_age          boolean not null default true,
  show_city         boolean not null default true,
  constraint age_range_ok check (age_min <= age_max)
);

-- Fotos adicionales del perfil (orden explícito)
create table public.profile_photos (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  storage_path text not null,
  position    smallint not null default 0 check (position between 0 and 5),
  created_at  timestamptz not null default now(),
  unique (user_id, storage_path)
);
create index profile_photos_user_idx on public.profile_photos (user_id, position);

-- ---------------------------------------------------------------------------
-- Establecimientos (datos propios, importados de fuentes verificables)
-- ---------------------------------------------------------------------------
create table public.venues (
  id             uuid primary key default gen_random_uuid(),
  osm_id         text unique,
  name           text not null,
  address        text,
  latitude       double precision not null check (latitude between -90 and 90),
  longitude      double precision not null check (longitude between -180 and 180),
  city           text not null default 'Barcelona',
  zone           text,
  category       public.venue_category not null default 'nightclub',
  music_genres   public.music_genre[] not null default '{}',
  website_url    text,
  instagram_url  text,
  phone          text,
  opening_hours  text,
  verification   public.venue_verification not null default 'unverified',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index venues_city_idx on public.venues (lower(city));
create index venues_name_idx on public.venues (lower(name));
create index venues_coords_idx on public.venues (latitude, longitude);

-- Procedencia de los datos de cada local (trazabilidad/licencias)
create table public.venue_sources (
  id           uuid primary key default gen_random_uuid(),
  venue_id     uuid not null references public.venues (id) on delete cascade,
  source_name  text not null,
  source_url   text,
  license      text not null,
  imported_at  timestamptz not null default now(),
  raw_tags     jsonb
);
create index venue_sources_venue_idx on public.venue_sources (venue_id);

-- ---------------------------------------------------------------------------
-- Eventos (creados y publicados por administradores)
-- ---------------------------------------------------------------------------
create table public.events (
  id           uuid primary key default gen_random_uuid(),
  venue_id     uuid not null references public.venues (id) on delete cascade,
  title        text not null check (char_length(title) between 3 and 120),
  description  text check (description is null or char_length(description) <= 2000),
  starts_at    timestamptz not null,
  ends_at      timestamptz,
  status       public.event_status not null default 'draft',
  music_genres public.music_genre[] not null default '{}',
  created_by   uuid references public.profiles (id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint event_dates_ok check (ends_at is null or ends_at >= starts_at)
);
create index events_venue_status_idx on public.events (venue_id, status);
create index events_starts_idx on public.events (starts_at) where status = 'published';

-- ---------------------------------------------------------------------------
-- Asistencia ("Esta noche salgo"): unicidad (usuario, local, fecha)
-- ---------------------------------------------------------------------------
create table public.venue_attendance (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  venue_id   uuid not null references public.venues (id) on delete cascade,
  date       date not null check (date >= current_date - interval '1 day'),
  status     public.attendance_status not null default 'planned',
  mode       public.interaction_mode,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Impide contar dos veces a la misma persona para el mismo local y fecha.
  unique (user_id, venue_id, date)
);
create index venue_attendance_lookup_idx on public.venue_attendance (venue_id, date, status);
create index venue_attendance_user_idx on public.venue_attendance (user_id, date);

create table public.event_attendance (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  event_id   uuid not null references public.events (id) on delete cascade,
  status     public.attendance_status not null default 'planned',
  mode       public.interaction_mode,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, event_id)
);
create index event_attendance_event_idx on public.event_attendance (event_id, status);

-- ---------------------------------------------------------------------------
-- Swipe y matches
-- ---------------------------------------------------------------------------
create table public.swipes (
  id         uuid primary key default gen_random_uuid(),
  swiper_id  uuid not null references public.profiles (id) on delete cascade,
  target_id  uuid not null references public.profiles (id) on delete cascade,
  decision   public.swipe_decision not null,
  mode       public.interaction_mode not null,
  venue_id   uuid references public.venues (id) on delete cascade,
  date       date,
  created_at timestamptz not null default now(),
  unique (swiper_id, target_id),
  constraint no_self_swipe check (swiper_id <> target_id)
);
create index swipes_target_idx on public.swipes (target_id, decision);

create table public.matches (
  id         uuid primary key default gen_random_uuid(),
  -- Invariante simétrica: el menor id va primero (evita matches duplicados A↔B).
  user_a     uuid not null references public.profiles (id) on delete cascade,
  user_b     uuid not null references public.profiles (id) on delete cascade,
  context    text not null default 'general' check (context in ('general','venue')),
  venue_id   uuid references public.venues (id) on delete cascade,
  date       date,
  created_at timestamptz not null default now(),
  constraint match_order check (user_a < user_b),
  constraint no_self_match check (user_a <> user_b),
  unique (user_a, user_b)
);
create index matches_user_a_idx on public.matches (user_a, created_at desc);
create index matches_user_b_idx on public.matches (user_b, created_at desc);

-- ---------------------------------------------------------------------------
-- Conversaciones y mensajes (chat privado tras match mutuo)
-- ---------------------------------------------------------------------------
create table public.conversations (
  id              uuid primary key default gen_random_uuid(),
  match_id        uuid unique not null references public.matches (id) on delete cascade,
  last_message_at timestamptz,
  created_at      timestamptz not null default now()
);

create table public.conversation_members (
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  user_id         uuid not null references public.profiles (id) on delete cascade,
  joined_at       timestamptz not null default now(),
  last_read_at    timestamptz,
  primary key (conversation_id, user_id)
);
create index conversation_members_user_idx on public.conversation_members (user_id);

create table public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id       uuid not null references public.profiles (id) on delete cascade,
  body            text not null check (char_length(body) between 1 and 2000),
  created_at      timestamptz not null default now(),
  read_at         timestamptz,
  constraint no_self_message check (sender_id is not null)
);
create index messages_conversation_idx on public.messages (conversation_id, created_at desc);
create index messages_sender_idx on public.messages (sender_id);

-- ---------------------------------------------------------------------------
-- Grupos de amigos
-- ---------------------------------------------------------------------------
create table public.friend_groups (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references public.profiles (id) on delete cascade,
  name        text not null check (char_length(name) between 2 and 60),
  description text check (description is null or char_length(description) <= 300),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index friend_groups_owner_idx on public.friend_groups (owner_id);

create table public.group_members (
  group_id  uuid not null references public.friend_groups (id) on delete cascade,
  user_id   uuid not null references public.profiles (id) on delete cascade,
  role      public.group_role not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);
create index group_members_user_idx on public.group_members (user_id);

create table public.group_invitations (
  id         uuid primary key default gen_random_uuid(),
  group_id   uuid not null references public.friend_groups (id) on delete cascade,
  inviter_id uuid not null references public.profiles (id) on delete cascade,
  invitee_id uuid not null references public.profiles (id) on delete cascade,
  status     public.invitation_status not null default 'pending',
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  constraint no_self_invite check (inviter_id <> invitee_id),
  -- Solo una invitación pendiente por (grupo, invitado).
  unique (group_id, invitee_id, status)
);
create index group_invitations_invitee_idx on public.group_invitations (invitee_id, status);

-- ---------------------------------------------------------------------------
-- Bloqueos y denuncias (herramientas de seguridad)
-- ---------------------------------------------------------------------------
create table public.blocks (
  id         uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references public.profiles (id) on delete cascade,
  blocked_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint no_self_block check (blocker_id <> blocked_id),
  unique (blocker_id, blocked_id)
);
create index blocks_blocked_idx on public.blocks (blocked_id);

create table public.reports (
  id          uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  reported_id uuid not null references public.profiles (id) on delete cascade,
  venue_id    uuid references public.venues (id) on delete set null,
  reason      public.report_reason not null,
  details     text check (details is null or char_length(details) <= 1000),
  status      public.report_status not null default 'open',
  created_at  timestamptz not null default now(),
  resolved_by uuid references public.profiles (id) on delete set null,
  resolved_at timestamptz,
  constraint no_self_report check (reporter_id <> reported_id)
);
create index reports_status_idx on public.reports (status, created_at desc);
create index reports_reported_idx on public.reports (reported_id);

-- ---------------------------------------------------------------------------
-- Verificaciones y administración
-- ---------------------------------------------------------------------------
create table public.user_verifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  method     public.verification_method not null,
  status     public.verification_status not null default 'pending',
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by uuid references public.profiles (id) on delete set null
);
create index user_verifications_user_idx on public.user_verifications (user_id, status);

create table public.admin_roles (
  user_id    uuid primary key references public.profiles (id) on delete cascade,
  role       public.admin_role not null,
  granted_by uuid references public.profiles (id) on delete set null,
  granted_at timestamptz not null default now()
);

create table public.admin_audit_logs (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid references public.profiles (id) on delete set null,
  action      text not null,
  target_type text not null,
  target_id   text,
  metadata    jsonb not null default '{}',
  created_at  timestamptz not null default now()
);
create index admin_audit_logs_actor_idx on public.admin_audit_logs (actor_id, created_at desc);
create index admin_audit_logs_created_idx on public.admin_audit_logs (created_at desc);
