import type { Espece } from "./types";

const T = "toxique" as const;
const PH = "Identiques à l'amanite phalloïde : 6 à 24 h de latence, puis atteinte du foie";

export const lot1: Espece[] = [
  { id: "amanite-phalloide", fr: "Amanite phalloïde", la: "Amanita phalloides", cat: T, mortel: true, syndrome: "Phalloïdien", mois: [7, 11], commons: "Amanita phalloides", f: {
    c: "5–15 cm, vert olive à jaunâtre, parfois blanchâtre ; fines fibrilles sombres rayonnantes ; surface lisse, sans flocons le plus souvent",
    d: "Lames blanches, libres, serrées ; restent blanches",
    p: "Blanc, souvent marbré de vert pâle ; anneau blanc membraneux et pendant ; base renflée dans une volve blanche en forme de sac, souvent enterrée",
    ch: "Blanche, immuable ; odeur faible, désagréable en vieillissant",
    h: "Feuillus : chênes, châtaigniers, hêtres ; plus rarement conifères", s: "Juillet – novembre", a: "Plaine à montagne moyenne",
    cf: "Russule verdoyante (ni anneau ni volve, chair cassante comme de la craie) ; rosé des prés (lames roses puis brunes, pas de volve) ; tricholomes verdâtres",
    x: "Premiers signes 6 à 24 h après le repas : vomissements, diarrhée violente. Accalmie trompeuse, puis atteinte du foie. Un seul chapeau peut suffire à tuer un adulte",
    r: "Toujours déterrer la base du pied pour vérifier l'absence de volve" } },
  { id: "amanite-vireuse", fr: "Amanite vireuse", la: "Amanita virosa", cat: T, mortel: true, syndrome: "Phalloïdien", mois: [7, 10], commons: "Amanita virosa", f: {
    c: "5–12 cm, entièrement blanc, d'abord conique puis convexe, souvent un peu asymétrique ; légèrement visqueux par temps humide",
    d: "Lames blanches, libres, serrées",
    p: "Blanc, élancé, couvert de mèches cotonneuses ; anneau fragile, souvent déchiré ou disparu ; volve blanche en sac à la base",
    ch: "Blanche, odeur désagréable ; la surface du chapeau jaunit avec une goutte de potasse (test de mycologue)",
    h: "Conifères (épicéas) et feuillus (hêtres, bouleaux) sur sols acides et humides", s: "Juillet – octobre", a: "Surtout collines et montagne",
    cf: "Rosé des prés, agaric des jachères (lames roses puis brunes, pas de volve) ; jeunes vesses-de-loup quand l'amanite est encore dans son œuf",
    x: "Identiques à l'amanite phalloïde : 6 à 24 h de latence, troubles digestifs violents, puis atteinte du foie",
    r: "Tout champignon blanc à lames blanches avec anneau : ne jamais consommer sans avis d'expert" } },
  { id: "amanite-printaniere", fr: "Amanite printanière", la: "Amanita verna", cat: T, mortel: true, syndrome: "Phalloïdien", mois: [4, 6], commons: "Amanita verna", f: {
    c: "4–10 cm, blanc à crème, convexe puis étalé, lisse", d: "Lames blanches, libres, serrées",
    p: "Blanc, lisse ; anneau membraneux blanc ; volve blanche en sac à la base",
    ch: "Blanche, odeur faible ; pas de jaunissement à la potasse (différence avec l'amanite vireuse)",
    h: "Feuillus (chênes) sur sols calcaires, régions chaudes ; plus rare dans le Nord-Est", s: "Avril – juin", a: "Plaine et collines",
    cf: "Mousseron de la Saint-Georges (même saison, mais ni anneau ni volve, odeur de farine) ; rosé des prés", x: PH,
    r: "Au printemps, un champignon blanc à lames blanches n'est pas forcément un mousseron : vérifier la base du pied" } },
  { id: "galere-marginee", fr: "Galère marginée", la: "Galerina marginata", cat: T, mortel: true, syndrome: "Phalloïdien", mois: [1, 12], commons: "Galerina marginata", f: {
    c: "1,5–5 cm, brun-orangé à fauve, pâlit en séchant depuis le centre (hygrophane) ; marge parfois striée", d: "Lames ocre puis brun rouille",
    p: "Brunâtre, plus sombre vers la base ; petit anneau membraneux fragile, souvent sali de brun par les spores ; fibrilles argentées sous l'anneau",
    ch: "Mince, brunâtre ; odeur de farine",
    h: "Bois mort, souches, branches enterrées, surtout de conifères, aussi de feuillus ; isolée ou en petites touffes", s: "Toute l'année, surtout automne", a: "Plaine à montagne",
    cf: "Pholiote changeante (même milieu, souvent côte à côte) ; collybie à pied velouté (pied velours noir, pas d'anneau) ; hypholomes", x: PH,
    r: "Les petits champignons bruns en touffes sur bois sont à laisser aux confirmés" } },
  { id: "lepiote-brun-incarnat", fr: "Lépiote brun-incarnat", la: "Lepiota brunneoincarnata", cat: T, mortel: true, syndrome: "Phalloïdien", mois: [8, 11], commons: "Lepiota brunneoincarnata", f: {
    c: "2–5 cm, centre brun-vineux, surface découpée en petites écailles brun-rosé disposées en cercles sur fond blanc rosé", d: "Lames blanches à crème, libres, serrées",
    p: "Court, blanc rosé ; zone d'anneau floconneuse, pas de vrai anneau mobile ; mèches brun-rosé sous cette zone",
    ch: "Blanche, légèrement rosée dans le pied ; odeur fruitée",
    h: "Parcs, jardins, bords de chemins, lisières ; sols riches, plutôt calcaires", s: "Août – novembre", a: "Surtout plaine",
    cf: "Jeunes coulemelles (bien plus grandes : chapeau de plus de 10 cm adulte, anneau double qui coulisse, pied chiné de brun)", x: PH,
    r: "Aucune lépiote de moins de 10 cm de chapeau ne se consomme" } },
  { id: "conocybe-ride", fr: "Conocybe ridé", la: "Conocybe rugosa", cat: T, mortel: true, syndrome: "Phalloïdien", mois: [5, 10], commons: "Conocybe rugosa", f: {
    c: "1–3 cm, conique puis en cloche, brun-ocre, pâlit en séchant ; marge striée", d: "Lames ocre puis brun rouille",
    p: "Grêle, crème à brunâtre ; petit anneau membraneux, souvent mobile", ch: "Très mince ; odeur faible",
    h: "Copeaux de bois, paillage, pelouses, jardins, bords de chemins", s: "Mai – octobre", a: "Surtout plaine",
    cf: "Petits champignons bruns de pelouse et de jardin, peu cherchés mais parfois cueillis par des enfants ou des débutants", x: PH,
    r: "Ne jamais consommer de petits champignons bruns de jardin ou de paillage" } },
  { id: "cortinaire-rocou", fr: "Cortinaire couleur de rocou", la: "Cortinarius orellanus", cat: T, mortel: true, syndrome: "Orellanien", mois: [8, 10], commons: "Cortinarius orellanus", f: {
    c: "3–8 cm, orange-fauve à brun-roux, mat et finement fibrilleux, avec un mamelon arrondi", d: "Lames espacées, épaisses, orange-fauve puis rouille",
    p: "Jaune-fauve, fibrilleux, sans bulbe marqué ; voile en toile d'araignée (cortine) fugace chez le jeune", ch: "Jaunâtre ; odeur faible de radis",
    h: "Feuillus (chênes, châtaigniers) sur sols acides, stations plutôt chaudes", s: "Août – octobre", a: "Plaine et collines",
    cf: "Girolle (plis épais et non vraies lames, pas de teinte rouille) ; chanterelle en tube",
    x: "Latence très longue, de 2 jours à 3 semaines : soif intense, douleurs lombaires, puis insuffisance rénale, souvent définitive. Le lien avec le repas est alors difficile à faire",
    r: "Tout champignon à lames rouille est à écarter pour un cueilleur non confirmé" } },
  { id: "cortinaire-tres-joli", fr: "Cortinaire très joli", la: "Cortinarius rubellus", cat: T, mortel: true, syndrome: "Orellanien", mois: [8, 10], commons: "Cortinarius rubellus", f: {
    c: "3–8 cm, conique avec un mamelon pointu, fauve-roux à brun orangé, finement fibrilleux", d: "Lames espacées, fauves puis rouille",
    p: "Orangé-roux, orné de bracelets jaunâtres (restes de voile)", ch: "Jaunâtre à orangée ; odeur faible de radis",
    h: "Conifères humides (épicéas, pins), mousses et sphaignes", s: "Août – octobre", a: "Surtout montagne",
    cf: "Chanterelle en tube (plis et non lames, pied creux jaune, pas de teinte rouille) ; girolle",
    x: "Identiques au cortinaire couleur de rocou : 2 jours à 3 semaines de latence, puis insuffisance rénale",
    r: "En forêt de conifères, ne cueillir les chanterelles en tube qu'après avoir vérifié les plis sous le chapeau" } },
  { id: "gyromitre", fr: "Gyromitre (fausse morille)", la: "Gyromitra esculenta", cat: T, mortel: true, syndrome: "Gyromitrien", mois: [3, 5], commons: "Gyromitra esculenta", f: {
    c: "3–10 cm, brun-roux à brun foncé, plissé en circonvolutions qui évoquent un cerveau ; pas d'alvéoles régulières", d: "Pas de lames ni de tubes",
    p: "Court, blanchâtre, irrégulier", ch: "Mince ; en coupe, l'intérieur est divisé en plusieurs cavités irrégulières (une morille est creuse d'un seul tenant, du chapeau au pied)",
    h: "Conifères (pins), sols sableux, coupes forestières", s: "Mars – mai", a: "Plaine à montagne",
    cf: "Morilles (alvéoles régulières, chapeau soudé au pied, une seule cavité intérieure)",
    x: "6 à 12 h après le repas : troubles digestifs, puis atteinte nerveuse, du foie et du sang. Reste toxique après cuisson ou séchage ; les vapeurs de cuisson sont elles-mêmes dangereuses",
    l: "Vente interdite en France (décret n° 91-1039 du 7 octobre 1991)",
    r: "Couper chaque morille en deux dans le sens de la longueur : une seule cavité = morille" } },
  { id: "paxille-enroule", fr: "Paxille enroulé", la: "Paxillus involutus", cat: T, mortel: true, syndrome: "Paxillien", mois: [7, 11], commons: "Paxillus involutus", f: {
    c: "5–15 cm, brun olivâtre à brun roux, creusé au centre ; marge longtemps enroulée et cotonneuse",
    d: "Lames serrées, descendant sur le pied, jaunâtres puis brunes ; elles se tachent de brun quand on les touche",
    p: "Court, brunâtre, sans anneau", ch: "Jaunâtre, brunit à la coupe ; pas de lait",
    h: "Très commun sous bouleaux, aussi feuillus et conifères, parcs", s: "Juillet – novembre", a: "Plaine à montagne",
    cf: "Lactaires (ils laissent couler un lait à la cassure) ; bolets vus de dessus",
    x: "Cru ou peu cuit : troubles digestifs en quelques heures. Après des repas répétés, l'organisme peut se sensibiliser : destruction brutale des globules rouges et insuffisance rénale, parfois mortelle",
    r: "« Déjà mangé sans problème » ne prouve rien pour cette espèce" } },
  { id: "tricholome-equestre", fr: "Tricholome équestre", la: "Tricholoma equestre", cat: T, mortel: true, syndrome: "Rhabdomyolyse", mois: [9, 11], commons: "Tricholoma equestre", f: {
    c: "5–12 cm, jaune verdâtre, centre plus brun et finement écailleux, un peu visqueux", d: "Lames jaune soufre vif, serrées, échancrées près du pied",
    p: "Jaune, plein, sans anneau", ch: "Blanche à jaunâtre ; odeur de farine",
    h: "Pins sur sols sableux ; aussi sous feuillus", s: "Septembre – novembre", a: "Surtout plaine",
    cf: "Autres tricholomes jaunes, dont le tricholome soufré (odeur de gaz d'éclairage, chair jaune)",
    x: "Après plusieurs repas sur quelques jours : fatigue, douleurs et faiblesse musculaires, urines foncées, puis destruction des muscles (y compris le cœur)",
    l: "Vente et importation interdites en France depuis 2005",
    r: "Longtemps réputé bon comestible : les anciens guides le classent encore ainsi" } },
  { id: "inocybe-patouillard", fr: "Inocybe de Patouillard", la: "Inocybe erubescens", cat: T, mortel: true, syndrome: "Muscarinien", mois: [5, 7], commons: "Inocybe erubescens", f: {
    c: "3–8 cm, conique puis en cloche avec un mamelon, blanc crème ; fibrilles rayonnantes, marge souvent fendue ; rougit en vieillissant ou au froissement",
    d: "Lames crème puis brun olivâtre, tachées de rouge", p: "Blanc, plein, rougissant ; sans anneau", ch: "Blanche, rougit lentement ; odeur faible, un peu fruitée",
    h: "Feuillus (hêtres, tilleuls) sur sols calcaires, parcs, bords de chemins", s: "Mai – juillet", a: "Plaine et collines",
    cf: "Mousseron de la Saint-Georges (chapeau charnu et lisse, lames blanches très serrées, forte odeur de farine, ne rougit jamais)",
    x: "15 min à 2 h après le repas : sueurs abondantes, salivation, larmes, troubles de la vue, ralentissement du cœur. Il existe un antidote en milieu hospitalier",
    r: "Au printemps, écarter tout champignon blanc dont la chair ou les lames rougissent" } },
];
