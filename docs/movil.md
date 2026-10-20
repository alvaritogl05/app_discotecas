# Estrategia móvil (iOS / Android)

App Discotecas es **web-first**. Esta fase 7 describe cómo llevar el producto a iOS y Android **reutilizando el máximo de código**, sin reescribir la lógica de negocio ni el backend.

> Estado: 📋 **planificado, no implementado**. El backend (Supabase) y `packages/shared` ya están preparados para ello.

---

## 1. Por qué un monorepo ya preparado

- **`packages/shared`** contiene toda la lógica de dominio (tipos, constantes, schemas Zod, reglas de edad/asistencia/matching/distancia) **agnóstica al runtime**. Tanto la web como la app móvil la importan: una sola fuente de verdad.
- **Supabase** es el mismo backend: Auth (Google/Apple/SMS), Postgres + RLS, Storage y Realtime funcionan igual desde un cliente nativo.
- **Las RPCs `SECURITY DEFINER`** no cambian: la app móvil llama a `handle_swipe`, `set_venue_attendance`, `send_message`, etc., igual que la web. La seguridad vive en la BD, no en el cliente.

Resultado: la app móvil es fundamentalmente una **nueva capa de presentación** sobre el mismo núcleo.

---

## 2. Recomendación de stack: Expo (React Native)

**Expo** es la vía más rápida y mantenible para este caso:

| Aspecto | Detalle |
| --- | --- |
| Framework | **React Native + Expo (SDK actual)** |
| Lenguaje | TypeScript estricto (compartido) |
| Navegación | `expo-router` (paradigma App Router, misma estructura mental que Next) |
| Estado/data | TanStack Query o React Query para caché + llamadas Supabase |
| Auth nativa | `expo-auth-session` para Google/Apple nativos; SMS igual que web vía Supabase |
| Push | `expo-notifications` + Supabase (Realtime ya habilitado) |
| Build | **EAS Build** para firmar y publicar en App Store / Google Play |

Por qué Expo sobre RN «crudo»: gestiona firmas, builds en la nube, actualizaciones over-the-air, notificaciones y permisos sin mantener dos proyectos nativos (Xcode/Android Studio) a mano.

---

## 3. Estructura propuesta del monorepo

```
app_discotecas/
├── apps/
│   ├── web/          # Next.js (existente)
│   └── mobile/       # Expo (nuevo)
├── packages/
│   └── shared/       # Lógica de dominio compartida (existente)
├── supabase/         # Backend compartido (existente)
└── scripts/
```

Se añade `apps/mobile` como workspace de npm. `packages/shared` no se toca.

---

## 4. Qué se reutiliza y qué se cambia

| Capa | Reutilizable | Cambio necesario |
| --- | --- | --- |
| Lógica de dominio (`shared`) | ✅ Todo | Ninguno |
| Backend Supabase + RLS + RPCs | ✅ Todo | Configurar redirect URLs / deep links para móvil |
| Schemas Zod y validación | ✅ Todo | Ninguno |
| Componentes React | ❌ Parcial | Reescribir con componentes nativos (no HTML/Tailwind DOM) |
| Navegación | ❌ | `expo-router` en lugar de App Router |
| Estilos | ❌ | Las **decisiones de diseño** (tema oscuro neón, tokens de color) se trasladan; la implementación Tailwind-DOM se sustituye por nativo ( StyleSheet / NativeWind) |
| Chat Realtime | ✅ Lógica | Suscripción Supabase Realtime funciona igual |

---

## 5. Autenticación en móvil

- **Google / Apple**: en móvil se usa la **autenticación nativa** (`expo-auth-session`) y se intercambia el token por una sesión de Supabase (`signInWithIdToken`). Apple **requiere** integración nativa para Apps Store (ya se tiene la cuenta Apple Developer del punto OAuth web).
- **SMS**: idéntico a web (Supabase → proveedor Twilio), solo cambia la UI.
- **Deep links**: configurar `auth/v1/callback` y los redirect URLs en Supabase para el esquema de la app (`exp://…` en dev, custom scheme en producción).

---

## 6. Notificaciones push (habilitadas por el backend)

- `expo-notifications` obtiene el token de dispositivo.
- Guardarlo en una tabla (p. ej. `push_subscriptions`) y disparar desde **Supabase Edge Functions** (o un proveedor) cuando ocurre un evento relevante: **nuevo match**, **mensaje nuevo**, **alguien confirma asistencia a tu local**, **respuesta de invitación a grupo**.
- Respetar consentimiento y preferencias del usuario; dar de baja el token al logout.

---

## 7. Publicación (EAS)

1. **EAS Build** para generar binarios firmados (`.ipa` iOS / `.aab` Android).
2. **App Store Connect** (iOS) y **Google Play Console** (Android): fichas, privacidad, permisos (cámara, fotos, notificaciones, ubicación).
3. **Requisitos de las tiendas**: política de privacidad publicada (ver [seguridad-rgpd.md](seguridad-rgpd.md)), clasificación por edad (+18), justificación de permisos.
4. **EAS Update** para correcciones over-the-air menores.

> Publicar en la App Store exige la cuenta **Apple Developer (99 USD/año)** ya contemplada en el README. Ambas tiendas cobran comisión por transacción si en el futuro se venden entradas.

---

## 8. Ubicación (fase móvil)

- La web hoy usa **enlaces externos a OpenStreetMap** sin mapa interactivo.
- En móvil se puede añadir el mapa nativo (`react-native-maps`) con la **posición aproximada** del usuario, pidiendo permiso explícito y ofreciendo alternativa sin ubicación. La distancia ya se calcula con `shared/distance.ts` (haversine).

---

## 9. Orden de implementación sugerido

1. **Configurar `apps/mobile`** con Expo + expo-router + TypeScript estricto; enlazar `packages/shared`.
2. **Supabase client móvil** + autenticación (SMS primero, luego Google/Apple nativos).
3. **Perfil y Explorar** (lectura, búsqueda, detalle de local).
4. **Asistencia** («esta noche salgo») reutilizando `set_venue_attendance`.
5. **Personas + swipe + matches + chat** (Realtime).
6. **Grupos + bloqueos/denuncias**.
7. **Push + mapa nativo**.
8. **EAS Build + publicación** (tras resolver la revisión jurídica y textos legales).

---

## 10. Riesgos / decisiones abiertas

- **NativeWind vs StyleSheet**: NativeWind permite reusar clases Tailwind, pero añade complejidad; valorar según el equipo.
- **Geolocalización**: pedir «ubicación aproximada» mejora la privacidad frente a la exacta; decisión de producto/legal.
- **Apple OAuth**: obligatorio nativo para publicar; el flujo web no sirve para la App Store.
- **Costes**: Apple Developer 99 USD/año + comisión de tienda; EAS tiene plan gratuito con límites y planes de pago para builds ilimitados.
