// src/app/parametres/page.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import Header from "@/components/navigation/Header";
import {
  getParametres,
  saveParametres,
  PARAMETRES_DEFAUT,
  type Parametres,
  type QuestionsParQuiz,
} from "@/lib/parametres";

export default function ParametresPage() {
  const [params, setParams] = useState<Parametres>(PARAMETRES_DEFAUT);
  const [mounted, setMounted] = useState(false);
  const [notifStatut, setNotifStatut] = useState<"defaut" | "accordee" | "refusee" | "non-supporte">("defaut");
  const [confirmEtape, setConfirmEtape] = useState<0 | 1 | 2>(0);
  const [sauvegarde, setSauvegarde] = useState(false);
  const timerSauvegarde = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setParams(getParametres());
    setMounted(true);
    if (!("Notification" in window)) {
      setNotifStatut("non-supporte");
    } else if (Notification.permission === "granted") {
      setNotifStatut("accordee");
    } else if (Notification.permission === "denied") {
      setNotifStatut("refusee");
    }
    return () => {
      if (timerSauvegarde.current) clearTimeout(timerSauvegarde.current);
    };
  }, []);

  const handleChange = <K extends keyof Parametres>(key: K, value: Parametres[K]) => {
    const updated = { ...params, [key]: value };
    setParams(updated);
    saveParametres(updated);
    setSauvegarde(true);
    if (timerSauvegarde.current) clearTimeout(timerSauvegarde.current);
    timerSauvegarde.current = setTimeout(() => setSauvegarde(false), 1500);
  };

  const demanderPermissionNotifs = async () => {
    if (!("Notification" in window)) return;
    try {
      const result = await Notification.requestPermission();
      if (result === "granted") {
        setNotifStatut("accordee");
        handleChange("notificationsActivees", true);
        if ("serviceWorker" in navigator) {
          const reg = await navigator.serviceWorker.ready;
          reg.active?.postMessage({ type: "NOTIFS_ACTIVEES" });
        }
      } else {
        setNotifStatut("refusee");
        handleChange("notificationsActivees", false);
      }
    } catch {
      setNotifStatut("refusee");
      handleChange("notificationsActivees", false);
    }
  };

  const reinitialiserProgression = () => {
    localStorage.removeItem("quiz-performances");
    localStorage.removeItem("quiz-history");
    setConfirmEtape(0);
  };

  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="max-w-2xl mx-auto w-full px-4 py-6 space-y-6">

        {sauvegarde && (
          <div className="fixed top-16 right-4 z-50 bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg">
            ✓ Enregistré
          </div>
        )}

        {/* Objectif quotidien */}
        <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-800">🎯 Objectif quotidien</h2>

          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="objectifType"
                checked={params.objectifType === "minimum"}
                onChange={() => handleChange("objectifType", "minimum")}
                className="accent-indigo-600"
              />
              <span className="text-sm text-gray-700">1 quiz minimum par jour</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="objectifType"
                checked={params.objectifType === "personnalise"}
                onChange={() => handleChange("objectifType", "personnalise")}
                className="accent-indigo-600"
              />
              <span className="text-sm text-gray-700">Nombre personnalisé</span>
            </label>
          </div>

          {params.objectifType === "personnalise" && (
            <div className="flex items-center gap-3 pl-6">
              <span className="text-sm text-gray-600">Nombre de quiz :</span>
              <input
                type="number"
                min={1}
                max={10}
                value={params.objectifNombre}
                onChange={(e) => handleChange("objectifNombre", Math.min(10, Math.max(1, Number(e.target.value))))}
                className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <span className="text-sm text-gray-500">/ jour</span>
            </div>
          )}

          <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
            Seuls les quiz réussis à {params.seuilReussite}% ou plus comptent pour l&apos;objectif.
          </p>
        </section>

        {/* Notifications */}
        <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-800">🔔 Notifications</h2>
          <p className="text-sm text-gray-500">
            Un rappel te sera envoyé à <strong>18h00</strong> si ton objectif du jour n&apos;est pas encore atteint.
          </p>

          {notifStatut === "non-supporte" && (
            <p className="text-xs text-orange-600 bg-orange-50 rounded-lg px-3 py-2">
              Les notifications ne sont pas supportées par ce navigateur.
            </p>
          )}

          {notifStatut === "refusee" && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
              Notifications bloquées. Autorise-les dans les paramètres de ton navigateur.
            </p>
          )}

          {notifStatut === "accordee" && (
            <p className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2 font-semibold">
              ✓ Notifications activées
            </p>
          )}

          {notifStatut === "defaut" && (
            <button
              onClick={demanderPermissionNotifs}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Activer les notifications
            </button>
          )}
        </section>

        {/* Autres paramètres */}
        <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-5">
          <h2 className="font-bold text-gray-800">⚙️ Préférences</h2>

          {/* Seuil de réussite */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Seuil de réussite minimum
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={50}
                max={100}
                step={5}
                value={params.seuilReussite}
                onChange={(e) => handleChange("seuilReussite", Number(e.target.value))}
                className="flex-1 accent-indigo-600"
              />
              <span className="text-sm font-bold text-indigo-700 w-10 text-right">
                {params.seuilReussite}%
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Un quiz est considéré réussi si ton score atteint ce seuil.
            </p>
          </div>

          {/* Nombre de questions par quiz */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Nombre de questions par quiz
            </label>
            <div className="flex gap-2">
              {([3, 5, 10] as QuestionsParQuiz[]).map((n) => (
                <button
                  key={n}
                  onClick={() => handleChange("questionsParQuiz", n)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-colors ${
                    params.questionsParQuiz === n
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-indigo-600 border-indigo-300 hover:border-indigo-500"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Niveau par défaut */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Niveau par défaut</label>
            <div className="flex gap-2 flex-wrap">
              {(["seconde", "premiere", "terminale"] as const).map((n) => (
                <button
                  key={n}
                  onClick={() => handleChange("niveauDefaut", n)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-colors capitalize ${
                    params.niveauDefaut === n
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-indigo-600 border-indigo-300 hover:border-indigo-500"
                  }`}
                >
                  {n === "premiere" ? "Première" : n.charAt(0).toUpperCase() + n.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Explications avancées ouvertes par défaut */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Explications avancées ouvertes</p>
              <p className="text-xs text-gray-400">Afficher les détails dépliés après correction</p>
            </div>
            <button
              role="switch"
              aria-checked={params.explicationsAvanceesOuvertes}
              onClick={() => handleChange("explicationsAvanceesOuvertes", !params.explicationsAvanceesOuvertes)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                params.explicationsAvanceesOuvertes ? "bg-indigo-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  params.explicationsAvanceesOuvertes ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-white rounded-2xl border border-red-100 p-5 shadow-sm space-y-3">
          <h2 className="font-bold text-red-600">⚠️ Zone de danger</h2>
          <p className="text-sm text-gray-500">
            La réinitialisation supprime définitivement tous tes scores, ta progression et ton historique de quiz.
          </p>
          <button
            onClick={() => setConfirmEtape(1)}
            className="text-sm text-red-500 hover:text-red-700 underline underline-offset-2 transition-colors"
          >
            Réinitialiser toute la progression
          </button>
        </section>

      </main>

      {/* Modal confirmation étape 1 */}
      {confirmEtape === 1 && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full space-y-4">
            <p className="text-2xl text-center">⚠️</p>
            <h2 className="text-base font-bold text-gray-800 text-center">
              Réinitialiser la progression ?
            </h2>
            <p className="text-sm text-gray-500 text-center">
              Tous tes scores, badges et l&apos;historique des quiz seront supprimés définitivement.
            </p>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setConfirmEtape(0)}
                className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => setConfirmEtape(2)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-sm font-semibold text-white transition-colors"
              >
                Oui, continuer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmation étape 2 */}
      {confirmEtape === 2 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full space-y-4">
            <p className="text-2xl text-center">🗑️</p>
            <h2 className="text-base font-bold text-red-600 text-center">
              Êtes-vous vraiment sûr ?
            </h2>
            <p className="text-sm text-gray-500 text-center">
              Cette action est <span className="font-semibold text-gray-700">irréversible</span>.
            </p>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setConfirmEtape(0)}
                className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={reinitialiserProgression}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-sm font-semibold text-white transition-colors"
              >
                Tout effacer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
