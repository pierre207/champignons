import { especes, type Categorie, type Espece } from "@/data";

const nb = (c: Categorie) => especes.filter((e) => e.cat === c).length;

export const SITE = "https://www.lamelle.fr";
export const NOM = "Lamelle";
export const TOTAL = especes.length;
export const SIGNATURE = "Lamelle — reconnaître et trouver les champignons";

export const urlFiche = (id: string) => `/champignons/${id}`;

/** Pages catégories : adresse, titres et description pour les moteurs de recherche. */
export const PAGES_CAT: Record<Categorie, { slug: string; h1: string; title: string; description: string }> = {
  comestible: {
    slug: "/champignons-comestibles",
    h1: "Champignons comestibles",
    title: `Champignons comestibles : ${nb("comestible")} espèces à reconnaître`,
    description: `Les ${nb("comestible")} champignons comestibles de France en fiches : photos, saison, habitat et sosies à ne pas confondre avant de cueillir.`,
  },
  eviter: {
    slug: "/champignons-a-eviter",
    h1: "Champignons à éviter",
    title: `Champignons à éviter : ${nb("eviter")} espèces à connaître`,
    description: `${nb("eviter")} champignons à ne pas cueillir : amers, indigestes ou toxiques crus. Photos, saison et confusions possibles avec les comestibles.`,
  },
  toxique: {
    slug: "/champignons-toxiques",
    h1: "Champignons toxiques",
    title: `Champignons toxiques et mortels : ${nb("toxique")} espèces`,
    description: `Amanite phalloïde et ${nb("toxique") - 1} autres champignons toxiques de France : symptômes, délai d'apparition et sosies comestibles à connaître.`,
  },
};

const CAT_TITRE: Record<Categorie, string> = { comestible: "Comestible", eviter: "À éviter", toxique: "Toxique" };
const CAT_ESPECE: Record<Categorie, string> = { comestible: "comestible", eviter: "à éviter", toxique: "toxique" };
const premiere = (t: string) => t.split(/[;(—]/)[0].trim().replace(/[.,]$/, "");
const minuscule = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);

/** Titre complet (sans le gabarit « | Lamelle » quand il ferait dépasser ~65 caractères). */
export function titreFiche(e: Espece) {
  const base = `${e.fr} (${e.la}) – ${CAT_TITRE[e.cat]}`;
  return base.length + 10 <= 65 ? `${base} | ${NOM}` : base;
}

/** Description générée depuis la fiche, limitée à ~160 caractères (on retire les morceaux de la fin si besoin). */
export function descriptionFiche(e: Espece) {
  const morceaux = [`${e.fr} : espèce ${e.mortel ? "mortelle" : CAT_ESPECE[e.cat]}.`];
  if (e.f.c) morceaux.push(/^\d/.test(e.f.c) ? `Chapeau ${premiere(e.f.c)}.` : `${premiere(e.f.c)}.`);
  else if (e.f.co) morceaux.push(`${premiere(e.f.co)}.`);
  if (e.f.s) morceaux.push(`${e.f.s}.`);
  if (e.f.cf) morceaux.push(`Confusion possible : ${minuscule(premiere(e.f.cf))}.`);
  let txt = morceaux.join(" ");
  while (txt.length > 160 && morceaux.length > 2) {
    morceaux.splice(morceaux.length - 2, 1);
    txt = morceaux.join(" ");
  }
  return txt.length > 160 ? txt.slice(0, 157).replace(/\s+\S*$/, "") + "…" : txt;
}
