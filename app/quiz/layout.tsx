import type { ReactNode } from "react";

export const metadata = {
  title: "Quiz champignons : reconnaître les espèces en photo",
  description: "Testez-vous : 4 photos, une seule bonne espèce. Comestibles, toxiques et sosies, avec la correction et les critères pour les distinguer.",
  alternates: { canonical: "/quiz" },
};

export default function L({ children }: { children: ReactNode }) {
  return children;
}
