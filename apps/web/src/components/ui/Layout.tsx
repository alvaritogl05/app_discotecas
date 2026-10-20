import { cn, Spinner } from "./Button";
import type { ReactNode } from "react";
import Link from "next/link";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("surface p-4 sm:p-5", className)}>{children}</div>;
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "violet" | "pink" | "success" | "danger" | "warning";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "border-line bg-surface-raised text-text-secondary",
    violet: "border-neon-violet/50 bg-neon-violet/15 text-neon-violet",
    pink: "border-neon-pink/50 bg-neon-pink/15 text-neon-pink",
    success: "border-success/40 bg-success/10 text-success",
    danger: "border-danger/40 bg-danger/10 text-danger",
    warning: "border-warning/40 bg-warning/10 text-warning",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description: string;
  action?: { href: string; label: string };
  icon?: ReactNode;
}) {
  return (
    <div className="surface flex flex-col items-center gap-3 px-6 py-12 text-center animate-fade-in">
      {icon && <div className="text-text-muted">{icon}</div>}
      <h3 className="text-base font-semibold text-text">{title}</h3>
      <p className="max-w-sm text-sm text-text-secondary">{description}</p>
      {action && (
        <Link href={action.href} className="btn-primary mt-2">
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function ErrorState({
  title = "Algo ha salido mal",
  description = "Inténtalo de nuevo en unos segundos.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="surface flex flex-col items-center gap-3 border-danger/40 px-6 py-12 text-center animate-fade-in"
    >
      <h3 className="text-base font-semibold text-text">{title}</h3>
      <p className="max-w-sm text-sm text-text-secondary">{description}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-secondary mt-1">
          Reintentar
        </button>
      )}
    </div>
  );
}

export function LoadingState({ label = "Cargando…" }: { label?: string }) {
  return (
    <div
      role="status"
      className="surface flex flex-col items-center gap-3 px-6 py-12 text-center"
    >
      <Spinner className="size-6 text-neon-violet" />
      <p className="text-sm text-text-secondary">{label}</p>
    </div>
  );
}

export function SectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cn("mb-3 text-lg font-bold text-text", className)}>{children}</h2>
  );
}
