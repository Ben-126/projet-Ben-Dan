import { notFound } from "next/navigation";
import Header from "@/components/navigation/Header";
import ChapitresAvecProgression from "@/components/navigation/ChapitresAvecProgression";
import StatsMatiere from "@/components/progression/StatsMatiere";
import { NIVEAUX, getMatiereBySlugAndNiveau, type Niveau } from "@/data/programmes";

interface Props {
  params: Promise<{ niveau: string; matiere: string }>;
}

export async function generateStaticParams() {
  return NIVEAUX.flatMap((n) =>
    n.matieres.map((m) => ({ niveau: n.slug, matiere: m.slug }))
  );
}

export default async function MatierePage({ params }: Props) {
  const { niveau: niveauSlug, matiere: matiereSlug } = await params;

  const niveauInfo = NIVEAUX.find((n) => n.slug === niveauSlug);
  if (!niveauInfo) notFound();

  const matiere = getMatiereBySlugAndNiveau(niveauSlug as Niveau, matiereSlug);
  if (!matiere) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <div className="flex items-center gap-3 mb-2">
          <div className={`${matiere.couleur} rounded-xl p-3`}>
            <span className="text-3xl">{matiere.emoji}</span>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
              {niveauInfo.emoji} {niveauInfo.label}
            </p>
            <h1 className="text-xl font-bold text-gray-800">{matiere.nom}</h1>
            <p className="text-sm text-gray-500">{matiere.chapitres.length} chapitres disponibles</p>
          </div>
        </div>

        <div className="mt-6">
          <StatsMatiere matiereSlug={matiereSlug} chapitres={matiere.chapitres} />
        </div>

        <p className="text-sm text-gray-600 font-medium mb-3 mt-2">Choisir un chapitre :</p>

        <ChapitresAvecProgression matiere={matiere} niveau={niveauSlug} />
      </main>
    </div>
  );
}
