"use client";

import { Fragment, useEffect, useState, type ReactNode } from "react";
import Shell from "@/components/Shell";
import { CATS, especes, parId, type Espece } from "@/data";
import { commons, photosFiche, tuileStyle } from "@/data/photos";

const ROWS: [keyof Espece["f"], string][] = [
  ["c", "CHAPEAU / FORME"], ["co", "COULEUR"], ["d", "DESSOUS"], ["p", "PIED"], ["ch", "CHAIR"],
  ["h", "HABITAT"], ["s", "SAISON"], ["a", "ALTITUDE"],
];

// Normalisation caractère par caractère (sans accents, minuscules) : les positions restent alignées sur le texte d'origine
const plat = (t: string) => Array.from(t, (c) => c.normalize("NFD")[0].toLowerCase()).join("");

/** Espèces citées dans le texte « confusions », avec leur position. */
function cites(texte: string, soi: Espece) {
  const t = plat(texte);
  const trouves: { e: Espece; i: number; n: number }[] = [];
  const noms = especes.filter((x) => x.id !== soi.id)
    .flatMap((x) => [x.fr, x.fr.replace(/\s*\(.*\)/, ""), x.la].map((nom) => ({ x, nom: plat(nom) })))
    .sort((a, b) => b.nom.length - a.nom.length); // les noms longs d'abord (« pied de mouton roux » avant « pied de mouton »)
  for (const { x, nom } of noms) {
    let i = t.indexOf(nom);
    while (i >= 0) {
      const libre = trouves.every((f) => i + nom.length <= f.i || i >= f.i + f.n);
      const mot = !/[a-z]/.test(t[i - 1] ?? "") && !/[a-z]/.test(t[i + nom.length] ?? "");
      if (libre && mot) trouves.push({ e: x, i, n: nom.length });
      i = t.indexOf(nom, i + 1);
    }
  }
  return trouves.sort((a, b) => a.i - b.i);
}

/** Texte des confusions avec les espèces citées en liens vers leur fiche. */
function avecLiens(texte: string, liste: ReturnType<typeof cites>): ReactNode {
  const out: ReactNode[] = [];
  let k = 0;
  liste.forEach(({ e, i, n }, j) => {
    out.push(<Fragment key={`t${j}`}>{texte.slice(k, i)}</Fragment>);
    out.push(<a key={`a${j}`} href={`/fiche?id=${e.id}`}>{texte.slice(i, i + n)}</a>);
    k = i + n;
  });
  out.push(<Fragment key="fin">{texte.slice(k)}</Fragment>);
  return out;
}

export default function Fiche() {
  const [e, setE] = useState<Espece | null | undefined>(undefined);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id") ?? "";
    setE(parId(id) ?? null);
  }, []);

  if (e === undefined) return <Shell tab="especes"><p className="empty">Chargement…</p></Shell>;
  if (e === null) return <Shell tab="especes"><p className="empty">Espèce introuvable. <a href="/">Retour à la liste</a></p></Shell>;

  const cat = CATS.find((c) => c.key === e.cat)!;
  const photos = photosFiche(e.id);
  const index = especes.indexOf(e) + 1;
  const xLabel = e.cat === "comestible" ? "CONSOMMATION" : e.cat === "toxique" ? "SYMPTÔMES ET DÉLAI" : "POURQUOI L'ÉVITER";

  return (
    <Shell tab="especes">
      <div className="topbar">
        <a className="icon-btn" href={`/?cat=${e.cat}`} aria-label="Retour à la liste">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#eceFea" strokeWidth="2" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
        </a>
        <span className="mono">Fiche {String(index).padStart(3, "0")} / {especes.length}</span>
      </div>

      {photos.length > 0 ? (
        <div className="photos photos-real" role="group" aria-label={`Photos de ${e.fr}`}>
          {photos.map((p, i) => (
            <div key={i} className="tuile" role="img" aria-label={`${e.fr}, photo ${i + 1}`} style={tuileStyle(p)} />
          ))}
        </div>
      ) : (
        <div className="photos" role="group" aria-label="Photos à venir">
          <div>[Photo adulte — à venir]</div>
          <div>[Dessous]</div>
          <div>[Coupe]</div>
        </div>
      )}

      <article className="fiche">
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span className={`badge b-${e.cat}`}>{cat.court.toUpperCase()}</span>
            {e.mortel && <span className="pill pill-mortel">MORTEL</span>}
            {e.syndrome && <span className="mono" style={{ textTransform: "none" }}>Syndrome {e.syndrome.toLowerCase()}</span>}
          </div>
          <h1 style={{ marginTop: 6 }}>{e.fr}</h1>
          <span className="la">{e.la}</span>
        </div>

        {e.f.cf && (
          <section className={`alert ${e.cat === "toxique" ? "alert-danger" : "alert-warn"}`} aria-labelledby="conf">
            <div>
              <h2 id="conf">{e.cat === "toxique" ? "Peut être confondu avec" : "Ne pas confondre avec"}</h2>
              {/* Chaque espèce citée renvoie vers sa fiche */}
              <p className="alert-liens">{avecLiens(e.f.cf, cites(e.f.cf, e))}</p>
            </div>
          </section>
        )}

        <dl className="grid">
          {ROWS.filter(([k]) => e.f[k]).map(([k, label]) => (
            <div key={k}><dt>{label}</dt><dd>{e.f[k]}</dd></div>
          ))}
          {e.f.x && <div><dt>{xLabel}</dt><dd>{e.f.x}</dd></div>}
          {e.f.l && <div><dt>STATUT LÉGAL</dt><dd>{e.f.l}</dd></div>}
          {e.f.r && <div><dt>RÈGLE DE TERRAIN</dt><dd>{e.f.r}</dd></div>}
        </dl>

        {e.complete === false && <p className="note">Fiche résumée : la description complète de cette espèce est en cours de rédaction.</p>}
        {e.cat === "toxique" && (
          <p className="note">En cas de doute après un repas : appelez le 15 ou un centre antipoison et gardez les restes de champignons.</p>
        )}

        {photos.some((p) => p.o) && (
          <p className="note credits">
            Photos : Wikimedia Commons ({photos.map((p, i) => (
              <span key={i}>{i ? ", " : ""}{p.o ? <a href={commons(p.o)} target="_blank" rel="noopener">{i + 1}</a> : i + 1}</span>
            ))}).
          </p>
        )}

        {e.cat === "comestible" && (
          <a className="btn" href={`/carte?id=${e.id}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1206" strokeWidth="2" aria-hidden="true"><path d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2z" /></svg>
            Voir les zones favorables
          </a>
        )}
      </article>
    </Shell>
  );
}
