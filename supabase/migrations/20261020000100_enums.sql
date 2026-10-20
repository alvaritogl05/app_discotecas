-- ============================================================================
-- 0001 — Enums y tipos de dominio
-- App Discotecas · Postgres (Supabase)
-- Mantener en sincronía con packages/shared/src/constants.ts
-- ============================================================================

create type public.music_genre as enum (
  'electronic','house','techno','trance','drum_and_bass','reggaeton','latin',
  'hip_hop','rnb','pop','rock','indie','funk','disco','afrobeat','salsa',
  'bachata','urbano','otros'
);

create type public.discovery_mode as enum ('romantic','social','both');
create type public.interaction_mode as enum ('romantic','social');
create type public.swipe_decision as enum ('like','pass');
create type public.attendance_status as enum ('planned','confirmed','checked_in','cancelled');

create type public.report_reason as enum (
  'spam','harassment','inappropriate_content','fake_profile','underage','scam','other'
);
create type public.report_status as enum ('open','reviewing','resolved','dismissed');

create type public.admin_role as enum ('moderator','admin');
create type public.event_status as enum ('draft','published','cancelled','archived');
create type public.venue_verification as enum ('unverified','verified','disputed');
create type public.venue_category as enum ('nightclub','pub','bar','concert_hall','other');
create type public.invitation_status as enum ('pending','accepted','declined');
create type public.group_role as enum ('owner','member');
create type public.verification_method as enum ('document','selfie','manual');
create type public.verification_status as enum ('pending','approved','rejected');
