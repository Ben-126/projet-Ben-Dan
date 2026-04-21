"use client";
import { useState, useRef } from "react";

const LANGUES = [
  { code: "en", bcp47: "en-GB", nom: "Anglais", emoji: "🇬🇧" },
  { code: "es", bcp47: "es-ES", nom: "Espagnol", emoji: "🇪🇸" },
  { code: "de", bcp47: "de-DE", nom: "Allemand", emoji: "🇩🇪" },
  { code: "it", bcp47: "it-IT", nom: "Italien", emoji: "🇮🇹" },
  { code: "pt", bcp47: "pt-PT", nom: "Portugais", emoji: "🇵🇹" },
];

const PHRASES: Record<string, string[]> = {
  en: [
    "The weather is beautiful today.",
    "I would like to order a coffee, please.",
    "Could you repeat that more slowly?",
    "My name is… and I am a student.",
    "Where is the nearest train station?",
  ],
  es: [
    "Buenos días, ¿cómo estás hoy?",
    "Me gustaría pedir un café, por favor.",
    "¿Puede repetir eso más despacio?",
    "Me llamo… y soy estudiante.",
    "¿Dónde está la estación de tren más cercana?",
  ],
  de: [
    "Das Wetter ist heute wunderschön.",
    "Ich möchte bitte einen Kaffee bestellen.",
    "Könnten Sie das langsamer wiederholen?",
    "Mein Name ist… und ich bin Schüler.",
    "Wo ist der nächste Bahnhof?",
  ],
  it: [
    "Il tempo è bellissimo oggi.",
    "Vorrei ordinare un caffè, per favore.",
    "Potrebbe ripetere più lentamente?",
    "Mi chiamo… e sono studente.",
    "Dov'è la stazione ferroviaria più vicina?",
  ],
  pt: [
    "O tempo está lindo hoje.",
    "Eu gostaria de pedir um café, por favor.",
    "Pode repetir isso mais devagar?",
    "Meu nome é… e sou estudante.",
    "Onde fica a estação de trem mais próxima?",
  ],
};

interface MotResultat {
  mot: string;
  correct: boolean;
  transcrit: string;
}

interface ResultatAnalyse {
  transcrit: string;
  similitude: number;
  mots: MotResultat[];
  feedback: string;
  modeLocal?: boolean;
}

export default function CorrectionPrononciation() {
  const [langue, setLangue] = useState("en");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [enregistrement, setEnregistrement] = useState(false);
  const [analyse, setAnalyse] = useState(false);
  const [resultat, setResultat] = useState<ResultatAnalyse | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const phrase = PHRASES[langue][phraseIndex];

  const changerLangue = (code: string) => {
    setLangue(code);
    setPhraseIndex(0);
    setResultat(null);
    setErreur(null);
    if (enregistrement) arreterEnregistrement();
  };

  const phraseAleatoire = () => {
    const phrases = PHRASES[langue];
    const newIndex = (phraseIndex + 1) % phrases.length;
    setPhraseIndex(newIndex);
    setResultat(null);
    setErreur(null);
  };

  const demarrerEnregistrement = async () => {
    setResultat(null);
    setErreur(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => { stream.getTracks().forEach((t) => t.stop()); envoyerAudio(); };
      mr.start();
      mediaRecorderRef.current = mr;
      setEnregistrement(true);
    } catch {
      setErreur("Impossible d'accéder au microphone. Vérifiez les permissions.");
    }
  };

  const arreterEnregistrement = () => {
    mediaRecorderRef.current?.stop();
    setEnregistrement(false);
  };

  const envoyerAudio = async () => {
    setAnalyse(true);
    try {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const fd = new FormData();
      fd.append("audio", blob);
      fd.append("texte", phrase);
      fd.append("langue", langue);

      const res = await fetch("/api/langues/prononcer", { method: "POST", body: fd });
      const data = await res.json() as ResultatAnalyse & { error?: string };

      if (!res.ok || data.error) {
        setErreur(data.error ?? "Erreur lors de l'analyse.");
        return;
      }
      setResultat(data);
    } catch {
      setErreur("Impossible de contacter le serveur. Vérifiez votre connexion.");
    } finally {
      setAnalyse(false);
    }
  };

  const scoreClass = (similitude: number) => {
    if (similitude >= 0.9) return "text-green-600";
    if (similitude >= 0.65) return "text-yellow-600";
    return "text-red-600";
  };

  const scoreLabel = (similitude: number) => {
    if (similitude >= 0.9) return "Excellent";
    if (similitude >= 0.75) return "Bien";
    if (similitude >= 0.5) return "À améliorer";
    return "Difficile";
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500 text-center">
        Lisez la phrase à voix haute — l&apos;IA analysera votre prononciation.
      </p>

      {/* Sélecteur de langue */}
      <div className="flex flex-wrap gap-2 justify-center">
        {LANGUES.map((l) => (
          <button
            key={l.code}
            onClick={() => changerLangue(l.code)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-colors ${
              langue === l.code
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
            }`}
          >
            {l.emoji} {l.nom}
          </button>
        ))}
      </div>

      {/* Phrase à prononcer */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 text-center space-y-3">
        <p className="text-xs text-indigo-500 font-medium uppercase tracking-wide">
          Phrase à prononcer
        </p>
        <p className="text-xl font-semibold text-indigo-900">&ldquo;{phrase}&rdquo;</p>
        <button
          onClick={phraseAleatoire}
          className="text-xs text-indigo-500 hover:text-indigo-700 underline transition-colors"
        >
          Autre phrase →
        </button>
      </div>

      {/* Bouton enregistrement */}
      <div className="flex flex-col items-center gap-3">
        {!analyse ? (
          <>
            <button
              onClick={enregistrement ? arreterEnregistrement : demarrerEnregistrement}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-lg transition-all duration-200 ${
                enregistrement
                  ? "bg-red-500 hover:bg-red-600 scale-110"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white`}
              aria-label={enregistrement ? "Arrêter l'enregistrement" : "Commencer l'enregistrement"}
            >
              {enregistrement ? "⏹" : "🎤"}
            </button>
            <p className="text-sm text-gray-500">
              {enregistrement ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse inline-block" />
                  Enregistrement en cours…
                </span>
              ) : (
                "Cliquez pour enregistrer"
              )}
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Analyse en cours…</p>
          </div>
        )}
      </div>

      {/* Erreur */}
      {erreur && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {erreur}
        </div>
      )}

      {/* Résultat */}
      {resultat && (
        <div className="space-y-4">
          {/* Score */}
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4">
            <div>
              <p className="text-xs text-gray-500 font-medium">Score de prononciation</p>
              <p className={`text-2xl font-bold ${scoreClass(resultat.similitude)}`}>
                {Math.round(resultat.similitude * 100)}%
                <span className="text-base font-medium ml-1">
                  — {scoreLabel(resultat.similitude)}
                </span>
              </p>
            </div>
            {resultat.similitude >= 0.9 && <span className="text-3xl">🏆</span>}
            {resultat.similitude >= 0.75 && resultat.similitude < 0.9 && <span className="text-3xl">👍</span>}
            {resultat.similitude < 0.75 && <span className="text-3xl">💪</span>}
          </div>

          {/* Mots mot-à-mot */}
          {resultat.mots.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Analyse mot par mot
              </p>
              <div className="flex flex-wrap gap-2">
                {resultat.mots.map((m, i) => (
                  <span
                    key={i}
                    className={`px-2 py-1 rounded-lg text-sm font-medium ${
                      m.correct
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                    title={!m.correct && m.transcrit ? `Compris : "${m.transcrit}"` : undefined}
                  >
                    {m.mot}
                    {!m.correct && <span className="text-xs ml-0.5 opacity-70">✗</span>}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Ce qui a été compris */}
          {resultat.transcrit && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Ce qui a été compris
              </p>
              <p className="text-gray-700 italic">&ldquo;{resultat.transcrit}&rdquo;</p>
            </div>
          )}

          {/* Feedback */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 space-y-1">
            <p className="text-xs text-indigo-500 font-medium uppercase tracking-wide">
              Feedback du coach
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">{resultat.feedback}</p>
          </div>

          {resultat.modeLocal && (
            <p className="text-xs text-center text-gray-400">
              Mode hors ligne — configurez OPENAI_API_KEY pour une analyse réelle
            </p>
          )}
        </div>
      )}
    </div>
  );
}
