import type { Metadata } from "next";
import Header from "@/components/navigation/Header";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation",
  description: "Conditions générales d'utilisation du service Révioria.",
  robots: { index: false, follow: false },
};

export default function PageCGU() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-8 text-sm text-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Conditions Générales d&apos;Utilisation</h1>
          <p className="text-gray-500 mt-1">Dernière mise à jour : 28 avril 2026</p>
        </div>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800 text-base">1. Présentation du service</h2>
          <p>
            Révioria est une plateforme de révision en ligne destinée aux lycéens (Seconde, Première, Terminale).
            Elle propose des quiz générés par intelligence artificielle, un suivi de progression, et des fonctionnalités
            de gamification. Le service est actuellement accessible gratuitement. Des fonctionnalités payantes
            (abonnement Premium) et des publicités pourront être introduites à l&apos;avenir.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800 text-base">2. Accès au service</h2>
          <p>
            Le service est accessible sans inscription pour les fonctionnalités de base (quiz). La création d&apos;un
            compte permet d&apos;accéder aux fonctionnalités avancées : sauvegarde de progression, classement, streaks,
            badges.
          </p>
          <p>
            L&apos;accès au service est réservé aux personnes physiques. Les mineurs de moins de 15 ans doivent
            obtenir l&apos;accord d&apos;un parent ou tuteur légal avant de créer un compte.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800 text-base">3. Création de compte</h2>
          <p>
            Lors de la création d&apos;un compte, l&apos;utilisateur s&apos;engage à :
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>Fournir des informations exactes et à les maintenir à jour</li>
            <li>Choisir un pseudo ne portant pas atteinte à des droits tiers</li>
            <li>Ne pas usurper l&apos;identité d&apos;une autre personne</li>
            <li>Garder ses identifiants de connexion confidentiels</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800 text-base">4. Utilisation du service</h2>
          <p>L&apos;utilisateur s&apos;engage à ne pas :</p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>Utiliser le service à des fins commerciales ou publicitaires sans autorisation</li>
            <li>Tenter de contourner les systèmes de sécurité ou de limitation</li>
            <li>Reproduire, distribuer ou revendre les contenus générés par le service</li>
            <li>Utiliser des outils automatisés (bots, scrapers) pour accéder au service</li>
            <li>Publier un pseudo ou contenu offensant, discriminatoire ou illégal</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800 text-base">5. Contenu généré par IA</h2>
          <p>
            Les questions de quiz et explications sont générées automatiquement par intelligence artificielle
            à partir des programmes officiels de l&apos;Éducation nationale. Ces contenus sont fournis
            <strong> à titre éducatif uniquement</strong>. L&apos;éditeur ne garantit pas l&apos;exactitude
            absolue des contenus générés et ne saurait être tenu responsable d&apos;erreurs éventuelles.
          </p>
          <p>
            Révioria ne se substitue pas à un enseignant ni à un manuel scolaire officiel.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800 text-base">6. Disponibilité du service</h2>
          <p>
            L&apos;éditeur s&apos;efforce de maintenir le service accessible en permanence. Cependant, des
            interruptions peuvent survenir pour maintenance, mise à jour ou incidents techniques. L&apos;éditeur
            ne peut être tenu responsable des interruptions de service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800 text-base">7. Propriété intellectuelle</h2>
          <p>
            Le code source, le design, la marque Révioria et les contenus non générés par IA sont la
            propriété exclusive de l&apos;éditeur. Toute reproduction sans autorisation est interdite.
          </p>
          <p>
            Les contenus pédagogiques s&apos;inspirent des programmes publiés par le Ministère de
            l&apos;Éducation nationale, lesquels sont soumis à leurs propres droits.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800 text-base">8. Publicités et offres payantes</h2>
          <p>
            Le service est actuellement gratuit et sans publicité. L&apos;éditeur se réserve le droit
            d&apos;introduire :
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>Un abonnement Premium avec fonctionnalités avancées</li>
            <li>Des publicités non-intrusives sur les pages du service</li>
          </ul>
          <p>
            En cas d&apos;introduction de publicités ou de tout traitement de données à des fins publicitaires,
            un nouveau <strong>consentement explicite et granulaire</strong> sera demandé à l&apos;utilisateur,
            conformément aux articles 6 et 7 du RGPD et à la recommandation CNIL du 17 septembre 2020.
            Aucune donnée à des fins publicitaires ne sera collectée sans ce consentement préalable.
          </p>
          <p className="text-gray-500 text-xs">
            Dernière mise à jour : 29 avril 2026
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800 text-base">9. Données personnelles</h2>
          <p>
            Le traitement des données personnelles est décrit dans notre{" "}
            <Link href="/confidentialite" className="text-indigo-600 hover:underline">
              politique de confidentialité
            </Link>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800 text-base">10. Suspension et résiliation</h2>
          <p>
            L&apos;éditeur se réserve le droit de suspendre ou supprimer un compte en cas de violation des
            présentes CGU, sans préavis ni indemnité. L&apos;utilisateur peut supprimer son compte à tout
            moment depuis les paramètres de l&apos;application.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800 text-base">11. Modifications des CGU</h2>
          <p>
            L&apos;éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs
            seront informés des modifications importantes. La poursuite de l&apos;utilisation du service
            vaut acceptation des nouvelles conditions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800 text-base">12. Droit applicable</h2>
          <p>
            Les présentes CGU sont soumises au droit français. En cas de litige, et à défaut de résolution
            amiable, les tribunaux français seront compétents.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800 text-base">13. Contact</h2>
          <p>
            Pour toute question relative aux présentes CGU :{" "}
            <a href="mailto:benpodrojsky@gmail.com" className="text-indigo-600 hover:underline">
              benpodrojsky@gmail.com
            </a>
          </p>
        </section>

        <Link href="/" className="inline-block text-indigo-600 hover:underline">
          ← Retour à l&apos;accueil
        </Link>
      </main>
    </div>
  );
}
