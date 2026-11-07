"use client";

import { useEffect, useMemo, useState } from "react";
import Shell from "@/components/Shell";
import { especes } from "@/data";

type Mode = "carreaux" | "foret";

// Générateur pseudo-aléatoire déterministe (démo uniquement)
const seedOf = (s: string) => Array.from(s).reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
const rng = (seed: number) => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);

const FORETS = [
  "M20,90 C80,60 180,70 210,120 C240,170 200,260 150,280 C90,300 30,260 15,200 Z",
  "M225,85 C290,65 360,100 372,170 C382,222 322,232 272,212 C232,192 212,140 225,85 Z",
  "M205,305 C262,282 360,300 376,380 C392,462 320,522 250,502 C190,482 172,342 205,305 Z",
  "M40,360 C100,340 168,380 163,440 C158,500 80,522 45,482 C20,452 20,382 40,360 Z",
];
const PAL = ["#4A3F27", "#A06E2A", "#F2A33A"];

export default function Carte() {
  const options = useMemo(() => especes.filter((e) => e.cat === "comestible"), []);
  const [id, setId] = useState(options[0].id);
  const [mode, setMode] = useState<Mode>("foret");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const q = p.get("id");
    if (q && especes.some((e) => e.id === q)) setId(q);
    try { const m = localStorage.getItem("carte-mode"); if (m === "carreaux" || m === "foret") setMode(m); } catch {}
  }, []);

  const changerMode = (m: Mode) => {
    setMode(m);
    try { localStorage.setItem("carte-mode", m); } catch {}
  };

  const esp = especes.find((e) => e.id === id)!;
  const r = useMemo(() => rng(seedOf(id)), [id]);

  // Foyers de probabilité fictifs, placés dans les forêts
  const foyers = useMemo(() => {
    const rand = rng(seedOf(id));
    const centres = [[110, 190], [290, 150], [290, 400], [100, 430]];
    return centres.map(([x, y]) => ({ x: x + (rand() - 0.5) * 60, y: y + (rand() - 0.5) * 60, k: rand() }));
  }, [id]);

  const cellules = useMemo(() => {
    const out: { x: number; y: number; c: string }[] = [];
    const size = 12;
    for (let y = 0; y < 560; y += size) {
      for (let x = 0; x < 390; x += size) {
        let v = 0;
        for (const f of foyers) {
          const d = Math.hypot(x - f.x, y - f.y);
          v += Math.max(0, 1 - d / (70 + f.k * 50)) * (0.6 + f.k * 0.6);
        }
        const k = v > 0.75 ? 2 : v > 0.4 ? 1 : v > 0.12 ? 0 : -1;
        if (k >= 0) out.push({ x, y, c: PAL[k] });
      }
    }
    return out;
  }, [foyers]);

  const pct = (base: number) => Math.round(base + r() * 30);
  const [auj, dem] = useMemo(() => [pct(40), pct(25)], [id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Shell tab="carte">
      <div className="map-wrap">
        <svg viewBox="0 0 390 560" preserveAspectRatio="xMidYMid slice" aria-label="Carte de démonstration" role="img">
          <defs>
            <filter id="flou" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="16" /></filter>
            <clipPath id="forets">{FORETS.map((d, i) => <path key={i} d={d} />)}</clipPath>
          </defs>
          <rect width="390" height="560" fill="#1A221E" />
          <path d="M-10,250 C80,230 150,300 230,270 C300,245 340,300 400,290" fill="none" stroke="#24435A" strokeWidth="5" />
          <g fill="#202D21" stroke="#34463A" strokeWidth="1">{FORETS.map((d, i) => <path key={i} d={d} />)}</g>

          {mode === "foret" ? (
            <g clipPath="url(#forets)">
              <g filter="url(#flou)">
                {foyers.map((f, i) => (
                  <g key={i}>
                    <circle cx={f.x} cy={f.y} r={68 + f.k * 24} fill={PAL[0]} />
                    <circle cx={f.x} cy={f.y} r={36 + f.k * 16} fill={PAL[1]} />
                    {f.k > 0.35 && <circle cx={f.x} cy={f.y} r={14 + f.k * 12} fill={PAL[2]} />}
                  </g>
                ))}
              </g>
            </g>
          ) : (
            <g opacity="0.9">
              {cellules.map((c, i) => <rect key={i} x={c.x} y={c.y} width="12" height="12" fill={c.c} stroke="#121815" strokeWidth="0.5" />)}
            </g>
          )}

          <path d="M0,120 L140,150 L260,110 L400,140" fill="none" stroke="#2E3833" strokeWidth="2" />
          <path d="M180,0 L190,150 L170,320 L210,560" fill="none" stroke="#2E3833" strokeWidth="2" />
          <path d="M0,470 L170,440 L400,500" fill="none" stroke="#2E3833" strokeWidth="2" />
          <g fill="#3A4540">
            <rect x="160" y="250" width="10" height="8" /><rect x="174" y="246" width="8" height="10" /><rect x="166" y="262" width="12" height="7" /><rect x="184" y="258" width="9" height="9" />
          </g>
          <circle cx="196" cy="300" r="7" fill="#5aa0ff" stroke="#fff" strokeWidth="2" />
        </svg>

        <div className="map-top">
          <select value={id} onChange={(e) => setId(e.target.value)} aria-label="Espèce affichée">
            {options.map((o) => <option key={o.id} value={o.id}>{o.fr}</option>)}
          </select>
          <span className="chip">DÉMO · ZONES ET CHIFFRES FICTIFS</span>
        </div>

        <div className="legend">
          <span className="mono" style={{ fontSize: 11 }}>{mode === "foret" ? "Probabilité (en forêt)" : "Probabilité"}</span>
          {mode === "foret" ? (
            <>
              <span className="legend-bar" style={{ background: "linear-gradient(90deg, #202D21, #4A3F27, #A06E2A, #F2A33A)" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Faible</span><span>Élevée</span></div>
            </>
          ) : (
            <div className="legend-steps">
              <span><i style={{ background: PAL[0] }} />Faible</span>
              <span><i style={{ background: PAL[1] }} />Moy.</span>
              <span><i style={{ background: PAL[2] }} />Élevée</span>
            </div>
          )}
        </div>

        <div className="mode" role="group" aria-label="Rendu de la carte">
          <button aria-pressed={mode === "carreaux"} onClick={() => changerMode("carreaux")}>Carreaux</button>
          <button aria-pressed={mode === "foret"} onClick={() => changerMode("foret")}>Dégradé</button>
        </div>
      </div>

      <section className="sheet" aria-labelledby="prev">
        <div className="head-row">
          <h2 id="prev" style={{ margin: 0, fontSize: 17 }}>Prévisions de pousse</h2>
          <span className="mono">AROME · J et J+1</span>
        </div>
        <div className="prev">
          <div className="today"><span className="lbl">Aujourd&apos;hui</span><span className="pct">{auj} %</span><span className="meta">démo · pluie et températures à venir</span></div>
          <div><span className="lbl">Demain</span><span className="pct">{dem} %</span><span className="meta">démo · pluie et températures à venir</span></div>
        </div>
        <p className="note">{esp.fr} : {esp.f.h}. Saison : {esp.f.s?.toLowerCase()}.</p>
        <a className="btn btn-ghost" href={`/fiche?id=${esp.id}`}>Voir la fiche</a>
      </section>
    </Shell>
  );
}
