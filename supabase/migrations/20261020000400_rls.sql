-- ============================================================================
-- 0004 — Row Level Security
-- Principio: el frontend oculta botones; RLS y funciones server-side son la
-- autoridad real. Todas las tablas tienen RLS activado y políticas explícitas.
-- ============================================================================

alter table public.profiles             enable row level security;
alter table public.user_preferences     enable row level security;
alter table public.profile_photos       enable row level security;
alter table public.venues               enable row level security;
alter table public.venue_sources        enable row level security;
alter table public.events               enable row level security;
alter table public.venue_attendance     enable row level security;
alter table public.event_attendance     enable row level security;
alter table public.swipes               enable row level security;
alter table public.matches              enable row level security;
alter table public.conversations        enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages             enable row level security;
alter table public.friend_groups        enable row level security;
alter table public.group_members        enable row level security;
alter table public.group_invitations    enable row level security;
alter table public.blocks               enable row level security;
alter table public.reports              enable row level security;
alter table public.user_verifications   enable row level security;
alter table public.admin_roles          enable row level security;
alter table public.admin_audit_logs     enable row level security;

-- ---------------------------------------------------------------------------
-- PERFILES
-- Lectura: cualquier autenticado puede ver perfiles no bloqueados.
-- `birth_date` no se concede por columna (ver GRANT al final); el dueño usa
-- la función get_my_profile().
-- ---------------------------------------------------------------------------
create policy "profiles_select_visible"
  on public.profiles for select to authenticated
  using (
    not exists (
      select 1 from public.blocks b
      where (b.blocker_id = auth.uid() and b.blocked_id = profiles.id)
         or (b.blocker_id = profiles.id and b.blocked_id = auth.uid())
    )
  );

create policy "profiles_insert_own"
  on public.profiles for insert to authenticated
  with check (id = auth.uid());

create policy "profiles_update_own"
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Eliminación de cuenta: solo el propio usuario (cascade en auth.users).
create policy "profiles_delete_own"
  on public.profiles for delete to authenticated
  using (id = auth.uid());

-- ---------------------------------------------------------------------------
-- PREFERENCIAS Y FOTOS: solo el dueño
-- ---------------------------------------------------------------------------
create policy "preferences_select_own"
  on public.user_preferences for select to authenticated
  using (user_id = auth.uid());
create policy "preferences_insert_own"
  on public.user_preferences for insert to authenticated
  with check (user_id = auth.uid());
create policy "preferences_update_own"
  on public.user_preferences for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "photos_select_own"
  on public.profile_photos for select to authenticated
  using (user_id = auth.uid());
create policy "photos_insert_own"
  on public.profile_photos for insert to authenticated
  with check (user_id = auth.uid());
create policy "photos_update_own"
  on public.profile_photos for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
create policy "photos_delete_own"
  on public.profile_photos for delete to authenticated
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- LOCALES Y FUENTES: lectura pública para autenticados (son locales, no personas)
-- Escritura solo desde servidor/service role (sin política de escritura).
-- ---------------------------------------------------------------------------
create policy "venues_select_authenticated"
  on public.venues for select to authenticated using (true);
create policy "venue_sources_select_authenticated"
  on public.venue_sources for select to authenticated using (true);

-- ---------------------------------------------------------------------------
-- EVENTOS: publicados visibles; borradores solo para admin
-- ---------------------------------------------------------------------------
create policy "events_select"
  on public.events for select to authenticated
  using (
    status = 'published'
    or created_by = auth.uid()
    or public.is_admin()
  );

-- ---------------------------------------------------------------------------
-- ASISTENCIA A LOCALES
-- Escritura exclusivamente vía set_venue_attendance() (SECURITY DEFINER);
-- no hay políticas INSERT/UPDATE/DELETE para authenticated.
-- Lectura: los que comparten asistencia y no están bloqueados.
-- ---------------------------------------------------------------------------
create policy "venue_attendance_select"
  on public.venue_attendance for select to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = venue_attendance.user_id
        and p.share_attendance = true
    )
    and not exists (
      select 1 from public.blocks b
      where (b.blocker_id = auth.uid() and b.blocked_id = venue_attendance.user_id)
         or (b.blocker_id = venue_attendance.user_id and b.blocked_id = auth.uid())
    )
  );

create policy "event_attendance_select"
  on public.event_attendance for select to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = event_attendance.user_id and p.share_attendance = true
    )
  );

-- ---------------------------------------------------------------------------
-- SWIPES: solo el swiper ve sus propias decisiones (no revelar likes previos)
-- ---------------------------------------------------------------------------
create policy "swipes_select_own"
  on public.swipes for select to authenticated
  using (swiper_id = auth.uid());
create policy "swipes_delete_own"
  on public.swipes for delete to authenticated
  using (swiper_id = auth.uid());

-- ---------------------------------------------------------------------------
-- MATCHES / CONVERSACIONES / MENSAJES: solo participantes
-- ---------------------------------------------------------------------------
create policy "matches_select_participant"
  on public.matches for select to authenticated
  using (user_a = auth.uid() or user_b = auth.uid());

create policy "conversations_select_member"
  on public.conversations for select to authenticated
  using (
    exists (
      select 1 from public.conversation_members cm
      where cm.conversation_id = conversations.id and cm.user_id = auth.uid()
    )
  );

create policy "conversation_members_select_own"
  on public.conversation_members for select to authenticated
  using (user_id = auth.uid());

create policy "messages_select_member"
  on public.messages for select to authenticated
  using (
    exists (
      select 1 from public.conversation_members cm
      where cm.conversation_id = messages.conversation_id and cm.user_id = auth.uid()
    )
  );
-- Escritura de mensajes solo vía send_message() (SECURITY DEFINER).

create policy "conversation_members_update_own"
  on public.conversation_members for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- GRUPOS
-- ---------------------------------------------------------------------------
create policy "groups_select_member"
  on public.friend_groups for select to authenticated
  using (
    owner_id = auth.uid()
    or exists (
      select 1 from public.group_members gm
      where gm.group_id = friend_groups.id and gm.user_id = auth.uid()
    )
  );
-- Crear/invitar/abandonar: funciones create_friend_group/invite_to_group/leave_group.

create policy "group_members_select_member"
  on public.group_members for select to authenticated
  using (
    exists (
      select 1 from public.group_members gm
      where gm.group_id = group_members.group_id and gm.user_id = auth.uid()
    )
  );

create policy "group_invitations_select_involved"
  on public.group_invitations for select to authenticated
  using (invitee_id = auth.uid() or inviter_id = auth.uid());

-- ---------------------------------------------------------------------------
-- BLOQUEOS: cada usuario ve/gestiona solo los suyos
-- ---------------------------------------------------------------------------
create policy "blocks_select_own"
  on public.blocks for select to authenticated
  using (blocker_id = auth.uid());
create policy "blocks_delete_own"
  on public.blocks for delete to authenticated
  using (blocker_id = auth.uid());

-- ---------------------------------------------------------------------------
-- DENUNCIAS: visibles solo para el denunciante y administradores.
-- Nunca públicas.
-- ---------------------------------------------------------------------------
create policy "reports_select_reporter_or_admin"
  on public.reports for select to authenticated
  using (reporter_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------------
-- VERIFICACIONES: el propio usuario ve su estado; decide un admin.
-- ---------------------------------------------------------------------------
create policy "verifications_select_own_or_admin"
  on public.user_verifications for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------------
-- ADMINISTRACIÓN: solo admins (y solo lectura directa; escritura vía RPC)
-- ---------------------------------------------------------------------------
create policy "admin_roles_select_admin"
  on public.admin_roles for select to authenticated
  using (public.is_admin());

create policy "admin_audit_select_admin"
  on public.admin_audit_logs for select to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- GRANTS: exponer solo lo necesario. `birth_date` y `phone` NO se conceden.
-- ---------------------------------------------------------------------------
revoke all on all tables in schema public from anon;
grant select on table public.profiles to authenticated;
-- El usuario crea y edita SOLO su propia fila (las policies refuerzan id = auth.uid()).
grant insert (id, display_name, birth_date, bio, interests, music_favorites,
              languages, discovery_mode, city, photo_path)
  on table public.profiles to authenticated;
grant update (display_name, bio, interests, music_favorites, languages,
              discovery_mode, city, photo_path, share_attendance)
  on table public.profiles to authenticated;
revoke delete on table public.profiles from authenticated;

grant insert (user_id, age_min, age_max, max_distance_km, genres,
              discoverable, share_attendance, show_age, show_city)
  on table public.user_preferences to authenticated;
grant update on table public.user_preferences to authenticated;
grant insert (user_id, storage_path, position) on table public.profile_photos to authenticated;

grant select on table public.venues to authenticated;
grant select on table public.venue_sources to authenticated;
grant select on table public.events to authenticated;
grant select on table public.venue_attendance to authenticated;
grant select on table public.event_attendance to authenticated;
grant select on table public.swipes to authenticated;
grant select on table public.matches to authenticated;
grant select on table public.conversations to authenticated;
grant select on table public.conversation_members to authenticated;
grant update (last_read_at) on table public.conversation_members to authenticated;
grant select on table public.messages to authenticated;
grant select on table public.friend_groups to authenticated;
grant select on table public.group_members to authenticated;
grant select on table public.group_invitations to authenticated;
grant select on table public.blocks to authenticated;
grant select on table public.reports to authenticated;
grant select on table public.user_verifications to authenticated;
grant select on table public.admin_roles to authenticated;
grant select on table public.admin_audit_logs to authenticated;

-- Permisos de ejecución de las funciones server-side.
grant execute on function public.get_my_profile() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.handle_swipe(uuid, public.swipe_decision, public.interaction_mode, uuid, date) to authenticated;
grant execute on function public.set_venue_attendance(uuid, date, public.attendance_status, public.interaction_mode) to authenticated;
grant execute on function public.venue_attendance_counters(uuid, date) to authenticated;
grant execute on function public.venue_attendees(uuid, date, integer) to authenticated;
grant execute on function public.send_message(uuid, text) to authenticated;
grant execute on function public.create_friend_group(text, text) to authenticated;
grant execute on function public.invite_to_group(uuid, uuid) to authenticated;
grant execute on function public.respond_group_invitation(uuid, boolean) to authenticated;
grant execute on function public.leave_group(uuid) to authenticated;
grant execute on function public.block_user(uuid) to authenticated;
grant execute on function public.report_user(uuid, public.report_reason, text, uuid) to authenticated;
grant execute on function public.delete_my_account() to authenticated;
grant execute on function public.admin_list_users(integer, integer) to authenticated;
grant execute on function public.admin_set_user_suspended(uuid, boolean, text) to authenticated;
grant execute on function public.admin_set_venue_verification(uuid, public.venue_verification) to authenticated;
grant execute on function public.admin_resolve_report(uuid, public.report_status) to authenticated;
grant execute on function public.admin_upsert_event(uuid, uuid, text, text, timestamptz, timestamptz, public.event_status, public.music_genre[]) to authenticated;
grant execute on function public.admin_publish_event(uuid, boolean) to authenticated;
grant execute on function public.admin_grant_role(uuid, public.admin_role) to authenticated;

-- Anónimos: ninguna tabla (solo Auth).
revoke all on all tables in schema public from anon;
revoke all on all functions in schema public from anon;
