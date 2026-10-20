import type { SwipeDecision } from "../constants";

/**
 * Reglas de match mutuo. La ejecución atómica real ocurre en el servidor
 * (RPC `handle_swipe` en Postgres) dentro de una transacción; estas funciones
 * replican la regla para lógica de UI y tests.
 */
export function createsMatch(
  myDecision: SwipeDecision,
  theirDecisionOnMe: SwipeDecision | null,
): boolean {
  return myDecision === "like" && theirDecisionOnMe === "like";
}

/** Ids normalizados y ordenados para claves de unicidad simétricas (A↔B). */
export function matchKey(a: string, b: string): string {
  return [a, b].sort().join(":");
}

/**
 * Regla de visibilidad para el swipe:
 *  - no ver tu propio perfil
 *  - no ver a quien ya decidiste (like/pass)
 *  - no ver a quien te bloqueó ni a quien bloqueaste
 *  - no ver perfiles no descubribles (salvo en contexto de asistencia con
 *    `shareAttendance` activo para esa fecha)
 */
export interface DiscoveryVisibilityInput {
  viewerId: string;
  targetId: string;
  targetDiscoverable: boolean;
  targetSharesAttendanceForThisContext: boolean;
  viewerHasDecided: boolean;
  targetBlockedViewer: boolean;
  viewerBlockedTarget: boolean;
}

export function isTargetVisible(input: DiscoveryVisibilityInput): boolean {
  const {
    viewerId,
    targetId,
    targetDiscoverable,
    targetSharesAttendanceForThisContext,
    viewerHasDecided,
    targetBlockedViewer,
    viewerBlockedTarget,
  } = input;
  if (viewerId === targetId) return false;
  if (viewerHasDecided) return false;
  if (targetBlockedViewer || viewerBlockedTarget) return false;
  return targetDiscoverable || targetSharesAttendanceForThisContext;
}
