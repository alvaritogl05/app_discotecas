-- ============================================================================
-- 0003 — Funciones y triggers
-- Toda mutación sensible pasa por funciones SECURITY DEFINER con search_path
-- fijo, validando al usuario autenticado (auth.uid()) en el servidor.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Utilidades
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_roles r where r.user_id = auth.uid()
  );
$$;

create or replace function public.updated_at_trigger()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Edad derivada de la fecha de nacimiento (+18 obligatorio en servidor)
-- ---------------------------------------------------------------------------
create or replace function public.set_profile_age()
returns trigger
language plpgsql
as $$
declare
  computed_age integer;
begin
  if new.birth_date > current_date then
    raise exception 'La fecha de nacimiento no puede estar en el futuro';
  end if;

  computed_age := extract(year from age(new.birth_date))::integer;

  if computed_age < 18 then
    raise exception 'Debes ser mayor de 18 años para usar App Discotecas';
  end if;

  new.age := computed_age;
  return new;
end;
$$;

create trigger profiles_set_age
  before insert or update of birth_date on public.profiles
  for each row execute function public.set_profile_age();

-- ---------------------------------------------------------------------------
-- Perfil del dueño (incluye birth_date, que no se concede por columna)
-- ---------------------------------------------------------------------------
create or replace function public.get_my_profile()
returns setof public.profiles
language sql
security definer
set search_path = public
stable
as $$
  select * from public.profiles where id = auth.uid();
$$;

-- ---------------------------------------------------------------------------
-- Swipe + creación atómica de match mutuo
-- Devuelve jsonb: { matched: bool, match_id: uuid|null }
-- ---------------------------------------------------------------------------
create or replace function public.handle_swipe(
  p_target_id uuid,
  p_decision public.swipe_decision,
  p_mode public.interaction_mode,
  p_venue_id uuid default null,
  p_date date default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  v_target record;
  v_their_decision public.swipe_decision;
  v_match_id uuid;
  v_user_a uuid;
  v_user_b uuid;
begin
  if v_me is null then
    raise exception 'No autenticado';
  end if;
  if v_me = p_target_id then
    raise exception 'No puedes deslizar sobre tu propio perfil';
  end if;
  if p_decision not in ('like','pass') then
    raise exception 'Decisión no válida';
  end if;

  -- El objetivo debe ser visible: no bloqueos en ningún sentido.
  if exists (
    select 1 from public.blocks b
    where (b.blocker_id = v_me and b.blocked_id = p_target_id)
       or (b.blocker_id = p_target_id and b.blocked_id = v_me)
  ) then
    raise exception 'No disponible';
  end if;

  select p.id, p.discovery_mode, p.share_attendance
    into v_target
    from public.profiles p
   where p.id = p_target_id;
  if not found then
    raise exception 'Perfil no disponible';
  end if;

  -- Guardar/actualizar decisión (upsert: re-swipe permitido p.ej. nuevo contexto)
  insert into public.swipes (swiper_id, target_id, decision, mode, venue_id, date)
  values (v_me, p_target_id, p_decision, p_mode, p_venue_id, p_date)
  on conflict (swiper_id, target_id)
  do update set decision = excluded.decision,
                mode = excluded.mode,
                venue_id = excluded.venue_id,
                date = excluded.date,
                created_at = now();

  if p_decision <> 'like' then
    return jsonb_build_object('matched', false, 'match_id', null);
  end if;

  -- ¿Existe ya interés mutuo?
  select s.decision into v_their_decision
    from public.swipes s
   where s.swiper_id = p_target_id and s.target_id = v_me;
  if not found or v_their_decision <> 'like' then
    return jsonb_build_object('matched', false, 'match_id', null);
  end if;

  -- Compatibilidad de modos: el match requiere interés del mismo tipo.
  -- Regla: al menos un modo en común ("romantic" o "social").
  if not exists (
    select 1
      from public.swipes s1
      join public.swipes s2
        on s2.swiper_id = s1.target_id and s2.target_id = s1.swiper_id
     where s1.swiper_id = v_me and s1.target_id = p_target_id
       and s1.mode = s2.mode
  ) then
    return jsonb_build_object('matched', false, 'match_id', null);
  end if;

  if v_me < p_target_id then
    v_user_a := v_me; v_user_b := p_target_id;
  else
    v_user_a := p_target_id; v_user_b := v_me;
  end if;

  insert into public.matches (user_a, user_b, context, venue_id, date)
  values (v_user_a, v_user_b,
          case when p_venue_id is not null then 'venue' else 'general' end,
          p_venue_id, p_date)
  on conflict (user_a, user_b) do nothing
  returning id into v_match_id;

  if v_match_id is null then
    select m.id into v_match_id from public.matches m
     where m.user_a = v_user_a and m.user_b = v_user_b;
  end if;

  return jsonb_build_object('matched', true, 'match_id', v_match_id);
end;
$$;

-- Al crear un match se abre su conversación con los dos miembros.
create or replace function public.on_match_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_conversation_id uuid;
begin
  insert into public.conversations (match_id)
  values (new.id)
  returning id into v_conversation_id;

  insert into public.conversation_members (conversation_id, user_id)
  values (v_conversation_id, new.user_a),
         (v_conversation_id, new.user_b);

  return new;
end;
$$;

create trigger matches_create_conversation
  after insert on public.matches
  for each row execute function public.on_match_created();

-- ---------------------------------------------------------------------------
-- Asistencia a locales ("Esta noche salgo")
-- ---------------------------------------------------------------------------
create or replace function public.set_venue_attendance(
  p_venue_id uuid,
  p_date date,
  p_status public.attendance_status,
  p_mode public.interaction_mode default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  v_existing public.attendance_status;
  v_id uuid;
begin
  if v_me is null then
    raise exception 'No autenticado';
  end if;
  if p_date < current_date or p_date > current_date + interval '30 days' then
    raise exception 'Fecha fuera del rango permitido (hoy..+30 días)';
  end if;
  if p_status not in ('planned','confirmed','checked_in','cancelled') then
    raise exception 'Estado de asistencia no válido';
  end if;

  if not exists (select 1 from public.venues v where v.id = p_venue_id) then
    raise exception 'Local no encontrado';
  end if;

  select va.status into v_existing
    from public.venue_attendance va
   where va.user_id = v_me and va.venue_id = p_venue_id and va.date = p_date;

  if not found then
    if p_status in ('planned','confirmed') then
      insert into public.venue_attendance (user_id, venue_id, date, status, mode)
      values (v_me, p_venue_id, p_date, p_status, p_mode)
      returning id into v_id;
      return jsonb_build_object('ok', true, 'status', p_status);
    end if;
    raise exception 'Una asistencia nueva solo puede iniciarse como planned o confirmed';
  end if;

  if v_existing = p_status then
    return jsonb_build_object('ok', true, 'status', p_status);
  end if;

  -- Transiciones permitidas (máquina de estados del dominio).
  if not (
       (v_existing in ('planned','confirmed','cancelled') and p_status in ('planned','confirmed','cancelled'))
    or (v_existing = 'confirmed' and p_status = 'checked_in')
    or (v_existing = 'planned' and p_status = 'checked_in')
  ) then
    raise exception 'Transición de estado no permitida: % -> %', v_existing, p_status;
  end if;

  update public.venue_attendance
     set status = p_status,
         mode = coalesce(p_mode, mode)
   where user_id = v_me and venue_id = p_venue_id and date = p_date;

  return jsonb_build_object('ok', true, 'status', p_status);
end;
$$;

-- Contadores transparentes: confirmados y check-ins por separado.
-- La información es agregada y anónima; no se expone quién asiste.
create or replace function public.venue_attendance_counters(
  p_venue_id uuid,
  p_date date
)
returns jsonb
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  v_planned integer;
  v_confirmed integer;
  v_checked integer;
begin
  if auth.uid() is null then
    raise exception 'No autenticado';
  end if;

  select
    count(*) filter (where status = 'planned'),
    count(*) filter (where status = 'confirmed'),
    count(*) filter (where status = 'checked_in')
  into v_planned, v_confirmed, v_checked
  from public.venue_attendance
  where venue_id = p_venue_id
    and date = p_date
    and status <> 'cancelled';

  return jsonb_build_object(
    'planned', v_planned,
    -- "confirmados" incluye a quienes ya hicieron check-in (asistieron).
    'confirmed', v_confirmed + v_checked,
    'checked_in', v_checked
  );
end;
$$;

-- Personas que asisten y han decidido compartirlo, para el swipe contextual.
create or replace function public.venue_attendees(
  p_venue_id uuid,
  p_date date,
  p_limit integer default 50
)
returns table (
  user_id uuid,
  display_name text,
  photo_path text,
  age integer,
  status public.attendance_status,
  mode public.interaction_mode
)
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  v_me uuid := auth.uid();
begin
  if v_me is null then
    raise exception 'No autenticado';
  end if;

  return query
  select va.user_id, p.display_name, p.photo_path, p.age, va.status, va.mode
    from public.venue_attendance va
    join public.profiles p on p.id = va.user_id
   where va.venue_id = p_venue_id
     and va.date = p_date
     and va.status <> 'cancelled'
     and p.share_attendance
     and p.id <> v_me
     and not exists (
       select 1 from public.blocks b
        where (b.blocker_id = v_me and b.blocked_id = p.id)
           or (b.blocker_id = p.id and b.blocked_id = v_me)
     )
     and not exists (
       select 1 from public.swipes s
        where s.swiper_id = v_me and s.target_id = p.id
     )
   order by va.updated_at desc
   limit least(p_limit, 100);
end;
$$;

-- ---------------------------------------------------------------------------
-- Mensajería
-- ---------------------------------------------------------------------------
create or replace function public.send_message(
  p_conversation_id uuid,
  p_body text
)
returns public.messages
language plpgsql
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  v_member boolean;
  v_blocked boolean;
  v_message public.messages;
begin
  if v_me is null then
    raise exception 'No autenticado';
  end if;
  if char_length(trim(p_body)) < 1 or char_length(p_body) > 2000 then
    raise exception 'Longitud de mensaje no válida';
  end if;

  select exists (
    select 1 from public.conversation_members cm
     where cm.conversation_id = p_conversation_id and cm.user_id = v_me
  ) into v_member;
  if not v_member then
    raise exception 'No eres participante de esta conversación';
  end if;

  -- No enviar mensajes a quien bloqueó o fue bloqueado.
  select exists (
    select 1
      from public.conversation_members cm
      join public.matches m on m.id = (
        select c.match_id from public.conversations c where c.id = p_conversation_id
      )
     where cm.conversation_id = p_conversation_id
       and cm.user_id <> v_me
       and exists (
         select 1 from public.blocks b
          where (b.blocker_id = v_me and b.blocked_id = cm.user_id)
             or (b.blocker_id = cm.user_id and b.blocked_id = v_me)
       )
  ) into v_blocked;
  if v_blocked then
    raise exception 'No puedes enviar mensajes en esta conversación';
  end if;

  insert into public.messages (conversation_id, sender_id, body)
  values (p_conversation_id, v_me, trim(p_body))
  returning * into v_message;

  update public.conversations
     set last_message_at = v_message.created_at
   where id = p_conversation_id;

  return v_message;
end;
$$;

-- ---------------------------------------------------------------------------
-- Grupos de amigos
-- ---------------------------------------------------------------------------
create or replace function public.create_friend_group(
  p_name text,
  p_description text default null
)
returns public.friend_groups
language plpgsql
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  v_group public.friend_groups;
begin
  if v_me is null then
    raise exception 'No autenticado';
  end if;
  if char_length(p_name) < 2 or char_length(p_name) > 60 then
    raise exception 'Nombre de grupo no válido';
  end if;

  insert into public.friend_groups (owner_id, name, description)
  values (v_me, p_name, nullif(p_description, ''))
  returning * into v_group;

  insert into public.group_members (group_id, user_id, role)
  values (v_group.id, v_me, 'owner');

  return v_group;
end;
$$;

create or replace function public.invite_to_group(
  p_group_id uuid,
  p_invitee_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  v_invitation_id uuid;
begin
  if v_me is null then
    raise exception 'No autenticado';
  end if;
  if not exists (
    select 1 from public.group_members gm
     where gm.group_id = p_group_id and gm.user_id = v_me
  ) then
    raise exception 'Solo los miembros del grupo pueden invitar';
  end if;
  if exists (
    select 1 from public.blocks b
     where (b.blocker_id = p_invitee_id and b.blocked_id = v_me)
  ) then
    raise exception 'No se puede invitar a este usuario';
  end if;

  insert into public.group_invitations (group_id, inviter_id, invitee_id)
  values (p_group_id, v_me, p_invitee_id)
  on conflict (group_id, invitee_id, status) do nothing
  returning id into v_invitation_id;

  return v_invitation_id;
end;
$$;

create or replace function public.respond_group_invitation(
  p_invitation_id uuid,
  p_accept boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  inv record;
begin
  if v_me is null then
    raise exception 'No autenticado';
  end if;

  select * into inv from public.group_invitations i where i.id = p_invitation_id;
  if not found or inv.invitee_id <> v_me then
    raise exception 'Invitación no encontrada';
  end if;
  if inv.status <> 'pending' then
    raise exception 'La invitación ya fue respondida';
  end if;

  update public.group_invitations
     set status = case when p_accept then 'accepted' else 'declined' end,
         responded_at = now()
   where id = p_invitation_id;

  if p_accept then
    insert into public.group_members (group_id, user_id, role)
    values (inv.group_id, v_me, 'member')
    on conflict do nothing;
  end if;

  return jsonb_build_object('ok', true, 'accepted', p_accept);
end;
$$;

create or replace function public.leave_group(p_group_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  v_owner uuid;
begin
  if v_me is null then
    raise exception 'No autenticado';
  end if;

  select owner_id into v_owner from public.friend_groups where id = p_group_id;
  if not found then
    raise exception 'Grupo no encontrado';
  end if;
  if v_owner = v_me then
    raise exception 'El propietario debe transferir o eliminar el grupo antes de abandonarlo';
  end if;

  delete from public.group_members where group_id = p_group_id and user_id = v_me;
  return jsonb_build_object('ok', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- Bloqueos y denuncias
-- ---------------------------------------------------------------------------
create or replace function public.block_user(p_blocked_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
begin
  if v_me is null then
    raise exception 'No autenticado';
  end if;
  if v_me = p_blocked_id then
    raise exception 'No puedes bloquearte a ti mismo';
  end if;

  insert into public.blocks (blocker_id, blocked_id)
  values (v_me, p_blocked_id)
  on conflict do nothing;

  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.report_user(
  p_reported_id uuid,
  p_reason public.report_reason,
  p_details text default null,
  p_venue_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  v_id uuid;
begin
  if v_me is null then
    raise exception 'No autenticado';
  end if;
  if v_me = p_reported_id then
    raise exception 'No puedes denunciarte a ti mismo';
  end if;

  insert into public.reports (reporter_id, reported_id, reason, details, venue_id)
  values (v_me, p_reported_id, p_reason, nullif(p_details, ''), p_venue_id)
  returning id into v_id;

  return v_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- Administración (solo para roles concedidos de forma segura)
-- ---------------------------------------------------------------------------
create or replace function public.admin_list_users(
  p_limit integer default 50,
  p_offset integer default 0
)
returns table (
  id uuid,
  display_name text,
  age integer,
  city text,
  verified boolean,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
stable
as $$
begin
  if not public.is_admin() then
    raise exception 'Acceso denegado';
  end if;
  return query
  select p.id, p.display_name, p.age, p.city, p.verified, p.created_at
    from public.profiles p
   order by p.created_at desc
   limit least(p_limit, 100) offset p_offset;
end;
$$;

create or replace function public.admin_set_user_suspended(
  p_user_id uuid,
  p_suspended boolean,
  p_reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
begin
  if not public.is_admin() then
    raise exception 'Acceso denegado';
  end if;
  if p_user_id = v_me then
    raise exception 'No puedes suspender tu propia cuenta desde el panel';
  end if;

  update public.profiles
     set share_attendance = false,
         discovery_mode = 'social'
   where id = p_user_id;

  insert into public.admin_audit_logs (actor_id, action, target_type, target_id, metadata)
  values (v_me, case when p_suspended then 'suspend_user' else 'unsuspend_user' end,
          'profile', p_user_id::text,
          jsonb_build_object('reason', p_reason));

  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.admin_set_venue_verification(
  p_venue_id uuid,
  p_state public.venue_verification
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
begin
  if not public.is_admin() then
    raise exception 'Acceso denegado';
  end if;

  update public.venues set verification = p_state where id = p_venue_id;
  insert into public.admin_audit_logs (actor_id, action, target_type, target_id, metadata)
  values (v_me, 'set_venue_verification', 'venue', p_venue_id::text,
          jsonb_build_object('state', p_state));

  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.admin_resolve_report(
  p_report_id uuid,
  p_status public.report_status
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
begin
  if not public.is_admin() then
    raise exception 'Acceso denegado';
  end if;
  if p_status not in ('open','reviewing','resolved','dismissed') then
    raise exception 'Estado no válido';
  end if;

  update public.reports
     set status = p_status,
         resolved_by = v_me,
         resolved_at = now()
   where id = p_report_id;

  insert into public.admin_audit_logs (actor_id, action, target_type, target_id, metadata)
  values (v_me, 'resolve_report', 'report', p_report_id::text,
          jsonb_build_object('status', p_status));

  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.admin_upsert_event(
  p_event_id uuid,
  p_venue_id uuid,
  p_title text,
  p_description text,
  p_starts_at timestamptz,
  p_ends_at timestamptz,
  p_status public.event_status,
  p_music_genres public.music_genre[] default '{}'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  v_id uuid;
begin
  if not public.is_admin() then
    raise exception 'Acceso denegado';
  end if;
  if p_status = 'published' then
    raise exception 'Usa admin_publish_event para publicar';
  end if;

  if p_event_id is null then
    insert into public.events (venue_id, title, description, starts_at, ends_at, status, music_genres, created_by)
    values (p_venue_id, p_title, p_description, p_starts_at, p_ends_at, p_status, p_music_genres, v_me)
    returning id into v_id;
  else
    update public.events
       set venue_id = p_venue_id,
           title = p_title,
           description = p_description,
           starts_at = p_starts_at,
           ends_at = p_ends_at,
           status = p_status,
           music_genres = p_music_genres
     where id = p_event_id
    returning id into v_id;
  end if;

  insert into public.admin_audit_logs (actor_id, action, target_type, target_id, metadata)
  values (v_me, 'upsert_event', 'event', v_id::text, jsonb_build_object('status', p_status));

  return v_id;
end;
$$;

create or replace function public.admin_publish_event(p_event_id uuid, p_publish boolean)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
begin
  if not public.is_admin() then
    raise exception 'Acceso denegado';
  end if;

  update public.events
     set status = case when p_publish then 'published' else 'draft' end
   where id = p_event_id;

  insert into public.admin_audit_logs (actor_id, action, target_type, target_id, metadata)
  values (v_me, case when p_publish then 'publish_event' else 'unpublish_event' end,
          'event', p_event_id::text, '{}');

  return jsonb_build_object('ok', true);
end;
$$;

-- Conceder/quitar roles (solo admins; el bootstrap inicial se documenta en README)
create or replace function public.admin_grant_role(
  p_user_id uuid,
  p_role public.admin_role
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
begin
  if not public.is_admin() then
    raise exception 'Acceso denegado';
  end if;

  insert into public.admin_roles (user_id, role, granted_by)
  values (p_user_id, p_role, v_me)
  on conflict (user_id) do update set role = excluded.role;

  insert into public.admin_audit_logs (actor_id, action, target_type, target_id, metadata)
  values (v_me, 'grant_role', 'admin_role', p_user_id::text, jsonb_build_object('role', p_role));

  return jsonb_build_object('ok', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- Eliminación de cuenta del propio usuario (RGPD / derecho al olvido)
-- ---------------------------------------------------------------------------
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
begin
  if v_me is null then
    raise exception 'No autenticado';
  end if;
  -- auth.delete_user() elimina la fila de auth.users; el cascade borra
  -- profiles y todas las relaciones del usuario.
  perform auth.delete_user();
end;
$$;

-- ---------------------------------------------------------------------------
-- Triggers de updated_at
-- ---------------------------------------------------------------------------
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.updated_at_trigger();

create trigger venues_updated_at
  before update on public.venues
  for each row execute function public.updated_at_trigger();

create trigger events_updated_at
  before update on public.events
  for each row execute function public.updated_at_trigger();

create trigger venue_attendance_updated_at
  before update on public.venue_attendance
  for each row execute function public.updated_at_trigger();

create trigger event_attendance_updated_at
  before update on public.event_attendance
  for each row execute function public.updated_at_trigger();

create trigger friend_groups_updated_at
  before update on public.friend_groups
  for each row execute function public.updated_at_trigger();
