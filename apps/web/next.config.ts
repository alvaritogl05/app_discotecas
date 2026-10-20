import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Imágenes de usuarios y locales servidas desde Supabase Storage.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Permite que los paquetes del workspace se compilen en el servidor.
  transpilePackages: ["@app-discotecas/shared"],
};

export default nextConfig;
