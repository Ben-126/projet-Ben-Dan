"use client";
import { useState } from "react";
import type { Question, NiveauCorrection, FeedbackDetaille } from "@/types";
import { getParametres } from "@/lib/parametres";
import ExplicationAvancee from "./ExplicationAvancee";

interface CorrectionDisplayProps {
  question: Question;
  reponseUtilisateur: string | boolean;
  correcte: boolean;
  niveauCorrection: NiveauCorrection;
  feedback?: string;
  feedbackDetaille?: FeedbackDetaille;
  onSuivant: () => void;
  estDerniere: boolean;
  matiere?: string;
}

function getLibelleReponse(question: Question, reponse: string | boolean): string {
  if (typeof reponse === "boolean") {
    return reponse ? "Vrai" : "Faux";
  }
  if (question.type === "qcm") {
    const index = question.options.indexOf(reponse);
    if (index !== -1) {
      return `${String.fromCharCode(65 + index)}. ${reponse}`;
    }
  }
  return reponse;
}

function getLibelleBonneReponse(question: Question): string {
  if (question.type === "vrai_faux") {
    return question.reponseCorrecte ? "Vrai" : "Faux";
  }
  if (question.type === "qcm") {
    const index = question.options.indexOf(question.reponseCorrecte);
    if (index !== -1) {
      return `${String.fromCharCode(65 + index)}. ${question.reponseCorrecte}`;
    }
  }
  return question.reponseCorrecte;
}

const NIVEAU_CONFIG = {
  correct: {
    border: "rgba(61,214,191,0.4)",
    bg: "rgba(61,214,191,0.08)",
    emoji: "✅",
    titre: "Bonne réponse !",
    couleurTitre: "var(--teal)",
  },
  partiel: {
    border: "rgba(245,200,64,0.4)",
    bg: "rgba(245,200,64,0.08)",
    emoji: "⚠️",
    titre: "Partiellement correct",
    couleurTitre: "var(--amber)",
  },
  incorrect: {
    border: "rgba(239,110,90,0.4)",
    bg: "rgba(239,110,90,0.08)",
    emoji: "❌",
    titre: "Mauvaise réponse",
    couleurTitre: "var(--coral-l)",
  },
};

export default function CorrectionDisplay({
  question,
  reponseUtilisateur,
  correcte,
  niveauCorrection,
  feedback,
  feedbackDetaille,
  onSuivant,
  estDerniere,
  matiere,
}: CorrectionDisplayProps) {
  const [explicationSimplifiee, setExplicationSimplifiee] = useState<string | null>(null);
  const [analogie, setAnalogie] = useState<string | null>(null);
  const [chargementSimplify, setChargementSimplify] = useState(false);

  async function handlePasCompris() {
    if (chargementSimplify || explicationSimplifiee) return;
    setChargementSimplify(true);
    try {
      const res = await fetch("/api/quiz/simplify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.question,
          reponseCorrecte: question.reponseCorrecte,
          explication: question.explication,
          matiere,
        }),
      });
      if (res.ok) {
        const data = await res.json() as { explicationSimplifiee: string; analogie: string | null };
        setExplicationSimplifiee(data.explicationSimplifiee);
        setAnalogie(data.analogie);
      }
    } finally {
      setChargementSimplify(false);
    }
  }

  const libelleUser = getLibelleReponse(question, reponseUtilisateur);
  const libelleBonne = getLibelleBonneReponse(question);
  const { explicationsAvanceesOuvertes } = getParametres();
  const config = NIVEAU_CONFIG[niveauCorrection];

  return (
    <div
      className="rounded-2xl p-5 space-y-4"
      style={{ background: config.bg, border: `2px solid ${config.border}` }}
      data-testid="correction-display"
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">{config.emoji}</span>
        <div>
          <p style={{ fontWeight: 700, fontSize: 18, color: config.couleurTitre }}>
            {config.titre}
          </p>
          {niveauCorrection === "partiel" && (
            <p style={{ fontSize: 14, color: "var(--amber)", marginTop: 2 }}>
              Ta réponse : <span className="font-medium">{libelleUser}</span>
            </p>
          )}
          {niveauCorrection === "incorrect" && (
            <p style={{ fontSize: 14, color: "var(--text2)", marginTop: 2 }}>
              Ta réponse : <span style={{ fontWeight: 500, color: "var(--coral-l)" }}>{libelleUser}</span>
              {" · "}
              Bonne réponse : <span style={{ fontWeight: 500, color: "var(--teal)" }}>{libelleBonne}</span>
            </p>
          )}
          {correcte && question.type === "qcm" && (
            <p style={{ fontSize: 14, color: "var(--teal)", marginTop: 2 }}>{libelleUser}</p>
          )}
        </div>
      </div>

      {question.type === "reponse_courte" && niveauCorrection !== "correct" && feedbackDetaille && (
        <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${niveauCorrection === "partiel" ? "rgba(245,200,64,0.3)" : "rgba(245,200,64,0.2)"}` }}>
          {feedbackDetaille.pointsPositifs && (
            <div className="flex gap-2 px-3 py-2" style={{ background: "rgba(61,214,191,0.08)", borderBottom: "1px solid rgba(61,214,191,0.2)" }}>
              <span style={{ color: "var(--teal)", fontSize: 14, marginTop: 2, flexShrink: 0 }}>✓</span>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: "var(--teal)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Ce qui est correct</p>
                <p style={{ fontSize: 14, color: "var(--text)" }}>{feedbackDetaille.pointsPositifs}</p>
              </div>
            </div>
          )}
          {feedbackDetaille.pointsManquants && (
            <div className="flex gap-2 px-3 py-2" style={{ background: niveauCorrection === "partiel" ? "rgba(245,200,64,0.08)" : "rgba(245,200,64,0.06)", borderBottom: "1px solid rgba(245,200,64,0.15)" }}>
              <span style={{ fontSize: 14, marginTop: 2, flexShrink: 0, color: "var(--amber)" }}>!</span>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: "var(--amber)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Ce qui manque</p>
                <p style={{ fontSize: 14, color: "var(--text2)" }}>{feedbackDetaille.pointsManquants}</p>
              </div>
            </div>
          )}
          {feedbackDetaille.pourquoi && (
            <div className="flex gap-2 px-3 py-2" style={{ background: niveauCorrection === "partiel" ? "rgba(245,200,64,0.1)" : "rgba(245,200,64,0.08)" }}>
              <span style={{ fontSize: 14, marginTop: 2, flexShrink: 0, color: "var(--amber)" }}>?</span>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: "var(--amber)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Pourquoi</p>
                <p style={{ fontSize: 14, color: "var(--text2)" }}>{feedbackDetaille.pourquoi}</p>
              </div>
            </div>
          )}
        </div>
      )}
      {question.type === "reponse_courte" && niveauCorrection !== "correct" && !feedbackDetaille && feedback && (
        <div className="rounded-xl p-3" style={{ background: "rgba(245,200,64,0.08)", border: "1px solid rgba(245,200,64,0.3)" }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--amber)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
            {niveauCorrection === "partiel" ? "Piste d'amélioration" : "Retour"}
          </p>
          <p style={{ fontSize: 14, color: "var(--text2)" }}>
            {feedback}
          </p>
        </div>
      )}

      {niveauCorrection === "partiel" && (
        <div className="rounded-xl p-3 flex items-center gap-2" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(245,200,64,0.2)" }}>
          <span style={{ color: "var(--amber)", fontWeight: 700, fontSize: 14 }}>+</span>
          <p style={{ fontSize: 12, color: "var(--text2)" }}>
            Réponse partielle — points partiels attribués
          </p>
        </div>
      )}

      <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)" }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Explication</p>
        <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.6 }}>{question.explication}</p>
      </div>

      <ExplicationAvancee
        explicationAvancee={question.explicationAvancee}
        defaultExpanded={!correcte || explicationsAvanceesOuvertes}
      />

      {/* Bouton "Je n'ai pas compris" — visible uniquement si réponse incorrecte ou partielle */}
      {niveauCorrection !== "correct" && !explicationSimplifiee && (
        <button
          onClick={handlePasCompris}
          disabled={chargementSimplify}
          data-testid="btn-pas-compris"
          className="w-full py-3 rounded-xl font-semibold"
          style={{
            background: "rgba(77,94,232,0.08)",
            border: "1px solid rgba(77,94,232,0.25)",
            color: "var(--indigo-l)",
            cursor: chargementSimplify ? "wait" : "pointer",
            fontSize: 14,
          }}
        >
          {chargementSimplify ? "Génération en cours..." : "🤔 Je n'ai pas compris — Explique-moi simplement"}
        </button>
      )}

      {/* Explication simplifiée */}
      {explicationSimplifiee && (
        <div
          className="rounded-xl p-4 space-y-3"
          style={{ background: "rgba(77,94,232,0.06)", border: "1px solid rgba(77,94,232,0.2)" }}
          data-testid="explication-simplifiee"
        >
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--indigo-l)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            🧩 Explication simplifiée
          </p>
          <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.65 }}>{explicationSimplifiee}</p>
          {analogie && (
            <div className="rounded-lg p-3" style={{ background: "rgba(61,214,191,0.06)", border: "1px solid rgba(61,214,191,0.15)" }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--teal)", marginBottom: 4 }}>💡 Analogie</p>
              <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>{analogie}</p>
            </div>
          )}
        </div>
      )}

      <button
        onClick={onSuivant}
        data-testid="btn-suivant"
        className="w-full py-3 rounded-xl font-semibold transition-colors"
        style={{ background: "var(--indigo)", color: "#fff", border: "none", cursor: "pointer" }}
      >
        {estDerniere ? "Voir mon score" : "Question suivante →"}
      </button>
    </div>
  );
}
