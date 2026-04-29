"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getConsentement, enregistrerConsentement, effacerDonneesNonEssentielles } from "@/lib/consent";

export default function BandeauCookies() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getConsentement()) setVisible(true);
  }, []);

  const accepter = () => {
    enregistrerConsentement("accepted");
    setVisible(false);
  };

  const refuser = () => {
    enregistrerConsentement("refused");
    // RGPD : supprimer immédiatement toutes les données non-essentielles déjà collectées
    effacerDonneesNonEssentielles();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg p-4">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 text-sm text-gray-700 space-y-1">
          <p className="font-medium text-gray-800">Stockage local de données</p>
          <p>
            Révioria utilise le <strong>stockage local de ton navigateur</strong> (localStorage) pour sauvegarder
            ta progression, tes résultats et tes préférences. Ces données restent sur ton appareil et
            ne sont pas transmises à des tiers à des fins publicitaires.{" "}
            <Link href="/confidentialite" className="text-indigo-600 hover:underline font-medium">
              Politique de confidentialité
            </Link>
          </p>
          <p className="text-xs text-gray-500">
            Si tu refuses, ta progression et tes résultats de quiz ne seront pas conservés entre les sessions.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={refuser}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Refuser
          </button>
          <button
            onClick={accepter}
            className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
