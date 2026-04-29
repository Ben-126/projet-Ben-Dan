import type { Metadata } from "next";
import Header from "@/components/navigation/Header";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité et traitement des données personnelles de Révioria.",
  robots: { index: false, follow: false },
};

export default function PageConfidentialite() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-8 text-sm text-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Politique de confidentialité</h1>
          <p className="text-gray-500 mt-1">Dernière mise à jour : 29 avril 2026</p>
        </div>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800 text-base">1. Responsable du traitement</h2>
          <p>
            Le responsable du traitement des données personnelles collectées sur Révioria est l&apos;éditeur du site,
            Ben Podrojsky, joignable à l&apos;adresse :{" "}
            <a href="mailto:benpodrojsky@gmail.com" className="text-indigo-600 hover:underline">
              benpodrojsky@gmail.com
            </a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-gray-800 text-base">2. Données collectées et finalités</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 px-3 py-2 text-left">Donnée</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">Finalité</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">Base légale</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">Durée de conservation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-3 py-2">Adresse email</td>
                  <td className="border border-gray-200 px-3 py-2">Authentification et identification du compte</td>
                  <td className="border border-gray-200 px-3 py-2">Consentement (création de compte)</td>
                  <td className="border border-gray-200 px-3 py-2">Jusqu&apos;à suppression du compte</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-3 py-2">Pseudo</td>
                  <td className="border border-gray-200 px-3 py-2">Affichage dans le classement</td>
                  <td className="border border-gray-200 px-3 py-2">Consentement (création de compte)</td>
                  <td className="border border-gray-200 px-3 py-2">Jusqu&apos;à suppression du compte</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-2">XP, niveau, badges</td>
                  <td className="border border-gray-200 px-3 py-2">Suivi de la progression et gamification</td>
                  <td className="border border-gray-200 px-3 py-2">Intérêt légitime (service demandé)</td>
                  <td className="border border-gray-200 px-3 py-2">Jusqu&apos;à suppression du compte</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-3 py-2">Résultats de quiz</td>
                  <td className="border border-gray-200 px-3 py-2">Affichage local de tes résultats</td>
                  <td className="border border-gray-200 px-3 py-2">Consentement (stockage local)</td>
                  <td className="border border-gray-200 px-3 py-2">Stocké localement — supprimé au refus ou à la réinitialisation</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-2">Adresse IP (rate limiting)</td>
                  <td className="border border-gray-200 px-3 py-2">Limitation des requêtes (anti-abus)</td>
                  <td className="border border-gray-200 px-3 py-2">Intérêt légitime (sécurité du service)</td>
                  <td className="border border-gray-200 px-3 py-2">60 secondes (Upstash Redis — expiration automatique)</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-3 py-2">Adresse IP (logs serveur)</td>
                  <td className="border border-gray-200 px-3 py-2">Journaux d&apos;accès serveur</td>
                  <td className="border border-gray-200 px-3 py-2">Intérêt légitime (sécurité)</td>
                  <td className="border border-gray-200 px-3 py-2">7 jours max (Vercel — rétention standard)</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-2">Images de devoir (scan IA)</td>
                  <td className="border border-gray-200 px-3 py-2">Analyse par IA pour aide aux exercices</td>
                  <td className="border border-gray-200 px-3 py-2">Consentement (utilisation explicite de la fonctionnalité)</td>
                  <td className="border border-gray-200 px-3 py-2">Traitement immédiat par Groq — non stockée chez Révioria ni chez Groq après traitement</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-3 py-2">Audio (prononciation langues)</td>
                  <td className="border border-gray-200 px-3 py-2">Analyse de prononciation par IA (Whisper)</td>
                  <td className="border border-gray-200 px-3 py-2">Consentement (utilisation explicite de la fonctionnalité)</td>
                  <td className="border border-gray-200 px-3 py-2">Traitement immédiat par Groq/Whisper — non stockée après transcription</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-2">Email parental (mineurs &lt; 15 ans)</td>
                  <td className="border border-gray-200 px-3 py-2">Preuve du consentement parental requis par la loi</td>
                  <td className="border border-gray-200 px-3 py-2">Obligation légale (art. 8 RGPD + art. 45 LIL)</td>
                  <td className="border border-gray-200 px-3 py-2">Pendant toute la durée de vie du compte mineur</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-500">
            Actuellement, aucune donnée publicitaire ni de suivi comportemental n&apos;est collectée.
            Si des publicités sont introduites à l&apos;avenir, cette politique sera mise à jour et un nouveau
            consentement explicite et granulaire te sera demandé avant tout traitement à des fins publicitaires.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-gray-800 text-base">3. Utilisation de l&apos;intelligence artificielle (Groq)</h2>
          <p>
            Révioria utilise l&apos;API <strong>Groq</strong> (Groq Inc., États-Unis) pour trois fonctionnalités :
            la génération de questions de quiz, la correction de copies scannées, et l&apos;analyse de prononciation.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-2">
            <p className="font-medium text-amber-800 text-xs">Transfert de données vers les États-Unis</p>
            <p className="text-xs text-amber-700">
              Lors de l&apos;utilisation des fonctionnalités IA, les données suivantes sont transmises à Groq (USA) :
            </p>
            <ul className="text-xs text-amber-700 list-disc list-inside space-y-1">
              <li><strong>Quiz :</strong> contexte pédagogique (matière, chapitre, niveau scolaire) + adresse IP incluse dans les métadonnées de connexion HTTP</li>
              <li><strong>Scan de devoir :</strong> image photographiée + adresse IP</li>
              <li><strong>Prononciation :</strong> enregistrement audio + adresse IP</li>
            </ul>
            <p className="text-xs text-amber-700">
              L&apos;adresse IP est transmise à Groq via les métadonnées HTTP de chaque requête. Elle n&apos;est pas
              stockée par Groq à des fins d&apos;identification au-delà du traitement de la requête, conformément
              à leur{" "}
              <a
                href="https://groq.com/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                politique de confidentialité
              </a>.
            </p>
          </div>

          <p>
            Ces transferts vers les États-Unis sont encadrés par les{" "}
            <strong>Clauses Contractuelles Types (CCT) de la Commission européenne</strong> adoptées par Groq,
            conformément à l&apos;article 46 du RGPD.
          </p>
          <p>
            Les images et enregistrements audio ne sont <strong>pas conservés</strong> par Révioria ni par Groq
            au-delà du traitement immédiat. Groq déclare ne pas utiliser les données des API pour l&apos;entraînement
            de ses modèles.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800 text-base">4. Sous-traitants et hébergeurs</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 px-3 py-2 text-left">Prestataire</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">Rôle</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">Localisation</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">Garanties RGPD</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-3 py-2">Vercel Inc.</td>
                  <td className="border border-gray-200 px-3 py-2">Hébergement de l&apos;application — logs serveur 7 jours max</td>
                  <td className="border border-gray-200 px-3 py-2">USA / CDN mondial</td>
                  <td className="border border-gray-200 px-3 py-2">Clauses Contractuelles Types UE</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-3 py-2">Supabase</td>
                  <td className="border border-gray-200 px-3 py-2">Base de données (comptes, profils, badges)</td>
                  <td className="border border-gray-200 px-3 py-2">UE — Stockholm, Suède (aws-eu-north-1)</td>
                  <td className="border border-gray-200 px-3 py-2">Serveur UE — pas de transfert hors UE</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-2">Groq Inc.</td>
                  <td className="border border-gray-200 px-3 py-2">Génération IA (quiz, scan, prononciation) — IP transmise, non stockée</td>
                  <td className="border border-gray-200 px-3 py-2">USA</td>
                  <td className="border border-gray-200 px-3 py-2">Clauses Contractuelles Types UE — pas d&apos;entraînement sur données API</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-3 py-2">Upstash Inc.</td>
                  <td className="border border-gray-200 px-3 py-2">Limitation des requêtes (rate limiting) — IP expirée en 60 secondes</td>
                  <td className="border border-gray-200 px-3 py-2">USA / EU</td>
                  <td className="border border-gray-200 px-3 py-2">Clauses Contractuelles Types UE — expiration automatique des données</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-gray-800 text-base">5. Tes droits (RGPD)</h2>
          <p>Conformément au RGPD, tu disposes des droits suivants :</p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li><strong>Droit d&apos;accès</strong> — consulter toutes tes données depuis ton profil</li>
            <li><strong>Droit de rectification</strong> — modifier ton pseudo depuis les paramètres</li>
            <li><strong>Droit à l&apos;effacement</strong> — supprimer ton compte depuis les paramètres (suppression intégrale Supabase + stockage local)</li>
            <li><strong>Droit d&apos;opposition</strong> — t&apos;opposer à un traitement basé sur l&apos;intérêt légitime</li>
            <li>
              <strong>Droit à la portabilité</strong> — exporter une copie de tes données via l&apos;API{" "}
              <code className="text-xs bg-gray-100 px-1 rounded">/api/user/export-data</code>{" "}
              (format JSON) ou en contactant{" "}
              <a href="mailto:benpodrojsky@gmail.com" className="text-indigo-600 hover:underline">benpodrojsky@gmail.com</a>
            </li>
            <li><strong>Droit à la limitation</strong> — demander la suspension d&apos;un traitement</li>
          </ul>
          <p>
            Pour exercer tes droits, contacte-nous à :{" "}
            <a href="mailto:benpodrojsky@gmail.com" className="text-indigo-600 hover:underline">
              benpodrojsky@gmail.com
            </a>.
            Nous répondons sous <strong>30 jours</strong>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-gray-800 text-base">6. Mineurs (moins de 15 ans)</h2>
          <p>
            Révioria est un service destiné aux lycéens, susceptible d&apos;être utilisé par des personnes de moins de 15 ans.
            Conformément à l&apos;article 8 du RGPD et à l&apos;article 45 de la Loi Informatique et Libertés,
            l&apos;utilisation du service par un mineur de moins de 15 ans nécessite le consentement d&apos;un
            parent ou tuteur légal.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
            <p className="font-medium text-blue-800 text-xs">Mécanisme de vérification de l&apos;âge</p>
            <p className="text-xs text-blue-700">
              Lors de la création d&apos;un compte, l&apos;utilisateur déclare son groupe d&apos;âge :
            </p>
            <ul className="text-xs text-blue-700 list-disc list-inside space-y-1">
              <li><strong>15 ans ou plus :</strong> déclaration sur l&apos;honneur — accès direct</li>
              <li>
                <strong>Moins de 15 ans :</strong> saisie obligatoire de l&apos;adresse email du parent ou tuteur
                légal. Cet email est conservé comme preuve du consentement parental pendant toute la durée de vie du compte.
              </li>
            </ul>
            <p className="text-xs text-blue-700">
              La preuve de consentement parental (email) est stockée dans les métadonnées du compte Supabase
              et peut être produite en cas de contrôle. Elle est supprimée avec le compte.
            </p>
          </div>

          <p>
            Nous ne collectons pas sciemment de données sur des enfants de moins de 13 ans.
            Si tu es parent et penses que ton enfant a créé un compte sans autorisation, contacte-nous pour
            suppression immédiate à{" "}
            <a href="mailto:benpodrojsky@gmail.com" className="text-indigo-600 hover:underline">
              benpodrojsky@gmail.com
            </a>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800 text-base">7. Sécurité</h2>
          <p>Tes données sont protégées par :</p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>Chiffrement HTTPS (TLS) sur toutes les communications</li>
            <li>Accès à la base de données limité via Row Level Security (Supabase RLS)</li>
            <li>Aucune donnée sensible stockée en clair</li>
            <li>En-têtes de sécurité HTTP (HSTS, X-Frame-Options, CSP, Permissions-Policy)</li>
            <li>Limitation des requêtes par IP (rate limiting) pour prévenir les abus</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-gray-800 text-base">8. Stockage local (localStorage)</h2>
          <p>
            Révioria n&apos;utilise <strong>pas de cookies publicitaires ou de tracking</strong>.
            Le stockage local de ton navigateur (<code className="text-xs bg-gray-100 px-1 rounded">localStorage</code>)
            est utilisé — avec ton consentement — pour :
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>Stocker ton historique de quiz et tes performances</li>
            <li>Conserver ton profil de gamification (XP, streak, badges)</li>
            <li>Mémoriser tes objectifs personnalisés et tes cartes de révision espacée</li>
            <li>Enregistrer ton consentement à cette politique</li>
          </ul>
          <p>
            Ces données restent sur ton appareil et ne sont <strong>jamais transmises à des tiers</strong> à des fins publicitaires.
            En cas de refus ou de retrait du consentement, toutes ces données sont supprimées immédiatement.
          </p>
          <p>
            Le localStorage n&apos;est pas un cookie au sens technique, mais il est soumis aux mêmes règles
            de consentement selon l&apos;article 82 de la Loi Informatique et Libertés.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800 text-base">9. Droit de réclamation</h2>
          <p>
            Si tu estimes que le traitement de tes données ne respecte pas le RGPD, tu as le droit de déposer
            une plainte auprès de la{" "}
            <a
              href="https://www.cnil.fr/fr/plaintes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              CNIL (Commission Nationale de l&apos;Informatique et des Libertés)
            </a>.
          </p>
        </section>

        <Link href="/" className="inline-block text-indigo-600 hover:underline">
          ← Retour à l&apos;accueil
        </Link>
      </main>
    </div>
  );
}
