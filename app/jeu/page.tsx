"use client";

import { useCallback, useEffect, useState } from "react";
import Shell from "@/components/Shell";
import { CATS, especes, type Espece } from "@/data";
import { aPhotos, photosJeu, tuileStyle, type Tuile } from "@/data/photos";

const TOTAL = 10;
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

// Leurres : d'abord les espèces citées dans « confusions » de la fiche, puis le même genre, puis le reste
const leurresPour = (a: Espece) => {
  const cf = norm(a.f.cf ?? "");
  const autres = pool.filter((e) => e.id !== a.id);
  const cites = autres.filter((e) => cf.includes(norm(e.fr)) || cf.includes(norm(e.la)));
  const memeGenre = autres.filter((e) => !cites.includes(e) && genre(e) === genre(a));
  const reste = autres.filter((e) => !cites.includes(e) && !memeGenre.includes(e));
  return [...shuffle(cites), ...shuffle(memeGenre), ...shuffle(reste)].slice(0, 3);
};

const nouvelleQuestion = (deja: string[]): Q => {
  const libres = pool.filter((e) => !deja.includes(e.id));
  const answer = pickOne(libres.length ? libres : pool);
  const choices = [answer, ...leurresPour(answer)].map((e) => ({ e, t: pickOne(photosJeu(e.id)) }));
  return { answer, choices: shuffle(choices) };
};

export default function Jeu() {
  const [q, setQ] = useState<Q | null>(null);
  const [n, setN] = useState(1);
  const [score, setScore] = useState(0);
  const [pick, setPick] = useState<string | null>(null);
  const [fini, setFini] = useState(false);
  const [deja, setDeja] = useState<string[]>([]);

  const poser = useCallback((vus: string[]) => {
    const nq = nouvelleQuestion(vus);
    setQ(nq);
    setDeja([...vus, nq.answer.id]);
  }, []);

  useEffect(() => { poser([]); }, [poser]);

  const repondre = (id: string) => {
    if (pick || !q) return;
    setPick(id);
    if (id === q.answer.id) setScore((s) => s + 1);
  };

  const suivante = () => {
    if (n >= TOTAL) { setFini(true); return; }
    setN((x) => x + 1);
    setPick(null);
    poser(deja);
  };

  const rejouer = () => { setN(1); setScore(0); setPick(null); setFini(false); poser([]); };

  if (!q) return <Shell tab="jeu"><p className="empty">Chargement…</p></Shell>;

  const ok = pick === q.answer.id;
  const cat = CATS.find((c) => c.key === q.answer.cat)!;

  return (
    <Shell tab="jeu">
      <header className="head">
        <div className="head-row">
          <span className="mono">Question {n} / {TOTAL}</span>
          <span className="mono" style={{ color: "var(--accent)" }}>Score {score}</span>
        </div>
        <div className="progress" role="progressbar" aria-label="Progression" aria-valuemin={0} aria-valuemax={TOTAL} aria-valuenow={n}>
          <div style={{ width: `${(n / TOTAL) * 100}%` }} />
        </div>
      </header>

      <main className="wrap">
        {fini ? (
          <>
            <h1>{score} / {TOTAL}</h1>
            <p className="note">Partie terminée. Le jeu utilise pour l&apos;instant les {pool.length} espèces qui ont des photos.</p>
            <button className="btn" onClick={rejouer}>Rejouer</button>
          </>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span className="note">Trouvez la bonne photo :</span>
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
            {pick && (
              <>
                <div className={`feedback ${ok ? "ok" : "ko"}`} aria-live="polite">
                  <strong>{ok ? "Bonne réponse." : `Raté : vous avez choisi ${q.choices.find((c) => c.e.id === pick)!.e.fr}.`}</strong>{" "}
                  {q.answer.fr} : {cat.court.toLowerCase()}{q.answer.mortel ? ", mortel" : ""}.{q.answer.f.r ? ` ${q.answer.f.r}` : ""}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <a className="btn btn-ghost" href={`fiche.html?id=${q.answer.id}`}>Voir la fiche</a>
                  <button className="btn" onClick={suivante}>{n >= TOTAL ? "Voir le score" : "Question suivante"}</button>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </Shell>
  );
}
