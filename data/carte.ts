// Paramètres de la carte de pousse. Modèle heuristique : à valider et ajuster avec le mycologue.
//
// Classes d'essences (identiques à scripts/forets.py) :
// 0 aucune, 1 chênes, 2 hêtre, 3 châtaignier, 4 autres feuillus, 5 peuplier-robinier,
// 6 pins, 7 sapin-épicéa, 8 autres conifères (douglas, mélèze), 9 forêt mixte

export type Profil = "ete" | "automne" | "printemps" | "hiver";

export interface ParamCarte {
  /** Poids par classe d'essence (index = classe). Classe absente = FOND. */
  hotes: Partial<Record<number, number>>;
  profil: Profil;
}

const FOND = 0.08; // une forêt quelconque n'est jamais tout à fait nulle
export const poids = (p: ParamCarte, classe: number) => (classe === 0 ? 0 : p.hotes[classe] ?? FOND);

// Températures moyennes journalières (°C) : en dessous de min ou au-dessus de max, pas de pousse
export const TEMP: Record<Profil, [number, number, number, number]> = {
  ete: [10, 14, 22, 28],
  automne: [2, 6, 15, 21],
  printemps: [5, 9, 16, 22],
  hiver: [1, 4, 12, 18],
};
// Bilan hydrique (mm) entre 4 et 14 jours avant le jour considéré : pluie moins évaporation (ET0).
// Le même seuil vaut pour toutes les régions : l'évaporation tient compte du climat local
// (20 mm de pluie ne valent pas la même chose en Provence par vent chaud qu'en Bretagne).
// En dessous du minimum, pas de pousse ; à partir de l'optimum, facteur maximal.
export const BILAN: [number, number] = [-10, 20];
// Ancien seuil sur la pluie brute (mm), utilisé si la météo ne contient pas encore l'évaporation
export const PLUIE: Record<Profil, [number, number]> = {
  ete: [15, 50],
  automne: [10, 35],
  printemps: [10, 35],
  hiver: [10, 35],
};

const F = { 1: 1, 2: 1, 3: 1, 4: 0.8, 9: 0.9 }; // feuillus
const C = { 6: 1, 7: 1, 8: 0.8, 9: 0.9 }; // conifères
const TOUT = { 1: 0.8, 2: 0.8, 3: 0.8, 4: 0.8, 5: 0.5, 6: 0.8, 7: 0.8, 8: 0.8, 9: 0.8 };

export const CARTE: Record<string, ParamCarte> = {
  "cepe-de-bordeaux": { hotes: { 1: 1, 2: 1, 3: 1, 4: 0.6, 7: 0.9, 9: 1, 6: 0.5 }, profil: "ete" },
  "cepe-des-pins": { hotes: { 6: 1, 7: 0.8, 2: 0.5, 9: 0.8 }, profil: "ete" },
  "cepe-d-ete": { hotes: { ...F }, profil: "ete" },
  "cepe-bronze": { hotes: { 1: 1, 3: 1, 4: 0.5, 9: 0.6 }, profil: "ete" },
  "bolet-bai": { hotes: { ...C, 2: 0.6 }, profil: "automne" },
  "bolet-a-pied-rouge": { hotes: { 7: 1, 2: 1, 1: 0.8, 9: 1, 6: 0.6 }, profil: "ete" },
  "bolet-blafard": { hotes: { 1: 1, 2: 1, 4: 0.7, 9: 0.6 }, profil: "ete" },
  "bolet-de-quelet": { hotes: { 1: 1, 2: 1, 4: 0.7, 9: 0.6 }, profil: "ete" },
  "bolet-rude": { hotes: { 4: 0.8, 9: 0.6, 5: 0.4 }, profil: "ete" },
  "bolet-orange": { hotes: { 4: 0.8, 5: 0.8, 9: 0.5 }, profil: "ete" },
  "bolet-a-chair-jaune": { hotes: { ...F, 6: 0.5, 7: 0.5 }, profil: "ete" },
  "bolet-jaune": { hotes: { 6: 1, 8: 0.6, 9: 0.5 }, profil: "automne" },
  "nonnette-granulee": { hotes: { 6: 1, 9: 0.4 }, profil: "ete" },
  girolle: { hotes: { 1: 1, 2: 1, 3: 1, 7: 0.9, 9: 1, 6: 0.6, 4: 0.6 }, profil: "ete" },
  "chanterelle-en-tube": { hotes: { 7: 1, 9: 0.9, 6: 0.6, 2: 0.5 }, profil: "automne" },
  "trompette-de-la-mort": { hotes: { 1: 1, 2: 1, 4: 0.7, 9: 0.8 }, profil: "automne" },
  "pied-de-mouton": { hotes: { 1: 0.9, 2: 1, 4: 0.7, 7: 0.9, 9: 1, 6: 0.6 }, profil: "automne" },
  "pied-de-mouton-roux": { hotes: { 1: 0.9, 2: 1, 4: 0.7, 7: 0.9, 9: 1, 6: 0.6 }, profil: "automne" },
  "agaric-des-forets": { hotes: { 7: 1, 6: 0.8, 8: 0.8, 9: 0.8, 4: 0.4 }, profil: "automne" },
  "agaric-auguste": { hotes: { 7: 1, 9: 0.8, 4: 0.6, 2: 0.6 }, profil: "ete" },
  "morille-commune": { hotes: { 4: 0.9, 5: 1, 9: 0.5 }, profil: "printemps" },
  "morille-conique": { hotes: { 7: 0.8, 8: 0.8, 4: 0.6, 5: 0.6, 9: 0.6 }, profil: "printemps" },
  "lactaire-delicieux": { hotes: { 6: 1, 9: 0.4 }, profil: "automne" },
  "lactaire-de-l-epicea": { hotes: { 7: 1, 9: 0.6 }, profil: "automne" },
  "lactaire-sanguin": { hotes: { 6: 1 }, profil: "automne" },
  "pleurote-en-huitre": { hotes: { 4: 1, 2: 0.9, 5: 1, 1: 0.6, 9: 0.6 }, profil: "hiver" },
  meunier: { hotes: { 1: 1, 2: 1, 4: 0.8, 9: 0.8 }, profil: "ete" },
  "pied-bleu": { hotes: { ...TOUT }, profil: "automne" },
  "russule-charbonniere": { hotes: { 1: 1, 2: 1, 4: 0.7, 9: 0.8 }, profil: "ete" },
  "russule-verdoyante": { hotes: { 1: 1, 2: 1, 3: 1, 9: 0.6 }, profil: "ete" },
  "russule-comestible": { hotes: { 1: 1, 2: 1, 3: 1, 9: 0.6 }, profil: "ete" },
  "russule-entiere": { hotes: { 7: 1, 9: 0.9, 2: 0.6, 6: 0.5 }, profil: "ete" },
  "laccaire-amethyste": { hotes: { 2: 1, 1: 0.9, 4: 0.8, 9: 0.9, 7: 0.7 }, profil: "automne" },
  "cortinaire-violet": { hotes: { 2: 1, 7: 1, 9: 1, 6: 0.5 }, profil: "automne" },
  "pholiote-ridee": { hotes: { 7: 1, 6: 0.9, 9: 0.8 }, profil: "automne" },
  "hygrophore-de-mars": { hotes: { 7: 1, 9: 0.9, 2: 0.6 }, profil: "printemps" },
  "lyophylle-en-touffes": { hotes: { ...TOUT }, profil: "automne" },
  "amanite-des-cesars": { hotes: { 1: 1, 3: 1, 9: 0.4 }, profil: "ete" },
  "sparassis-crepu": { hotes: { 6: 1, 7: 0.6, 9: 0.6 }, profil: "automne" },
  "polypore-en-touffe": { hotes: { 1: 1, 9: 0.4 }, profil: "automne" },
  "polypore-soufre": { hotes: { 1: 1, 5: 1, 3: 0.8, 4: 0.8 }, profil: "ete" },
  "langue-de-boeuf": { hotes: { 1: 1, 3: 1, 9: 0.4 }, profil: "automne" },
  "vesse-de-loup-perlee": { hotes: { ...TOUT }, profil: "ete" },
};

/** Espèces de prairies, de jardins ou cultivées : la carte des forêts ne les décrit pas. */
export const HORS_FORET = [
  "coulemelle", "rose-des-pres", "agaric-des-jacheres", "mousseron-saint-georges", "faux-mousseron",
  "agrocybe-precoce", "vesse-de-loup-geante", "coprin-chevelu", "truffe-noire",
];

/** Groupes proposés dans le menu de la carte (les espèces restantes vont dans « Autres comestibles »). */
export const GROUPES: { id: string; nom: string; especes: string[] }[] = [
  { id: "cepes", nom: "Cèpes et bolets", especes: [
    "cepe-de-bordeaux", "cepe-des-pins", "cepe-d-ete", "cepe-bronze", "bolet-bai", "bolet-a-pied-rouge", "bolet-blafard",
    "bolet-de-quelet", "bolet-rude", "bolet-orange", "bolet-a-chair-jaune", "bolet-jaune", "nonnette-granulee"] },
  { id: "chanterelles", nom: "Chanterelles et pieds de mouton", especes: [
    "girolle", "chanterelle-en-tube", "trompette-de-la-mort", "pied-de-mouton", "pied-de-mouton-roux"] },
  { id: "morilles", nom: "Morilles", especes: ["morille-commune", "morille-conique"] },
  { id: "lactaires-russules", nom: "Lactaires et russules", especes: [
    "lactaire-delicieux", "lactaire-de-l-epicea", "lactaire-sanguin",
    "russule-charbonniere", "russule-verdoyante", "russule-comestible", "russule-entiere"] },
];
const classes = new Set(GROUPES.flatMap((g) => g.especes));
GROUPES.push({ id: "autres", nom: "Autres comestibles", especes: Object.keys(CARTE).filter((id) => !classes.has(id)) });

// Altitude
/** Baisse de la température avec l'altitude (°C par mètre), gradient moyen de l'atmosphère. */
export const GRADIENT = 0.0065;
/** Marge (m) au-delà de la plage d'altitude d'une espèce : l'indice décroît jusqu'à 0 sur cette distance. */
export const MARGE_ALTITUDE = 200;
/** Plage d'altitude (m) d'après le champ « altitude » des fiches. À valider avec le mycologue. */
export function plageAltitude(a?: string): [number, number] {
  const t = (a ?? "").toLowerCase();
  if (t.includes("climat doux")) return [0, 500];
  if (t.startsWith("surtout plaine")) return [0, 600];
  if (t.includes("plaine et collines")) return [0, 800];
  if (t.includes("montagne moyenne")) return [0, 1300];
  if (t.includes("plaine à montagne")) return [0, 1800];
  if (t.includes("collines et montagne")) return [200, 1900];
  if (t.includes("surtout montagne")) return [500, 2000];
  if (t.includes("montagne")) return [700, 2000];
  return [0, 2000];
}
