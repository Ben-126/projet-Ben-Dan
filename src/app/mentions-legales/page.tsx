"use client";

import Header from "@/components/navigation/Header";
import Link from "next/link";

export default function PageMentionsLegales() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-6 text-sm text-gray-700">
        <h1 className="text-2xl font-bold text-gray-800">Mentions légales</h1>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800">Éditeur</h2>
          <p>Révioria est un projet personnel à but non commercial.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800">Hébergement</h2>
          <p>
            Application : Vercel Inc. — 340 Pine Street, San Francisco, CA 94104, USA.<br />
            Base de données : Supabase — serveur EU (Stockholm, Suède).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800">Propriété intellectuelle</h2>
          <p>
            Les contenus de quiz sont inspirés des{" "}
            <a
              href="https://www.education.gouv.fr/reussir-au-lycee/les-programmes-du-lycee-general-et-technologique-9812"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              programmes officiels du Ministère de l&apos;Éducation nationale
            </a>
            .
          </p>
        </section>

        <Link href="/" className="inline-block text-indigo-600 hover:underline">
          ← Retour à l&apos;accueil
        </Link>
      </main>
    </div>
  );
}
