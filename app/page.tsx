import Liste from "@/components/Liste";
import { SIGNATURE, TOTAL } from "@/lib/seo";

export const metadata = {
  title: { absolute: SIGNATURE },
  description: `Fiches de ${TOTAL} champignons de France, comestibles, à éviter ou toxiques : photos, saison, confusions. Carte des zones de pousse et quiz.`,
  alternates: { canonical: "/" },
};

export default function Accueil() {
  return <Liste cat="comestible" titre="Espèces" />;
}
