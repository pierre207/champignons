"use client";

import { useEffect, useRef, useState } from "react";

// Autocomplétion du géocodage de la Géoplateforme (IGN), gratuite et sans clé
const API = "https://data.geopf.fr/geocodage/completion";

export interface Lieu { nom: string; detail: string; lon: number; lat: number; commune: boolean }

interface Resultat {
  x: number; y: number; fulltext: string; kind?: string; poiType?: string[]; country?: string;
}

export default function RechercheLieu({ onChoix, zone }: { onChoix: (l: Lieu) => void; zone?: [number, number, number, number] }) {
  const [texte, setTexte] = useState("");
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [ouvert, setOuvert] = useState(false);
  const [erreur, setErreur] = useState(false);
  const requete = useRef(0);

  useEffect(() => {
    const t = texte.trim();
    if (t.length < 3) { setLieux([]); return; }
    const n = ++requete.current;
    const minuteur = setTimeout(async () => {
      try {
        const q = new URLSearchParams({ text: t, type: "StreetAddress,PositionOfInterest", maxResponses: "10" });
        const r = await fetch(`${API}?${q}`);
        const j: { results?: Resultat[] } = await r.json();
        if (n !== requete.current) return;
        const dans = (x: number, y: number) => !zone || (x >= zone[0] && x <= zone[2] && y >= zone[1] && y <= zone[3]);
        const res = (j.results ?? [])
          .map((p) => {
            const [nom, ...reste] = p.fulltext.split(", ");
            const type = p.poiType?.[0] ?? (p.kind === "street" ? "rue" : p.kind);
            return {
              nom, detail: [reste.join(", "), type].filter(Boolean).join(" · "),
              lon: p.x, lat: p.y, commune: p.kind === "administratif" || p.kind === "municipality", dedans: dans(p.x, p.y),
            };
          })
          .sort((a, b) => Number(b.dedans) - Number(a.dedans))
          .slice(0, 6);
        setLieux(res);
        setErreur(false);
        setOuvert(true);
      } catch {
        if (n === requete.current) { setErreur(true); setLieux([]); }
      }
    }, 250);
    return () => clearTimeout(minuteur);
  }, [texte, zone]);

  const choisir = (l: Lieu) => {
    setTexte(l.nom);
    setOuvert(false);
    onChoix(l);
  };

  return (
    <div className="recherche-lieu">
      <div className="search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
        <input
          type="search" value={texte} placeholder="Commune, lieu-dit, sommet, forêt…" aria-label="Aller à un lieu"
          autoComplete="off" enterKeyHint="search"
          onChange={(e) => setTexte(e.target.value)} onFocus={() => setOuvert(true)}
          onKeyDown={(e) => { if (e.key === "Enter" && lieux[0]) { e.preventDefault(); choisir(lieux[0]); (e.target as HTMLInputElement).blur(); } }}
        />
      </div>
      {ouvert && (lieux.length > 0 || erreur) && (
        <ul className="lieux" role="listbox">
          {erreur && <li className="vide">Recherche indisponible pour le moment.</li>}
          {lieux.map((l, i) => (
            <li key={i}>
              <button type="button" onClick={() => choisir(l)}>
                <span>{l.nom}</span><small>{l.detail}</small>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
