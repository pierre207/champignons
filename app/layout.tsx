import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Champignons — prototype",
  description: "Prototype : espèces, fiches, carte de démonstration et jeu.",
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
