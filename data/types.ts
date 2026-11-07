export type Categorie = "comestible" | "eviter" | "toxique";

/** Champs courts pour limiter le poids des données. */
export interface Fiche {
  c?: string; // chapeau (ou forme)
  co?: string; // couleur (espèces sans chapeau)
  d?: string; // dessous
  p?: string; // pied
  ch?: string; // chair
  h?: string; // habitat
  s?: string; // saison (texte)
  a?: string; // altitude
  cf?: string; // confusions
  x?: string; // consommation (comestibles) ou symptômes et délai (toxiques) ou raison (à éviter)
  l?: string; // statut légal
  r?: string; // règle de terrain
}

export interface Espece {
  id: string;
  fr: string;
  la: string;
  cat: Categorie;
  mortel?: boolean;
  syndrome?: string;
  groupe?: string;
  mois: [number, number]; // début, fin (peut chevaucher l'année)
  f: Fiche;
  complete?: boolean; // false = fiche résumée, en attente de rédaction
  commons?: string; // nom de catégorie Wikimedia Commons
}
