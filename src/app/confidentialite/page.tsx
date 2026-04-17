"use client";

import Header from "@/components/navigation/Header";
import Link from "next/link";

export default function PageConfidentialite() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-6 text-sm text-gray-700">
        <h1 className="text-2xl font-bold text-gray-800">Politique de confidentialité</h1>
        <p className="text-gray-500">Dernière mise à jour : avril 2026</p>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800">Données collectées</h2>
          <p>Révioria collecte uniquement les données nécessaires au fonctionnement du service :</p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>Adresse email (authentification)</li>
            <li>Pseudo (affichage public dans le classement)</li>
            <li>XP, niveau, badges (progression gamifiée)</li>
            <li>Résultats de quiz (stockés localement sur ton appareil)</li>
          </ul>
          <p>Aucune donnée publicitaire ni de suivi comportemental n&apos;est collectée.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800">Stockage</h2>
          <p>
            Les données de quiz et de gamification sont stockées localement sur ton appareil (localStorage).
            Les données de profil et sociales sont hébergées sur Supabase (serveurs EU — Stockholm, Suède).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800">Tes droits (RGPD)</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>Droit d&apos;accès : toutes tes données sont visibles dans ton profil.</li>
            <li>Droit à l&apos;effacement : tu peux supprimer ton compte depuis les paramètres.</li>
            <li>Droit de rectification : tu peux modifier ton pseudo depuis les paramètres.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800">Contact</h2>
          <p>Pour toute question relative à tes données : contact via l&apos;application.</p>
        </section>

        <Link href="/" className="inline-block text-indigo-600 hover:underline">
          ← Retour à l&apos;accueil
        </Link>
      </main>
    </div>
  );
}
