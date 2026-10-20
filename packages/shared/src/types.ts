import type {
  AdminRole,
  AttendanceStatus,
  DiscoveryMode,
  EventStatus,
  InteractionMode,
  MusicGenre,
  ReportReason,
  ReportStatus,
  SwipeDecision,
  VenueCategory,
  VenueVerificationState,
} from "./constants";

/** Perfil público mínimo expuesto en descubrimiento/chats. */
export interface PublicProfile {
  id: string;
  displayName: string;
  /** Edad calculada; nunca se publica la fecha de nacimiento completa. */
  age: number;
  bio: string | null;
  interests: string[];
  musicFavorites: MusicGenre[];
  languages: string[];
  discoveryMode: DiscoveryMode;
  /** Nombre del primer recurso de foto (ruta en Storage) o null. */
  photoUrl: string | null;
  /** Zona general (ciudad), nunca coordenadas exactas. */
  city: string | null;
}

/** Perfil privado: datos propios del usuario. */
export interface OwnProfile extends PublicProfile {
  birthDate: string;
  verified: boolean;
  createdAt: string;
}

export interface ProfilePreferences {
  /** Rango de edad buscado [min, max]. */
  ageMin: number;
  ageMax: number;
  /** Radio de búsqueda en km. */
  maxDistanceKm: number;
  genres: MusicGenre[];
  /** Mostrar el perfil en el descubrimiento general. */
  discoverable: boolean;
  /** Mostrar asistencia a locales en el descubrimiento de esa noche. */
  shareAttendance: boolean;
  showAge: boolean;
  showCity: boolean;
}

export interface Venue {
  id: string;
  name: string;
  address: string | null;
  /** Coordenadas del LOCAL (públicas, es un establecimiento comercial). */
  latitude: number;
  longitude: number;
  city: string;
  zone: string | null;
  category: VenueCategory;
  musicGenres: MusicGenre[];
  websiteUrl: string | null;
  instagramUrl: string | null;
  verification: VenueVerificationState;
  dataSource: string;
  sourceUpdatedAt: string;
}

export interface VenueAttendanceCounters {
  venueId: string;
  date: string;
  planned: number;
  confirmed: number;
  checkedIn: number;
}

export interface VenueAttendanceEntry {
  userId: string;
  displayName: string;
  photoUrl: string | null;
  age: number;
  status: AttendanceStatus;
  mode: InteractionMode | null;
}

export interface SwipeRecord {
  swiperId: string;
  targetId: string;
  decision: SwipeDecision;
  mode: InteractionMode;
}

export interface Match {
  id: string;
  userA: string;
  userB: string;
  createdAt: string;
  /** Cómo se originó el match. */
  context: "general" | "venue";
  venueId: string | null;
  date: string | null;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
  readAt: string | null;
}

export interface FriendGroup {
  id: string;
  ownerId: string;
  name: string;
  description: string | null;
  memberCount: number;
  createdAt: string;
}

export interface GroupInvitation {
  id: string;
  groupId: string;
  groupName: string;
  inviterName: string;
  status: "pending" | "accepted" | "declined";
}

export interface UserReport {
  id: string;
  reporterId: string;
  reportedId: string;
  reason: ReportReason;
  details: string | null;
  status: ReportStatus;
  createdAt: string;
}

export interface AdminRoleRecord {
  userId: string;
  role: AdminRole;
  grantedAt: string;
}

export interface EventRecord {
  id: string;
  venueId: string;
  title: string;
  description: string | null;
  startsAt: string;
  endsAt: string | null;
  status: EventStatus;
  musicGenres: MusicGenre[];
}
