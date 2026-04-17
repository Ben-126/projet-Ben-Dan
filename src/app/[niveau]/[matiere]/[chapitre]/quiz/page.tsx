import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/navigation/Header";
import QuizRunner from "@/components/quiz/QuizRunner";
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

export default async function QuizPage({ params }: Props) {
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
        {/* Fil d'ariane : Niveau → Matière → Chapitre → Quiz */}
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
            <li className="text-gray-600 font-medium truncate max-w-[180px]" title={chapitre.titre}>
              {chapitre.titre}
            </li>
            <li aria-hidden="true" className="text-gray-300 select-none">›</li>
            <li>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-[10px] uppercase tracking-wide">
                Quiz
              </span>
            </li>
          </ol>
          {/* Compétences du chapitre */}
          {chapitre.competences.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2" aria-label="Compétences évaluées">
              {chapitre.competences.map((comp) => (
                <span
                  key={comp.id}
                  className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100"
                >
                  {comp.titre}
                </span>
              ))}
            </div>
          )}
        </nav>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6" data-testid="quiz-container">
          <QuizRunner
            matiereSlug={matiereSlug}
            chapitreSlug={chapitreSlug}
            titreChapitre={chapitre.titre}
            niveauLycee={niveauSlug}
            matiereName={matiere.nom}
            competences={chapitre.competences}
          />
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Questions générées pour la classe de {niveauInfo.label}
        </p>
      </main>
    </div>
  );
}
