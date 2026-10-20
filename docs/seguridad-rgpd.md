# Seguridad y RGPD

Medidas de seguridad y privacidad implementadas en App Discotecas, y las que quedan pendientes.

> ⚠️ **Este documento y los textos legales de la app son borradores técnicos. Requieren revisión por un profesional del derecho antes de cualquier lanzamiento real.** No constituyen asesoramiento legal.

---

## 1. Principio rector

El frontend **sugiere**, la base de datos **decide**. Los botones se ocultan según permisos para mejorar la UX, pero la autoridad real es **RLS + funciones `SECURITY DEFINER`** que validan `auth.uid()` en el servidor. Ninguna regla depende de que el cliente se comporte bien.

---

## 2. Medidas implementadas

### 2.1 Autorización (RLS)

- **RLS activado en todas las tablas** (21 tablas). Detalle en [supabase.md](supabase.md).
- **Escritura sensible solo vía RPC**: swipes, asistencia, mensajes, roles y administración no tienen `INSERT`/`UPDATE` concedido a `authenticated`; pasan por funciones que validan al usuario.
- **`anon` no accede a ninguna tabla ni función** (solo Auth). La anon key es pública por diseño; la protege RLS.
- **Bloqueos respetados** en perfiles, asistencia, swipe y envío de mensajes (en ambos sentidos).

### 2.2 Datos personales

- **Edad +18 validada en servidor**: el trigger `set_profile_age` recalcula `age` desde `birth_date` y rechaza menores y fechas futuras. La validación de cliente es solo cosmética.
- **`birth_date` no se concede por columna**: no aparece en los `GRANT`; cada usuario accede únicamente a la suya vía `get_my_profile()`. **Nunca se publica la fecha de nacimiento completa**; la UI muestra solo la edad.
- **Privacidad de asistencia**: `share_attendance` (por usuario) controla quién ve su presencia; los contadores son agregados y anónimos.
- **Denuncias**: visibles solo para el denunciante y los admins; nunca públicas.

### 2.3 Validación de entrada

- **Zod en servidor (Server Actions) y en cliente**: payloads validados en ambos extremos (`packages/shared/src/schemas.ts`).
- **CHECKs en BD**: longitudes, rangos numéricos, unicidad e invariantes (p. ej. `user_a < user_b` en matches).
- **Búsqueda y listados acotados** (`limit` con techo) para evitar abusos de enumeración.

### 2.4 Secretos y configuración

- **Secretos solo en variables de entorno**; `.env.local` está en `.gitignore`.
- `lib/env.ts` valida las variables con Zod al arrancar (fallo temprano y explícito).
- **Sin configuración Supabase, la app no simula autenticación**: muestra un estado claro de «configuración pendiente».

### 2.5 Cuentas y consentimiento

- **Registro restringido a mayores de edad** con validación server-side.
- **Eliminación de cuenta propia** (derecho al olvido) vía `delete_my_account()` → `auth.delete_user()` con `on delete cascade` sobre todas las relaciones.
- **Bloqueo y denuncia** accesibles desde la interfaz (`block_user`, `report_user`).

### 2.6 Administración

- **Roles (`admin_roles`) con auditoría** (`admin_audit_logs`: actor, acción, objetivo, metadata, timestamp).
- **Panel `/admin` protegido**: doble comprobación (redirect en `proxy`/capa de UI + `is_admin()` en cada RPC admin).
- **Sin cuenta admin predeterminada**; el bootstrap es un paso manual documentado.
- **No se puede un admin suspender a sí mismo** desde el panel.

### 2.7 Transporte y dependencias

- Supabase fuerza **HTTPS** en su API.
- Dependencias con lockfile y auditoría periódica (`npm audit`).

---

## 3. Pendientes / no implementados (bloqueantes para lanzamiento)

Estos puntos **deben** resolverse antes de tratar datos reales de usuarios:

1. **Revisión jurídica profesional** de la política de privacidad y los términos (hoy son borradores en `/legal/privacidad` y `/legal/terminos`).
2. **Texto legal real**: política de cookies, base legal por tratamiento (consentimiento / interés legítimo), plazos de conservación y ejercicio de derechos (ARCOPL) publicados y funcionales.
3. **Banner de cookies / gestión de consentimiento** (obligatorio en la UE).
4. **Proceso de verificación de identidad**: existe `user_verifications` pero sin flujo; no se muestra ninguna insignia «verificado».
5. **Subida de fotos a Storage**: no implementada; hay que crear el bucket `avatars` con políticas de acceso y políticas de tamaño/tipo.
6. **Rate limiting en endpoints sensibles** (además del que ofrece Supabase Auth): SMS, swipe y mensajes.
7. **Notificaciones push**: no integradas (implican gestionar tokens y consentimiento).
8. **Registro/DPO y contacto de privacidad** operativo.
9. **Tests automatizados de RLS** ejecutándose en CI con BD efímera.
10. **Revisión de dependencias y de superficie de exposición** antes de producción.

---

## 4. Resumen de exposición actual

| Área | Estado |
| --- | --- |
| Autorización en BD (RLS + RPC) | ✅ Fuerte |
| Validación edad +18 en servidor | ✅ |
| Protección de `birth_date` | ✅ |
| Bloqueos y denuncias | ✅ |
| Auditoría administrativa | ✅ |
| Gestión de consentimiento y textos legales | ❌ Pendiente (revisión jurídica) |
| Subida/almacenamiento de fotos | ❌ Pendiente |
| Verificación de identidad | ❌ Pendiente |
| Notificaciones push | ❌ Pendiente |

---

## 5. Cómo verificar la seguridad (para revisores)

```powershell
npm run typecheck    # TypeScript estricto
npm run lint         # ESLint
npm run test         # Lógica de dominio + componentes
supabase test db     # Tests de RLS (requiere CLI + Docker)
```

Revisar especialmente `supabase/migrations/20261020000400_rls.sql` (políticas y GRANTS) y `20261020000300_functions.sql` (todas las funciones declaran `security definer` con `search_path` fijo y validan `auth.uid()`).
