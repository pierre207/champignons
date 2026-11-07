import type { Espece } from "./types";

const C = "comestible" as const;
const PM = "Plaine à montagne";
const PC = "Plaine et collines";
const CM = "Collines et montagne";

export const lot2: Espece[] = [
  // Cèpes et bolets
  { id: "cepe-de-bordeaux", fr: "Cèpe de Bordeaux", la: "Boletus edulis", cat: C, groupe: "Cèpes et bolets", mois: [7, 11], commons: "Boletus edulis", f: {
    c: "8–20 cm, brun clair à brun noisette, bord souvent plus pâle ; surface lisse, un peu grasse par temps humide", d: "Tubes blancs puis jaune verdâtre, ne bleuissent pas",
    p: "Ventru, blanc à brun très pâle, fin réseau blanc en relief dans le haut", ch: "Blanche, ferme, ne change pas de couleur à la coupe ; saveur douce",
    h: "Hêtres, chênes, épicéas, sapins", s: "Juillet – novembre", a: PM, cf: "Bolet amer (réseau brun foncé sur le pied, tubes qui rosissent, très amer)",
    x: "Excellent comestible ; écarter les exemplaires véreux ou ramollis" } },
  { id: "cepe-des-pins", fr: "Cèpe des pins", la: "Boletus pinophilus", cat: C, groupe: "Cèpes et bolets", mois: [6, 10], commons: "Boletus pinophilus", f: {
    c: "8–20 cm, brun-rouge acajou, souvent ridulé", d: "Tubes blancs puis jaune verdâtre", p: "Massif, teinté de brun rosé, réseau clair dans le haut",
    ch: "Blanche, immuable, brun-rouge sous la cuticule", h: "Pins, épicéas, parfois hêtres ; sols acides", s: "Juin – octobre", a: CM, cf: "Bolet amer", x: "Excellent comestible" } },
  { id: "cepe-d-ete", fr: "Cèpe d'été", la: "Boletus reticulatus", cat: C, groupe: "Cèpes et bolets", mois: [5, 9], commons: "Boletus reticulatus", f: {
    c: "8–20 cm, brun clair, mat, souvent craquelé par temps sec", d: "Tubes blancs puis jaune verdâtre", p: "Brun clair, couvert d'un réseau visible jusqu'en bas",
    ch: "Blanche, immuable, souvent attaquée par les larves", h: "Chênes, hêtres, châtaigniers", s: "Mai – septembre", a: PC, cf: "Bolet amer", x: "Excellent comestible" } },
  { id: "cepe-bronze", fr: "Cèpe bronzé", la: "Boletus aereus", cat: C, groupe: "Cèpes et bolets", mois: [6, 10], commons: "Boletus aereus", f: {
    c: "8–20 cm, brun très foncé à presque noir, velouté", d: "Tubes blancs puis jaune verdâtre", p: "Massif, brun, réseau fin", ch: "Blanche, ferme, immuable",
    h: "Chênes, châtaigniers ; stations chaudes", s: "Juin – octobre", a: PC, cf: "Bolet amer", x: "Excellent comestible" } },
  { id: "bolet-bai", fr: "Bolet bai", la: "Imleria badia", cat: C, groupe: "Cèpes et bolets", mois: [8, 11], commons: "Imleria badia", f: {
    c: "5–15 cm, brun chocolat, visqueux par temps humide", d: "Tubes jaune pâle, bleuissent au toucher", p: "Cylindrique, brunâtre, sans réseau",
    ch: "Blanchâtre à jaunâtre, bleuit légèrement à la coupe", h: "Conifères, hêtres, sols acides", s: "Août – novembre", a: PM, cf: "Bolet amer ; bolets à pores rouges", x: "Très bon comestible" } },
  { id: "bolet-a-pied-rouge", fr: "Bolet à pied rouge", la: "Neoboletus erythropus", cat: C, groupe: "Cèpes et bolets", mois: [6, 11], commons: "Neoboletus erythropus", f: {
    c: "8–20 cm, brun foncé, velouté", d: "Pores rouge orangé, bleuissent instantanément au toucher", p: "Jaune couvert de fines ponctuations rouges, sans réseau",
    ch: "Jaune vif, bleuit fortement et immédiatement", h: "Feuillus et conifères, sols acides", s: "Juin – novembre", a: PM,
    cf: "Bolet de Satan (chapeau blanchâtre, pied avec réseau rouge, sols calcaires)", x: "Bon comestible uniquement bien cuit ; toxique cru" } },
  { id: "bolet-blafard", fr: "Bolet blafard", la: "Suillellus luridus", cat: C, groupe: "Cèpes et bolets", mois: [6, 10], commons: "Suillellus luridus", f: {
    c: "6–15 cm, brun olive à ocre", d: "Pores orange à rouges, bleuissent au toucher", p: "Jaune orangé avec un réseau rouge bien marqué",
    ch: "Jaune, bleuit ; rouge vineux à la base du pied", h: "Chênes, hêtres, sols calcaires", s: "Juin – octobre", a: PC, cf: "Bolet de Satan",
    x: "Comestible bien cuit ; éviter l'alcool au même repas" } },
  { id: "bolet-de-quelet", fr: "Bolet de Quélet", la: "Suillellus queletii", cat: C, groupe: "Cèpes et bolets", mois: [6, 10], commons: "Suillellus queletii", f: {
    c: "6–15 cm, orange-brique à brun rougeâtre", d: "Pores orange, bleuissent", p: "Jaune, rouge betterave à la base, sans réseau",
    ch: "Jaune, bleuit ; rouge betterave à la base", h: "Chênes, tilleuls, sols calcaires", s: "Juin – octobre", a: PC, cf: "Bolet de Satan", x: "Comestible uniquement bien cuit" } },
  { id: "bolet-rude", fr: "Bolet rude", la: "Leccinum scabrum", cat: C, groupe: "Cèpes et bolets", mois: [7, 10], commons: "Leccinum scabrum", f: {
    c: "5–15 cm, brun gris à brun noisette", d: "Tubes blanchâtres puis grisâtres", p: "Élancé, blanc couvert de mèches noires râpeuses",
    ch: "Blanche, molle avec l'âge, change peu à la coupe", h: "Toujours sous les bouleaux", s: "Juillet – octobre", a: PM, cf: "Autres bolets rudes ; peu de risque",
    x: "Comestible bien cuit ; jeunes exemplaires seulement" } },
  { id: "bolet-orange", fr: "Bolet orangé", la: "Leccinum aurantiacum", cat: C, groupe: "Cèpes et bolets", mois: [7, 10], commons: "Leccinum aurantiacum", f: {
    c: "6–20 cm, orange vif à rouge brique", d: "Tubes blanchâtres puis grisâtres", p: "Blanc couvert de mèches rousses à noirâtres",
    ch: "Blanche, gris violacé puis noirâtre à la coupe", h: "Peupliers, trembles", s: "Juillet – octobre", a: PM, cf: "Autres bolets rudes ; peu de risque",
    x: "Comestible uniquement bien cuit ; des troubles sont signalés après cuisson insuffisante" } },
  { id: "bolet-a-chair-jaune", fr: "Bolet à chair jaune", la: "Xerocomellus chrysenteron", cat: C, groupe: "Cèpes et bolets", mois: [7, 11], commons: "Xerocomellus chrysenteron", f: {
    c: "4–8 cm, brun olive, souvent craquelé laissant voir du rose dans les fentes", d: "Pores jaunes, larges, bleuissent légèrement", p: "Jaune, teinté de rouge vers le bas",
    ch: "Jaune pâle, molle", h: "Feuillus et conifères", s: "Juillet – novembre", a: PM, cf: "Peu de risque", x: "Comestible médiocre ; jeunes exemplaires seulement, s'abîme vite" } },
  { id: "bolet-jaune", fr: "Bolet jaune", la: "Suillus luteus", cat: C, groupe: "Cèpes et bolets", mois: [8, 11], commons: "Suillus luteus", f: {
    c: "5–12 cm, brun chocolat, très visqueux", d: "Pores jaunes, petits", p: "Jaune pâle, anneau membraneux brun violacé", ch: "Blanc jaunâtre, tendre",
    h: "Pins", s: "Août – novembre", a: PM, cf: "Peu de risque", x: "Comestible ; retirer la peau gluante du chapeau ; peut être laxatif" } },
  { id: "nonnette-granulee", fr: "Nonnette granulée", la: "Suillus granulatus", cat: C, groupe: "Cèpes et bolets", mois: [6, 11], commons: "Suillus granulatus", f: {
    c: "4–10 cm, brun orangé, visqueux", d: "Pores jaunes, laissent perler des gouttelettes laiteuses chez le jeune", p: "Jaune pâle, ponctué de granules dans le haut, sans anneau",
    ch: "Jaune pâle", h: "Pins, sols calcaires", s: "Juin – novembre", a: PM, cf: "Peu de risque", x: "Comestible ; retirer la peau gluante du chapeau" } },
  // Chanterelles et pieds de mouton
  { id: "girolle", fr: "Girolle", la: "Cantharellus cibarius", cat: C, groupe: "Chanterelles et pieds de mouton", mois: [6, 10], commons: "Cantharellus cibarius", f: {
    c: "3–10 cm, jaune d'œuf, irrégulier, bord ondulé", d: "Plis épais et fourchus (pas de vraies lames) qui descendent sur le pied", p: "Plein, de la même couleur que le chapeau",
    ch: "Blanc jaunâtre, ferme ; odeur fruitée d'abricot", h: "Hêtres, chênes, épicéas ; mousses", s: "Juin – octobre", a: PM,
    cf: "Fausse girolle (vraies lames fines et serrées, orange vif) ; clitocybe de l'olivier (en touffes sur souches, lames vraies) ; cortinaires orange", x: "Excellent comestible" } },
  { id: "chanterelle-en-tube", fr: "Chanterelle en tube", la: "Craterellus tubaeformis", cat: C, groupe: "Chanterelles et pieds de mouton", mois: [9, 12], commons: "Craterellus tubaeformis", f: {
    c: "2–6 cm, brun gris, creusé en entonnoir, souvent percé au centre", d: "Plis grisâtres, espacés, fourchus", p: "Creux, jaune à orangé, souvent aplati",
    ch: "Mince, élastique", h: "Conifères humides, mousses, en troupes nombreuses", s: "Septembre – décembre", a: CM,
    cf: "Cortinaire très joli (lames rouille, pied plein)", x: "Très bon comestible ; se sèche bien" } },
  { id: "trompette-de-la-mort", fr: "Trompette de la mort", la: "Craterellus cornucopioides", cat: C, groupe: "Chanterelles et pieds de mouton", mois: [8, 11], commons: "Craterellus cornucopioides", f: {
    c: "3–10 cm de haut, en forme de trompette creuse, gris noir à brun foncé", d: "Surface externe lisse ou légèrement ridée, gris cendré", p: "Fait corps avec le chapeau, creux jusqu'à la base",
    ch: "Mince, noirâtre", h: "Hêtres, chênes, sols argileux", s: "Août – novembre", a: PM, cf: "Peu de risque", x: "Très bon comestible ; se sèche bien" } },
  { id: "pied-de-mouton", fr: "Pied de mouton", la: "Hydnum repandum", cat: C, groupe: "Chanterelles et pieds de mouton", mois: [8, 11], commons: "Hydnum repandum", f: {
    c: "5–15 cm, crème à orangé pâle, bosselé", d: "Aiguillons crème, fragiles, qui descendent sur le pied", p: "Court, blanc, plein",
    ch: "Blanche, ferme, jaunit légèrement", h: "Feuillus et conifères", s: "Août – novembre", a: PM, cf: "Peu de risque : les aiguillons sont caractéristiques",
    x: "Bon comestible ; amer chez les vieux exemplaires" } },
  { id: "pied-de-mouton-roux", fr: "Pied de mouton roux", la: "Hydnum rufescens", cat: C, groupe: "Chanterelles et pieds de mouton", mois: [8, 11], commons: "Hydnum rufescens", f: {
    c: "3–7 cm, orange roux, plus petit et plus mince que le pied de mouton", d: "Aiguillons orangés, ne descendent pas sur le pied", p: "Blanc à orangé, plus élancé",
    ch: "Blanchâtre, fragile", h: "Feuillus et conifères", s: "Août – novembre", a: PM, cf: "Peu de risque", x: "Bon comestible" } },
  // Coulemelle et agarics
  { id: "coulemelle", fr: "Coulemelle", la: "Macrolepiota procera", cat: C, groupe: "Coulemelle et agarics", mois: [7, 10], commons: "Macrolepiota procera", f: {
    c: "10–30 cm, d'abord en baguette de tambour puis étalé en parasol ; écailles brunes sur fond crème, mamelon central brun", d: "Lames blanches, libres, serrées",
    p: "Haut (jusqu'à 40 cm), chiné de brun en zigzags ; anneau double, épais, qui coulisse le long du pied ; base bulbeuse sans volve",
    ch: "Blanche, ne rougit pas ; odeur agréable", h: "Lisières, clairières, prairies", s: "Juillet – octobre", a: PM,
    cf: "Petites lépiotes mortelles (moins de 10 cm, anneau non coulissant) ; amanite panthère (volve à la base)", x: "Très bon comestible ; chapeau seulement, le pied est fibreux" } },
  { id: "rose-des-pres", fr: "Rosé des prés", la: "Agaricus campestris", cat: C, groupe: "Coulemelle et agarics", mois: [7, 10], commons: "Agaricus campestris", f: {
    c: "4–10 cm, blanc, soyeux, parfois légèrement écailleux", d: "Lames rose vif chez le jeune, puis brun chocolat", p: "Court, blanc ; anneau mince, fugace ; pas de volve",
    ch: "Blanche, rosit très légèrement ; odeur agréable", h: "Prairies pâturées, jamais en forêt", s: "Juillet – octobre", a: PM,
    cf: "Amanites blanches mortelles (lames blanches, volve) ; agaric jaunissant (jaunit vivement au frottement, odeur d'encre)", x: "Très bon comestible" } },
  { id: "agaric-des-jacheres", fr: "Agaric des jachères", la: "Agaricus arvensis", cat: C, groupe: "Coulemelle et agarics", mois: [6, 10], commons: "Agaricus arvensis", f: {
    c: "8–20 cm, blanc à crème, jaunit légèrement au toucher", d: "Lames gris rosé pâle puis brun chocolat", p: "Blanc ; grand anneau double en roue dentée dessous ; pas de volve",
    ch: "Blanche ; odeur d'anis ou d'amande amère", h: "Prairies, lisières", s: "Juin – octobre", a: PM,
    cf: "Agaric jaunissant (odeur d'encre, base du pied jaune chrome à la coupe) ; amanite vireuse", x: "Très bon comestible" } },
  { id: "agaric-des-forets", fr: "Agaric des forêts", la: "Agaricus silvaticus", cat: C, groupe: "Coulemelle et agarics", mois: [8, 11], commons: "Agaricus silvaticus", f: {
    c: "5–10 cm, couvert de fines écailles brun roux sur fond crème", d: "Lames roses puis brun chocolat", p: "Blanchâtre, anneau membraneux ; pas de volve",
    ch: "Blanche, rougit nettement à la coupe", h: "Conifères", s: "Août – novembre", a: PM, cf: "Agaric jaunissant", x: "Bon comestible" } },
  { id: "agaric-auguste", fr: "Agaric auguste", la: "Agaricus augustus", cat: C, groupe: "Coulemelle et agarics", mois: [7, 10], commons: "Agaricus augustus", f: {
    c: "10–25 cm, couvert d'écailles brun doré sur fond jaunâtre", d: "Lames pâles puis brun chocolat", p: "Blanc, mèches floconneuses sous un grand anneau ; pas de volve",
    ch: "Blanche, jaunit légèrement ; odeur d'amande amère", h: "Litière riche, conifères et feuillus, bords de chemins", s: "Juillet – octobre", a: PM,
    cf: "Agaric jaunissant", x: "Bon comestible en quantité modérée : accumule le cadmium" } },
  // Morilles
  { id: "morille-commune", fr: "Morille commune", la: "Morchella esculenta", cat: C, groupe: "Morilles", mois: [3, 5], commons: "Morchella esculenta", f: {
    c: "4–10 cm de haut, arrondi à ovoïde, jaune ocre à gris beige ; alvéoles irrégulières comme une éponge", d: "Pas de lames ; chapeau soudé au pied",
    p: "Blanc crème, granuleux, creux", ch: "Mince, cassante, blanche ; une seule cavité intérieure", h: "Frênes, ormes, vergers, forêts alluviales, sols calcaires",
    s: "Mars – mai", a: PC, cf: "Gyromitre (circonvolutions en cerveau, plusieurs cavités) ; morillon",
    x: "Excellent comestible ; toxique crue ou peu cuite, cuire au moins 20 min ; quantités modérées", r: "Couper chaque exemplaire en deux : une seule cavité du sommet à la base" } },
  { id: "morille-conique", fr: "Morille conique", la: "Morchella elata", cat: C, groupe: "Morilles", mois: [4, 5], commons: "Morchella elata", f: {
    c: "4–10 cm de haut, conique, brun foncé à noirâtre ; alvéoles allongées, côtes verticales noircies", d: "Pas de lames ; chapeau soudé au pied",
    p: "Blanchâtre, granuleux, creux", ch: "Mince ; une seule cavité intérieure", h: "Conifères, places à feu, copeaux, jardins", s: "Avril – mai", a: CM,
    cf: "Gyromitre", x: "Excellent comestible ; mêmes précautions que la morille commune", r: "Couper chaque exemplaire en deux : une seule cavité du sommet à la base" } },
  // Lactaires
  { id: "lactaire-delicieux", fr: "Lactaire délicieux", la: "Lactarius deliciosus", cat: C, groupe: "Lactaires", mois: [8, 11], commons: "Lactarius deliciosus", f: {
    c: "5–15 cm, orange carotte avec des zones concentriques plus foncées, se tache de vert en vieillissant", d: "Lames orange, serrées, verdissent au toucher",
    p: "Court, orange, creux, marqué de petites fossettes", ch: "Lait orange carotte, qui ne change pas de couleur", h: "Pins, sols plutôt calcaires", s: "Août – novembre", a: PM,
    cf: "Lactaire à toison (chapeau poilu, lait blanc et brûlant)", x: "Bon comestible ; colore les urines en rouge, sans danger" } },
  { id: "lactaire-de-l-epicea", fr: "Lactaire de l'épicéa", la: "Lactarius deterrimus", cat: C, groupe: "Lactaires", mois: [8, 11], commons: "Lactarius deterrimus", f: {
    c: "4–10 cm, orange, verdit très vite", d: "Lames orange, verdissent", p: "Orange, sans fossettes marquées", ch: "Lait orange, vire au rouge vineux en 10 à 30 min",
    h: "Épicéas", s: "Août – novembre", a: CM, cf: "Lactaire à toison", x: "Comestible ; saveur un peu amère, moins apprécié que le lactaire délicieux" } },
  { id: "lactaire-sanguin", fr: "Lactaire sanguin", la: "Lactarius sanguifluus", cat: C, groupe: "Lactaires", mois: [9, 11], commons: "Lactarius sanguifluus", f: {
    c: "5–12 cm, orange terne à rose vineux, taches vertes", d: "Lames rose vineux", p: "Court, marqué de fossettes", ch: "Lait rouge sang dès la cassure",
    h: "Pins, sols calcaires, régions méditerranéennes", s: "Septembre – novembre", a: PC, cf: "Lactaire à toison", x: "Très bon comestible, le plus estimé du groupe" } },
  // Pleurote, mousserons, meunier, pied bleu
  { id: "pleurote-en-huitre", fr: "Pleurote en huître", la: "Pleurotus ostreatus", cat: C, groupe: "Pleurote, mousserons, meunier, pied bleu", mois: [10, 3], commons: "Pleurotus ostreatus", f: {
    c: "5–15 cm, en coquille ou en éventail, gris ardoise à brun, en touffes étagées", d: "Lames blanches, descendant jusqu'à la base", p: "Très court, latéral, parfois absent",
    ch: "Blanche, élastique ; odeur agréable", h: "Bois mort et troncs de feuillus (hêtres, peupliers)", s: "Octobre – mars, après les premiers froids", a: PM,
    cf: "Peu de risque en hiver sur bois ; pleurotes blancs sur conifères à éviter", x: "Bon comestible ; écarter la base coriace" } },
  { id: "mousseron-saint-georges", fr: "Mousseron de la Saint-Georges", la: "Calocybe gambosa", cat: C, groupe: "Pleurote, mousserons, meunier, pied bleu", mois: [4, 6], commons: "Calocybe gambosa", f: {
    c: "5–15 cm, blanc à crème, charnu, lisse, bord enroulé", d: "Lames blanches, très serrées, étroites", p: "Blanc, trapu, plein ; ni anneau ni volve",
    ch: "Blanche, ferme ; forte odeur de farine fraîche", h: "Prairies, haies, lisières ; souvent en cercles", s: "Avril – juin", a: PM,
    cf: "Inocybe de Patouillard (rougit, mortel) ; entolome livide (lames jaunes puis roses) ; amanite printanière (anneau, volve)", x: "Excellent comestible" } },
  { id: "faux-mousseron", fr: "Faux mousseron", la: "Marasmius oreades", cat: C, groupe: "Pleurote, mousserons, meunier, pied bleu", mois: [5, 11], commons: "Marasmius oreades", f: {
    c: "2–5 cm, beige à fauve, avec un mamelon arrondi, pâlit en séchant", d: "Lames crème, très espacées", p: "Fin, tenace : il se tord sans casser",
    ch: "Mince ; odeur d'amande", h: "Prairies et pelouses, en ronds de sorcière", s: "Mai – novembre", a: PM,
    cf: "Clitocybe blanchi (blanc, lames serrées, même milieu, toxique) ; panéole des foins", x: "Bon comestible ; chapeaux seulement ; se sèche bien" } },
  { id: "meunier", fr: "Meunier", la: "Clitopilus prunulus", cat: C, groupe: "Pleurote, mousserons, meunier, pied bleu", mois: [7, 10], commons: "Clitopilus prunulus", f: {
    c: "3–10 cm, blanc grisâtre, toucher de peau de chamois", d: "Lames blanches puis roses, descendant sur le pied", p: "Court, blanc, souvent excentré",
    ch: "Blanche, tendre ; forte odeur de farine", h: "Feuillus et conifères, souvent près des cèpes", s: "Juillet – octobre", a: PM,
    cf: "Clitocybes blancs toxiques (lames qui restent blanches) ; entolome livide", x: "Bon comestible pour les confirmés ; la sporée rose est le critère de sécurité" } },
  { id: "pied-bleu", fr: "Pied bleu", la: "Lepista nuda", cat: C, groupe: "Pleurote, mousserons, meunier, pied bleu", mois: [10, 12], commons: "Lepista nuda", f: {
    c: "5–15 cm, violet lilas puis brunâtre, lisse", d: "Lames lilas, serrées", p: "Violet, fibrilleux, sans anneau ni toile d'araignée",
    ch: "Lilas, tendre ; odeur fruitée", h: "Litière de feuillus et conifères, compost, parcs", s: "Octobre – décembre", a: PM,
    cf: "Cortinaires violets (voile en toile d'araignée, lames qui deviennent rouille)", x: "Bon comestible bien cuit ; toxique cru" } },
  // Russules
  { id: "russule-charbonniere", fr: "Russule charbonnière", la: "Russula cyanoxantha", cat: C, groupe: "Russules", mois: [7, 10], commons: "Russula cyanoxantha", f: {
    c: "5–15 cm, couleurs mêlées : violet, vert, gris, bleu ardoise", d: "Lames blanches, souples et grasses au toucher (ne cassent pas, contrairement aux autres russules)",
    p: "Blanc, parfois teinté de violet", ch: "Blanche, saveur douce", h: "Feuillus (hêtres, chênes)", s: "Juillet – octobre", a: PM,
    cf: "Russules âcres ; amanite phalloïde pour les formes vertes", x: "Très bon comestible" } },
  { id: "russule-verdoyante", fr: "Russule verdoyante", la: "Russula virescens", cat: C, groupe: "Russules", mois: [7, 9], commons: "Russula virescens", f: {
    c: "5–15 cm, vert-de-gris, surface craquelée en petites plaques", d: "Lames blanches à crème, cassantes", p: "Blanc, court, sans anneau ni volve",
    ch: "Blanche, saveur douce de noisette", h: "Hêtres, chênes", s: "Juillet – septembre", a: PC, cf: "Amanite phalloïde (anneau, volve, chapeau lisse)",
    x: "Excellent comestible ; déterrer la base du pied à chaque cueillette" } },
  { id: "russule-comestible", fr: "Russule comestible", la: "Russula vesca", cat: C, groupe: "Russules", mois: [6, 10], commons: "Russula vesca", f: {
    c: "5–10 cm, rose vineux à brun rosé ; la peau ne couvre pas tout à fait le bord, laissant voir la chair blanche", d: "Lames blanches, serrées",
    p: "Blanc, ferme, souvent effilé vers la base", ch: "Blanche, saveur douce", h: "Feuillus", s: "Juin – octobre", a: PM, cf: "Russules rouges âcres", x: "Bon comestible" } },
  { id: "russule-entiere", fr: "Russule entière", la: "Russula integra", cat: C, groupe: "Russules", mois: [7, 10], commons: "Russula integra", f: {
    c: "5–12 cm, brun rougeâtre à brun violacé, luisant", d: "Lames crème puis jaune ocre", p: "Blanc, ferme", ch: "Blanche, saveur douce",
    h: "Conifères", s: "Juillet – octobre", a: CM, cf: "Russules âcres", x: "Bon comestible" } },
  // Autres espèces à lames
  { id: "laccaire-amethyste", fr: "Laccaire améthyste", la: "Laccaria amethystina", cat: C, groupe: "Autres espèces à lames", mois: [8, 11], commons: "Laccaria amethystina", f: {
    c: "2–6 cm, violet améthyste vif, pâlit en séchant", d: "Lames épaisses, espacées, violettes", p: "Fin, fibreux, violet", ch: "Mince, violacée, sans odeur marquée",
    h: "Feuillus et conifères", s: "Août – novembre", a: PM, cf: "Mycène pure et mycène rose (odeur de radis, lames serrées, toxiques)",
    x: "Comestible médiocre ; accumule l'arsenic, à consommer rarement" } },
  { id: "cortinaire-violet", fr: "Cortinaire violet", la: "Cortinarius violaceus", cat: C, groupe: "Autres espèces à lames", mois: [8, 10], commons: "Cortinarius violaceus", f: {
    c: "6–15 cm, violet très foncé, écailleux et mat", d: "Lames violet foncé puis rouille", p: "Violet foncé, bulbe à la base, restes de toile d'araignée",
    ch: "Violacée ; odeur de bois de cèdre", h: "Conifères et feuillus, sols acides ; rare", s: "Août – octobre", a: CM, cf: "Autres cortinaires violets, dont toxiques",
    x: "Comestible pour les confirmés uniquement ; espèce rare à préserver" } },
  { id: "pholiote-ridee", fr: "Pholiote ridée", la: "Cortinarius caperatus", cat: C, groupe: "Autres espèces à lames", mois: [8, 10], commons: "Cortinarius caperatus", f: {
    c: "5–12 cm, jaune ocre, ridé radialement, centre couvert d'un givre blanc", d: "Lames crème puis ocre rouille", p: "Blanc, anneau membraneux bien formé",
    ch: "Blanche à jaunâtre", h: "Conifères, myrtilles, sols acides", s: "Août – octobre", a: CM, cf: "Cortinaires toxiques ; inocybes", x: "Bon comestible pour les confirmés" } },
  { id: "hygrophore-de-mars", fr: "Hygrophore de mars", la: "Hygrophorus marzuolus", cat: C, groupe: "Autres espèces à lames", mois: [2, 5], commons: "Hygrophorus marzuolus", f: {
    c: "4–10 cm, gris clair à noirâtre, souvent à demi enfoui sous les aiguilles ou la neige fondante", d: "Lames épaisses, espacées, blanches puis grisâtres",
    p: "Trapu, blanc grisâtre", ch: "Blanche, ferme", h: "Sapins et hêtres, montagne", s: "Février – mai, à la fonte des neiges", a: "Montagne",
    cf: "Peu de risque à cette saison", x: "Très bon comestible" } },
  { id: "agrocybe-precoce", fr: "Agrocybe précoce", la: "Agrocybe praecox", cat: C, groupe: "Autres espèces à lames", mois: [4, 6], commons: "Agrocybe praecox", f: {
    c: "3–7 cm, crème à beige ocre, lisse", d: "Lames pâles puis brun tabac", p: "Blanchâtre ; anneau membraneux fragile", ch: "Blanche ; odeur de farine",
    h: "Prairies, jardins, copeaux, bords de chemins", s: "Avril – juin", a: PC, cf: "Hébélomes et inocybes (toxiques)", x: "Comestible médiocre ; réservé aux confirmés" } },
  { id: "lyophylle-en-touffes", fr: "Lyophylle en touffes", la: "Lyophyllum decastes", cat: C, groupe: "Autres espèces à lames", mois: [8, 11], commons: "Lyophyllum decastes", f: {
    c: "4–12 cm, gris brun à brun, lisse ; en grosses touffes serrées", d: "Lames blanches à crème", p: "Blanc, soudé aux autres à la base",
    ch: "Blanche, ferme, élastique", h: "Bords de chemins, parcs, lisières", s: "Août – novembre", a: PM, cf: "Lyophylle conné (blanc pur, toxique) ; entolome livide", x: "Bon comestible" } },
  { id: "amanite-des-cesars", fr: "Amanite des Césars", la: "Amanita caesarea", cat: C, groupe: "Autres espèces à lames", mois: [7, 10], commons: "Amanita caesarea", f: {
    c: "8–20 cm, orange vif, lisse, sortant d'un œuf blanc", d: "Lames jaune d'or", p: "Jaune d'or ; anneau jaune ; grande volve blanche en sac",
    ch: "Blanche, jaune sous la peau", h: "Chênes, châtaigniers ; régions chaudes, rare dans le Nord-Est", s: "Juillet – octobre", a: PC,
    cf: "Amanite tue-mouches (lames et pied blancs, flocons blancs, toxique) ; œufs d'amanites mortelles",
    x: "Excellent comestible ; réservé aux confirmés, ne jamais récolter à l'état d'œuf fermé" } },
  // Polypores, vesses-de-loup, coprin, truffe
  { id: "sparassis-crepu", fr: "Sparassis crépu", la: "Sparassis crispa", cat: C, groupe: "Polypores, vesses-de-loup, coprin, truffe", mois: [8, 11], commons: "Sparassis crispa", f: {
    c: "Boule de 10–40 cm faite de lames ondulées et frisées, évoquant un chou-fleur ou une éponge", co: "Crème à jaune pâle, brunit en vieillissant",
    ch: "Élastique, blanche ; odeur agréable", h: "Au pied des pins, sur les racines", s: "Août – novembre", a: PM,
    cf: "Clavaire élégante (rameaux dressés et non lames frisées, couleur rose-orangé, toxique)", x: "Bon comestible jeune ; bien nettoyer (aiguilles et terre)" } },
  { id: "polypore-en-touffe", fr: "Polypore en touffe", la: "Grifola frondosa", cat: C, groupe: "Polypores, vesses-de-loup, coprin, truffe", mois: [9, 11], commons: "Grifola frondosa", f: {
    c: "Grosse touffe de 20–50 cm faite de nombreux petits chapeaux gris brun en éventail", d: "Pores blancs, fins", ch: "Blanche, ferme ; odeur forte",
    h: "Au pied des vieux chênes, parfois châtaigniers", s: "Septembre – novembre", a: PC, cf: "Polypore géant (noircit au toucher, plus coriace)", x: "Très bon comestible jeune" } },
  { id: "polypore-soufre", fr: "Polypore soufré", la: "Laetiporus sulphureus", cat: C, groupe: "Polypores, vesses-de-loup, coprin, truffe", mois: [5, 9], commons: "Laetiporus sulphureus", f: {
    c: "Consoles étagées de 10–40 cm sur les troncs", co: "Orange vif dessus, jaune soufre dessous et en bordure", d: "Pores très fins, jaune soufre",
    ch: "Jaune pâle, tendre et juteuse jeune, crayeuse ensuite", h: "Chênes, saules, cerisiers, robiniers", s: "Mai – septembre", a: PC, cf: "Peu de risque",
    x: "Comestible jeune et bien cuit ; éviter les sujets poussés sur if ou robinier ; troubles digestifs signalés chez certaines personnes" } },
  { id: "langue-de-boeuf", fr: "Langue de bœuf", la: "Fistulina hepatica", cat: C, groupe: "Polypores, vesses-de-loup, coprin, truffe", mois: [8, 10], commons: "Fistulina hepatica", f: {
    c: "Console charnue de 10–25 cm en forme de langue, rouge sang", d: "Petits tubes séparés, crème puis rosés",
    ch: "Rouge marbrée comme de la viande, laisse s'écouler un jus rouge", h: "Chênes, châtaigniers, souvent au pied du tronc", s: "Août – octobre", a: PC,
    cf: "Peu de risque", x: "Comestible ; saveur acidulée" } },
  { id: "vesse-de-loup-perlee", fr: "Vesse-de-loup perlée", la: "Lycoperdon perlatum", cat: C, groupe: "Polypores, vesses-de-loup, coprin, truffe", mois: [7, 11], commons: "Lycoperdon perlatum", f: {
    c: "Poire inversée de 3–7 cm, blanche, couverte de petites pointes coniques qui se détachent", ch: "Blanche et homogène chez le jeune, puis olive et poudreuse",
    h: "Feuillus et conifères", s: "Juillet – novembre", a: PM,
    cf: "Œuf d'amanite (en coupe, on y voit la silhouette d'un champignon) ; scléroderme (chair noire marbrée)",
    x: "Comestible jeune uniquement, chair blanche et homogène", r: "Toujours couper en deux avant de garder" } },
  { id: "vesse-de-loup-geante", fr: "Vesse-de-loup géante", la: "Calvatia gigantea", cat: C, groupe: "Polypores, vesses-de-loup, coprin, truffe", mois: [6, 10], commons: "Calvatia gigantea", f: {
    c: "Boule blanche de 20–50 cm, lisse, sans pied", ch: "Blanche, ferme et homogène chez le jeune, puis olive et poudreuse",
    h: "Prairies, jardins, lisières riches en azote", s: "Juin – octobre", a: PM, cf: "Peu de risque à cette taille", x: "Bon comestible jeune, chair entièrement blanche" } },
  { id: "coprin-chevelu", fr: "Coprin chevelu", la: "Coprinus comatus", cat: C, groupe: "Polypores, vesses-de-loup, coprin, truffe", mois: [6, 11], commons: "Coprinus comatus", f: {
    c: "5–15 cm de haut, cylindrique, blanc couvert de mèches laineuses, se liquéfie en encre noire par le bord", d: "Lames blanches, puis roses, puis noires",
    p: "Blanc, creux, anneau mobile fragile", ch: "Blanche, tendre", h: "Bords de chemins, pelouses, terrains remués", s: "Juin – novembre", a: PM,
    cf: "Coprin noir d'encre (gris, lisse, toxique avec l'alcool)", x: "Bon comestible jeune, lames encore blanches ; cuisiner dans les heures qui suivent la cueillette" } },
  { id: "truffe-noire", fr: "Truffe noire", la: "Tuber melanosporum", cat: C, groupe: "Polypores, vesses-de-loup, coprin, truffe", mois: [12, 3], commons: "Tuber melanosporum", f: {
    c: "Tubercule souterrain de 3–10 cm, noir, couvert de petites verrues pyramidales", ch: "Noire violacée, parcourue de fines veines blanches ; odeur puissante",
    h: "Racines de chênes truffiers et noisetiers, sols calcaires ; surtout Sud-Est et Sud-Ouest", s: "Décembre – mars", a: PC,
    cf: "Scléroderme (chair noire mais sans veines, toxique)", x: "Excellent comestible",
    l: "La récolte sur terrain d'autrui sans autorisation est sanctionnée ; la plupart des truffières sont privées" } },
];
