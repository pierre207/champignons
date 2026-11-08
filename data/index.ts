import type { Categorie, Espece } from "./types";
import { lot1 } from "./lot1";
import { lot2 } from "./lot2";
import { lot3 } from "./lot3";
import { lot4 } from "./lot4";
import { REGLES } from "./regles";

export type { Categorie, Espece } from "./types";

// Les règles « À retenir » complémentaires ne remplacent jamais celles déjà présentes dans les fiches
export const especes: Espece[] = [...lot2, ...lot4, ...lot1, ...lot3].map((e) =>
  e.f.r || !REGLES[e.id] ? e : { ...e, f: { ...e.f, r: REGLES[e.id] } });

export const parId = (id: string) => especes.find((e) => e.id === id);

export const CATS: { key: Categorie; label: string; court: string }[] = [
  { key: "comestible", label: "Comestibles", court: "Comestible" },
  { key: "eviter", label: "À éviter", court: "À éviter" },
  { key: "toxique", label: "Toxiques", court: "Toxique" },
];

export const enSaison = (e: Espece, mois: number) => {
  const [a, b] = e.mois;
  return a <= b ? mois >= a && mois <= b : mois >= a || mois <= b;
};

export const MOIS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
