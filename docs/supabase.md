# Supabase — migraciones, RPCs y operativa

Referencia técnica del backend: esquema, funciones `SECURITY DEFINER`, políticas RLS y procedimientos de operación.

> Todas las migraciones viven en `supabase/migrations/` y se aplican **en orden** (los prefijos numéricos garantizan el orden).

---

## 1. Aplicar migraciones

**Opción A — Supabase CLI:**

```powershell
npm install -g supabase
supabase login
supabase link --project-ref TU-PROYECTO
supabase db push
```

**Opción B — SQL Editor del panel:** ejecuta en orden:

1. `20261020000100_enums.sql` — tipos de dominio.
2. `20261020000200_tables.sql` — tablas, claves, índices.
3. `20261020000300_functions.sql` — funciones `SECURITY DEFINER` y triggers.
4. `20261020000400_rls.sql` — RLS, políticas y `GRANT`s.

**Seed de locales** (datos reales de Barcelona):

```powershell
npm run venues:import      # genera supabase/seed/venues_barcelona.sql desde OpenStreetMap
# Aplica ese fichero en el SQL Editor (es idempotente).
```

---

## 2. Enums (`*_enums.sql`)

Mantener en sincronía con `packages/shared/src/constants.ts`.

| Enum | Valores |
| --- | --- |
| `music_genre` | electronic, house, techno, trance, drum_and_bass, reggaeton, latin, hip_hop, rnb, pop, rock, indie, funk, disco, afrobeat, salsa, bachata, urbano, otros |
| `discovery_mode` | romantic, social, both |
| `interaction_mode` | romantic, social |
| `swipe_decision` | like, pass |
| `attendance_status` | planned, confirmed, checked_in, cancelled |
| `report_reason` | spam, harassment, inappropriate_content, fake_profile, underage, scam, other |
| `report_status` | open, reviewing, resolved, dismissed |
| `admin_role` | moderator, admin |
| `event_status` | draft, published, cancelled, archived |
| `venue_verification` | unverified, verified, disputed |
| `venue_category` | nightclub, pub, bar, concert_hall, other |
| `invitation_status` | pending, accepted, declined |
| `group_role` | owner, member |
| `verification_method` | document, selfie, manual |
| `verification_status` | pending, approved, rejected |

---

## 3. Tablas (`*_tables.sql`)

Resumen de las tablas y sus invariantes clave:

| Tabla | Notas / invariantes |
| --- | --- |
| `profiles` | 1:1 con `auth.users` (`on delete cascade`). `age` derivado por trigger. |
| `user_preferences` | Rango de edad, distancia, privacidad. `age_min <= age_max`. |
| `profile_photos` | Fotos adicionales con `position` 0–5; `unique (user_id, storage_path)`. |
| `venues` | Locales reales; `osm_id unique`; coordenadas con CHECK de rango. |
| `venue_sources` | Procedencia/licencia de cada local (trazabilidad ODbL). |
| `events` | Borradores y publicados; `ends_at >= starts_at`. |
| `venue_attendance` | **`unique (user_id, venue_id, date)`** — evita doble conteo. |
| `event_attendance` | `unique (user_id, event_id)`. |
| `swipes` | `unique (swiper_id, target_id)`; `check (swiper_id <> target_id)`. |
| `matches` | **`check (user_a < user_b)`** + `unique (user_a, user_b)` — simetría. |
| `conversations` | 1:1 con `matches` (`match_id unique`); se crea por trigger. |
| `conversation_members` | PK `(conversation_id, user_id)`; `last_read_at` para lecturas. |
| `messages` | Longitud 1–2000; escritura solo vía `send_message()`. |
| `friend_groups` | Grupo con `owner_id`. |
| `group_members` | PK `(group_id, user_id)`; rol owner/member. |
| `group_invitations` | `unique (group_id, invitee_id, status)`. |
| `blocks` | `unique (blocker_id, blocked_id)`; sin autbloqueo. |
| `reports` | Denuncia con motivo; nunca pública. |
| `user_verifications` | Proceso de verificación (sin UI en esta fase). |
| `admin_roles` | PK `user_id`; rol moderator/admin. |
| `admin_audit_logs` | Auditoría de acciones administrativas (actor, acción, target, metadata). |

---

## 4. Funciones `SECURITY DEFINER` (`*_functions.sql`)

Todas usan `set search_path = public` y validan `auth.uid()` en el servidor. Son la **única** vía de escritura para las operaciones sensibles.

### Dominio

| Función | Propósito |
| --- | --- |
| `is_admin()` | ¿El usuario actual tiene rol admin? (usada por RLS y RPCs admin). |
| `get_my_profile()` | Devuelve la fila completa del dueño (incluye `birth_date`, que no se concede por columna). |
| `handle_swipe(target, decision, mode, venue?, date?)` | Upsert del swipe + creación atómica de match si hay interés mutuo **y** modo compatible. Devuelve `{matched, match_id}`. |
| `set_venue_attendance(venue, date, status, mode?)` | Máquina de estados de asistencia; valida transiciones. Devuelve `{ok, status}`. |
| `venue_attendance_counters(venue, date)` | Contadores **transparentes**: planned, confirmed (incluye check-ins), checked_in. Sin aforo inventado. |
| `venue_attendees(venue, date, limit)` | Personas que asisten y comparten visibilidad (excluye bloqueados y ya deslizados). |
| `send_message(conversation, body)` | Envía mensaje si eres miembro y no hay bloqueo; actualiza `last_message_at`. |

### Grupos

| Función | Propósito |
| --- | --- |
| `create_friend_group(name, description?)` | Crea grupo y añade al dueño como `owner`. |
| `invite_to_group(group, invitee)` | Invita (solo miembros; respeta bloqueos). |
| `respond_group_invitation(invitation, accept)` | Acepta/rechaza y añade como miembro. |
| `leave_group(group)` | Abandona (el dueño debe transferir/eliminar antes). |

### Seguridad

| Función | Propósito |
| --- | --- |
| `block_user(blocked)` | Bloquea (idempotente). |
| `report_user(reported, reason, details?, venue?)` | Crea denuncia. |

### Administración (requieren `is_admin()`)

| Función | Propósito |
| --- | --- |
| `admin_list_users(limit, offset)` | Lista usuarios. |
| `admin_set_user_suspended(user, suspended, reason?)` | Suspende/reesuspende; audita. |
| `admin_set_venue_verification(venue, state)` | Marca local como verificado/en disputa; audita. |
| `admin_resolve_report(report, status)` | Resuelve denuncia; audita. |
| `admin_upsert_event(...)` | Crea/actualiza evento (no publica directamente); audita. |
| `admin_publish_event(event, publish)` | Publica/despublica; audita. |
| `admin_grant_role(user, role)` | Concede/actualiza rol admin; audita. |

### Cuenta (RGPD)

| Función | Propósito |
| --- | --- |
| `delete_my_account()` | Llama a `auth.delete_user()`; el `on delete cascade` borra todas las relaciones. |

### Triggers

- `set_profile_age` — calcula `age` desde `birth_date` y **bloquea <18** y fechas futuras.
- `on_match_created` — al crear un match, abre la conversación con sus dos miembros.
- `updated_at_trigger` — mantiene `updated_at` en las tablas con marca de actualización.

---

## 5. Row Level Security (`*_rls.sql`)

RLS está activado en **todas** las tablas. Principio: lectura según pertenencia/visibilidad; **escritura sensible solo vía RPC** (sin política `INSERT`/`UPDATE` concedida para esas tablas).

Reglas destacadas:

- **profiles**: lectura salvo bloqueos mutuos; escritura solo `id = auth.uid()`.
- **venues / venue_sources / events(publicados)**: lectura para autenticados; escritura solo desde servidor/service role.
- **swipes**: solo el swiper ve sus propias decisiones (no se revelan likes previos).
- **matches / conversations / messages**: solo participantes.
- **reports**: visibles solo para el denunciante y admins.
- **admin_roles / admin_audit_logs**: solo admins.
- **asistencia / mensajes / roles**: sin escritura directa; solo RPCs.

### GRANTS

- Se **revoca todo** a `anon` (tablas y funciones): los anónimos solo usan Auth.
- `authenticated` recibe `SELECT` acotado y `INSERT`/`UPDATE` **por columna** donde aplica.
- **`birth_date` y `phone` no se conceden** como columna.
- `execute` concedido solo a las RPCs documentadas.

---

## 6. Realtime (chat en vivo)

1. Supabase → **Database → Replication**.
2. Habilita la tabla `messages` (y `conversations` si quieres la lista en vivo).
3. Sin Realtime, el chat degrada a **polling** (plan B ya implementado en `ChatRoom`).

---

## 7. Primer administrador

No existe cuenta admin predeterminada. Tras registrar tu cuenta normal, en el SQL Editor:

```sql
insert into public.admin_roles (user_id, role)
values ('UUID-DE-TU-USUARIO', 'admin')
on conflict (user_id) do update set role = excluded.role;
```

Entra de nuevo y visita `/admin`. Los admins pueden conceder otros roles desde el panel (`admin_grant_role`).

---

## 8. Operación y buenas prácticas

- **Backup**: usa los backups automáticos de Supabase + `supabase db dump` antes de cambios grandes.
- **Entorno**: separa proyectos de desarrollo y producción; revisa las políticas antes de exponer.
- **Anon key**: es pública **por diseño**; la protege RLS. La `service_role` jamás va al cliente ni al repo.
- **Nuevas migraciones**: nunca editar una migración ya aplicada; crear una nueva con prefijo superior.
- **`search_path` fijo**: toda función nueva que toque el esquema debe declarar `set search_path = public`.
- **Tests de RLS**: requieren BD; ejecutar con `supabase test db` (CLI + Docker).
