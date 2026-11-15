import { notFound } from "next/navigation";
import FicheContenu from "@/components/FicheContenu";
import { especes, parId } from "@/data";
import { descriptionFiche, titreFiche, urlFiche } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => especes.map((e) => ({ slug: e.id }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const e = parId((await params).slug);
  if (!e) return {};
  const url = urlFiche(e.id);
  const description = descriptionFiche(e);
  return {
    title: { absolute: titreFiche(e) },
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title: titreFiche(e), description, images: [{ url: `/ph/${e.id}/og.jpg`, width: 800, height: 420, alt: e.fr }] },
  };
}

export default async function Page({ params }: Props) {
  const e = parId((await params).slug);
  if (!e) notFound();
  return <FicheContenu e={e} />;
}
