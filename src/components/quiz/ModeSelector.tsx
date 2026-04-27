"use client";
import type { ModeQuiz } from "@/types";

interface ModeSelectorProps {
  titreChapitre: string;
  onSelectMode: (mode: ModeQuiz) => void;
}

export default function ModeSelector({ titreChapitre, onSelectMode }: ModeSelectorProps) {
  return (
    <div className="space-y-6" data-testid="mode-selector">
      <div className="text-center">
        <p style={{ fontSize: 12, fontWeight: 600, color: "var(--indigo-l)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
          {titreChapitre}
        </p>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>Choisir un mode</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Mode Entraînement */}
        <button
          onClick={() => onSelectMode("entrainement")}
          data-testid="btn-mode-entrainement"
          className="group relative flex flex-col items-center text-center gap-3 p-6 rounded-2xl transition-all duration-200"
          style={{ border: "2px solid rgba(77,94,232,0.3)", background: "var(--card)", boxShadow: "0 4px 16px rgba(0,0,0,0.3)", cursor: "pointer" }}
        >
          <span className="text-4xl">🎯</span>
          <div>
            <p style={{ fontWeight: 700, color: "var(--text)", fontSize: 16 }}>Entraînement</p>
            <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 4, lineHeight: 1.5 }}>
              Correction après chaque question · Indices · Révision des erreurs
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-1 mt-1">
            <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: "var(--r-pill)", background: "rgba(61,214,191,0.1)", color: "var(--teal)" }}>
              Correction immédiate
            </span>
            <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: "var(--r-pill)", background: "rgba(77,94,232,0.1)", color: "var(--indigo-l)" }}>
              Adaptatif
            </span>
          </div>
        </button>

        {/* Mode Contrôle */}
        <button
          onClick={() => onSelectMode("controle")}
          data-testid="btn-mode-controle"
          className="group relative flex flex-col items-center text-center gap-3 p-6 rounded-2xl transition-all duration-200"
          style={{ border: "2px solid rgba(245,200,64,0.3)", background: "var(--card)", boxShadow: "0 4px 16px rgba(0,0,0,0.3)", cursor: "pointer" }}
        >
          <span className="text-4xl">📝</span>
          <div>
            <p style={{ fontWeight: 700, color: "var(--text)", fontSize: 16 }}>Contrôle</p>
            <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 4, lineHeight: 1.5 }}>
              Temps limité · 10 questions · Note sur 20
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-1 mt-1">
            <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: "var(--r-pill)", background: "rgba(245,200,64,0.1)", color: "var(--amber)" }}>
              Conditions réelles
            </span>
            <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: "var(--r-pill)", background: "rgba(239,110,90,0.1)", color: "var(--coral-l)" }}>
              Chronomètre
            </span>
          </div>
        </button>

        {/* Mode Chrono */}
        <button
          onClick={() => onSelectMode("chrono")}
          data-testid="btn-mode-chrono"
          className="group relative flex flex-col items-center text-center gap-3 p-6 rounded-2xl transition-all duration-200"
          style={{ border: "2px solid rgba(245,200,64,0.25)", background: "var(--card)", boxShadow: "0 4px 16px rgba(0,0,0,0.3)", cursor: "pointer" }}
        >
          <span className="text-4xl">⚡</span>
          <div>
            <p style={{ fontWeight: 700, color: "var(--text)", fontSize: 16 }}>Chrono</p>
            <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 4, lineHeight: 1.5 }}>
              Course contre la montre · Réponds vite pour gagner plus de points !
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-1 mt-1">
            <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: "var(--r-pill)", background: "rgba(245,200,64,0.1)", color: "var(--amber)" }}>
              30s par question
            </span>
          </div>
        </button>

        {/* Mode Quiz rapide */}
        <button
          onClick={() => onSelectMode("rapide")}
          data-testid="btn-mode-rapide"
          className="group relative flex flex-col items-center text-center gap-3 p-6 rounded-2xl transition-all duration-200"
          style={{ border: "2px solid rgba(61,214,191,0.3)", background: "var(--card)", boxShadow: "0 4px 16px rgba(0,0,0,0.3)", cursor: "pointer" }}
        >
          <span className="text-4xl">🚀</span>
          <div>
            <p style={{ fontWeight: 700, color: "var(--text)", fontSize: 16 }}>Quiz rapide</p>
            <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 4, lineHeight: 1.5 }}>
              5 questions · ~1 minute · Idéal pour une révision express
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-1 mt-1">
            <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: "var(--r-pill)", background: "rgba(61,214,191,0.1)", color: "var(--teal)" }}>
              5 questions
            </span>
            <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: "var(--r-pill)", background: "rgba(61,214,191,0.08)", color: "var(--teal)" }}>
              ~1 min
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
