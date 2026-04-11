"use client";
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
    border: "border-green-300",
    bg: "bg-green-50",
    emoji: "✅",
    titre: "Bonne réponse !",
    couleurTitre: "text-green-700",
  },
  partiel: {
    border: "border-yellow-300",
    bg: "bg-yellow-50",
    emoji: "⚠️",
    titre: "Partiellement correct",
    couleurTitre: "text-yellow-700",
  },
  incorrect: {
    border: "border-red-300",
    bg: "bg-red-50",
    emoji: "❌",
    titre: "Mauvaise réponse",
    couleurTitre: "text-red-700",
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
}: CorrectionDisplayProps) {
  const libelleUser = getLibelleReponse(question, reponseUtilisateur);
  const libelleBonne = getLibelleBonneReponse(question);
  const { explicationsAvanceesOuvertes } = getParametres();
  const config = NIVEAU_CONFIG[niveauCorrection];

  return (
    <div
      className={`rounded-2xl border-2 p-5 space-y-4 ${config.bg} ${config.border}`}
      data-testid="correction-display"
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">{config.emoji}</span>
        <div>
          <p className={`font-bold text-lg ${config.couleurTitre}`}>
            {config.titre}
          </p>
          {niveauCorrection === "partiel" && (
            <p className="text-sm text-yellow-700 mt-0.5">
              Ta réponse : <span className="font-medium">{libelleUser}</span>
            </p>
          )}
          {niveauCorrection === "incorrect" && (
            <p className="text-sm text-gray-600 mt-0.5">
              Ta réponse : <span className="font-medium text-red-600">{libelleUser}</span>
              {" · "}
              Bonne réponse : <span className="font-medium text-green-600">{libelleBonne}</span>
            </p>
          )}
          {correcte && question.type === "qcm" && (
            <p className="text-sm text-green-600 mt-0.5">{libelleUser}</p>
          )}
        </div>
      </div>

      {question.type === "reponse_courte" && niveauCorrection !== "correct" && feedbackDetaille && (
        <div className={`rounded-xl border overflow-hidden ${
          niveauCorrection === "partiel" ? "border-yellow-300" : "border-orange-200"
        }`}>
          {feedbackDetaille.pointsPositifs && (
            <div className="flex gap-2 px-3 py-2 bg-green-50 border-b border-green-100">
              <span className="text-green-500 text-sm mt-0.5 shrink-0">✓</span>
              <div>
                <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-0.5">Ce qui est correct</p>
                <p className="text-sm text-green-900">{feedbackDetaille.pointsPositifs}</p>
              </div>
            </div>
          )}
          {feedbackDetaille.pointsManquants && (
            <div className={`flex gap-2 px-3 py-2 border-b ${
              niveauCorrection === "partiel" ? "bg-yellow-50 border-yellow-100" : "bg-orange-50 border-orange-100"
            }`}>
              <span className={`text-sm mt-0.5 shrink-0 ${niveauCorrection === "partiel" ? "text-yellow-500" : "text-orange-500"}`}>!</span>
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wide mb-0.5 ${
                  niveauCorrection === "partiel" ? "text-yellow-700" : "text-orange-700"
                }`}>Ce qui manque</p>
                <p className={`text-sm ${niveauCorrection === "partiel" ? "text-yellow-900" : "text-orange-900"}`}>{feedbackDetaille.pointsManquants}</p>
              </div>
            </div>
          )}
          {feedbackDetaille.pourquoi && (
            <div className={`flex gap-2 px-3 py-2 ${
              niveauCorrection === "partiel" ? "bg-yellow-100" : "bg-orange-100"
            }`}>
              <span className={`text-sm mt-0.5 shrink-0 ${niveauCorrection === "partiel" ? "text-yellow-600" : "text-orange-600"}`}>?</span>
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wide mb-0.5 ${
                  niveauCorrection === "partiel" ? "text-yellow-700" : "text-orange-700"
                }`}>Pourquoi</p>
                <p className={`text-sm ${niveauCorrection === "partiel" ? "text-yellow-900" : "text-orange-900"}`}>{feedbackDetaille.pourquoi}</p>
              </div>
            </div>
          )}
        </div>
      )}
      {question.type === "reponse_courte" && niveauCorrection !== "correct" && !feedbackDetaille && feedback && (
        <div className={`rounded-xl p-3 border ${
          niveauCorrection === "partiel"
            ? "bg-yellow-100 border-yellow-300"
            : "bg-orange-50 border-orange-200"
        }`}>
          <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${
            niveauCorrection === "partiel" ? "text-yellow-700" : "text-orange-600"
          }`}>
            {niveauCorrection === "partiel" ? "Piste d'amélioration" : "Retour"}
          </p>
          <p className={`text-sm ${niveauCorrection === "partiel" ? "text-yellow-900" : "text-orange-800"}`}>
            {feedback}
          </p>
        </div>
      )}

      {niveauCorrection === "partiel" && (
        <div className="bg-white rounded-xl p-3 border border-yellow-200 flex items-center gap-2">
          <span className="text-yellow-500 font-bold text-sm">+</span>
          <p className="text-xs text-yellow-800">
            Réponse partielle — points partiels attribués
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Explication</p>
        <p className="text-sm text-gray-700 leading-relaxed">{question.explication}</p>
      </div>

      <ExplicationAvancee
        explicationAvancee={question.explicationAvancee}
        defaultExpanded={!correcte || explicationsAvanceesOuvertes}
      />

      <button
        onClick={onSuivant}
        data-testid="btn-suivant"
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
      >
        {estDerniere ? "Voir mon score" : "Question suivante →"}
      </button>
    </div>
  );
}
