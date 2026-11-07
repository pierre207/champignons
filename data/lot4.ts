import type { Espece, Fiche } from "./types";

// Lot 4 « à éviter » : habitat, saison et raison en tableau ; description détaillée dans « details ».
type Row = [string, string, string, string, number, number, string];

const rows: Row[] = [
  ["Bolet amer", "Tylopilus felleus", "Conifères, hêtre, sols acides", "Juillet – octobre", 7, 10, "Très amer ; sosie du cèpe"],
  ["Bolet radicant", "Caloboletus radicans", "Chênes, sols calcaires", "Juillet – octobre", 7, 10, "Amer, indigeste"],
  ["Bolet à beau pied", "Caloboletus calopus", "Conifères, hêtre, montagne", "Juillet – octobre", 7, 10, "Amer, indigeste"],
  ["Bolet poivré", "Chalciporus piperatus", "Conifères, bouleaux", "Juillet – novembre", 7, 11, "Saveur brûlante"],
  ["Bolet des bouviers", "Suillus bovinus", "Pins, sols sableux", "Août – novembre", 8, 11, "Médiocre"],
  ["Amanite rougissante", "Amanita rubescens", "Feuillus et conifères", "Juin – novembre", 6, 11, "Toxique crue ; sosie de l'amanite panthère"],
  ["Amanite vaginée", "Amanita vaginata", "Feuillus", "Juin – octobre", 6, 10, "Confusion avec amanites mortelles"],
  ["Amanite citrine", "Amanita citrina", "Hêtre, chêne, pins, sols acides", "Août – novembre", 8, 11, "Sans intérêt ; sosie de l'amanite phalloïde"],
  ["Amanite solitaire", "Amanita strobiliformis", "Feuillus, sols calcaires", "Juillet – octobre", 7, 10, "Confusion avec amanites toxiques"],
  ["Volvaire gluante", "Volvopluteus gloiocephalus", "Champs, compost, bords de chemins", "Juin – octobre", 6, 10, "Médiocre ; sosie de l'amanite vireuse"],
  ["Clitocybe nébuleux", "Clitocybe nebularis", "Litière de feuillus et conifères", "Septembre – décembre", 9, 12, "Troubles digestifs fréquents"],
  ["Clitocybe odorant", "Clitocybe odora", "Feuillus", "Août – novembre", 8, 11, "Confusion avec clitocybes blancs toxiques"],
  ["Clitocybe en coupe", "Pseudoclitocybe cyathiformis", "Litière, bois pourri", "Octobre – décembre", 10, 12, "Médiocre"],
  ["Armillaire couleur de miel", "Armillaria mellea", "Souches et racines de feuillus", "Septembre – novembre", 9, 11, "Toxique crue ; troubles digestifs ; sosie de la galère marginée"],
  ["Collybie à pied velouté", "Flammulina velutipes", "Bois mort de feuillus, hiver", "Novembre – mars", 11, 3, "Sosie de la galère marginée"],
  ["Pholiote changeante", "Kuehneromyces mutabilis", "Souches de feuillus", "Avril – novembre", 4, 11, "Sosie de la galère marginée"],
  ["Collybie à larges lames", "Megacollybia platyphylla", "Bois pourri de feuillus", "Mai – octobre", 5, 10, "Troubles digestifs"],
  ["Lépiote déguenillée", "Chlorophyllum rhacodes", "Conifères, litière riche", "Août – novembre", 8, 11, "Intolérances ; confusion avec lépiotes toxiques"],
  ["Laccaire laqué", "Laccaria laccata", "Feuillus et conifères", "Juin – novembre", 6, 11, "Petit, confusion avec petites espèces toxiques"],
  ["Lactaire poivré", "Lactifluus piperatus", "Feuillus", "Juillet – octobre", 7, 10, "Très âcre"],
  ["Lactaire roux", "Lactarius rufus", "Conifères, sols acides", "Juillet – novembre", 7, 11, "Très âcre"],
  ["Russule fétide", "Russula foetens", "Feuillus et conifères", "Juillet – octobre", 7, 10, "Odeur, âcreté"],
  ["Russule noircissante", "Russula nigricans", "Feuillus et conifères", "Juillet – novembre", 7, 11, "Médiocre"],
  ["Russule ocre et blanche", "Russula ochroleuca", "Feuillus et conifères", "Août – novembre", 8, 11, "Médiocre, légèrement âcre"],
  ["Hygrophore conique", "Hygrocybe conica", "Prairies, pelouses", "Juillet – novembre", 7, 11, "Comestibilité douteuse"],
  ["Hygrocybe cochenille", "Hygrocybe coccinea", "Prairies maigres", "Août – novembre", 8, 11, "Sans intérêt"],
  ["Fausse girolle", "Hygrophoropsis aurantiaca", "Conifères, bois pourri", "Août – décembre", 8, 12, "Troubles digestifs ; sosie de la girolle"],
  ["Tricholome rutilant", "Tricholomopsis rutilans", "Souches de conifères", "Août – novembre", 8, 11, "Médiocre"],
  ["Tricholome jaunissant", "Tricholoma scalpturatum", "Feuillus et conifères, parcs", "Septembre – novembre", 9, 11, "Confusion avec le tricholome tigré"],
  ["Hypholome couleur de brique", "Hypholoma lateritium", "Souches de feuillus", "Septembre – décembre", 9, 12, "Amer ; sosie de l'hypholome en touffe"],
  ["Psathyrelle de Candolle", "Candolleomyces candolleanus", "Souches, parcs", "Mai – octobre", 5, 10, "Sans intérêt"],
  ["Psathyrelle pleureuse", "Lacrymaria lacrymabunda", "Bords de chemins, prairies", "Mai – novembre", 5, 11, "Médiocre"],
  ["Coprin micacé", "Coprinellus micaceus", "Souches de feuillus", "Avril – novembre", 4, 11, "Sans intérêt, se liquéfie vite"],
  ["Strophaire vert-de-gris", "Stropharia aeruginosa", "Litière, herbe en forêt", "Septembre – novembre", 9, 11, "Comestibilité douteuse"],
  ["Gomphide glutineux", "Gomphidius glutinosus", "Épicéas", "Août – octobre", 8, 10, "Médiocre"],
  ["Hydne imbriqué", "Sarcodon imbricatus", "Conifères, montagne", "Août – octobre", 8, 10, "Amer, indigeste"],
  ["Hydne cure-oreille", "Auriscalpium vulgare", "Cônes de pins tombés", "Toute l'année", 1, 12, "Sans intérêt"],
  ["Phallus impudique", "Phallus impudicus", "Feuillus et conifères", "Juin – novembre", 6, 11, "Odeur ; sans intérêt"],
  ["Clathre rouge", "Clathrus ruber", "Jardins, haies, régions chaudes", "Juin – novembre", 6, 11, "Odeur ; sans intérêt"],
  ["Géastre triple", "Geastrum triplex", "Litière de feuillus", "Août – novembre", 8, 11, "Sans intérêt"],
  ["Vesse-de-loup hérisson", "Lycoperdon echinatum", "Hêtre, sols calcaires", "Août – octobre", 8, 10, "Sans intérêt"],
  ["Pézize orangée", "Aleuria aurantia", "Chemins, sols nus", "Septembre – novembre", 9, 11, "Sans intérêt"],
  ["Pézize écarlate", "Sarcoscypha coccinea", "Bois mort humide", "Décembre – avril", 12, 4, "Sans intérêt"],
  ["Xylaire polymorphe", "Xylaria polymorpha", "Souches de feuillus", "Toute l'année", 1, 12, "Coriace"],
  ["Polypore du bouleau", "Fomitopsis betulina", "Bouleaux", "Toute l'année", 1, 12, "Coriace"],
  ["Amadouvier", "Fomes fomentarius", "Hêtres, bouleaux", "Toute l'année", 1, 12, "Coriace"],
  ["Ganoderme luisant", "Ganoderma lucidum", "Souches de feuillus", "Mai – octobre", 5, 10, "Coriace"],
  ["Polypore de Schweinitz", "Phaeolus schweinitzii", "Pied des conifères", "Juillet – novembre", 7, 11, "Coriace"],
  ["Polypore brûlé", "Bjerkandera adusta", "Bois mort de feuillus", "Toute l'année", 1, 12, "Coriace"],
  ["Tramète versicolore", "Trametes versicolor", "Bois mort de feuillus", "Toute l'année", 1, 12, "Coriace"],
  ["Tramète rougissante", "Daedaleopsis confragosa", "Saules, aulnes, bouleaux", "Toute l'année", 1, 12, "Coriace"],
  ["Stérée hirsute", "Stereum hirsutum", "Bois mort de feuillus", "Toute l'année", 1, 12, "Coriace"],
  ["Calocère visqueuse", "Calocera viscosa", "Souches de conifères", "Août – décembre", 8, 12, "Sans intérêt"],
];

const PM = "Plaine à montagne";
const PC = "Plaine et collines";
const CM = "Collines et montagne";
const COR = "Chair coriace ou ligneuse, immangeable ; aucune valeur culinaire";

type D = Omit<Fiche, "h" | "s">;

// Description complète par espèce (clé = id)
const details: Record<string, D> = {
  "bolet-amer": {
    c: "6–15 cm, brun clair à brun tabac, sec, velouté puis lisse", d: "Tubes et pores blancs puis nettement rose sale",
    p: "Trapu, brun-jaune, couvert d'un réseau brun foncé à mailles larges", ch: "Blanche, ne bleuit pas ; saveur très amère (goûter un fragment puis recracher)",
    a: PM, cf: "Cèpe de Bordeaux (pores blancs puis jaune-vert, réseau blanc et fin en haut du pied, saveur douce)",
    x: "Non toxique mais d'une amertume extrême : un seul exemplaire rend tout le plat immangeable", r: "Pores roses et réseau foncé sur le pied : bolet amer" },
  "bolet-radicant": {
    c: "8–20 cm, blanc grisâtre à gris crème, sec", d: "Pores jaune citron, bleuissant au toucher",
    p: "Épais, jaune, souvent radicant (prolongé en racine), réseau jaune dans le haut", ch: "Jaune pâle, bleuit à la coupe ; saveur très amère",
    a: PC, cf: "Bolet blafard et bolet de Satan (pores rouges) ; bolet à beau pied (pied rouge)", x: "Amertume tenace, indigeste ; sans intérêt" },
  "bolet-a-beau-pied": {
    c: "6–15 cm, gris beige à olivâtre, sec", d: "Pores jaunes, bleuissant au toucher",
    p: "Rouge carmin vers le bas, jaune en haut, couvert d'un réseau blanc à rougeâtre", ch: "Blanchâtre à jaunâtre, bleuit ; saveur amère",
    a: CM, cf: "Bolet à pied rouge et bolet blafard (pores rouges, saveur douce) ; bolet de Satan", x: "Amer, indigeste ; ne se mange pas" },
  "bolet-poivre": {
    c: "3–8 cm, brun cannelle à brun orangé", d: "Pores cuivrés à brun rougeâtre, larges",
    p: "Mince, de la couleur du chapeau ; base jaune vif (mycélium jaune)", ch: "Jaune, rosée au-dessus des tubes ; saveur poivrée brûlante",
    a: PM, cf: "Jeunes bolets comestibles (pores jaunes ou blancs, saveur douce)", x: "Saveur très piquante ; n'est pas consommé" },
  "bolet-des-bouviers": {
    c: "3–10 cm, ocre orangé, visqueux par temps humide, marge plus pâle", d: "Pores olive jaunâtre, larges et anguleux, divisés",
    p: "Court, de la couleur du chapeau, sans anneau", ch: "Jaunâtre, rosit parfois légèrement ; élastique",
    a: PC, cf: "Bolet jaune (anneau, pores petits) ; gomphide rose qui lui est souvent associé", x: "Comestible médiocre, chair caoutchouteuse ; sans intérêt" },
  "amanite-rougissante": {
    c: "6–15 cm, brun rosé à brun rougeâtre, couvert de verrues grisâtres à rosées", d: "Lames blanches, se tachant de rouge",
    p: "Blanc à rosé ; anneau blanc strié sur le dessus ; bulbe sans volve nette", ch: "Blanche, rougit lentement à la coupe et dans les morsures de larves",
    a: PM, cf: "Amanite panthère (flocons blanc pur, anneau lisse, bourrelet au bulbe, chair qui ne rougit pas) ; amanite épaisse",
    x: "Toxique crue (hémolysines) ; consommée cuite par des connaisseurs, mais la confusion avec l'amanite panthère est fréquente et grave",
    r: "Vérifier le rougissement de la chair et l'anneau strié ; dans le doute, ne pas consommer" },
  "amanite-vaginee": {
    c: "5–10 cm, gris souris à gris brun, marge nettement striée (cannelée)", d: "Lames blanches, libres",
    p: "Élancé, blanc à grisâtre, fragile, sans anneau ; base dans une volve blanche en sac", ch: "Blanche, mince, fragile",
    a: PM, cf: "Amanite phalloïde et amanite vireuse (anneau, volve) — toute amanite blanche ou verdâtre est à exclure",
    x: "Toxique crue ; comestible cuite selon les auteurs, mais le genre Amanita contient les espèces mortelles : déconseillée aux débutants",
    r: "Volve à la base = amanite = ne pas consommer sans validation d'un expert" },
  "amanite-citrine": {
    c: "5–10 cm, jaune citron pâle à blanc, avec plaques membraneuses blanchâtres", d: "Lames blanches",
    p: "Blanc ; anneau jaunâtre ; gros bulbe arrondi à rebord net (marginé)", ch: "Blanche ; odeur nette de pomme de terre crue",
    a: PM, cf: "Amanite phalloïde (vert olive, volve en sac, sans odeur de pomme de terre)",
    x: "Non mortelle mais sans intérêt et indigeste ; dangereuse par sa ressemblance avec la phalloïde", r: "Odeur de pomme de terre crue et bulbe marginé : amanite citrine" },
  "amanite-solitaire": {
    c: "10–20 cm, blanc grisâtre, couvert de verrues pyramidales grises", d: "Lames blanc crème",
    p: "Massif, blanc, floconneux ; anneau fragile, crémeux ; gros bulbe enfoncé dans le sol", ch: "Blanche, ferme",
    a: PC, cf: "Amanites toxiques (panthère, phalloïde) ; coulemelle", x: "Comestible selon certains auteurs mais rare et facilement confondue avec des amanites toxiques ; à laisser" },
  "volvaire-gluante": {
    c: "5–15 cm, blanc à gris beige, visqueux par temps humide, lisse", d: "Lames libres, blanches puis nettement roses",
    p: "Élancé, blanc, sans anneau ; base dans une volve blanche en sac", ch: "Blanche, molle",
    a: PC, cf: "Amanite vireuse et amanite phalloïde (lames restant blanches, anneau)", x: "Comestible médiocre ; la confusion avec les amanites mortelles blanches la rend dangereuse",
    r: "Vérifier la couleur des lames (roses chez la volvaire) et la présence d'un anneau ; dans le doute, ne pas consommer" },
  "clitocybe-nebuleux": {
    c: "8–20 cm, gris cendré à gris brun, comme recouvert d'un voile poudré", d: "Lames crème, serrées, légèrement décurrentes",
    p: "Massif, gris pâle, fibreux, base renflée", ch: "Blanche, épaisse ; odeur forte, aromatique, désagréable pour beaucoup",
    a: PM, cf: "Entolome livide (lames roses à maturité, odeur de farine) ; clitocybes gris toxiques", x: "Provoque souvent des troubles digestifs, même bien cuit ; n'est plus recommandé" },
  "clitocybe-odorant": {
    c: "3–8 cm, vert bleuté à vert-de-gris, pâlissant", d: "Lames crème verdâtre, légèrement décurrentes",
    p: "Court, de la couleur du chapeau ou plus pâle", ch: "Mince ; forte odeur d'anis",
    a: PM, cf: "Clitocybes blancs à muscarine (sans couleur verte) ; strophaire vert-de-gris (anneau, lames sombres)",
    x: "Comestible en petite quantité comme aromate ; les exemplaires décolorés se confondent avec des clitocybes toxiques", r: "Ne garder que des exemplaires nettement verts à forte odeur d'anis" },
  "clitocybe-en-coupe": {
    c: "3–7 cm, brun grisâtre, en entonnoir, hygrophane (pâlit en séchant), marge enroulée", d: "Lames gris pâle, décurrentes, fourchues",
    p: "Fin, gris brun, fibreux", ch: "Mince, grisâtre ; odeur faible",
    a: PM, cf: "Autres clitocybes gris, dont des espèces toxiques", x: "Comestible médiocre et peu charnu ; sans intérêt, confusion possible" },
  "armillaire-couleur-de-miel": {
    c: "3–12 cm, jaune miel à brun, couvert de petites mèches sombres au centre", d: "Lames blanchâtres puis tachées de brun, légèrement décurrentes",
    p: "Long, souvent courbé, en touffes ; anneau blanc cotonneux bordé de jaune", ch: "Blanche, fibreuse dans le pied ; saveur un peu amère",
    a: PM, cf: "Galère marginée (mortelle, sporée brune, anneau membraneux) ; hypholome en touffe (lames verdâtres, amer)",
    x: "Toxique crue ; cuite longuement (eau de première cuisson jetée), elle provoque malgré tout des troubles digestifs chez certaines personnes",
    r: "Ne jamais consommer cru ; ne garder que les chapeaux jeunes" },
  "collybie-a-pied-veloute": {
    c: "2–8 cm, jaune orangé à brun miel, visqueux, plus foncé au centre", d: "Lames crème à jaunâtres, espacées",
    p: "Tenace, velouté, brun noir vers la base, jaune en haut ; sans anneau", ch: "Mince, jaunâtre",
    a: PM, cf: "Galère marginée (mortelle : anneau, lames brun rouille) ; pholiote changeante",
    x: "Comestible (c'est l'enoki sauvage), mais pousse en hiver sur souches comme la galère marginée, mortelle", r: "Pied velouté noir et absence d'anneau ; dans le doute, ne pas consommer" },
  "pholiote-changeante": {
    c: "2–6 cm, brun cannelle, hygrophane : centre plus clair en séchant (deux tons)", d: "Lames crème puis brun cannelle",
    p: "Brun, couvert de petites mèches sous un anneau brun fragile", ch: "Mince, brunâtre ; odeur agréable",
    a: PM, cf: "Galère marginée (mortelle : pied lisse ou fibrilleux argenté sous l'anneau, sans mèches, odeur de farine)",
    x: "Bon comestible pour les connaisseurs, mais la confusion avec la galère marginée est mortelle", r: "Espèce réservée aux mycologues confirmés" },
  "collybie-a-larges-lames": {
    c: "6–15 cm, gris brun, fibrilleux radialement", d: "Lames blanches, très larges et très espacées",
    p: "Blanc, fibreux, rattaché à de longs cordons blancs (rhizomorphes) dans le bois", ch: "Blanche, mince",
    a: PM, cf: "Plutée couleur de cerf (lames roses, libres) ; clitocybe nébuleux", x: "Provoque des troubles digestifs chez de nombreuses personnes ; déconseillée" },
  "lepiote-deguenillee": {
    c: "8–20 cm, couvert de grosses écailles brunes retroussées sur fond blanc", d: "Lames blanches, libres",
    p: "Blanc, lisse (non chiné), bulbe marginé ; anneau double coulissant", ch: "Blanche, rougit puis brunit vivement à la coupe",
    a: PC, cf: "Coulemelle (pied chiné, chair ne rougissant pas) ; lépiote vénéneuse (Chlorophyllum brunneum, jardins) ; petites lépiotes mortelles",
    x: "Provoque des intolérances digestives chez une partie des consommateurs ; confusion possible avec des lépiotes toxiques",
    r: "Ne consommer aucune lépiote de moins de 10 cm de chapeau" },
  "laccaire-laque": {
    c: "1–5 cm, rose orangé à brun rosé, hygrophane, pâlissant", d: "Lames roses, épaisses, très espacées",
    p: "Fin, fibreux, de la couleur du chapeau", ch: "Mince, coriace",
    a: PM, cf: "Petites espèces toxiques à chapeau brun (inocybes, galères)", x: "Comestible mais minuscule et variable ; facile à confondre avec de petites espèces toxiques" },
  "lactaire-poivre": {
    c: "6–16 cm, blanc, en entonnoir, sec", d: "Lames blanc crème, extrêmement serrées",
    p: "Court, blanc, plein", ch: "Blanche, ferme ; lait blanc abondant, très âcre",
    a: PC, cf: "Lactaire velouté (lames espacées) ; russules blanches", x: "Saveur brûlante ; non toxique mais immangeable sans traitement particulier" },
  "lactaire-roux": {
    c: "4–10 cm, brun rouge sombre, mamelon pointu au centre", d: "Lames crème rosé",
    p: "De la couleur du chapeau, plus pâle", ch: "Blanchâtre ; lait blanc, d'abord doux puis très âcre",
    a: PM, cf: "Lactaire délicieux (lait orange) ; autres lactaires bruns", x: "Très âcre ; consommé seulement après traitement long dans certains pays nordiques ; déconseillé" },
  "russule-fetide": {
    c: "8–15 cm, jaune brun sale, visqueux, marge fortement cannelée", d: "Lames crème, avec gouttelettes, tachées de brun",
    p: "Blanc sale, creux, cassant", ch: "Odeur forte et rance (huile, pétrole) ; saveur âcre",
    a: PM, cf: "Russule à odeur d'amande (Russula grata, odeur d'amande) ; russules brunes", x: "Odeur et âcreté la rendent immangeable ; troubles digestifs" },
  "russule-noircissante": {
    c: "8–20 cm, blanc sale devenant brun puis noir", d: "Lames épaisses, très espacées, crème, rougissant puis noircissant au toucher",
    p: "Court, massif, blanc puis noir", ch: "Ferme ; rougit puis noircit à la coupe",
    a: PM, cf: "Russule à lames serrées (lames serrées) ; vieux exemplaires noircis méconnaissables",
    x: "Comestible médiocre ; des espèces proches asiatiques sont toxiques, et les vieux exemplaires parasités sont fréquents" },
  "russule-ocre-et-blanche": {
    c: "5–10 cm, jaune ocre à jaune verdâtre, mat", d: "Lames crème pâle",
    p: "Blanc, devenant grisâtre en vieillissant", ch: "Blanche ; saveur douce à légèrement âcre",
    a: PM, cf: "Russule fétide (cannelée, odeur rance) ; russules jaunes", x: "Comestible médiocre, parfois âcre ; peu d'intérêt" },
  "hygrophore-conique": {
    c: "2–5 cm, conique pointu, jaune orangé à rouge, noircissant au toucher et en vieillissant", d: "Lames jaune pâle, noircissant",
    p: "Jaune orangé, fibreux, noircissant", ch: "Mince, noircit à la coupe",
    a: PM, cf: "Autres hygrocybes colorés des prairies", x: "Comestibilité douteuse ; espèces des prairies anciennes, à protéger" },
  "hygrocybe-cochenille": {
    c: "2–5 cm, rouge écarlate vif, lisse, un peu gras", d: "Lames rouge orangé, espacées, à bord jaune",
    p: "Rouge à orangé, plus jaune à la base", ch: "Mince, orangée",
    a: PM, cf: "Autres hygrocybes rouges", x: "Sans intérêt culinaire ; indicateur de prairies anciennes non amendées, à préserver" },
  "fausse-girolle": {
    c: "3–8 cm, orange vif, velouté, en entonnoir, marge enroulée", d: "Vraies lames orange, serrées, minces, fourchues, décurrentes",
    p: "Mince, orange, souple", ch: "Mince, molle, orangée",
    a: PM, cf: "Girolle (plis épais et ramifiés au lieu de vraies lames, chair blanche et ferme, odeur fruitée)",
    x: "Provoque des troubles digestifs chez certains ; sans intérêt", r: "Girolle : plis épais et chair ferme ; fausse girolle : lames fines et chair molle" },
  "tricholome-rutilant": {
    c: "5–15 cm, jaune couvert de fines mèches pourpres à rouge vin", d: "Lames jaune d'or, serrées",
    p: "Jaune, couvert de mèches pourpres", ch: "Jaune pâle ; saveur un peu amère",
    a: PM, cf: "Tricholome équestre (lames et chair jaunes, sans mèches pourpres)", x: "Comestible médiocre, amère ; sans intérêt" },
  "tricholome-jaunissant": {
    c: "3–7 cm, gris argenté, couvert de fines fibrilles, jaunissant par endroits", d: "Lames blanches, jaunissant",
    p: "Blanchâtre, fibrilleux ; reste de voile fugace", ch: "Blanche ; odeur de farine",
    a: PM, cf: "Tricholome tigré (toxique, plus grand, chapeau à mèches gris sombre disposées en cercles)", x: "Comestible selon certains auteurs, mais la confusion avec le tricholome tigré est fréquente" },
  "hypholome-couleur-de-brique": {
    c: "4–10 cm, rouge brique au centre, jaunâtre vers la marge, avec restes de voile", d: "Lames jaunâtres puis gris violacé",
    p: "Jaune en haut, brun roux vers la base ; en touffes", ch: "Jaunâtre ; saveur amère",
    a: PC, cf: "Hypholome en touffe (toxique, lames vert jaunâtre, très amer) ; armillaire", x: "Amer et indigeste ; à laisser" },
  "psathyrelle-de-candolle": {
    c: "3–7 cm, crème à brun clair, hygrophane, très fragile, frangé de voile blanc à la marge", d: "Lames lilas grisâtre puis brun pourpre",
    p: "Blanc, creux, cassant", ch: "Mince, fragile",
    a: PC, cf: "Petites espèces brunes de souches, dont des toxiques", x: "Comestible mais minuscule et fragile ; sans intérêt" },
  "psathyrelle-pleureuse": {
    c: "3–8 cm, brun ocre, fibrilleux-laineux, marge frangée", d: "Lames brun noir tachetées, perlant de gouttelettes par temps humide",
    p: "Fibrilleux, brunâtre, avec zone annulaire noircie par les spores", ch: "Brunâtre",
    a: PC, cf: "Petites espèces brunes toxiques (inocybes, panéoles)", x: "Comestible médiocre ; sans intérêt" },
  "coprin-micace": {
    c: "2–5 cm, ovoïde puis campanulé, ocre fauve, strié, saupoudré de paillettes brillantes", d: "Lames blanches puis noires, se liquéfiant",
    p: "Blanc, mince, creux", ch: "Très mince, fragile",
    a: PC, cf: "Coprin noir d'encre (toxique avec l'alcool) ; autres petits coprins", x: "Comestible jeune mais minuscule et se liquéfie en quelques heures ; sans intérêt" },
  "strophaire-vert-de-gris": {
    c: "3–8 cm, vert-de-gris à bleu-vert, visqueux, parsemé de flocons blancs", d: "Lames gris lilas puis brun violacé",
    p: "Bleuté, couvert de flocons sous un anneau", ch: "Bleuâtre",
    a: PM, cf: "Clitocybe odorant (odeur d'anis, sans anneau)", x: "Comestibilité douteuse ; signalée comme toxique par plusieurs auteurs" },
  "gomphide-glutineux": {
    c: "5–12 cm, gris brun à lilas brun, très visqueux, taché de noir", d: "Lames décurrentes, blanchâtres puis gris noir",
    p: "Blanc, base jaune vif ; anneau glaireux", ch: "Blanche, jaune à la base du pied",
    a: CM, cf: "Hygrophores gluants", x: "Comestible médiocre une fois pelé ; sans intérêt" },
  "hydne-imbrique": {
    c: "8–20 cm, brun, couvert de grandes écailles imbriquées, retroussées", d: "Aiguillons gris brun, décurrents",
    p: "Court, brun grisâtre", ch: "Grisâtre ; saveur amère",
    a: CM, cf: "Pied-de-mouton (chapeau lisse, crème)", x: "Amer et indigeste ; employé séché comme aromate en petite quantité" },
  "hydne-cure-oreille": {
    c: "1–2 cm, réniforme (en forme de rein), brun, velu, fixé sur le côté", d: "Aiguillons gris brun",
    p: "Grêle, latéral, brun, velu", ch: "Coriace",
    a: PM, cf: "Aucune confusion dangereuse (pousse uniquement sur cônes de pins)", x: "Trop petit et coriace ; sans intérêt" },
  "phallus-impudique": {
    co: "Œuf blanc gélatineux, puis pied blanc creux portant un chapeau couvert d'une glèbe vert olive gluante", c: "Hauteur 10–25 cm",
    ch: "Odeur cadavérique très forte, perceptible de loin (attire les mouches)",
    a: PM, cf: "Jeune vesse-de-loup (l'œuf coupé montre un sujet gélatineux et non une chair blanche homogène)", x: "Odeur repoussante à maturité ; sans intérêt culinaire" },
  "clathre-rouge": {
    co: "Œuf blanc puis cage rouge vif en réseau ajouré, couverte d'une glèbe vert olive", c: "Hauteur 5–15 cm",
    ch: "Odeur cadavérique forte", a: "Plaine, régions à climat doux", cf: "Aucune confusion dangereuse", x: "Odeur repoussante ; sans intérêt" },
  "geastre-triple": {
    co: "Sphère brune posée sur une étoile à 4–8 branches charnues, avec une collerette autour de la sphère", c: "Diamètre ouvert 5–10 cm",
    ch: "Intérieur poudreux (spores brunes)", a: PC, cf: "Autres géastres (étoiles de terre)", x: "Sans intérêt culinaire" },
  "vesse-de-loup-herisson": {
    co: "Boule 3–6 cm couverte de longs aiguillons bruns serrés qui tombent en laissant un réseau", c: "Globuleuse, brièvement pédiculée",
    ch: "Blanche puis olive et poudreuse", a: PC, cf: "Vesse-de-loup perlée ; jeunes amanites (couper en deux : aucune silhouette de champignon à l'intérieur)",
    x: "Comestible jeune mais rare et sans intérêt", r: "Toujours couper une vesse-de-loup en deux pour vérifier qu'il ne s'agit pas d'un œuf d'amanite" },
  "pezize-orangee": {
    co: "Coupe orange vif à l'intérieur, extérieur plus pâle, finement duveteux", c: "Coupe 2–10 cm, souvent déformée",
    ch: "Mince, cassante", a: PM, cf: "Pézize écarlate (rouge, en hiver, sur bois)", x: "Comestible crue selon certains auteurs ; sans intérêt" },
  "pezize-ecarlate": {
    co: "Coupe rouge écarlate à l'intérieur, extérieur blanchâtre et duveteux", c: "Coupe 2–6 cm, courtement pédiculée",
    ch: "Mince", a: PC, cf: "Pézize orangée (orange, au sol)", x: "Sans intérêt culinaire" },
  "xylaire-polymorphe": {
    co: "Massues noires, rugueuses, en forme de doigts, souvent groupées", c: "Hauteur 3–8 cm",
    ch: "Blanche, coriace", a: PC, cf: "Aucune confusion dangereuse", x: COR },
  "polypore-du-bouleau": {
    c: "10–25 cm, en console arrondie, blanc à gris brun, lisse ; marge épaisse en bourrelet", d: "Pores blancs, fins",
    ch: "Blanche, liégeuse", a: PM, cf: "Amadouvier (sabot dur, gris)", x: COR + " ; utilisé autrefois comme amadou et pour affûter les rasoirs" },
  "amadouvier": {
    c: "10–40 cm, en sabot de cheval, gris argenté à brun, croûte dure, zoné", d: "Pores brun grisâtre, fins",
    ch: "Brun roux, fibreuse ; couche feutrée sous la croûte (l'amadou)", a: PM, cf: "Faux amadouvier (Phellinus, pores et intérieur plus durs)", x: COR + " ; l'amadou servait à allumer le feu" },
  "ganoderme-luisant": {
    c: "5–20 cm, rouge acajou à brun, verni et brillant, zoné", d: "Pores blanc crème",
    p: "Latéral, verni comme le chapeau", ch: "Liégeuse", a: PC, cf: "Ganoderme aplani (mat, sans pied)", x: COR + " ; consommé en tisane ou en complément (« reishi »)" },
  "polypore-de-schweinitz": {
    c: "10–30 cm, en rosette, jaune orangé et velu jeune, puis brun rouille", d: "Pores jaune verdâtre, brunissant au toucher",
    ch: "Spongieuse, brun roux", a: PM, cf: "Polypore soufré (jaune vif, sur feuillus)", x: COR + " ; parasite des racines de conifères" },
  "polypore-brule": {
    c: "2–7 cm, en consoles minces imbriquées, gris beige, marge blanche", d: "Pores gris fumée à noirâtres, très fins",
    ch: "Mince, blanchâtre, coriace", a: PM, cf: "Tramète versicolore (pores blancs)", x: COR },
  "tramete-versicolore": {
    c: "3–8 cm, mince, en éventail, zoné de bandes multicolores veloutées (brun, gris, bleuté), marge blanche", d: "Pores blancs à crème, très fins",
    ch: "Mince, coriace", a: PM, cf: "Stérée hirsute (dessous lisse, sans pores) ; polypore brûlé (pores gris)", x: COR },
  "tramete-rougissante": {
    c: "5–15 cm, brun gris à brun rougeâtre, zoné, rugueux", d: "Pores allongés en labyrinthe, blanchâtres, rougissant au frottement",
    ch: "Liégeuse", a: PC, cf: "Lenzite du bouleau (lames)", x: COR },
  "steree-hirsute": {
    c: "2–5 cm, mince, ondulé, velu, jaune orangé à gris, zoné", d: "Lisse, sans pores ni lames, jaune orangé",
    ch: "Mince, coriace", a: PM, cf: "Tramète versicolore (pores sous le chapeau)", x: COR },
  "calocere-visqueuse": {
    co: "Petits bois de cerf jaune orangé vif, gélatineux et collants", c: "Hauteur 3–8 cm, ramifié",
    ch: "Caoutchouteuse", a: PM, cf: "Clavaires et ramaires jaunes (cassantes, au sol)", x: "Sans intérêt culinaire" },
};

const slug = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const lot4: Espece[] = rows.map(([fr, la, h, s, m1, m2, raison]) => {
  const id = slug(fr);
  const d = details[id];
  return {
    id, fr, la, cat: "eviter", mois: [m1, m2], complete: !!d, commons: la,
    f: d ? { ...d, h, s, x: d.x ?? raison } : { h, s, x: raison },
  };
});
