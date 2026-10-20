/** Iconos de proveedores de autenticación. Marcas en monocromo neutro. */

type IconProps = { className?: string };

export function GoogleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.6 12.2c0-.7-.06-1.35-.18-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.24c1.9-1.75 2.96-4.33 2.96-7.3z"
        opacity="0.9"
      />
      <path
        fill="currentColor"
        d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.24-2.5c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.6-4.12H3.06v2.6A10 10 0 0 0 12 22z"
        opacity="0.7"
      />
      <path
        fill="currentColor"
        d="M6.4 13.9a6 6 0 0 1 0-3.82V7.48H3.06a10 10 0 0 0 0 9.04z"
        opacity="0.5"
      />
      <path
        fill="currentColor"
        d="M12 5.96c1.47 0 2.79.5 3.83 1.5l2.87-2.87C16.95 2.99 14.7 2 12 2A10 10 0 0 0 3.06 7.48l3.34 2.6C7.2 7.72 9.4 5.96 12 5.96z"
        opacity="0.8"
      />
    </svg>
  );
}

export function AppleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.4 12.8c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.15-2.8.85-3.5.85s-1.85-.83-3-.8c-1.55.02-3 .9-3.8 2.3-1.6 2.8-.4 7 1.15 9.3.77 1.12 1.68 2.38 2.88 2.34 1.16-.05 1.6-.75 3-.75s1.8.75 3 .72c1.24-.02 2.03-1.14 2.79-2.27.87-1.3 1.23-2.57 1.25-2.63-.03-.02-2.4-.92-2.42-3.66zM14.1 5.9c.63-.77 1.06-1.83.94-2.9-.9.04-2 .6-2.65 1.36-.58.68-1.1 1.77-.96 2.8 1 .08 2.03-.5 2.67-1.26z"
      />
    </svg>
  );
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <path d="M10.5 18.5h3" />
    </svg>
  );
}
