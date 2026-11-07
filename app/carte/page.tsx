"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as MLMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Shell from "@/components/Shell";
import { especes } from "@/data";
import { CARTE, HORS_FORET } from "@/data/carte";
import { PALIERS, dessiner, grilleMeteo, indice, type Forets, type Meteo, type Mode } from "@/lib/pousse";

const ZONE = "alsace";
const NOMS_CLASSES = ["Hors forêt", "Chênes", "Hêtre", "Châtaignier", "Autres feuillus", "Peupliers, robiniers", "Pins", "Sapin, épicéa", "Douglas, mélèze", "Forêt mixte"];

const STYLE = {
  version: 8 as const,
  sources: {
    ign: {
      type: "raster" as const,
      tiles: ["https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&TILEMATRIXSET=PM&FORMAT=image/png&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}"],
      tileSize: 256, maxzoom: 19, attribution: "© IGN Plan IGN · BD Forêt V2 · Météo Open-Meteo",
    },
  },
  layers: [{ id: "ign", type: "raster" as const, source: "ign", paint: { "raster-brightness-max": 0.55, "raster-saturation": -0.6, "raster-contrast": 0.1 } }],
};

type Etat = "chargement" | "pret" | "sans-donnees";

export default function Carte() {
  const options = useMemo(() => especes.filter((e) => e.cat === "comestible" && CARTE[e.id]), []);
  const horsForet = useMemo(() => especes.filter((e) => HORS_FORET.includes(e.id)).map((e) => e.fr), []);
  const [id, setId] = useState(options[0].id);
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
    if (q && CARTE[q]) setId(q);
    try { const m = localStorage.getItem("carte-mode"); if (m === "carreaux" || m === "foret") setMode(m); } catch {}
  }, []);

  // Chargement des données et de la carte
  useEffect(() => {
    let annule = false;
    (async () => {
      try {
        const [fr, mr] = await Promise.all([fetch(`data/forets-${ZONE}.json`), fetch(`data/meteo-${ZONE}.json`)]);
        if (!fr.ok || !mr.ok) throw new Error("absent");
        const f: Forets = await fr.json();
        const m: Meteo = await mr.json();
        const img = new Image();
        img.src = `data/forets-${ZONE}.png`;
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
        minZoom: 7, maxZoom: 15, attributionControl: { compact: true },
      });
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
      map.on("load", () => { carte.current = map!; setPret(true); });
      const maj = () => { const c = map!.getCenter(); setCentre({ lon: c.lng, lat: c.lat }); };
      map.on("moveend", maj);
      map.on("load", maj);
    });
    return () => { annule = true; map?.remove(); carte.current = null; };
  }, []);

  const param = CARTE[id];
  const esp = especes.find((e) => e.id === id)!;

  // Grilles météo du jour et du lendemain pour l'espèce choisie
  const grilles = useMemo(() => {
    const d = donnees.current;
    if (etat !== "pret" || !d) return null;
    return [grilleMeteo(d.m, d.m.today, param, esp), grilleMeteo(d.m, d.m.today + 1, param, esp)];
  }, [etat, param, esp]);

  // Dessin de la couche de probabilité
  useEffect(() => {
    const map = carte.current, d = donnees.current;
    if (!pret || !map || !d || !grilles) return;
    const canvas = toile.current ?? (toile.current = document.createElement("canvas"));
    dessiner(canvas, d.f, d.cls, d.m, grilles[jour], param, mode);
    const [x0, y0, x1, y1] = d.f.lonlat;
    if (map.getLayer("pousse")) map.removeLayer("pousse");
    if (map.getSource("pousse")) map.removeSource("pousse");
    map.addSource("pousse", { type: "canvas", canvas, animate: false, coordinates: [[x0, y1], [x1, y1], [x1, y0], [x0, y0]] });
    map.addLayer({ id: "pousse", type: "raster", source: "pousse", paint: { "raster-opacity": 0.9, "raster-resampling": mode === "carreaux" ? "nearest" : "linear" } });
  }, [pret, grilles, jour, mode, param]);

  const changerMode = (m: Mode) => { setMode(m); try { localStorage.setItem("carte-mode", m); } catch {} };

  // Indices au centre de la carte
  const ici = useMemo(() => {
    const d = donnees.current;
    if (!d || !grilles || !centre) return null;
    const a = indice(d.f, d.cls, d.m, grilles[0], param, centre.lon, centre.lat);
    const b = indice(d.f, d.cls, d.m, grilles[1], param, centre.lon, centre.lat);
    return a && b ? { classe: a.classe, auj: Math.round(a.valeur * 100), dem: Math.round(b.valeur * 100) } : null;
  }, [grilles, centre, param]);

  const m = donnees.current?.m;
  const maj = m ? new Date(m.updated).toLocaleString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }) : "";

  return (
    <Shell tab="carte">
      <div className="map-wrap">
        <div ref={boite} className="map-gl" aria-label="Carte des zones favorables" role="region" />
        <div className="viseur" aria-hidden="true" />

        <div className="map-top">
          <select value={id} onChange={(e) => setId(e.target.value)} aria-label="Espèce affichée">
            {options.map((o) => <option key={o.id} value={o.id}>{o.fr}</option>)}
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
        <p className="note">
          Estimation calculée à partir du type de forêt (IGN), de la pluie des 4 à 14 derniers jours, de la température et de la saison de {esp.fr.toLowerCase()} ({esp.f.s?.toLowerCase()}). Ce n&apos;est pas une observation de terrain.{maj ? ` Météo mise à jour le ${maj}.` : ""}
        </p>
        <p className="note">Non affichées (espèces de prairies, de jardins ou cultivées) : {horsForet.join(", ")}.</p>
        <a className="btn btn-ghost" href={`fiche.html?id=${esp.id}`}>Voir la fiche</a>
      </section>
    </Shell>
  );
}
