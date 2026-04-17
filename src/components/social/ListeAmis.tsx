"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getMesAmis,
  getDemandesRecues,
  rechercherParPseudo,
  envoyerDemandeAmi,
  accepterDemandeAmi,
  refuserDemandeAmi,
} from "@/lib/social";
import type { Amitie, ProfilPublic } from "@/types";

interface ListeAmisProps {
  userId: string;
}

export default function ListeAmis({ userId }: ListeAmisProps) {
  const [amis, setAmis] = useState<Amitie[]>([]);
  const [demandes, setDemandes] = useState<Amitie[]>([]);
  const [recherche, setRecherche] = useState("");
  const [resultatsRecherche, setResultatsRecherche] = useState<ProfilPublic[]>([]);
  const [chargement, setChargement] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const charger = useCallback(async () => {
    setChargement(true);
    const [mesAmis, demandesRecues] = await Promise.all([
      getMesAmis(userId),
      getDemandesRecues(userId),
    ]);
    setAmis(mesAmis);
    setDemandes(demandesRecues);
    setChargement(false);
  }, [userId]);

  useEffect(() => {
    charger();
  }, [charger]);

  const handleRecherche = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recherche.trim()) return;
    const resultats = await rechercherParPseudo(recherche.trim());
    setResultatsRecherche(resultats.filter((p) => p.id !== userId));
  };

  const handleEnvoyerDemande = async (friendId: string) => {
    const erreur = await envoyerDemandeAmi(userId, friendId);
    if (erreur) {
      setMessage(`Erreur : ${erreur}`);
    } else {
      setMessage("Demande d'ami envoyée !");
      setResultatsRecherche([]);
      setRecherche("");
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAccepter = async (amitiéId: string) => {
    await accepterDemandeAmi(amitiéId);
    charger();
  };

  const handleRefuser = async (amitiéId: string) => {
    await refuserDemandeAmi(amitiéId);
    charger();
  };

  const lienInvitation = `${typeof window !== "undefined" ? window.location.origin : ""}/social?inviter=${userId}`;

  return (
    <div className="space-y-6">
      {/* Lien d'invitation */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 space-y-2">
        <p className="text-sm font-semibold text-indigo-800">Inviter un ami</p>
        <p className="text-xs text-indigo-600">Partage ce lien pour qu&apos;un ami te rejoigne :</p>
        <div className="flex gap-2">
          <input
            readOnly
            value={lienInvitation}
            className="flex-1 text-xs bg-white border border-indigo-200 rounded-lg px-3 py-2 text-gray-700"
          />
          <button
            onClick={() => navigator.clipboard.writeText(lienInvitation)}
            className="px-3 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Copier
          </button>
        </div>
      </div>

      {/* Recherche par pseudo */}
      <form onSubmit={handleRecherche} className="flex gap-2">
        <input
          type="text"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher un ami par pseudo..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Chercher
        </button>
      </form>

      {message && (
        <p className="text-sm text-center text-indigo-600 font-medium">{message}</p>
      )}

      {resultatsRecherche.length > 0 && (
        <ul className="space-y-2">
          {resultatsRecherche.map((p) => (
            <li key={p.id} className="flex items-center justify-between px-4 py-3 bg-white border border-gray-100 rounded-xl">
              <span className="text-sm font-medium">{p.pseudo}</span>
              <button
                onClick={() => handleEnvoyerDemande(p.id)}
                className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                + Ajouter
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Demandes reçues */}
      {demandes.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">Demandes reçues ({demandes.length})</h3>
          {demandes.map((d) => (
            <div key={d.id} className="flex items-center justify-between px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-xl">
              <span className="text-sm font-medium">{(d.profil as ProfilPublic | undefined)?.pseudo ?? "Utilisateur"}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAccepter(d.id)}
                  className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Accepter
                </button>
                <button
                  onClick={() => handleRefuser(d.id)}
                  className="text-xs bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Refuser
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Liste d'amis */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">
          Mes amis ({chargement ? "..." : amis.length})
        </h3>
        {!chargement && amis.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">
            Tu n&apos;as pas encore d&apos;amis. Utilise la recherche ou partage ton lien !
          </p>
        )}
        {amis.map((a) => {
          const profil = a.profil as ProfilPublic | undefined;
          return (
            <div key={a.id} className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-100 rounded-xl">
              <span className="text-lg">👤</span>
              <div className="flex-1">
                <p className="text-sm font-medium">{profil?.pseudo ?? "Ami"}</p>
                <p className="text-xs text-gray-400">{profil?.xp_total ?? 0} XP · Niveau {profil?.niveau ?? 1}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
