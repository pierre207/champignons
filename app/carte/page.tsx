"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as MLMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Shell from "@/components/Shell";
import RechercheLieu from "@/components/RechercheLieu";
import { especes } from "@/data";
import { CARTE, GROUPES, HORS_FORET } from "@/data/carte";
import { PALIERS, classeEn, dessiner, grilleMeteo, indice, type Forets, type Grille, type Meteo, type Mode } from "@/lib/pousse";

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

export default function Carte() {
  const horsForet = useMemo(() => especes.filter((e) => HORS_FORET.includes(e.id)).map((e) => e.fr), []);
  const [gid, setGid] = useState(GROUPES[0].id);
  // Rendu « carreaux » conservé dans lib/pousse.ts mais masqué pour l’instant
  const mode: Mode = "foret";
  const [jour, setJour] = useState<0 | 1>(0);
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
  const couchesPour = (region: string, j: 0 | 1) => {
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
    const cle = `${gid}|${jour}`;
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
      const couches = d && couchesPour(d.region, jour);
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
  }, [pret, vue, version, gid, jour]);

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

  // Indices au centre de la carte
  const ici = useMemo(() => {
    if (!centre || !ou || centre.zoom < ZOOM_MIN) return null;
    const d = depts.current.get(ou)!, m = meteos.current.get(d.region);
    const c0 = couchesPour(d.region, 0), c1 = couchesPour(d.region, 1);
    if (!m || !c0 || !c1) return null;
    let classe = 0;
    const liste = c0.map((c, k) => {
      const a = indice(d.f, d.cls, m, c.g, c.p, centre.lon, centre.lat);
      const b = indice(d.f, d.cls, m, c1[k].g, c.p, centre.lon, centre.lat);
      if (a) classe = a.classe;
      return { e: c.e, auj: a ? Math.round(a.valeur * 100) : 0, dem: b ? Math.round(b.valeur * 100) : 0 };
    });
    if (!liste.length) return null;
    liste.sort((x, y) => y.auj - x.auj || y.dem - x.dem || x.e.fr.localeCompare(y.e.fr));
    return { classe, liste, auj: Math.max(...liste.map((l) => l.auj)), dem: Math.max(...liste.map((l) => l.dem)), m };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ou, centre, version, gid]);

  const m = ici?.m;
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
          <h2 id="prev" style={{ margin: 0, fontSize: 17 }}>Probabilité de pousse</h2>
          <span className="mono">{ici ? NOMS_CLASSES[ici.classe] : ""}</span>
        </div>
        {etat === "erreur" ? (
          <p className="note">Les données de la carte sont indisponibles pour le moment.</p>
        ) : centre && centre.zoom < ZOOM_MIN ? (
          <p className="note">Zoomez sur la carte pour afficher l&apos;indice de pousse.</p>
        ) : etat === "pret" && centre && vue.length === 0 ? (
          <p className="note">Pas encore de données pour cette zone : les régions sont ajoutées progressivement.</p>
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
        {etat !== "erreur" && (
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
          Indice au centre du viseur, pour l&apos;espèce la plus favorable du groupe. Estimation calculée à partir du type de forêt (IGN), de la pluie des 4 à 18 derniers jours (les plus anciens comptant moins), de la température et de la saison de chaque espèce. Ce n&apos;est pas une observation de terrain.{maj ? ` Météo mise à jour le ${maj}.` : ""}
        </p>
        <p className="note">Non affichées (espèces de prairies, de jardins ou cultivées) : {horsForet.join(", ")}.</p>
      </section>
    </Shell>
  );
}
