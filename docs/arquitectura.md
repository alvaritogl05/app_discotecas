# Arquitectura

Visión técnica de **App Discotecas**: cómo está construido, por qué y hacia dónde va.

> Documento vivo. Refleja el estado de la entrega actual (fases 0–6; móvil = fase 7).

---

## 1. Visión general

App Discotecas es una plataforma social de nightlife: descubrir discotecas, declarar «esta noche salgo», hacer swipe, empatar (match), chatear, crear grupos y moderar. La zona de lanzamiento inicial es **Barcelona y alrededores**.

**Filosofía de seguridad**: el frontend *sugiere* (oculta botones que el usuario no debería pulsar), pero **la autoridad real es la base de datos**. Toda mutación sensible pasa por funciones PostgreSQL `SECURITY DEFINER` que validan `auth.uid()` en el servidor, protegidas por RLS. Ni siquiera con la anon key (pública por diseño) un cliente puede saltarse estas reglas.

```
┌─────────────┐   Server Actions (Zod)   ┌──────────────────┐   RPC SECURITY DEFINER   ┌────────────┐
│  Next.js UI │ ───────────────────────► │  Supabase JS/SSR │ ───────────────────────► │  Postgres  │
│  (browser)  │ ◄─────────────────────── │   (anon key)     │ ◄─────────────────────── │  RLS+RPCs  │
└─────────────┘      lectura RLS         └──────────────────┘      auth.uid()          └────────────┘
```

---

## 2. Stack

| Capa | Elección | Motivo |
| --- | --- | --- |
| Framework | **Next.js 16** (App Router, Turbopack) | Server Components + Server Actions = mutaciones validadas en servidor sin API routes aparte. |
| Lenguaje | **TypeScript estricto** | `strict: true` en todos los workspaces; tipos compartidos entre web y futuro móvil. |
| Estilos | **Tailwind CSS v4** | Tokens de tema vía CSS; utilidades atómicas, sin framework de componentes pesado. |
| Backend | **Supabase** (Postgres, Auth, Storage, Realtime) | RLS integrada, Auth con Google/Apple/SMS out-of-the-box, Realtime para chat. |
| Validación | **Zod 4** | Schemas compartidos en `packages/shared`; misma validación en cliente y servidor. |
| Pruebas | **Vitest 5** | Rápido, nativo ESM/TS, mismo runner para lógica de dominio y componentes. |
| Paquetes | **npm workspaces** | Monorepo ligero, proporcional al tamaño del proyecto. |

---

## 3. Monorepo

```
app_discotecas/
├── apps/web/                 # Next.js 16 (App Router)
│   └── src/
│       ├── app/              # Rutas (landing, login, explorar, personas, matches, chats, perfil, grupos, admin, legal)
│       ├── components/       # ui/ (base), app/ (producto), admin/, auth/
│       ├── lib/
│       │   ├── actions/      # Server Actions: toda mutación validada en servidor
│       │   ├── supabase/     # Clientes browser/server + proxy de sesión
│       │   └── env.ts        # Variables de entorno validadas con Zod
│       └── proxy.ts          # Guard de rutas + refresh de sesión (antes middleware)
├── packages/shared/          # Tipos, constantes, schemas Zod y reglas de negocio
├── supabase/
│   ├── migrations/           # Esquema, funciones SECURITY DEFINER y políticas RLS
│   └── seed/                 # Locales reales de OpenStreetMap (SQL idempotente)
└── scripts/                  # Importación de locales vía Overpass API
```

### `packages/shared`

Lógica de dominio agnóstica al runtime (sin React ni Next), reutilizable por la app móvil:

- `constants.ts` — géneros musicales, modos, estados, límites (en sincronía con los enums de Postgres).
- `types.ts` — interfaces del dominio (`Venue`, `Profile`, `Match`, `AttendanceStatus`…).
- `age.ts` — cálculo y validación de edad (+18).
- `attendance.ts` — máquina de estados de asistencia y transiciones permitidas.
- `matching.ts` — reglas de compatibilidad de modos para match.
- `distance.ts` — fórmula haversine para distancias.
- `schemas.ts` — schemas Zod de formularios y payloads.

Mantener `constants.ts` sincronizado con `supabase/migrations/*_enums.sql` es responsabilidad manual (documentado en ambos archivos).

---

## 4. Modelo de datos (resumen)

Entidades principales y sus invariantes (detalle en [supabase.md](supabase.md)):

- **profiles** 1:1 con `auth.users`. `birth_date` genera `age` por trigger; **+18 validado en servidor**. `birth_date` no se concede por columna.
- **venues** — locales reales importados de OpenStreetMap; procedencia trazada en `venue_sources` (licencia ODbL).
- **venue_attendance** — «esta noche salgo»; `unique (user_id, venue_id, date)` evita doble conteo.
- **swipes / matches** — swipe con `unique (swiper_id, target_id)`; match simétrico garantizado con `user_a < user_b`. El match crea su `conversations` por trigger.
- **messages** — chat privado, escritura solo vía `send_message()`.
- **friend_groups / group_members / group_invitations** — grupos de amigos.
- **blocks / reports** — herramientas de seguridad; denuncias visibles solo para denunciante y admins.
- **admin_roles / admin_audit_logs** — administración protegida con auditoría.

---

## 5. Flujo de una mutación (ejemplo: swipe)

1. **Cliente** (`SwipeDeck`) llama a la Server Action `handleSwipeAction` de `lib/actions/social.ts`.
2. La action crea un cliente Supabase *server-side*, obtiene el usuario (`getUser()`) y valida el payload con Zod (`swipeSchema`).
3. Ejecuta la RPC `handle_swipe(...)` (`SECURITY DEFINER`).
4. En Postgres, `handle_swipe` valida `auth.uid()`, que no hay bloqueo, que el objetivo es visible, guarda el swipe (upsert) y, si hay interés mutuo **y compatibilidad de modo**, crea el `match` (con `user_a < user_b`).
5. El trigger `on_match_created` abre la `conversación` con los dos miembros.
6. Devuelve `{ matched, match_id }`; la UI muestra el modal de match si aplica.

El cliente nunca toca `swipes`/`matches` directamente: no hay `INSERT` concedido para `authenticated`.

---

## 6. Gestión de sesión y entorno

- **`src/proxy.ts`** (convención Next 16, antes `middleware`) refresca la sesión de Supabase en cada request y redirige: rutas protegidas sin sesión → `/login`; usuarios en `/login` → `/explorar`. Sin Supabase configurado, las rutas protegidas redirigen a `/login?reason=not-configured`.
- **`lib/env.ts`** valida las variables de entorno con Zod al arrancar. Falta de configuración → estado explícito de «configuración pendiente» (nunca autenticación simulada).

---

## 7. Decisiones técnicas destacadas

- **Server Actions sobre API routes**: menos superficie de ataque, validación Zod compartida y tipado de extremo a extremo.
- **RPCs `SECURITY DEFINER` con `search_path` fijo**: toda lógica sensible vive en la BD, inmune a manipulación del cliente.
- **`birth_date` no concedido por columna**: se lee únicamente vía `get_my_profile()`; nunca se publica la fecha completa.
- **Datos reales de locales**: OpenStreetMap/ODbL en lugar de Google Places, cuyas condiciones prohíben persistir sus datos en base propia.
- **Contadores transparentes**: confirmados y check-ins por separado; la app **no** conoce el aforo real y no lo inventa.
- **Chat con Realtime + plan B por polling**: funciona en vivo si Realtime está habilitado; si no, hace polling.

---

## 8. Plan por fases

| Fase | Contenido | Estado |
| --- | --- | --- |
| 0 | Monorepo, tooling, tema, tipado compartido | ✅ |
| 1 | Esquema + migraciones + RLS + RPCs | ✅ |
| 2 | Auth (Google, Apple, SMS) + perfil + edad +18 | ✅ (providers requieren credenciales) |
| 3 | Explorar locales + detalle + asistencia | ✅ (143 locales reales en seed) |
| 4 | Personas + swipe + matches + chat | ✅ |
| 5 | Grupos + bloqueos + denuncias | ✅ |
| 6 | Panel administrativo + auditoría | ✅ |
| 7 | Apps móviles iOS/Android (Expo) | 📋 (estrategia en [movil.md](movil.md)) |

Pendientes transversales: subida de fotos a Storage, mapa interactivo (Mapbox), notificaciones push, verificación de identidad, pasarela de pagos. Detalle en el README («Limitaciones conocidas»).
