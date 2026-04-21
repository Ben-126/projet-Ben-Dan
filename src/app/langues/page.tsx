"use client";
import { useState } from "react";
import Header from "@/components/navigation/Header";
import ReconnaissanceVocale from "@/components/langues/ReconnaissanceVocale";
import CorrectionPrononciation from "@/components/langues/CorrectionPrononciation";
import DialogueLangue from "@/components/langues/DialogueLangue";

type Onglet = "reconnaissance" | "prononciation" | "dialogue";

const ONGLETS: { id: Onglet; label: string; emoji: string; description: string }[] = [
  {
    id: "reconnaissance",
    label: "Reconnaissance vocale",
    emoji: "🎙️",
    description: "Parlez et voyez la transcription en temps réel",
  },
  {
    id: "prononciation",
    label: "Prononciation",
    emoji: "🗣️",
    description: "Lisez une phrase et obtenez un feedback sur votre prononciation",
  },
  {
    id: "dialogue",
    label: "Dialogue IA",
    emoji: "💬",
    description: "Conversez avec l'IA dans la langue de votre choix",
  },
];

export default function LanguesPage() {
  const [onglet, setOnglet] = useState<Onglet>("reconnaissance");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            🌍 Langues
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Pratiquez l&apos;oral en langues étrangères avec l&apos;IA
          </p>
        </div>

        {/* Onglets */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {ONGLETS.map((o) => (
            <button
              key={o.id}
              onClick={() => setOnglet(o.id)}
              className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl border-2 text-center transition-colors ${
                onglet === o.id
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
              }`}
            >
              <span className="text-xl">{o.emoji}</span>
              <span className="text-xs font-medium leading-tight">{o.label}</span>
            </button>
          ))}
        </div>

        {/* Description de l'onglet */}
        <p className="text-xs text-gray-400 text-center mb-6">
          {ONGLETS.find((o) => o.id === onglet)?.description}
        </p>

        {/* Contenu */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          {onglet === "reconnaissance" && <ReconnaissanceVocale />}
          {onglet === "prononciation" && <CorrectionPrononciation />}
          {onglet === "dialogue" && <DialogueLangue />}
        </div>
      </main>
    </div>
  );
}
