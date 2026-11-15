import type { MetadataRoute } from "next";
import { especes } from "@/data";
import { PAGES_CAT, SITE, urlFiche } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", ...Object.values(PAGES_CAT).map((p) => p.slug), "/carte", "/quiz", "/lexique", ...especes.map((e) => urlFiche(e.id))];
  return pages.map((p) => ({ url: SITE + (p === "/" ? "" : p) }));
}
