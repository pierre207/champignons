import type { ReactNode } from "react";

export const metadata = { title: "Redirection", robots: { index: false } };

export default function L({ children }: { children: ReactNode }) {
  return children;
}
