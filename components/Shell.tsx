import type { ReactNode } from "react";

type Tab = "especes" | "carte" | "jeu";

const IconMush = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 11a8 6 0 0 1 16 0z" /><path d="M10 11v7a2 2 0 0 0 4 0v-7" /></svg>
);
const IconMap = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2z" /><path d="M9 4v14M15 6v14" /></svg>
);
const IconGame = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M9 9h.01M15 15h.01M15 9h.01M9 15h.01" /></svg>
);

export default function Shell({ tab, children }: { tab?: Tab; children: ReactNode }) {
  return (
    <div className="app">
      <div className="banner" role="note">
        Prototype : fiches et photos non encore validées par un mycologue.
      </div>
      {children}
      <nav className="tabbar" aria-label="Navigation principale">
        <a href="index.html" aria-current={tab === "especes" ? "page" : undefined}><IconMush />Espèces</a>
        <a href="carte.html" aria-current={tab === "carte" ? "page" : undefined}><IconMap />Carte</a>
        <a href="jeu.html" aria-current={tab === "jeu" ? "page" : undefined}><IconGame />Jeu</a>
      </nav>
    </div>
  );
}

export function MonthStrip({ mois, now }: { mois: [number, number]; now: number }) {
  const [a, b] = mois;
  const on = (m: number) => (a <= b ? m >= a && m <= b : m >= a || m <= b);
  return (
    <div aria-hidden="true">
      <div className="strip">
        {Array.from({ length: 12 }, (_, i) => {
          const m = i + 1;
          const cls = m === now ? (on(m) ? "now" : "now-off") : on(m) ? "on" : "";
          return <span key={m} className={cls} />;
        })}
      </div>
      <div className="strip-labels"><span>jan.</span><span>déc.</span></div>
    </div>
  );
}
