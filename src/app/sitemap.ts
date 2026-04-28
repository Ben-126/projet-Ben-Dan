import type { MetadataRoute } from "next";
import { NIVEAUX } from "@/data/programmes";

const BASE_URL = "https://quiz-2nd-q5pu.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/app`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/revision`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/progression`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/mentions-legales`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/confidentialite`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  const enc = (s: string) => s.split("/").map(encodeURIComponent).join("/");

  const matierePages: MetadataRoute.Sitemap = NIVEAUX.flatMap((niveau) =>
    niveau.matieres.map((matiere) => ({
      url: `${BASE_URL}/${enc(niveau.slug)}/${enc(matiere.slug)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }))
  );

  const chapitrePages: MetadataRoute.Sitemap = NIVEAUX.flatMap((niveau) =>
    niveau.matieres.flatMap((matiere) =>
      matiere.chapitres.map((chapitre) => ({
        url: `${BASE_URL}/${enc(niveau.slug)}/${enc(matiere.slug)}/${enc(chapitre.slug)}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }))
    )
  );

  return [...staticPages, ...matierePages, ...chapitrePages];
}
