"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as MLMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Shell from "@/components/Shell";
import RechercheLieu from "@/components/RechercheLieu";
import { especes } from "@/data";
import { CARTE, GROUPES, HORS_FORET, PLUIE7, POIDS_NOTES, SOL_H, TEMP } from "@/data/carte";
import { PALIERS, classeEn, detailEn, dessiner, grilleMeteo, indice, type Forets, type Grille, type Meteo, type Mode } from "@/lib/pousse";

// Données par département (forêts) et par région (météo), chargées selon la zone affichée
const ZOOM_MIN = 7; // en dessous, la couche n'est pas affichée (trop de départements à charger)
const FRANCE: [number, number, number, number] = [-5.3, 41.3, 9.7, 51.2];
interface Index { regions: Record<string, string>; depts: Record<string, Forets & { region: string }> }
interface Dept { f: Forets; cls: Uint8Array; region: string }
const NOMS_CLASSES = ["Hors forêt", "Chênes", "Hêtre", "Châtaignier", "Autres feuillus", "Peupliers, robiniers", "Pins", "Sapin, épicéa", "Douglas, mélèze", "Forêt mixte"];

// Fond OpenFreeMap (style « Liberty », données OpenStreetMap), gratuit et sans clé
const STYLE = "https://tiles.openfreemap.org/styles/liberty";
const CREDITS = "BD Forêt V2 © IGN · Météo Open-Meteo";

type Etat = "chargement" | "pret" | "erreur";

const JOURS = 5;
const ETIQUETTES = ["Très défavorable", "Défavorable", "Moyen", "Favorable", "Très favorable"];
const palier = (v: number) => (v < 25 ? 0 : v < 40 ? 1 : v < 60 ? 2 : v < 80 ? 3 : 4);
const couleurIndice = (v: number) => (v < 25 ? "#4A3F27" : v < 45 ? "#a06e2a" : v < 75 ? "#c98a32" : "#f2a33a");
const jourCourt = (d: string) => (d ? new Date(`${d}T12:00`).toLocaleDateString("fr-FR", { weekday: "short" }).replace(/^./, (c) => c.toUpperCase()) : "");
const dateCourte = (d: string) => (d ? new Date(`${d}T12:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : "");

/** Phrase d'explication : la note la plus basse, puis la tendance. */
function phrase(n: { solH: number; solT: number; pluie: number; saison: number }, cols: number[], jour: number, dates: string[]) {
  if (n.saison === 0) return "Hors saison pour cette espèce.";
  const causes = [
    { v: n.solT, t: "sol trop froid ou trop chaud" }, { v: n.solH, t: "sol trop sec ou détrempé" },
    { v: n.pluie, t: "peu de pluie ces 7 derniers jours" },
  ].filter((c) => c.v < 0.5).sort((a, b) => a.v - b.v).map((c) => c.t);
  const debut = causes.length ? `Frein principal : ${causes.slice(0, 2).join(", ")}.` : "Conditions réunies.";
  const suite = cols.slice(jour + 1);
  const max = suite.length ? Math.max(...suite) : 0;
  const fin = max >= cols[jour] + 8 ? ` Hausse attendue d'ici ${jourCourt(dates[cols.indexOf(max, jour + 1)] ?? "").toLowerCase().replace(/\.$/, "") || "quelques jours"}.` : "";
  return debut + fin;
}

/** Vert dans la zone idéale, rouge quand la note est nulle (au-delà des limites), jaune entre les deux. */
const couleurCurseur = (pos: number, [a, b]: [number, number], note: number) =>
  pos >= a && pos <= b ? "var(--ok)" : note <= 0 ? "var(--danger)" : "#d9a338";

/** Jauge d'une note : valeur, zone idéale, position. */
function Jauge({ nom, poids, valeur, pos, ideal, note, bornes }: {
  nom: string; poids: number; valeur: string; pos: number; ideal: [number, number]; note: number; bornes: [string, string, string];
}) {
  const p = Number.isNaN(pos) ? null : Math.min(Math.max(pos, 0), 1);
  return (
    <div className="fac">
      <div className="l"><span>{nom}<span className="poids"> · {Math.round(poids * 100)} %</span></span><b>{valeur}</b></div>
      <div className="jauge" aria-hidden="true">
        <div className="ideal" style={{ left: `${ideal[0] * 100}%`, width: `${(ideal[1] - ideal[0]) * 100}%` }} />
        {p !== null && <div className="pt" style={{ left: `${p * 100}%`, background: couleurCurseur(pos, ideal, note) }} />}
      </div>
      <div className="bornes"><span>{bornes[0]}</span><span>{bornes[1]}</span><span>{bornes[2]}</span></div>
    </div>
  );
}

export default function Carte() {
  const horsForet = useMemo(() => especes.filter((e) => HORS_FORET.includes(e.id)).map((e) => e.fr), []);
  const [gid, setGid] = useState(GROUPES[0].id);
  // Rendu « carreaux » conservé dans lib/pousse.ts mais masqué pour l’instant
  const mode: Mode = "foret";
  const [jour, setJour] = useState(0); // 0 = aujourd'hui … 4
  const [espSel, setEspSel] = useState<string | null>(null); // null : meilleure espèce du groupe
  const [etat, setEtat] = useState<Etat>("chargement");
  const [centre, setCentre] = useState<{ lon: number; lat: number; zoom: number } | null>(null);
  const [vue, setVue] = useState<string[]>([]); // départements visibles
  const [version, setVersion] = useState(0); // incrémentée quand des données arrivent

  const boite = useRef<HTMLDivElement>(null);
  const carte = useRef<MLMap | null>(null);
  const index = useRef<Index | null>(null);
  const depts = useRef(new Map<string, Dept>());
  const meteos = useRef(new Map<string, Meteo>());
  const enCours = useRef(new Set<string>());
  const dessins = useRef(new Map<string, string>()); // département → clé groupe|jour déjà dessinée
  const grilles = useRef(new Map<string, { e: (typeof especes)[number]; p: (typeof CARTE)[string]; g: Grille }[]>());
  const [pret, setPret] = useState(false);

  // Paramètres d'URL et préférence de rendu
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("id");
    const g = q && GROUPES.find((x) => x.especes.includes(q));
    if (g) setGid(g.id);
  }, []);

  // Chargement de l'index et de la carte
  useEffect(() => {
    let annule = false;
    fetch("/data/forets/index.json")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j: Index) => { if (!annule) { index.current = j; setEtat("pret"); } })
      .catch(() => { if (!annule) setEtat("erreur"); });

    let map: MLMap | undefined;
    import("maplibre-gl").then(({ default: maplibregl }) => {
      if (annule || !boite.current) return;
      map = new maplibregl.Map({
        container: boite.current, style: STYLE, center: [7.35, 48.15], zoom: 8.3,
        minZoom: 5, maxZoom: 15, attributionControl: { compact: true, customAttribution: CREDITS },
      });
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
      map.on("load", () => {
        carte.current = map!; setPret(true);
        // Crédits repliés à l'ouverture : un clic sur (i) les affiche
        const a = boite.current?.querySelector(".maplibregl-ctrl-attrib");
        a?.classList.remove("maplibregl-compact-show");
        a?.removeAttribute("open");
      });
      const maj = () => { const c = map!.getCenter(); setCentre({ lon: c.lng, lat: c.lat, zoom: map!.getZoom() }); };
      map.on("moveend", maj);
      map.on("load", maj);
    });
    return () => { annule = true; map?.remove(); carte.current = null; };
  }, []);

  // Départements visibles
  useEffect(() => {
    const map = carte.current, idx = index.current;
    if (!pret || !map || !idx || !centre) return;
    if (centre.zoom < ZOOM_MIN) { setVue((v) => (v.length ? [] : v)); return; }
    const b = map.getBounds();
    const codes = Object.entries(idx.depts)
      .filter(([, m]) => m.lonlat[0] < b.getEast() && m.lonlat[2] > b.getWest() && m.lonlat[1] < b.getNorth() && m.lonlat[3] > b.getSouth())
      .map(([c]) => c).sort();
    setVue((v) => (v.join() === codes.join() ? v : codes));
  }, [pret, etat, centre]);

  // Chargement des départements visibles et de leur météo
  useEffect(() => {
    const idx = index.current;
    if (!idx) return;
    for (const code of vue) {
      if (depts.current.has(code) || enCours.current.has(code)) continue;
      enCours.current.add(code);
      const m = idx.depts[code];
      (async () => {
        try {
          if (!meteos.current.has(m.region)) {
            const r = await fetch(`/data/meteo/${m.region}.json`);
            if (r.ok) meteos.current.set(m.region, await r.json());
          }
          const img = new Image();
          img.src = `/data/forets/d${code}.png`;
          await img.decode();
          const c = document.createElement("canvas");
          c.width = m.width; c.height = m.height;
          const cx = c.getContext("2d", { willReadFrequently: true })!;
          cx.drawImage(img, 0, 0);
          const rgba = cx.getImageData(0, 0, m.width, m.height).data;
          const cls = new Uint8Array(m.width * m.height);
          for (let i = 0; i < cls.length; i++) cls[i] = rgba[i * 4];
          depts.current.set(code, { f: m, cls, region: m.region });
          setVersion((v) => v + 1);
        } finally {
          enCours.current.delete(code);
        }
      })();
    }
  }, [vue]);

  const groupe = GROUPES.find((g) => g.id === gid)!;
  const membres = useMemo(() => groupe.especes.map((id) => especes.find((e) => e.id === id)!).filter(Boolean), [groupe]);

  // Grilles météo (par région, groupe et jour) pour chaque espèce du groupe
  const couchesPour = (region: string, j: number) => {
    const m = meteos.current.get(region);
    if (!m) return null;
    const k = `${region}|${gid}|${j}`;
    let c = grilles.current.get(k);
    if (!c) {
      c = membres.map((e) => ({ e, p: CARTE[e.id], g: grilleMeteo(m, m.today + j, CARTE[e.id], e) }));
      grilles.current.set(k, c);
    }
    return c;
  };

  // Dessin de la couche de probabilité, un calque par département visible
  useEffect(() => {
    const map = carte.current;
    if (!pret || !map) return;
    const etiquettes = map.getStyle().layers.find((l) => l.type === "symbol")?.id;
    const cle = `${gid}|${jour}|${espSel ?? ""}`;
    for (const [code] of dessins.current) {
      if (vue.includes(code)) continue;
      if (map.getLayer(`pousse-${code}`)) map.removeLayer(`pousse-${code}`);
      if (map.getSource(`pousse-${code}`)) map.removeSource(`pousse-${code}`);
      dessins.current.delete(code);
    }
    // On ne garde en mémoire que les départements récents
    if (depts.current.size > 24) for (const code of depts.current.keys()) if (!vue.includes(code) && depts.current.size > 24) depts.current.delete(code);
    for (const code of vue) {
      const d = depts.current.get(code);
      const toutes = d && couchesPour(d.region, jour);
      const couches = toutes && (espSel ? toutes.filter((c) => c.e.id === espSel) : toutes);
      if (!d || !couches || dessins.current.get(code) === cle) continue;
      const canvas = document.createElement("canvas");
      dessiner(canvas, d.f, d.cls, meteos.current.get(d.region)!, couches, mode);
      const [x0, y0, x1, y1] = d.f.lonlat;
      const id = `pousse-${code}`;
      if (map.getLayer(id)) map.removeLayer(id);
      if (map.getSource(id)) map.removeSource(id);
      map.addSource(id, { type: "canvas", canvas, animate: false, coordinates: [[x0, y1], [x1, y1], [x1, y0], [x0, y0]] });
      map.addLayer({ id, type: "raster", source: id, paint: { "raster-opacity": 0.85, "raster-resampling": "linear" } }, etiquettes);
      dessins.current.set(code, cle);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pret, vue, version, gid, jour, espSel]);

  // Département chargé sous le centre de la carte (de préférence celui qui y a de la forêt)
  const ou = useMemo(() => {
    if (!centre) return null;
    let repli: string | null = null;
    for (const [code, d] of depts.current) {
      const c = classeEn(d.f, d.cls, centre.lon, centre.lat);
      if (c === null) continue;
      if (c > 0) return code;
      repli = repli ?? code;
    }
    return repli;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centre, version]);

  // Indices au centre de la carte, pour chaque espèce du groupe et les 5 jours
  const ici = useMemo(() => {
    if (!centre || !ou || centre.zoom < ZOOM_MIN) return null;
    const d = depts.current.get(ou)!, m = meteos.current.get(d.region);
    if (!m) return null;
    const jours = Array.from({ length: Math.min(JOURS, m.dates.length - m.today) }, (_, j) => j);
    const parJour = jours.map((j) => couchesPour(d.region, j));
    if (parJour.some((c) => !c)) return null;
    let classe = 0;
    const liste = parJour[0]!.map((c, k) => ({
      e: c.e, p: c.p,
      vals: parJour.map((cj) => {
        const r = indice(d.f, d.cls, m, cj![k].g, c.p, centre.lon, centre.lat);
        if (r) classe = r.classe;
        return r ? Math.round(r.valeur * 100) : 0;
      }),
    }));
    return { classe, liste, m, dates: jours.map((j) => m.dates[m.today + j]) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ou, centre, version, gid]);

  // Meilleure espèce du jour affiché (option retenue : la carte montre le maximum du groupe)
  const meilleure = ici ? ici.liste.reduce((a, b) => (b.vals[jour] > a.vals[jour] ? b : a)) : null;
  const choisie = ici ? (espSel ? ici.liste.find((l) => l.e.id === espSel) ?? meilleure : meilleure) : null;
  // Colonnes des 5 jours : maximum du groupe, ou espèce choisie
  const colonnes = ici ? ici.dates.map((_, j) => (espSel && choisie ? choisie.vals[j] : Math.max(...ici.liste.map((l) => l.vals[j])))) : [];
  const valeur = colonnes[jour] ?? 0;
  const detail = ici && choisie && centre ? detailEn(ici.m, ici.m.today + jour, choisie.p, choisie.e, centre.lon, centre.lat) : null;
  const meilleurJour = colonnes.length ? colonnes.indexOf(Math.max(...colonnes)) : -1;

  const m = ici?.m;
  const maj = m ? new Date(m.updated).toLocaleString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }) : "";

  return (
    <Shell tab="carte">
      <div className="map-wrap">
        <div ref={boite} className="map-gl" aria-label="Carte des zones favorables" role="region" />
        <div className="viseur" aria-hidden="true" />

        <div className="map-top">
          <select value={gid} onChange={(e) => { setGid(e.target.value); setEspSel(null); }} aria-label="Groupe d'espèces affiché">
            {GROUPES.map((g) => <option key={g.id} value={g.id}>{g.nom}</option>)}
          </select>
          <RechercheLieu
            zone={FRANCE}
            onChoix={(l) => carte.current?.flyTo({ center: [l.lon, l.lat], zoom: l.commune ? 11.5 : 13.5, essential: true })}
          />
        </div>

        <div className="legend">
          <span className="legend-titre">Indice de pousse</span>
          <span className="legend-bar" style={{ background: `linear-gradient(90deg, ${PALIERS.map((p) => p.couleur).join(", ")})` }} />
          <div className="legend-bornes"><span>Faible</span><span>Élevé</span></div>
        </div>
      </div>

      <section className="sheet" aria-labelledby="prev">
        <div className="head-row">
          <h2 id="prev" style={{ margin: 0, fontSize: 17 }}>Indice de pousse</h2>
          <span className="mono">{ici ? NOMS_CLASSES[ici.classe] : ""}</span>
        </div>
        {etat === "erreur" ? (
          <p className="note">Les données de la carte sont indisponibles pour le moment.</p>
        ) : centre && centre.zoom < ZOOM_MIN ? (
          <p className="note">Zoomez sur la carte pour afficher l&apos;indice de pousse.</p>
        ) : etat === "pret" && centre && vue.length === 0 ? (
          <p className="note">Pas encore de données pour cette zone : les régions sont ajoutées progressivement.</p>
        ) : (
          <>
            <div className="esp-sel" role="group" aria-label="Espèce affichée">
              {(ici?.liste ?? membres.map((e) => ({ e, vals: [] as number[] })))
                .slice().sort((x, y) => (y.vals[jour] ?? 0) - (x.vals[jour] ?? 0))
                .map(({ e }) => {
                  const on = choisie?.e.id === e.id;
                  return (
                    <button key={e.id} type="button" className={on ? "on" : ""} aria-pressed={on}
                      onClick={() => setEspSel(espSel === e.id || meilleure?.e.id === e.id ? null : e.id)}>
                      {meilleure?.e.id === e.id ? "★ " : ""}{e.fr}
                    </button>
                  );
                })}
            </div>

            <div className="indice-jour">
              <div className="v">{ici ? valeur : "–"}<small> /100</small></div>
              <div>
                <span className={`etiq etiq-${palier(valeur)}`}>{ETIQUETTES[palier(valeur)]}</span>
                {choisie && <p className="fort">{espSel ? `Espèce affichée : ${choisie.e.fr.toLowerCase()}.` : `Meilleure espèce du groupe ici : ${choisie.e.fr.toLowerCase()}.`}</p>}
                {detail && <p>{phrase(detail.notes, colonnes, jour, ici!.dates)}</p>}
              </div>
            </div>

            {colonnes.length > 0 && (
              <div className="sec">
                <h3>{colonnes.length} prochains jours</h3>
                <div className="jours" role="group" aria-label="Jour affiché sur la carte">
                  {colonnes.map((v, j) => (
                    <button key={j} type="button" className={`jour${j === jour ? " sel" : ""}${j === meilleurJour && j !== jour ? " best" : ""}`}
                      aria-pressed={j === jour} onClick={() => setJour(j)}>
                      <b>{j === 0 ? "Auj." : jourCourt(ici!.dates[j])}</b>
                      <span>{dateCourte(ici!.dates[j])}</span>
                      <span className="col"><i style={{ height: `${v}%`, background: couleurIndice(v) }} /></span>
                      <em>{v}</em>
                      <small>{j === meilleurJour ? "meilleur" : j > 0 && v > colonnes[j - 1] ? "↗" : j > 0 && v < colonnes[j - 1] ? "↘" : ""}</small>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {detail && choisie && (
              <div className="sec">
                <h3>Pourquoi cet indice</h3>
                <div className="note-fac">
                  <Jauge nom="Humidité du sol" poids={POIDS_NOTES.solH} valeur={Number.isNaN(detail.brut.solH) ? "–" : `${Math.round(detail.brut.solH * 100)} %`}
                    pos={detail.brut.solH / 0.5} ideal={[SOL_H[1] / 0.5, SOL_H[2] / 0.5]} note={detail.notes.solH} bornes={["Sec", "Idéal", "Saturé"]} />
                  <Jauge nom="Température du sol" poids={POIDS_NOTES.solT} valeur={Number.isNaN(detail.brut.solT) ? "–" : `${Math.round(detail.brut.solT)} °C`}
                    pos={detail.brut.solT / 25} ideal={[TEMP[choisie.p.profil][1] / 25, TEMP[choisie.p.profil][2] / 25]} note={detail.notes.solT}
                    bornes={["0 °C", `Idéal ${TEMP[choisie.p.profil][1]}–${TEMP[choisie.p.profil][2]} °C`, "25 °C"]} />
                  <Jauge nom="Pluie des 7 derniers jours" poids={POIDS_NOTES.pluie} valeur={Number.isNaN(detail.brut.pluie) ? "–" : `${Math.round(detail.brut.pluie)} mm`}
                    pos={detail.brut.pluie / 60} ideal={[PLUIE7[0] / 60, PLUIE7[1] / 60]} note={detail.notes.pluie} bornes={["0 mm", `Idéal ${PLUIE7[0]}–${PLUIE7[1]} mm`, "60 mm"]} />
                  <Jauge nom="Saison" poids={POIDS_NOTES.saison} valeur={detail.saisonPos < 0 ? "Hors saison" : detail.saisonPos < 0.3 ? "Début de saison" : detail.saisonPos <= 0.7 ? "Bonne période" : detail.saisonPos <= 1 ? "Fin de saison" : "Hors saison"}
                    pos={(detail.saisonPos + 0.2) / 1.4} ideal={[0.5 / 1.4, 0.9 / 1.4]} note={detail.notes.saison} bornes={["Tôt", `Pic (${choisie.e.f.s ?? ""})`, "Tard"]} />
                </div>
                <p className="note" style={{ marginTop: 10 }}>
                  Indice = moyenne pondérée des 4 notes, multipliée par l&apos;intérêt du type de forêt pour l&apos;espèce ({NOMS_CLASSES[ici!.classe].toLowerCase()}). Hors saison, pas d&apos;indice.
                </p>
              </div>
            )}

            <div className="sec">
              <h3>{groupe.nom} · {jour === 0 ? "aujourd'hui" : `${jourCourt(ici?.dates[jour] ?? "")} ${dateCourte(ici?.dates[jour] ?? "")}`}</h3>
              <ul className="classement">
                {(ici?.liste ?? membres.map((e) => ({ e, vals: [] as number[] })))
                  .slice().sort((x, y) => (y.vals[jour] ?? 0) - (x.vals[jour] ?? 0))
                  .map(({ e, vals }) => {
                    const v = vals[jour] ?? 0;
                    return (
                      <li key={e.id}>
                        <a href={`/fiche?id=${e.id}`}>
                          <span className="nom">{e.fr}<span className="saison">{e.f.s}</span></span>
                          <span className="barre" aria-hidden="true"><i style={{ width: `${v}%` }} /></span>
                          <span className="val">{ici ? v : "–"}</span>
                        </a>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </>
        )}
        <p className="note">
          Indice au centre du viseur. Estimation calculée à partir du type de forêt (IGN), de l&apos;humidité et de la température du sol, de la pluie des 7 derniers jours et de la saison de chaque espèce. Ce n&apos;est pas une observation de terrain.{maj ? ` Météo mise à jour le ${maj}.` : ""}
        </p>
        <p className="note">Non affichées (espèces de prairies, de jardins ou cultivées) : {horsForet.join(", ")}.</p>
      </section>
    </Shell>
  );
}
