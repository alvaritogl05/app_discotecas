import type { ReactNode } from "react";
import { cn } from "@/components/ui/Button";

/** Definición de una columna de la tabla de administración. */
export interface AdminColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface AdminTableProps<T> {
  /** Descripción accesible de la tabla (visible solo para lectores de pantalla). */
  caption: string;
  columns: AdminColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
  className?: string;
}

/**
 * Tabla simple y accesible para el panel de administración.
 * Es un componente de presentación: puede usarse en Server y Client Components.
 */
export function AdminTable<T>({
  caption,
  columns,
  rows,
  rowKey,
  emptyMessage = "No hay resultados que mostrar.",
  className,
}: AdminTableProps<T>) {
  return (
    <div className={cn("surface overflow-x-auto", className)}>
      <table className="w-full min-w-[40rem] border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-line text-left">
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-muted"
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-sm text-text-secondary"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={rowKey(row)} className="border-b border-line/60 last:border-0">
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={cn("px-4 py-3 align-middle text-text-secondary", c.className)}
                  >
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
