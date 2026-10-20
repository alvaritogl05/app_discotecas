"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/ui/Button";
import {
  ChatIcon,
  CompassIcon,
  SparkIcon,
  UserIcon,
} from "@/components/ui/icons";

interface NavItem {
  href: string;
  label: string;
  icon: (props: { className?: string }) => React.ReactElement;
  /** Ocultar en escritorio (ya está en el header). */
  mobileOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/explorar", label: "Explorar", icon: CompassIcon },
  { href: "/personas", label: "Personas", icon: SparkIcon },
  { href: "/matches", label: "Matches", icon: UserIcon },
  { href: "/chats", label: "Chats", icon: ChatIcon },
  { href: "/perfil", label: "Perfil", icon: UserIcon },
];

/**
 * Navegación principal de 5 secciones.
 * - Móvil: barra inferior al alcance del pulgar.
 * - Escritorio: barra lateral fija.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-6xl">
      {/* Sidebar (escritorio) */}
      <aside className="sticky top-0 hidden h-dvh w-56 shrink-0 flex-col gap-1 border-r border-line px-3 py-6 md:flex">
        <Link href="/explorar" className="mb-6 px-3 text-lg font-black tracking-tight">
          <span className="neon-text">App Discotecas</span>
        </Link>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                isActive(item.href)
                  ? "bg-neon-violet/15 text-text"
                  : "text-text-secondary hover:bg-surface hover:text-text",
              )}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
        <p className="mt-auto px-3 text-[11px] text-text-muted">
          Tu noche. Tu gente.
        </p>
      </aside>

      {/* Contenido */}
      <main className="min-w-0 flex-1 px-4 pb-28 pt-4 sm:px-6 md:pb-10 md:pt-8">
        {children}
      </main>

      {/* Bottom bar (móvil) */}
      <nav
        aria-label="Navegación principal"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/90 backdrop-blur-md md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="mx-auto flex max-w-md items-stretch justify-around">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition",
                    active ? "text-text" : "text-text-muted",
                  )}
                >
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 transition",
                      active && "bg-neon-violet/15",
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
