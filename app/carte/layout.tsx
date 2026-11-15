import type { ReactNode } from "react";

export const metadata = {
  title: "Carte des champignons : où cueillir en ce moment",
  description: "Zones favorables aux champignons en France selon la pluie, la température et les essences forestières. Indice de pousse sur 5 jours.",
  alternates: { canonical: "/carte" },
};

export default function L({ children }: { children: ReactNode }) {
  return children;
}
