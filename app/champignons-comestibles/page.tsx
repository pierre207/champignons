import Liste from "@/components/Liste";
import { PAGES_CAT } from "@/lib/seo";

const p = PAGES_CAT.comestible;
export const metadata = { title: p.title, description: p.description, alternates: { canonical: p.slug } };

export default function Page() {
  return <Liste cat="comestible" titre={p.h1} />;
}
