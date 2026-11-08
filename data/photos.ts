import raw from "./photos.json";

// Une planche verticale de tuiles carrées par espèce : f.jpg (fiche), j.jpg (jeu), t.jpg (vignette)
type Entry = { f: string[]; j: number; dp?: { d?: string; p?: string } };
const data = raw as Record<string, Entry>;

export interface Tuile { url: string; i: number; n: number }
const base = (id: string) => `/ph/${id}/`;
export const aPhotos = (id: string) => id in data;
export const vignette = (id: string) => (id in data ? `${base(id)}t.jpg` : null);
export const photosFiche = (id: string) =>
  (data[id]?.f ?? []).map((o, i, a) => ({ o, url: base(id) + "f.jpg", i, n: a.length }));
export const photosJeu = (id: string): Tuile[] =>
  Array.from({ length: data[id]?.j ?? 0 }, (_, i) => ({ url: base(id) + "j.jpg", i, n: data[id].j }));
export const tuileStyle = (t: Tuile) => ({
  backgroundImage: `url(${t.url})`,
  backgroundSize: `100% ${t.n * 100}%`,
  backgroundPosition: `0 ${t.n > 1 ? (t.i / (t.n - 1)) * 100 : 0}%`,
});
export const commons = (o: string) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(o.replace(/ /g, "_"))}`;

/** Photos du dessous du chapeau et du pied (planche dp.jpg : dessous puis pied, selon ce qui existe). */
export const photosDP = (id: string): { d?: Tuile; p?: Tuile } => {
  const dp = data[id]?.dp;
  if (!dp) return {};
  const cles = (["d", "p"] as const).filter((k) => k in dp);
  const t = (k: "d" | "p") => (k in dp ? { url: base(id) + "dp.jpg", i: cles.indexOf(k), n: cles.length } : undefined);
  return { d: t("d"), p: t("p") };
};
