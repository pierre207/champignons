import Shell from "@/components/Shell";

export const metadata = {
  title: "Mentions légales",
  alternates: { canonical: "/mentions-legales" },
  robots: { index: false },
};

export default function MentionsLegales() {
  return (
    <Shell>
      <header className="head">
        <h1>Mentions légales</h1>
      </header>
      <article className="legal">
        <h2>Éditeur</h2>
        <p>Le site lamelle.fr est édité par Pierre-Alexandre Prioux, à titre personnel. Directeur de la publication : Pierre-Alexandre Prioux.</p>

        <h2>Hébergeur</h2>
        <p>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — vercel.com</p>

        <h2>Avertissement</h2>
        <p>
          Les informations de ce site sont données à titre indicatif. Elles ne remplacent pas l&apos;avis d&apos;un pharmacien ou d&apos;un
          mycologue. Ne consommez jamais un champignon sur la seule foi de ce site. En cas de doute après un repas, appelez le 15 ou un
          centre antipoison.
        </p>

        <h2>Sources et crédits</h2>
        <p>Photos : Wikimedia Commons ; chaque fiche renvoie vers la page d&apos;origine de ses photos (auteur et licence).</p>
        <p>Carte : fond OpenFreeMap, données © contributeurs OpenStreetMap ; forêts : BD Forêt V2 © IGN ; météo : Open-Meteo.</p>

        <h2>Données personnelles</h2>
        <p>
          Le site ne demande ni compte ni formulaire et ne dépose pas de cookie de suivi. Si vous l&apos;autorisez, votre position sert
          uniquement à centrer la carte dans votre navigateur ; elle n&apos;est pas enregistrée. Les fonds de carte sont chargés depuis
          OpenFreeMap et la recherche de lieu interroge le service de géocodage de l&apos;IGN (Géoplateforme).
        </p>
      </article>
    </Shell>
  );
}
