# App Discotecas — «Tu noche. Tu gente.»

Plataforma social de nightlife para descubrir discotecas, saber quién sale cada noche, conocer personas, hacer matches, crear grupos y organizar planes. Zona de lanzamiento inicial: **Barcelona y alrededores**.

> **Estado**: fase de desarrollo. La web funciona en local con un proyecto Supabase configurado. Algunas integraciones externas (OAuth, SMS, mapas) requieren credenciales propias — ver [Configuración](#configuración) y [Limitaciones conocidas](#limitaciones-conocidas).

---

## Qué incluye esta entrega

| Funcionalidad | Estado |
| --- | --- |
| Web responsive (móvil/tablet/escritorio) con navegación de 5 secciones | ✅ |
| Registro/acceso: Google, Apple y SMS vía Supabase Auth | ✅ (requiere configurar proveedores) |
| Control de edad +18 validado en servidor | ✅ |
| Perfil, preferencias y privacidad (fotos, géneros, visibilidad) | ✅ |
| Locales reales importados de OpenStreetMap (143 en el seed) | ✅ |
| «Esta noche salgo»: plan → confirmación → check-in → cancelación | ✅ |
| Contadores transparentes (confirmados ≠ check-ins, sin aforo inventado) | ✅ |
| Swipe con persistencia real y match mutuo atómico (RPC) | ✅ |
| Chat privado solo tras match, con Realtime y plan B por polling | ✅ |
| Bloqueo y denuncia de usuarios | ✅ |
| Grupos de amigos: crear, invitar, aceptar/rechazar, abandonar | ✅ |
| Panel administrativo protegido (usuarios, denuncias, locales, eventos, auditoría) | ✅ |
| Migraciones SQL versionadas con RLS en todas las tablas | ✅ |
| Pruebas automatizadas (lógica de negocio + componentes) | ✅ 62 pruebas |
| Apps móviles iOS/Android | 📋 Fase 7 (estrategia en [docs/movil.md](docs/movil.md)) |
| Venta de entradas / pagos | ❌ No implementado (sin integración real) |

---

## Arquitectura

Monorepo con **npm workspaces** (proporcional al proyecto, listo para el cliente móvil):

```
app_discotecas/
├── apps/web/                 # Next.js 16 (App Router) + TypeScript estricto + Tailwind v4
│   └── src/
│       ├── app/              # Rutas: landing, login, explorar, personas, matches, chats, perfil, grupos, admin, legal
│       ├── components/       # UI base (ui/) y componentes de producto (app/, admin/, auth/)
│       └── lib/
│           ├── actions/      # Server Actions: toda mutación validada en servidor
│           ├── supabase/     # Clientes browser/server + middleware de sesión
│           └── env.ts        # Variables de entorno validadas con Zod
├── packages/shared/          # Tipos, constantes, schemas Zod y reglas de negocio (web y futuro móvil)
├── supabase/
│   ├── migrations/           # Esquema, funciones SECURITY DEFINER y políticas RLS
│   └── seed/                 # Locales reales de OpenStreetMap (SQL idempotente)
└── scripts/                  # Importación de locales vía Overpass API
```

**Principios**: el frontend oculta botones; la autoridad real de permisos es **RLS + RPCs `SECURITY DEFINER`**. Toda mutación sensible (swipe, asistencia, mensajes, grupos, administración) pasa por funciones server-side que validan `auth.uid()`.

---

## Requisitos previos

- **Node.js ≥ 20.9** (probado con v24) y npm.
- Cuenta gratuita en [supabase.com](https://supabase.com).
- Opcional: Supabase CLI + Docker para base de datos local.
- Opcional: proyecto Google Cloud / Apple Developer para OAuth; proveedor SMS (Twilio) para acceso por teléfono; Mapbox para mapa interactivo.

---

## Instalación

```powershell
git clone <repo-url>
cd app_discotecas
npm install
```

### 1. Configura Supabase

1. Crea un proyecto en el panel de Supabase.
2. Ve a **Project Settings → API** y copia la *Project URL* y la *anon key*.
3. Crea el fichero de entorno local:

```powershell
Copy-Item .env.example apps\web\.env.local
# Edita apps/web/.env.local con tus valores:
#   NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
#   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

4. Aplica las migraciones (opción A, CLI):

```powershell
npm install -g supabase   # una vez
supabase login
supabase link --project-ref TU-PROYECTO
supabase db push          # aplica supabase/migrations/*
```

Opción B (sin CLI): SQL Editor del panel → ejecuta, **en orden**, los ficheros de `supabase/migrations/`:

1. `20261020000100_enums.sql`
2. `20261020000200_tables.sql`
3. `20261020000300_functions.sql`
4. `20261020000400_rls.sql`

5. Importa los locales reales de Barcelona:

```powershell
npm run venues:import     # genera supabase/seed/venues_barcelona.sql desde OpenStreetMap
# Aplica ese fichero en el SQL Editor (es idempotente).
```

Si prefieres regenerar los datos desde cero:

```powershell
node scripts/fetch-overpass.mjs   # descarga desde la Overpass API
npm run venues:import             # genera el SQL con atribución ODbL incluida
```

6. Habilita **Realtime** para la tabla `messages` (Database → Replication) si quieres mensajes en vivo (sin ello, el chat funciona con polling).

### 2. Ejecuta la web

```powershell
npm run dev        # http://localhost:3000
```

Sin `.env.local`, la app arranca y muestra un **estado claro de «configuración pendiente»** en `/login` (no simula autenticación).

---

## Proveedores de autenticación

La autenticación se configura íntegramente en **Supabase → Authentication → Providers**. La variable `NEXT_PUBLIC_AUTH_PROVIDERS` solo controla qué botones muestra la web.

### Google

1. Google Cloud Console → APIs & Services → Credentials → **OAuth client ID (Web)**.
2. Authorized redirect URI: `https://TU-PROYECTO.supabase.co/auth/v1/callback`.
3. Pega Client ID y Secret en Supabase → Providers → Google → Enable.
- Coste: gratuito.

### Apple

1. Requiere cuenta **Apple Developer** (99 USD/año).
2. Supabase → Providers → Apple: genera un *Services ID*, *Team ID*, *Key ID* y sube la `.p8`.
3. En el panel de Apple, añade el redirect URI de Supabase.
- Coste: 99 USD/año (ya necesario para publicar en la App Store en la fase móvil).

### Teléfono (SMS)

1. Supabase → Providers → Phone: conecta un proveedor SMS (Twilio, Vonage, MessageBird…).
2. Twilio: crea account SID + auth token + número comprado y configúralos en Supabase.
- **Coste variable**: Twilio cobra por SMS enviado (≈ 0,04–0,08 EUR/SMS en España según volumen). Activa el *rate limiting* de Supabase.

---

## Proveedor de mapas (opcional)

Sin clave, Explorar funciona con listado, búsqueda y **enlace a OpenStreetMap**. Para mapa interactivo incrustado:

- **Mapbox**: crea un token público y ponlo en `NEXT_PUBLIC_MAPBOX_TOKEN` + `NEXT_PUBLIC_MAP_PROVIDER=mapbox`.
- Alternativa gratuita: Leaflet + OSM (requiere aceptar y mostrar la atribución ODbL).

---

## Comprobaciones y pruebas

```powershell
npm run typecheck    # TypeScript estricto en todos los workspaces
npm run lint         # ESLint (config flat con eslint-config-next)
npm run test         # Vitest: 44 pruebas de dominio + 18 de UI/validación
```

Las pruebas de RLS requieren una base de datos; ejecútalas con `supabase test db` cuando tengas el CLI y Docker (los políticas están en `supabase/migrations/`).

---

## Procedimiento seguro para configurar el primer administrador

No existe ninguna cuenta administrativa predeterminada. Tras registrar tu cuenta normal:

1. En el SQL Editor, ejecuta (sustituye el UUID por el de tu usuario; lo encuentras en Authentication → Users):

```sql
insert into public.admin_roles (user_id, role)
values ('UUID-DE-TU-USUARIO', 'admin')
on conflict (user_id) do update set role = excluded.role;
```

2. Entra de nuevo en la app y visita `/admin`. La acción queda registrada en `admin_audit_logs`.
3. Los admins pueden conceder otros roles desde el panel (`admin_grant_role`).

---

## Despliegue

- **Vercel / Netlify**: conecta el repo; define las mismas variables `NEXT_PUBLIC_*` del `.env.local` en el panel. Node ≥ 20.
- **Supabase en producción**: revisa las políticas RLS antes de exponer el proyecto; la anon key es pública por diseño (RLS la protege).
- Configura el dominio de producción en **Authentication → URL Configuration** de Supabase (Site URL + redirect URLs de `/auth/callback`).

---

## Seguridad y privacidad (resumen)

- RLS activado en **todas** las tablas; sin escritura directa para operaciones sensibles (swipes, asistencia, mensajes, roles).
- `birth_date` no se concede por columna; cada usuario accede a la suya vía `get_my_profile()`.
- Bloqueos y denuncias registrados; las denuncias solo las ven el denunciante y los admins.
- Roles administrativos con auditoría (`admin_audit_logs`).
- Secretos solo en variables de entorno; `.env.local` está en `.gitignore`.
- Eliminación de cuenta propia vía `delete_my_account()` (cascada en el schema).
- Detalle completo: [docs/seguridad-rgpd.md](docs/seguridad-rgpd.md) — **requiere revisión jurídica antes del lanzamiento**.

---

## Limitaciones conocidas

1. **Sin proyecto Supabase configurado**, no hay registro ni datos: la app muestra el estado de configuración pendiente (por diseño; no se simula autenticación).
2. **OAuth y SMS** requieren credenciales propias del propietario (guía arriba). Mientras estén deshabilitados en Supabase, esos botones devuelven un error claro.
3. **Fotos de perfil**: el upload a Supabase Storage no está implementado en esta fase; el campo `photo_path` existe en el modelo. Falta crear el bucket `avatars` y el formulario de subida.
4. **Mapa interactivo**: sin proveedor configurado se usan enlaces externos a OSM.
5. **Grupos**: la invitación requiere conocer el ID del usuario (fase posterior: invitación por enlace o por match).
6. **Datos de asistencia**: son decisiones voluntarias de la comunidad; la app **no** conoce el aforo real de los locales.
7. **Notificaciones push**: no están integradas. La arquitectura del backend las admite (Realtime ya activo).
8. **Verificación de identidad**: existe `user_verifications` pero sin proceso implementado; no se muestra ninguna insignia «verificado» a usuarios.
9. **Eventos**: los administradores pueden crearlos, pero no hay seed de eventos (no se inventan datos).
10. **Textos legales**: política de privacidad y términos son borradores que requieren revisión jurídica profesional.

---

## Datos y licencias

- Establecimientos: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors, licencia **ODbL-1.0**. La procedencia de cada local queda registrada en la tabla `venue_sources`.
- No se usa Google Places: sus condiciones prohíben persistir sus datos en una base propia.

---

## Documentación adicional

- [docs/arquitectura.md](docs/arquitectura.md) — decisiones y plan por fases.
- [docs/supabase.md](docs/supabase.md) — migraciones, RPCs y operativa.
- [docs/seguridad-rgpd.md](docs/seguridad-rgpd.md) — medidas implementadas y pendientes.
- [docs/movil.md](docs/movil.md) — estrategia iOS/Android con Expo.
