import { PLUIE, TEMP, poids, type ParamCarte } from "@/data/carte";
import type { Espece } from "@/data/types";

export interface Forets {
  width: number; height: number; res: number;
  merc: [number, number, number, number];
  lonlat: [number, number, number, number];
  classes?: string[];
}
export interface Meteo {
  lon0: number; lat0: number; step: number; nx: number; ny: number;
  dates: string[]; today: number; updated: string;
  /** null : point de grille loin de toute forêt, non demandé */
  rain: (number[] | null)[]; tmean: ((number | null)[] | null)[];
}

const R = 6378137;
export const mercToLon = (x: number) => (x / R) * (180 / Math.PI);
export const mercToLat = (y: number) => (Math.atan(Math.sinh(y / R)) * 180) / Math.PI;
export const lonToMerc = (lon: number) => (lon * Math.PI * R) / 180;
export const latToMerc = (lat: number) => R * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Facteur de saison : 1 dans la période, 0,4 le mois avant ou après, 0 sinon. */
export function saison(e: Espece, date: string) {
  const m = Number(date.slice(5, 7));
  const [a, b] = e.mois;
  const dans = (x: number) => (a <= b ? x >= a && x <= b : x >= a || x <= b);
  if (dans(m)) return 1;
  if (dans(m === 12 ? 1 : m + 1) || dans(m === 1 ? 12 : m - 1)) return 0.4;
  return 0;
}

/** Facteur météo (0–1) pour un point de grille et un jour (index dans meteo.dates). */
export function facteurMeteo(m: Meteo, point: number, jour: number, p: ParamCarte) {
  const pluie = m.rain[point];
  const temp = m.tmean[point];
  if (!pluie || !temp) return 0;
  let cumul = 0;
  for (let d = jour - 14; d <= jour - 4; d++) if (d >= 0) cumul += pluie[d] ?? 0;
  let ts = 0, n = 0;
  for (let d = jour - 6; d <= jour; d++) { const t = temp[d]; if (d >= 0 && t != null) { ts += t; n++; } }
  if (!n) return 0;
  const t = ts / n;
  const [rmin, ropt] = PLUIE[p.profil];
  const fPluie = clamp((cumul - rmin) / (ropt - rmin));
  const [t0, t1, t2, t3] = TEMP[p.profil];
  const fTemp = t <= t0 || t >= t3 ? 0 : t < t1 ? (t - t0) / (t1 - t0) : t <= t2 ? 1 : (t3 - t) / (t3 - t2);
  return fPluie * fTemp;
}

/** Grille des facteurs météo × saison pour un jour. */
export function grilleMeteo(m: Meteo, jour: number, p: ParamCarte, e: Espece) {
  const s = saison(e, m.dates[jour]);
  const g = new Float32Array(m.nx * m.ny);
  if (s > 0) for (let i = 0; i < g.length; i++) g[i] = facteurMeteo(m, i, jour, p) * s;
  return g;
}

/** Interpolation bilinéaire de la grille météo en (lon, lat). */
export function echantillon(m: Meteo, g: Float32Array, lon: number, lat: number) {
  const fx = Math.min(Math.max((lon - m.lon0) / m.step, 0), m.nx - 1.001);
  const fy = Math.min(Math.max((lat - m.lat0) / m.step, 0), m.ny - 1.001);
  const x = Math.floor(fx), y = Math.floor(fy), dx = fx - x, dy = fy - y;
  const i = y * m.nx + x;
  return (g[i] * (1 - dx) + g[i + 1] * dx) * (1 - dy) + (g[i + m.nx] * (1 - dx) + g[i + m.nx + 1] * dx) * dy;
}

/** Classe d'essence en un point, ou null hors de l'emprise du raster. */
export function classeEn(f: Forets, cls: Uint8Array, lon: number, lat: number) {
  const px = Math.floor((lonToMerc(lon) - f.merc[0]) / f.res);
  const py = Math.floor((f.merc[3] - latToMerc(lat)) / f.res);
  if (px < 0 || py < 0 || px >= f.width || py >= f.height) return null;
  return cls[py * f.width + px];
}

/** Indice de pousse (0–1) en un point. */
export function indice(f: Forets, cls: Uint8Array, m: Meteo, g: Float32Array, p: ParamCarte, lon: number, lat: number) {
  const px = Math.floor((lonToMerc(lon) - f.merc[0]) / f.res);
  const py = Math.floor((f.merc[3] - latToMerc(lat)) / f.res);
  if (px < 0 || py < 0 || px >= f.width || py >= f.height) return null;
  const c = cls[py * f.width + px];
  return { classe: c, valeur: poids(p, c) * echantillon(m, g, lon, lat) };
}

// Palette (identique au prototype) : faible, moyenne, élevée
const STOPS: [number, [number, number, number]][] = [
  [0.15, [74, 63, 39]], [0.45, [160, 110, 42]], [0.75, [242, 163, 58]],
];
export const PALIERS = STOPS.map(([v, c]) => ({ v, couleur: `rgb(${c.join(",")})` }));

function couleur(v: number): [number, number, number, number] {
  if (v < STOPS[0][0]) return [0, 0, 0, 0];
  for (let k = STOPS.length - 1; k >= 0; k--) {
    if (v >= STOPS[k][0]) {
      if (k === STOPS.length - 1) return [...STOPS[k][1], 230];
      const [v0, c0] = STOPS[k], [v1, c1] = STOPS[k + 1];
      const t = (v - v0) / (v1 - v0);
      return [c0[0] + (c1[0] - c0[0]) * t, c0[1] + (c1[1] - c0[1]) * t, c0[2] + (c1[2] - c0[2]) * t, 150 + 80 * t];
    }
  }
  return [0, 0, 0, 0];
}
function palier(v: number): [number, number, number, number] {
  for (let k = STOPS.length - 1; k >= 0; k--) if (v >= STOPS[k][0]) return [...STOPS[k][1], 225];
  return [0, 0, 0, 0];
}

export type Mode = "carreaux" | "foret";
const BLOC = 6; // carreaux de 6 × 6 pixels (600 m Web Mercator, ≈ 400 m au sol)

/** Dessine la couche de probabilité sur un canvas de la taille du raster des forêts. */
export interface Couche { p: ParamCarte; g: Float32Array }

/** Valeur maximale parmi les espèces d'un groupe, pour une classe d'essence et un point. */
function maxCouches(pws: Float32Array[], gs: Float32Array[], c: number, m: Meteo, lon: number, lat: number) {
  let v = 0;
  for (let k = 0; k < gs.length; k++) {
    const w = pws[k][c];
    if (w <= v) continue; // l’échantillon météo ne dépasse jamais 1
    const x = w * echantillon(m, gs[k], lon, lat);
    if (x > v) v = x;
  }
  return v;
}

/** Dessine la couche de probabilité (maximum des espèces fournies) sur un canvas de la taille du raster des forêts. */
export function dessiner(canvas: HTMLCanvasElement, f: Forets, cls: Uint8Array, m: Meteo, couches: Couche[], mode: Mode) {
  const { width: w, height: h } = f;
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const lons = new Float32Array(w), lats = new Float32Array(h);
  for (let x = 0; x < w; x++) lons[x] = mercToLon(f.merc[0] + (x + 0.5) * f.res);
  for (let y = 0; y < h; y++) lats[y] = mercToLat(f.merc[3] - (y + 0.5) * f.res);
  // Les espèces hors saison (grille nulle) sont ignorées
  const actives = couches.filter((c) => c.g.some((v) => v > 0));
  const gs = actives.map((c) => c.g);
  const pws = actives.map((c) => { const a = new Float32Array(10); for (let k = 0; k < 10; k++) a[k] = poids(c.p, k); return a; });

  const img = ctx.createImageData(w, h);
  const d = img.data;
  if (mode === "foret") {
    // Valeur par pixel, lissée, puis découpée aux contours des forêts
    const val = new Float32Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (cls[i]) val[i] = maxCouches(pws, gs, cls[i], m, lons[x], lats[y]);
    }
    const lisse = flou(val, cls, w, h, 4);
    for (let i = 0; i < w * h; i++) {
      if (!cls[i]) continue;
      const [r, gg, b, a] = couleur(lisse[i]);
      d[i * 4] = r; d[i * 4 + 1] = gg; d[i * 4 + 2] = b; d[i * 4 + 3] = a;
    }
  } else {
    for (let by = 0; by < h; by += BLOC) for (let bx = 0; bx < w; bx += BLOC) {
      const nb = new Uint16Array(10);
      let foret = 0, n = 0;
      for (let y = by; y < Math.min(by + BLOC, h); y++) for (let x = bx; x < Math.min(bx + BLOC, w); x++) {
        const c = cls[y * w + x]; n++;
        if (c) { foret++; nb[c]++; }
      }
      if (foret / n < 0.25 || !gs.length) continue;
      const cx = Math.min(bx + BLOC / 2, w - 1), cy = Math.min(by + BLOC / 2, h - 1);
      let v = 0;
      for (let k = 0; k < gs.length; k++) {
        let somme = 0;
        for (let c = 1; c < 10; c++) somme += nb[c] * pws[k][c];
        const x = (somme / foret) * echantillon(m, gs[k], lons[cx | 0], lats[cy | 0]);
        if (x > v) v = x;
      }
      const [r, gg, b, a] = palier(v);
      if (!a) continue;
      for (let y = by; y < Math.min(by + BLOC - 1, h); y++) for (let x = bx; x < Math.min(bx + BLOC - 1, w); x++) {
        const i = (y * w + x) * 4;
        d[i] = r; d[i + 1] = gg; d[i + 2] = b; d[i + 3] = a;
      }
    }
  }
  ctx.putImageData(img, 0, 0);
}

/** Flou moyen (boîte, deux passes) pondéré par la présence de forêt. */
function flou(v: Float32Array, cls: Uint8Array, w: number, h: number, r: number) {
  const tmp = new Float32Array(w * h), tw = new Float32Array(w * h);
  const out = new Float32Array(w * h), ow = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    let s = 0, n = 0;
    for (let x = -r; x < w + r; x++) {
      const xa = x + r, xr = x - r - 1;
      if (xa >= 0 && xa < w) { s += v[y * w + xa]; n += cls[y * w + xa] ? 1 : 0; }
      if (xr >= 0 && xr < w) { s -= v[y * w + xr]; n -= cls[y * w + xr] ? 1 : 0; }
      if (x >= 0 && x < w) { tmp[y * w + x] = s; tw[y * w + x] = n; }
    }
  }
  for (let x = 0; x < w; x++) {
    let s = 0, n = 0;
    for (let y = -r; y < h + r; y++) {
      const ya = y + r, yr = y - r - 1;
      if (ya >= 0 && ya < h) { s += tmp[ya * w + x]; n += tw[ya * w + x]; }
      if (yr >= 0 && yr < h) { s -= tmp[yr * w + x]; n -= tw[yr * w + x]; }
      if (y >= 0 && y < h) { out[y * w + x] = s; ow[y * w + x] = n; }
    }
  }
  for (let i = 0; i < w * h; i++) out[i] = ow[i] ? out[i] / ow[i] : 0;
  return out;
}
