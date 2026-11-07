import type { Espece } from "./types";

const T = "toxique" as const;
const PM = "Plaine à montagne";
const PC = "Plaine et collines";
const CM = "Collines et montagne";
const PAN = "Syndrome panthérinien : 30 min à 3 h après le repas, agitation, confusion, ivresse, hallucinations, parfois convulsions, puis somnolence";
const MUS = "Syndrome muscarinien : 15 min à 2 h après le repas, sueurs abondantes, salivation, larmes, troubles de la vue, ralentissement du cœur";
const GI = "Gastro-intestinal : 30 min à 4 h après le repas, nausées, vomissements, diarrhée, douleurs abdominales";

export const lot3: Espece[] = [
  { id: "amanite-panthere", fr: "Amanite panthère", la: "Amanita pantherina", cat: T, syndrome: "Panthérinien", mois: [7, 10], commons: "Amanita pantherina", f: {
    c: "5–12 cm, brun gris à brun noisette, couvert de petits flocons blanc pur ; marge striée", d: "Lames blanches, libres",
    p: "Blanc ; anneau lisse, non strié ; bulbe à la base bordé d'un bourrelet net", ch: "Blanche, ne rougit pas ; odeur faible de radis",
    h: "Feuillus et conifères", s: "Juillet – octobre", a: PM, cf: "Amanite rougissante (chair et morsures qui rougissent, anneau strié) ; coulemelle",
    x: PAN + " ; la plus toxique du groupe" } },
  { id: "amanite-tue-mouches", fr: "Amanite tue-mouches", la: "Amanita muscaria", cat: T, syndrome: "Panthérinien", mois: [8, 11], commons: "Amanita muscaria", f: {
    c: "8–20 cm, rouge vif à orange, couvert de flocons blancs (qui peuvent être lavés par la pluie)", d: "Lames blanches",
    p: "Blanc ; anneau blanc ; bulbe couvert de bourrelets concentriques", ch: "Blanche, jaune orangé sous la peau", h: "Bouleaux, épicéas, pins", s: "Août – novembre", a: PM,
    cf: "Amanite des Césars (lames et pied jaunes, grande volve en sac, sans flocons) ; russules rouges", x: PAN } },
  { id: "amanite-jonquille", fr: "Amanite jonquille", la: "Amanita gemmata", cat: T, syndrome: "Panthérinien", mois: [4, 10], commons: "Amanita gemmata", f: {
    c: "4–10 cm, jaune paille à jaune jonquille, flocons blancs ; marge striée", d: "Lames blanches", p: "Blanc ; anneau fragile, souvent absent ; bulbe avec bourrelet",
    ch: "Blanche", h: "Pins, sols sableux", s: "Avril – octobre", a: PM, cf: "Amanite rougissante, amanite citrine", x: PAN } },
  { id: "amanite-royale", fr: "Amanite royale", la: "Amanita regalis", cat: T, syndrome: "Panthérinien", mois: [8, 10], commons: "Amanita regalis", f: {
    c: "8–20 cm, brun fauve à brun foie, flocons jaunâtres", d: "Lames blanches", p: "Blanc jaunâtre ; anneau ; bulbe avec bourrelets jaunâtres",
    ch: "Blanche, jaunâtre sous la peau", h: "Épicéas, bouleaux ; montagne", s: "Août – octobre", a: "Montagne", cf: "Amanite rougissante ; amanite panthère", x: PAN } },
  { id: "clitocybe-blanchi", fr: "Clitocybe blanchi", la: "Clitocybe rivulosa", cat: T, syndrome: "Muscarinien", mois: [7, 11], commons: "Clitocybe rivulosa", f: {
    c: "2–5 cm, blanc grisâtre, givré, souvent un peu creusé", d: "Lames blanc crème, serrées, légèrement décurrentes", p: "Court, blanchâtre",
    ch: "Mince, blanche ; odeur faible de farine", h: "Prairies, pelouses, souvent en ronds", s: "Juillet – novembre", a: PM,
    cf: "Faux mousseron (lames espacées, pied tenace) ; meunier (lames roses)", x: MUS } },
  { id: "clitocybe-des-feuilles", fr: "Clitocybe des feuilles", la: "Clitocybe phyllophila", cat: T, syndrome: "Muscarinien", mois: [9, 11], commons: "Clitocybe phyllophila", f: {
    c: "4–10 cm, blanc à chamois, givré", d: "Lames crème, décurrentes", p: "Blanchâtre, base cotonneuse prise dans les feuilles", ch: "Blanche ; odeur un peu aniée",
    h: "Litière de feuillus", s: "Septembre – novembre", a: PM, cf: "Clitocybe odorant ; meunier", x: MUS } },
  { id: "mycene-pure", fr: "Mycène pure", la: "Mycena pura", cat: T, syndrome: "Muscarinien", mois: [6, 11], commons: "Mycena pura", f: {
    c: "2–5 cm, lilas à rosé, marge striée", d: "Lames blanc rosé, assez serrées", p: "Fin, creux, de la couleur du chapeau", ch: "Mince ; nette odeur de radis",
    h: "Litière de feuillus et conifères", s: "Juin – novembre", a: PM, cf: "Laccaire améthyste (lames épaisses et espacées, sans odeur de radis)", x: MUS + " ; généralement léger" } },
  { id: "mycene-rose", fr: "Mycène rose", la: "Mycena rosea", cat: T, syndrome: "Muscarinien", mois: [8, 11], commons: "Mycena rosea", f: {
    c: "3–6 cm, rose vif, marge striée", d: "Lames blanc rosé", p: "Blanc rosé, creux", ch: "Mince ; odeur de radis", h: "Litière de feuillus, surtout hêtres",
    s: "Août – novembre", a: PM, cf: "Laccaire améthyste ; mycène pure", x: MUS + " ; généralement léger" } },
  { id: "inocybe-lames-terreuses", fr: "Inocybe à lames terreuses", la: "Inocybe geophylla", cat: T, syndrome: "Muscarinien", mois: [7, 11], commons: "Inocybe geophylla", f: {
    c: "1–3 cm, blanc soyeux (forme lilas existante), conique avec un mamelon", d: "Lames gris terreux puis brun tabac", p: "Fin, blanc soyeux", ch: "Mince ; odeur spermatique",
    h: "Feuillus et conifères, bords de chemins", s: "Juillet – novembre", a: PM, cf: "Petits champignons blancs, mousserons", x: MUS } },
  { id: "inocybe-fastigie", fr: "Inocybe fastigié", la: "Inocybe rimosa", cat: T, syndrome: "Muscarinien", mois: [6, 10], commons: "Inocybe rimosa", f: {
    c: "3–7 cm, conique pointu, paille à brun jaunâtre, fibreux, marge fendue", d: "Lames olivâtres puis brunes", p: "Blanc à paille, fibreux, sans bulbe marqué",
    ch: "Blanche ; odeur spermatique", h: "Feuillus, parcs, bords de chemins", s: "Juin – octobre", a: PM, cf: "Mousserons ; tricholomes", x: MUS } },
  { id: "inocybe-dechire", fr: "Inocybe déchiré", la: "Inocybe lacera", cat: T, syndrome: "Muscarinien", mois: [6, 10], commons: "Inocybe lacera", f: {
    c: "2–4 cm, brun, fibrilleux à mèches relevées", d: "Lames brunâtres", p: "Brun, fibrilleux, plus sombre vers la base", ch: "Mince ; odeur faible",
    h: "Sols sableux, pins, bords de chemins", s: "Juin – octobre", a: PM, cf: "Petits champignons bruns", x: MUS } },
  { id: "coprin-noir-d-encre", fr: "Coprin noir d'encre", la: "Coprinopsis atramentaria", cat: T, syndrome: "Coprinien", mois: [5, 11], commons: "Coprinopsis atramentaria", f: {
    c: "3–7 cm de haut, ovoïde puis en cloche, gris lisse à légèrement strié ; se liquéfie en encre noire", d: "Lames blanches puis noires, déliquescentes",
    p: "Blanc, creux, avec une trace d'anneau près de la base", ch: "Mince, blanche", h: "Bords de chemins, souches enterrées, jardins ; en touffes", s: "Mai – novembre", a: PM,
    cf: "Coprin chevelu (blanc et laineux, cylindrique)",
    x: "Seulement si de l'alcool est bu dans les 2 à 3 jours avant ou après le repas : rougeur du visage, palpitations, malaise, en 15 à 30 min" } },
  { id: "psilocybe-lanceole", fr: "Psilocybe lancéolé", la: "Psilocybe semilanceata", cat: T, syndrome: "Psilocybien", mois: [9, 11], commons: "Psilocybe semilanceata", f: {
    c: "0,5–2 cm, conique pointu avec un petit téton, beige à brun olive, visqueux par temps humide", d: "Lames gris olive puis brun violacé noir",
    p: "Très fin, ondulé, blanchâtre", ch: "Très mince", h: "Prairies pâturées, humides, souvent en altitude", s: "Septembre – novembre", a: CM,
    cf: "Petits champignons de prairie, dont des espèces toxiques",
    x: "20 min à 1 h : hallucinations, anxiété, troubles du comportement pouvant entraîner des accidents ; crises d'angoisse sévères possibles",
    l: "Stupéfiant en France : détention et consommation interdites" } },
  { id: "paneole-des-foins", fr: "Panéole des foins", la: "Panaeolina foenisecii", cat: T, syndrome: "Neurologique léger", mois: [5, 10], commons: "Panaeolina foenisecii", f: {
    c: "1–3 cm, en cloche, brun chocolat, pâlit en séchant avec une bande plus sombre au bord", d: "Lames brun marbré puis brun foncé", p: "Fin, brun clair, fragile",
    ch: "Très mince", h: "Pelouses tondues, prairies ; très commun dans les jardins", s: "Mai – octobre", a: PM, cf: "Faux mousseron (pied tenace, lames espacées crème)",
    x: "Troubles légers (malaise, nervosité) ; ingestion fréquente par les jeunes enfants dans les jardins" } },
  { id: "tricholome-tigre", fr: "Tricholome tigré", la: "Tricholoma pardinum", cat: T, syndrome: "Gastro-intestinal sévère", mois: [8, 10], commons: "Tricholoma pardinum", f: {
    c: "6–15 cm, gris argenté, couvert de petites écailles gris foncé disposées en cercles", d: "Lames blanc crème, échancrées, laissant perler des gouttelettes",
    p: "Blanc, massif, sans anneau", ch: "Blanche, ferme ; odeur de farine", h: "Hêtres et sapins, sols calcaires", s: "Août – octobre", a: CM,
    cf: "Tricholome jaunissant et autres tricholomes gris, plus petits et plus minces", x: GI + " ; sévère, pouvant durer plusieurs jours" } },
  { id: "entolome-livide", fr: "Entolome livide", la: "Entoloma sinuatum", cat: T, syndrome: "Gastro-intestinal sévère", mois: [8, 10], commons: "Entoloma sinuatum", f: {
    c: "8–20 cm, gris beige à blanc sale, lisse et un peu luisant", d: "Lames jaunâtres chez le jeune, puis rose saumon", p: "Blanc, massif, sans anneau",
    ch: "Blanche ; odeur de farine", h: "Chênes, hêtres, sols argileux et calcaires", s: "Août – octobre", a: PC,
    cf: "Meunier, clitocybe nébuleux, mousseron de la Saint-Georges", x: GI + " ; sévère" } },
  { id: "bolet-de-satan", fr: "Bolet de Satan", la: "Rubroboletus satanas", cat: T, syndrome: "Gastro-intestinal sévère", mois: [7, 9], commons: "Rubroboletus satanas", f: {
    c: "10–25 cm, blanc grisâtre à blanc crème, massif", d: "Pores rouge sang, bleuissent", p: "Très ventru, jaune en haut, rouge en bas, couvert d'un réseau rouge",
    ch: "Blanchâtre, bleuit faiblement ; odeur désagréable en vieillissant", h: "Chênes, hêtres, sols calcaires, stations chaudes", s: "Juillet – septembre", a: PC,
    cf: "Bolet à pied rouge, bolet blafard (chapeau brun, pas blanc)", x: GI + " ; sévère, même cuit" } },
  { id: "clitocybe-de-l-olivier", fr: "Clitocybe de l'olivier", la: "Omphalotus olearius", cat: T, syndrome: "Gastro-intestinal sévère", mois: [8, 11], commons: "Omphalotus olearius", f: {
    c: "6–15 cm, orange vif à orange cuivré, creusé au centre", d: "Vraies lames, fines et serrées, orange, décurrentes", p: "Orange, souvent soudé à d'autres en grosses touffes",
    ch: "Jaune orangé, fibreuse", h: "Souches et racines de chênes, oliviers, châtaigniers ; surtout le Sud", s: "Août – novembre", a: PC,
    cf: "Girolle (plis épais et non lames, pousse isolée au sol, jamais en grosses touffes sur bois)", x: GI + " ; sévère" } },
  { id: "hypholome-en-touffe", fr: "Hypholome en touffe", la: "Hypholoma fasciculare", cat: T, syndrome: "Gastro-intestinal", mois: [1, 12], commons: "Hypholoma fasciculare", f: {
    c: "2–7 cm, jaune soufre, centre orangé ; en grosses touffes", d: "Lames jaune verdâtre puis olive sombre", p: "Jaune, fin, courbé", ch: "Jaune ; saveur très amère",
    h: "Souches de feuillus et conifères", s: "Toute l'année", a: PM, cf: "Pholiote changeante, armillaire, hypholome couleur de brique", x: GI } },
  { id: "scleroderme-vulgaire", fr: "Scléroderme vulgaire", la: "Scleroderma citrinum", cat: T, syndrome: "Gastro-intestinal", mois: [7, 11], commons: "Scleroderma citrinum", f: {
    c: "Boule de 3–10 cm, sans pied, jaune ocre, peau épaisse et craquelée en écailles", ch: "Blanche puis rapidement noir violacé marbrée de blanc ; odeur métallique",
    h: "Sols acides, feuillus et conifères, bords de chemins", s: "Juillet – novembre", a: PM,
    cf: "Vesses-de-loup (chair blanche homogène, peau fine) ; truffes (chair veinée)", x: GI + ", parfois avec malaise" } },
  { id: "russule-emetique", fr: "Russule émétique", la: "Russula emetica", cat: T, syndrome: "Gastro-intestinal", mois: [7, 11], commons: "Russula emetica", f: {
    c: "3–10 cm, rouge vif, peau qui se détache facilement", d: "Lames blanches", p: "Blanc pur, fragile", ch: "Blanche ; saveur brûlante",
    h: "Conifères humides, tourbières, sphaignes", s: "Juillet – novembre", a: CM, cf: "Russules rouges comestibles (saveur douce)", x: GI } },
  { id: "lactaire-a-toison", fr: "Lactaire à toison", la: "Lactarius torminosus", cat: T, syndrome: "Gastro-intestinal", mois: [8, 10], commons: "Lactarius torminosus", f: {
    c: "4–12 cm, rose saumon à zones concentriques, marge enroulée et très poilue", d: "Lames crème rosé", p: "Rosé pâle, creux", ch: "Lait blanc, abondant, saveur brûlante",
    h: "Toujours sous les bouleaux", s: "Août – octobre", a: PM, cf: "Lactaire délicieux (lait orange, chapeau non poilu)", x: GI } },
  { id: "agaric-jaunissant", fr: "Agaric jaunissant", la: "Agaricus xanthodermus", cat: T, syndrome: "Gastro-intestinal", mois: [7, 11], commons: "Agaricus xanthodermus", f: {
    c: "5–15 cm, blanc, jaunit vivement au frottement", d: "Lames roses puis brun chocolat", p: "Blanc, anneau ; base jaune chrome vif à la coupe",
    ch: "Blanche ; odeur d'encre ou de phénol, surtout à la cuisson", h: "Parcs, jardins, lisières", s: "Juillet – novembre", a: PC,
    cf: "Rosé des prés, agaric des jachères", x: GI } },
  { id: "clavaire-elegante", fr: "Clavaire élégante", la: "Ramaria formosa", cat: T, syndrome: "Gastro-intestinal", mois: [8, 10], commons: "Ramaria formosa", f: {
    c: "Touffe de 10–20 cm en forme de corail, rameaux dressés rose saumon à pointes jaunes", ch: "Blanche, saveur amère", h: "Hêtres", s: "Août – octobre", a: PM,
    cf: "Sparassis crépu ; clavaires comestibles, difficiles à distinguer", x: GI + ", effet laxatif marqué" } },
  { id: "hebelome-echaude", fr: "Hébélome échaudé", la: "Hebeloma crustuliniforme", cat: T, syndrome: "Gastro-intestinal", mois: [9, 11], commons: "Hebeloma crustuliniforme", f: {
    c: "4–10 cm, crème à beige, centre plus foncé, un peu gras", d: "Lames beige puis brun argile, laissant perler des gouttelettes par temps humide",
    p: "Blanc, floconneux dans le haut", ch: "Blanche ; odeur de radis, saveur amère", h: "Feuillus, lisières, parcs", s: "Septembre – novembre", a: PM,
    cf: "Mousserons, tricholomes", x: GI } },
  { id: "lepiote-cretee", fr: "Lépiote crêtée", la: "Lepiota cristata", cat: T, syndrome: "Gastro-intestinal", mois: [7, 11], commons: "Lepiota cristata", f: {
    c: "2–5 cm, blanc avec un centre brun et des écailles brunes en cercles", d: "Lames blanches, libres", p: "Fin, blanc ; petit anneau fragile",
    ch: "Blanche ; odeur forte et désagréable de caoutchouc", h: "Litière, bords de chemins, jardins", s: "Juillet – novembre", a: PM,
    cf: "Jeunes coulemelles ; lépiotes mortelles", x: GI + " ; à traiter comme une lépiote mortelle en cas de doute" } },
  { id: "cortinaire-odeur-de-bouc", fr: "Cortinaire à odeur de bouc", la: "Cortinarius traganus", cat: T, syndrome: "Gastro-intestinal", mois: [8, 10], commons: "Cortinarius traganus", f: {
    c: "5–12 cm, lilas pâle, soyeux", d: "Lames ocre puis rouille", p: "Lilas, massif, bulbe ; restes de toile d'araignée", ch: "Jaune ocre ; forte odeur de bouc",
    h: "Conifères (pins, épicéas), montagne", s: "Août – octobre", a: "Montagne", cf: "Cortinaire violet ; pied bleu", x: GI } },
  { id: "helvelle-crepue", fr: "Helvelle crépue", la: "Helvella crispa", cat: T, syndrome: "Gastro-intestinal", mois: [8, 11], commons: "Helvella crispa", f: {
    c: "2–5 cm, blanc crème, en selle tordue et ondulée", p: "Blanc, creusé de côtes profondes et de cavités", ch: "Mince, cassante",
    h: "Feuillus, bords de chemins", s: "Août – novembre", a: PM, cf: "Peu de risque", x: GI + " ; toxique crue" } },
  { id: "pezize-couronnee", fr: "Pézize couronnée", la: "Sarcosphaera coronaria", cat: T, syndrome: "Gastro-intestinal", mois: [4, 6], commons: "Sarcosphaera coronaria", f: {
    c: "Boule creuse de 5–12 cm, d'abord enterrée, qui s'ouvre en étoile ; intérieur lilas, extérieur blanc", ch: "Blanche, cassante",
    h: "Conifères, sols calcaires, montagne", s: "Avril – juin", a: CM, cf: "Peu de risque", x: GI + " ; accumule l'arsenic" } },
  { id: "lyophylle-conne", fr: "Lyophylle conné", la: "Lyophyllum connatum", cat: T, syndrome: "Toxicité suspectée", mois: [9, 11], commons: "Lyophyllum connatum", f: {
    c: "3–8 cm, blanc pur, en touffes serrées", d: "Lames blanches, serrées, décurrentes", p: "Blanc, soudé aux autres à la base", ch: "Blanche, élastique",
    h: "Bords de chemins, prairies, lisières", s: "Septembre – novembre", a: PM, cf: "Lyophylle en touffes (brun gris) ; clitocybes blancs",
    x: "Toxicité suspectée : longtemps consommé, retiré des comestibles pour une substance soupçonnée d'être cancérogène (à confirmer)" } },
];
