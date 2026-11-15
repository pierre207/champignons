"use client";

import { useEffect, useMemo, useState } from "react";
import Shell, { MonthStrip } from "@/components/Shell";
import { CATS, MOIS, enSaison, especes, type Categorie } from "@/data";
import { vignette } from "@/data/photos";
import { PAGES_CAT, urlFiche } from "@/lib/seo";

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Liste des espèces d'une catégorie ; les onglets de catégorie sont des liens vers les pages dédiées. */
export default function Liste({ cat, titre }: { cat: Categorie; titre: string }) {
  const [q, setQ] = useState("");
  const [saison, setSaison] = useState(false);
  const [now, setNow] = useState(11);

  useEffect(() => {
    setNow(new Date().getMonth() + 1);
  }, []);

  const items = useMemo(() => {
    const nq = norm(q.trim());
    return especes
      .filter((e) => (nq ? norm(e.fr + " " + e.la).includes(nq) : e.cat === cat))
      .filter((e) => (saison ? enSaison(e, now) : true));
  }, [cat, q, saison, now]);

  const nbSaison = especes.filter((e) => e.cat === cat && enSaison(e, now)).length;

  return (
    <Shell tab="especes">
      <header className="head">
        <div className="head-row">
          <h1>{titre}</h1>
          <span className="mono">{MOIS[now - 1]} · France</span>
        </div>
        <label className="search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a9b3ac" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nom français ou latin" aria-label="Rechercher une espèce" />
        </label>
        {!q && (
          <div className="seg" role="group" aria-label="Catégorie">
            {CATS.map((c) => (
              <a key={c.key} className={`c-${c.key}`} href={PAGES_CAT[c.key].slug} aria-current={cat === c.key ? "page" : undefined}>{c.label}</a>
            ))}
          </div>
        )}
        <label className="toggle">
          <input type="checkbox" checked={saison} onChange={(e) => setSaison(e.target.checked)} />
          En saison ce mois-ci {!q && <span>({nbSaison})</span>}
        </label>
      </header>

      <main className="list">
        {items.length === 0 && <p className="empty">Aucune espèce ne correspond.</p>}
        {items.map((e) => (
          <a key={e.id} className="row" href={urlFiche(e.id)}>
            <div className="thumb" aria-hidden="true">
              {vignette(e.id) ? <img src={vignette(e.id)!} alt="" loading="lazy" /> : <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#6e7a73" strokeWidth="1.6"><path d="M4 11a8 6 0 0 1 16 0z" /><path d="M10 11v7a2 2 0 0 0 4 0v-7" /></svg>}
            </div>
            <div className="row-main">
              <span className="row-name">
                {e.fr}
                {e.mortel && <span className="pill pill-mortel">MORTEL</span>}
              </span>
              <span className="row-la">{e.la}{q ? ` · ${CATS.find((c) => c.key === e.cat)?.court}` : ""}</span>
              <MonthStrip mois={e.mois} now={now} />
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6e7a73" strokeWidth="2" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
          </a>
        ))}
      </main>
    </Shell>
  );
}
