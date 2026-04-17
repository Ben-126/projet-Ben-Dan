import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/navigation/Header";
import ChapitreProgressionResume from "@/components/progression/ChapitreProgressionResume";
import { NIVEAUX, getMatiereBySlugAndNiveau, type Niveau } from "@/data/programmes";

interface Props {
  params: Promise<{ niveau: string; matiere: string; chapitre: string }>;
}

export async function generateStaticParams() {
  return NIVEAUX.flatMap((n) =>
    n.matieres.flatMap((m) =>
      m.chapitres.map((c) => ({
        niveau: n.slug,
        matiere: m.slug,
        chapitre: c.slug,
      }))
    )
  );
}

export default async function ChapitreDetailPage({ params }: Props) {
  const { niveau: niveauSlug, matiere: matiereSlug, chapitre: chapitreSlug } = await params;

  const niveauInfo = NIVEAUX.find((n) => n.slug === niveauSlug);
  if (!niveauInfo) notFound();

  const matiere = getMatiereBySlugAndNiveau(niveauSlug as Niveau, matiereSlug);
  if (!matiere) notFound();

  const chapitre = matiere.chapitres.find((c) => c.slug === chapitreSlug);
  if (!chapitre) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">

        {/* Fil d'ariane */}
        <nav aria-label="Fil d'ariane" className="mb-5">
          <ol className="flex flex-wrap items-center gap-x-1 gap-y-1 text-xs text-gray-400">
            <li>
              <Link href="/" className="hover:text-indigo-600 transition-colors font-medium">
                {niveauInfo.emoji} {niveauInfo.label}
              </Link>
            </li>
            <li aria-hidden="true" className="text-gray-300 select-none">›</li>
            <li>
              <Link
                href={`/${niveauSlug}/${matiereSlug}`}
                className="hover:text-indigo-600 transition-colors font-medium flex items-center gap-1"
              >
                <span>{matiere.emoji}</span>
                <span>{matiere.nom}</span>
              </Link>
            </li>
            <li aria-hidden="true" className="text-gray-300 select-none">›</li>
            <li className="text-gray-700 font-semibold truncate max-w-[200px]" title={chapitre.titre}>
              {chapitre.titre}
            </li>
          </ol>
        </nav>

        {/* En-tête du chapitre */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`${matiere.couleur} rounded-xl p-3 shrink-0`}>
            <span className="text-3xl" role="img" aria-label={matiere.nom}>{matiere.emoji}</span>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{matiere.nom}</p>
            <h1 className="text-xl font-bold text-gray-800 leading-tight">{chapitre.titre}</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {chapitre.competences.length} compétence{chapitre.competences.length > 1 ? "s" : ""} au programme
            </p>
          </div>
        </div>

        {/* Progression (client) */}
        <ChapitreProgressionResume matiereSlug={matiereSlug} chapitreSlug={chapitreSlug} />

        {/* Compétences au programme */}
        <section className="mb-6" aria-labelledby="titre-competences">
          <h2
            id="titre-competences"
            className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"
          >
            <span className="text-indigo-500" aria-hidden="true">📋</span>
            Compétences au programme
          </h2>
          <ul className="space-y-2">
            {chapitre.competences.map((comp, i) => (
              <li
                key={comp.id}
                className="flex items-start gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100"
              >
                <span
                  aria-hidden="true"
                  className="flex-shrink-0 w-6 h-6 bg-indigo-200 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold"
                >
                  {i + 1}
                </span>
                <span className="text-sm text-indigo-800 font-medium leading-snug">{comp.titre}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Bouton démarrer */}
        <Link
          href={`/${niveauSlug}/${matiereSlug}/${chapitreSlug}/quiz`}
          data-testid="btn-demarrer-quiz"
          className="block w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-2xl font-bold text-center text-base transition-colors shadow-sm hover:shadow-md"
        >
          🚀 Démarrer le quiz
        </Link>

        <p className="text-center text-xs text-gray-400 mt-3">
          Questions générées par IA · classe de {niveauInfo.label}
        </p>
      </main>
    </div>
  );
}
