"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/ui/Button";

const SECTIONS = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/usuarios", label: "Usuarios" },
  { href: "/admin/denuncias", label: "Denuncias" },
  { href: "/admin/locales", label: "Locales" },
  { href: "/admin/eventos", label: "Eventos" },
  { href: "/admin/auditoria", label: "Auditoría" },
];

/** Subnavegación horizontal del panel de administración. */
export function AdminNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <nav aria-label="Secciones de administración" className="mb-6">
      <ul className="flex flex-wrap gap-2">
        {SECTIONS.map((section) => (
          <li key={section.href}>
            <Link
              href={section.href}
              aria-current={isActive(section.href) ? "page" : undefined}
              className={cn(
                "block rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
                isActive(section.href)
                  ? "border-neon-violet/50 bg-neon-violet/15 text-text"
                  : "border-line bg-surface-raised text-text-secondary hover:text-text",
              )}
            >
              {section.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
