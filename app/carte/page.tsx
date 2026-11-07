"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as MLMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Shell from "@/components/Shell";
import { especes } from "@/data";
import { CARTE, GROUPES, HORS_FORET } from "@/data/carte";
import { PALIERS, dessiner, grilleMeteo, indice, type Forets, type Meteo, type Mode } from "@/lib/pousse";

const ZONE = "alsace";
const NOMS_CLASSES = ["Hors forêt", "Chênes", "Hêtre", "Châtaignier", "Autres feuillus", "Peupliers, robiniers", "Pins", "Sapin, épicéa", "Douglas, mélèze", "Forêt mixte"];

// Fond OpenFreeMap (style « Liberty », données OpenStreetMap), gratuit et sans clé
const STYLE = "https://tiles.openfreemap.org/styles/liberty";
const CREDITS = "BD Forêt V2 © IGN · Météo Open-Meteo";

type Etat = "chargement" | "pret" | "sans-donnees";

export default function Carte() {
  const horsForet = useMemo(() => especes.filter((e) => HORS_FORET.includes(e.id)).map((e) => e.fr), []);
  const [gid, setGid] = useState(GROUPES[0].id);
  const [mode, setMode] = useState<Mode>("foret");
  const [jour, setJour] = useState<0 | 1>(0);
  const [etat, setEtat] = useState<Etat>("chargement");
  const [centre, setCentre] = useState<{ lon: number; lat: number } | null>(null);

  const boite = useRef<HTMLDivElement>(null);
  const carte = useRef<MLMap | null>(null);
  const toile = useRef<HTMLCanvasElement | null>(null);
  const donnees = useRef<{ f: Forets; cls: Uint8Array; m: Meteo } | null>(null);
  const [pret, setPret] = useState(false);

  // Paramètres d'URL et préférence de rendu
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("id");
    const g = q && GROUPES.find((x) => x.especes.includes(q));
    if (g) setGid(g.id);
    try { const m = localStorage.getItem("carte-mode"); if (m === "carreaux" || m === "foret") setMode(m); } catch {}
  }, []);

  // Chargement des données et de la carte
  useEffect(() => {
    let annule = false;
    (async () => {
      try {
        const [fr, mr] = await Promise.all([fetch(`/data/forets-${ZONE}.json`), fetch(`/data/meteo-${ZONE}.json`)]);
        if (!fr.ok || !mr.ok) throw new Error("absent");
        const f: Forets = await fr.json();
        const m: Meteo = await mr.json();
        const img = new Image();
        img.src = `/data/forets-${ZONE}.png`;
        await img.decode();
        const c = document.createElement("canvas");
        c.width = f.width; c.height = f.height;
        const cx = c.getContext("2d", { willReadFrequently: true })!;
        cx.drawImage(img, 0, 0);
        const rgba = cx.getImageData(0, 0, f.width, f.height).data;
        const cls = new Uint8Array(f.width * f.height);
        for (let i = 0; i < cls.length; i++) cls[i] = rgba[i * 4];
        if (annule) return;
        donnees.current = { f, cls, m };
        setEtat("pret");
      } catch {
        if (!annule) setEtat("sans-donnees");
      }
    })();

    let map: MLMap | undefined;
    import("maplibre-gl").then(({ default: maplibregl }) => {
      if (annule || !boite.current) return;
      map = new maplibregl.Map({
        container: boite.current, style: STYLE, center: [7.35, 48.15], zoom: 8.3,
        minZoom: 7, maxZoom: 15, attributionControl: { compact: true, customAttribution: CREDITS },
      });
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
      map.on("load", () => { carte.current = map!; setPret(true); });
      const maj = () => { const c = map!.getCenter(); setCentre({ lon: c.lng, lat: c.lat }); };
      map.on("moveend", maj);
      map.on("load", maj);
    });
    return () => { annule = true; map?.remove(); carte.current = null; };
  }, []);

  const groupe = GROUPES.find((g) => g.id === gid)!;
  const membres = useMemo(() => groupe.especes.map((id) => especes.find((e) => e.id === id)!).filter(Boolean), [groupe]);

  // Grilles météo du jour et du lendemain pour chaque espèce du groupe
  const couches = useMemo(() => {
    const d = donnees.current;
    if (etat !== "pret" || !d) return null;
    return [0, 1].map((j) => membres.map((e) => ({ e, p: CARTE[e.id], g: grilleMeteo(d.m, d.m.today + j, CARTE[e.id], e) })));
  }, [etat, membres]);

  // Dessin de la couche de probabilité
  useEffect(() => {
    const map = carte.current, d = donnees.current;
    if (!pret || !map || !d || !couches) return;
    const canvas = toile.current ?? (toile.current = document.createElement("canvas"));
    dessiner(canvas, d.f, d.cls, d.m, couches[jour], mode);
    const [x0, y0, x1, y1] = d.f.lonlat;
    if (map.getLayer("pousse")) map.removeLayer("pousse");
    if (map.getSource("pousse")) map.removeSource("pousse");
    map.addSource("pousse", { type: "canvas", canvas, animate: false, coordinates: [[x0, y1], [x1, y1], [x1, y0], [x0, y0]] });
    const etiquettes = map.getStyle().layers.find((l) => l.type === "symbol")?.id;
    map.addLayer({ id: "pousse", type: "raster", source: "pousse", paint: { "raster-opacity": 0.85, "raster-resampling": mode === "carreaux" ? "nearest" : "linear" } }, etiquettes);
  }, [pret, couches, jour, mode]);

  const changerMode = (m: Mode) => { setMode(m); try { localStorage.setItem("carte-mode", m); } catch {} };

  // Indices au centre de la carte
  const ici = useMemo(() => {
    const d = donnees.current;
    if (!d || !couches || !centre) return null;
    let classe = 0;
    const liste = couches[0].map((c, k) => {
      const a = indice(d.f, d.cls, d.m, c.g, c.p, centre.lon, centre.lat);
      const b = indice(d.f, d.cls, d.m, couches[1][k].g, c.p, centre.lon, centre.lat);
      if (a) classe = a.classe;
      return { e: c.e, auj: a ? Math.round(a.valeur * 100) : 0, dem: b ? Math.round(b.valeur * 100) : 0 };
    });
    if (!liste.length) return null;
    liste.sort((x, y) => y.auj - x.auj || y.dem - x.dem || x.e.fr.localeCompare(y.e.fr));
    return { classe, liste, auj: Math.max(...liste.map((l) => l.auj)), dem: Math.max(...liste.map((l) => l.dem)) };
  }, [couches, centre]);

  const m = donnees.current?.m;
  const maj = m ? new Date(m.updated).toLocaleString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }) : "";

  return (
    <Shell tab="carte">
      <div className="map-wrap">
        <div ref={boite} className="map-gl" aria-label="Carte des zones favorables" role="region" />
        <div className="viseur" aria-hidden="true" />

        <div className="map-top">
          <select value={gid} onChange={(e) => setGid(e.target.value)} aria-label="Groupe d'espèces affiché">
            {GROUPES.map((g) => <option key={g.id} value={g.id}>{g.nom}</option>)}
          </select>
          <span className="chip">{etat === "sans-donnees" ? "DONNÉES EN PRÉPARATION" : `ALSACE · ${jour === 0 ? "AUJOURD'HUI" : "DEMAIN"} · ESTIMATION`}</span>
        </div>

        <div className="legend">
          <span className="mono" style={{ fontSize: 11 }}>{mode === "foret" ? "Indice de pousse (en forêt)" : "Indice de pousse"}</span>
          {mode === "foret" ? (
            <>
              <span className="legend-bar" style={{ background: `linear-gradient(90deg, ${PALIERS.map((p) => p.couleur).join(", ")})` }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Faible</span><span>Élevé</span></div>
            </>
          ) : (
            <div className="legend-steps">
              <span><i style={{ background: PALIERS[0].couleur }} />Faible</span>
              <span><i style={{ background: PALIERS[1].couleur }} />Moy.</span>
              <span><i style={{ background: PALIERS[2].couleur }} />Élevé</span>
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
          <h2 id="prev" style={{ margin: 0, fontSize: 17 }}>Au centre de la carte</h2>
          <span className="mono">{ici ? NOMS_CLASSES[ici.classe] : ""}</span>
        </div>
        {etat === "sans-donnees" ? (
          <p className="note">Les données des forêts et de la météo ne sont pas encore générées pour cette zone.</p>
        ) : (
          <div className="prev" role="group" aria-label="Jour affiché sur la carte">
            <button className={jour === 0 ? "today" : ""} aria-pressed={jour === 0} onClick={() => setJour(0)}>
              <span className="lbl">Aujourd&apos;hui</span><span className="pct">{ici ? `${ici.auj}` : "–"}<small> /100</small></span>
            </button>
            <button className={jour === 1 ? "today" : ""} aria-pressed={jour === 1} onClick={() => setJour(1)}>
              <span className="lbl">Demain</span><span className="pct">{ici ? `${ici.dem}` : "–"}<small> /100</small></span>
            </button>
          </div>
        )}
        {etat !== "sans-donnees" && (
          <div>
            <h3 className="mono" style={{ margin: "4px 0 6px" }}>{groupe.nom} · {jour === 0 ? "aujourd'hui" : "demain"}</h3>
            <ul className="classement">
              {(ici?.liste ?? membres.map((e) => ({ e, auj: 0, dem: 0 })))
                .slice().sort((x, y) => (jour === 0 ? y.auj - x.auj : y.dem - x.dem))
                .map(({ e, auj, dem }) => {
                  const v = jour === 0 ? auj : dem;
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
        )}
        <p className="note">
          Indice au centre du viseur, pour l&apos;espèce la plus favorable du groupe. Estimation calculée à partir du type de forêt (IGN), de la pluie des 4 à 14 derniers jours, de la température et de la saison de chaque espèce. Ce n&apos;est pas une observation de terrain.{maj ? ` Météo mise à jour le ${maj}.` : ""}
        </p>
        <p className="note">Non affichées (espèces de prairies, de jardins ou cultivées) : {horsForet.join(", ")}.</p>
      </section>
    </Shell>
  );
}
