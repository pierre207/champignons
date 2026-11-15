import "./globals.css";
import type { ReactNode } from "react";
import { SIGNATURE, SITE } from "@/lib/seo";

export const metadata = {
  metadataBase: new URL(SITE),
  title: { default: SIGNATURE, template: "%s | Lamelle" },
  description: "Fiches des champignons de France, comestibles, à éviter ou toxiques, carte des zones de pousse et quiz de reconnaissance.",
  applicationName: "Lamelle",
  openGraph: { siteName: "Lamelle", locale: "fr_FR", type: "website" },
  twitter: { card: "summary_large_image" },
};

export const viewport = { width: "device-width", initialScale: 1, themeColor: "#121815" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans:ital,wght@0,400;0,600;0,700;1,400&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
