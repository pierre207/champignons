"use client";

import { useCallback, useEffect, useState } from "react";
import Shell from "@/components/Shell";
import { CATS, especes, type Espece } from "@/data";
import { aPhotos, photosDP, photosJeu, tuileStyle, type Tuile } from "@/data/photos";
import { LexiqueContenu, avecMots } from "@/components/Lexique";
import { critereCle } from "@/data/criteres";

// Partie sans fin : le niveau monte toutes les 5 réponses, jusqu'au niveau 3
const PALIER = 5;
const NIVEAU_MAX = 3;
const niveauDe = (n: number) => Math.min(NIVEAU_MAX, Math.floor((n - 1) / PALIER) + 1);
// Seules les espèces qui ont des photos entrent dans le jeu
const pool = especes.filter((e) => aPhotos(e.id));

const shuffle = <T,>(a: T[]) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
  return b;
};
const pickOne = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
const genre = (e: Espece) => e.la.split(" ")[0].toLowerCase();
const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

type Choix = { e: Espece; t: Tuile };
type Q = { answer: Espece; choices: Choix[] };

// Type de dessous du chapeau, tiré du texte de la fiche
const dessous = (e: Espece) => {
  // On retire les négations (« pas de lames ni de tubes », « sans pores ni lames »)
  const d = norm(e.f.d ?? "").replace(/(pas de|sans) [^,;.()]*/g, "");
  if (/tubes|pores/.test(d)) return "tubes";
  if (/aiguillons/.test(d)) return "aiguillons";
  if (/lames/.test(d)) return "lames";
  if (/plis/.test(d)) return "plis";
  return "autre";
};

const citesDans = (a: Espece, autres: Espece[]) => {
  const cf = norm(a.f.cf ?? "");
  return autres.filter((e) => cf.includes(norm(e.fr)) || cf.includes(norm(e.la)));
};

// Niveau 1 : espèces très différentes (autre genre, pas de sosie connu, dessous du chapeau différent si possible)
const leurresFaciles = (a: Espece) => {
  const autres = pool.filter((e) => e.id !== a.id);
  const cites = citesDans(a, autres);
  const cand = shuffle(autres.filter((e) => !cites.includes(e) && genre(e) !== genre(a)));
  const pris: Espece[] = [];
  const types = new Set([dessous(a)]);
  for (const e of cand) {
    if (pris.length === 3) break;
    if (!types.has(dessous(e)) && pris.every((p) => genre(p) !== genre(e))) { pris.push(e); types.add(dessous(e)); }
  }
  for (const e of cand) {
    if (pris.length === 3) break;
    if (!pris.includes(e) && pris.every((p) => genre(p) !== genre(e))) pris.push(e);
  }
  return pris;
};

// Niveau 2 : leurres tirés au hasard
const leurresHasard = (a: Espece) => shuffle(pool.filter((e) => e.id !== a.id)).slice(0, 3);

// Niveau 3 : d'abord les espèces citées dans « confusions » de la fiche, puis le même genre, puis le reste
const leurresSosies = (a: Espece) => {
  const autres = pool.filter((e) => e.id !== a.id);
  const cites = citesDans(a, autres);
  const memeGenre = autres.filter((e) => !cites.includes(e) && genre(e) === genre(a));
  const reste = autres.filter((e) => !cites.includes(e) && !memeGenre.includes(e));
  return [...shuffle(cites), ...shuffle(memeGenre), ...shuffle(reste)].slice(0, 3);
};

const LEURRES = [leurresFaciles, leurresHasard, leurresSosies];

const nouvelleQuestion = (deja: string[], niveau: number): Q => {
  const libres = pool.filter((e) => !deja.includes(e.id));
  const answer = pickOne(libres.length ? libres : pool);
  const choices = [answer, ...LEURRES[niveau - 1](answer)].map((e) => ({ e, t: pickOne(photosJeu(e.id)) }));
  return { answer, choices: shuffle(choices) };
};

const LIGNES: { cle: string; nom: string; val: (e: Espece) => string | undefined }[] = [
  { cle: "d", nom: "Dessous", val: (e) => e.f.d },
  { cle: "c", nom: "Chapeau", val: (e) => e.f.c ?? e.f.co },
  { cle: "p", nom: "Pied", val: (e) => e.f.p },
  { cle: "ch", nom: "Chair", val: (e) => e.f.ch },
];

/** Comparaison entre l'espèce choisie par erreur et la bonne réponse. */
function Comparaison({ choix, bonne, ouvrirLexique }: { choix: Choix; bonne: Choix; ouvrirLexique: () => void }) {
  const lignes = LIGNES.filter((l) => l.val(choix.e) || l.val(bonne.e));
  // Critère clé : choisi à la main pour les sosies connus ; sinon le dessous du chapeau, quand les deux espèces en ont un et qu'il diffère
  const [da, db] = [dessous(choix.e), dessous(bonne.e)];
  const main = critereCle(choix.e.id, bonne.e.id);
  const cle = main && lignes.some((l) => l.cle === main) ? main : da !== "autre" && db !== "autre" && da !== db ? "d" : null;
  const cite = (a: Espece, b: Espece) => !!a.f.r && (norm(a.f.r).includes(norm(b.fr)) || norm(a.f.r).includes(norm(b.la)));
  const retenir = cite(choix.e, bonne.e) ? choix.e.f.r : cite(bonne.e, choix.e) ? bonne.e.f.r : bonne.e.f.r;
  return (
    <>
      <div className="comp">
        <div className="comp-h">
          <span />
          {[{ c: choix, cls: "ko", txt: "votre choix" }, { c: bonne, cls: "ok", txt: "bonne réponse" }].map(({ c, cls, txt }) => (
            <div key={cls} className={`comp-who ${cls}`}>
              <span className="th"><span className="tuile" style={tuileStyle(c.t)} /></span>
              <span>{c.e.fr}<small>{txt}</small></span>
            </div>
          ))}
        </div>
        {lignes.map((l) => (
          <div key={l.cle} className={`comp-r${cle === l.cle ? " cle" : ""}`}>
            <b>{l.nom}{cle === l.cle && <span className="cletag">CRITÈRE CLÉ</span>}</b>
            {[choix.e, bonne.e].map((e) => {
              const ph = l.cle === "d" ? photosDP(e.id).d : l.cle === "p" ? photosDP(e.id).p : undefined;
              return (
                <span key={e.id}>
                  {avecMots(l.val(e) ?? "–", ouvrirLexique)}
                  {ph && <span className="comp-ph tuile" role="img" aria-label={`${e.fr}, ${l.nom.toLowerCase()}`} style={tuileStyle(ph)} />}
                </span>
              );
            })}
          </div>
        ))}
      </div>
      {retenir && <div className="retenir"><b>À retenir</b>{retenir}</div>}
    </>
  );
}

export default function Jeu() {
  const [q, setQ] = useState<Q | null>(null);
  const [n, setN] = useState(1);
  const [score, setScore] = useState(0);
  const [pick, setPick] = useState<string | null>(null);
  const [fini, setFini] = useState(false);
  const [deja, setDeja] = useState<string[]>([]);
  const [lexique, setLexique] = useState(false);

  useEffect(() => {
    if (!lexique) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setLexique(false); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [lexique]);

  const poser = useCallback((vus: string[], num: number) => {
    // Toutes les espèces vues : on recommence le tirage
    const base = vus.length >= pool.length ? [] : vus;
    const nq = nouvelleQuestion(base, niveauDe(num));
    setQ(nq);
    setDeja([...base, nq.answer.id]);
  }, []);

  useEffect(() => { poser([], 1); }, [poser]);

  const repondre = (id: string) => {
    if (pick || !q) return;
    setPick(id);
    if (id === q.answer.id) setScore((s) => s + 1);
  };

  const suivante = () => {
    setN(n + 1);
    setPick(null);
    poser(deja, n + 1);
  };

  const rejouer = () => { setN(1); setScore(0); setPick(null); setFini(false); poser([], 1); };

  if (!q) return <Shell tab="jeu"><p className="empty">Chargement…</p></Shell>;

  const ok = pick === q.answer.id;
  const niveau = niveauDe(n);
  const repondues = pick ? n : n - 1;
  // Progression dans le niveau en cours (le dernier niveau n'a pas de fin)
  const dansNiveau = niveau < NIVEAU_MAX ? (repondues - (niveau - 1) * PALIER) / PALIER : null;
  const cat = CATS.find((c) => c.key === q.answer.cat)!;

  return (
    <Shell tab="jeu">
      <header className="head">
        <div className="head-row">
          <span className="mono">Niveau {niveau} · Question {n}</span>
          <span className="mono" style={{ color: "var(--accent)" }}>Score {score} / {repondues}</span>
        </div>
        {!fini && dansNiveau !== null && (
          <div className="progress" role="progressbar" aria-label={`Progression vers le niveau ${niveau + 1}`} aria-valuemin={0} aria-valuemax={PALIER} aria-valuenow={Math.round(dansNiveau * PALIER)}>
            <div style={{ width: `${dansNiveau * 100}%` }} />
          </div>
        )}
      </header>

      <main className="wrap">
        {fini ? (
          <>
            <h1>{score} / {repondues}</h1>
            <p className="note">Partie terminée au niveau {niveau}. Le jeu utilise pour l&apos;instant les {pool.length} espèces qui ont des photos.</p>
            <button className="btn" onClick={rejouer}>Rejouer</button>
          </>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div className="head-row" style={{ alignItems: "center" }}>
                <span className="note">Trouvez la bonne photo :</span>
                <button type="button" className="aide" onClick={() => setLexique(true)}><i aria-hidden="true">?</i>Vocabulaire</button>
              </div>
              <div className="q-row">
                <h1 className="q-title">{q.answer.fr}</h1>
                <span className={`badge b-${q.answer.cat}`}>{cat.court.toUpperCase()}</span>
                {q.answer.mortel && <span className="pill pill-mortel">MORTEL</span>}
              </div>
              <span className="la">{q.answer.la}</span>
            </div>
            <div className="pgrid">
              {q.choices.map((c, i) => {
                const cls = pick ? (c.e.id === q.answer.id ? "good" : c.e.id === pick ? "bad" : "dim") : "";
                return (
                  <button key={c.e.id} className={`pchoice ${cls}`} onClick={() => repondre(c.e.id)} aria-disabled={!!pick} aria-label={pick ? c.e.fr : `Photo ${i + 1}`}>
                    <span className="tuile" style={tuileStyle(c.t)} />
                    {pick && (cls === "good" || cls === "bad") && <span className="mark" aria-hidden="true">{cls === "good" ? "✓" : "✕"}</span>}
                    {pick && <span className="cap">{c.e.fr}</span>}
                  </button>
                );
              })}
            </div>
            {pick && (() => {
              const choix = q.choices.find((c) => c.e.id === pick)!;
              const bonne = q.choices.find((c) => c.e.id === q.answer.id)!;
              return (
                <>
                  <div className={`feedback ${ok ? "ok" : "ko"}`} aria-live="polite">
                    <strong>{ok ? "Bonne réponse." : `Raté : vous avez choisi ${choix.e.fr}.`}</strong>{" "}
                    {q.answer.fr} : {cat.court.toLowerCase()}{q.answer.mortel ? ", mortel" : ""}.
                    {ok ? (q.answer.f.r ? ` ${q.answer.f.r}` : "") : " Voici comment les distinguer."}
                  </div>
                  <div className="suite">
                    <button className="btn" onClick={suivante}>{n % PALIER === 0 && niveau < NIVEAU_MAX ? `Passer au niveau ${niveau + 1}` : "Question suivante"}</button>
                  </div>
                  {!ok && <Comparaison choix={choix} bonne={bonne} ouvrirLexique={() => setLexique(true)} />}
                  <a className="lien-fiche" href={`/fiche?id=${q.answer.id}`}>Voir la fiche complète : {q.answer.fr}</a>
                  <button className="fin-partie" onClick={() => setFini(true)}>Terminer la partie</button>
                </>
              );
            })()}
          </>
        )}
      </main>

      {lexique && (
        <div className="lex-modal" role="dialog" aria-modal="true" aria-labelledby="lex-titre">
          <div className="lex-modal-h">
            <h2 id="lex-titre">Les parties d&apos;un champignon</h2>
            <button type="button" className="lex-fermer" onClick={() => setLexique(false)} aria-label="Fermer le vocabulaire" autoFocus>✕</button>
          </div>
          <LexiqueContenu />
        </div>
      )}
    </Shell>
  );
}
