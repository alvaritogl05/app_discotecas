import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-app",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "App Discotecas — Tu noche. Tu gente.",
    template: "%s · App Discotecas",
  },
  description:
    "Descubre discotecas, encuentra quién sale esta noche, haz matches y organiza tus planes. Barcelona y alrededores.",
  applicationName: "App Discotecas",
};

export const viewport: Viewport = {
  themeColor: "#050507",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="relative min-h-dvh antialiased">
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
