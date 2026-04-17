"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { deconnecter } from "@/lib/auth";
import { setupOnlineListener } from "@/lib/sync";
import AuthModal from "@/components/auth/AuthModal";
import ClochNotif from "@/components/social/ClochNotif";
import type { User } from "@supabase/supabase-js";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const cleanup = setupOnlineListener();

    return () => {
      subscription.unsubscribe();
      cleanup();
    };
  }, []);

  const handleDeconnexion = async () => {
    await deconnecter();
    setUser(null);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/logo.png" alt="Révioria" width={32} height={32} className="object-contain mix-blend-multiply" />
          <span className="font-bold text-indigo-700 text-lg hidden sm:block">Révioria</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          <Link
            href="/progression"
            className="text-sm text-gray-600 hover:text-indigo-600 font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Progression
          </Link>

          {user && (
            <Link
              href="/social"
              className="text-sm text-gray-600 hover:text-indigo-600 font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Social
            </Link>
          )}
        </nav>

        {/* Actions droite */}
        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <>
              <ClochNotif />
              <button
                onClick={handleDeconnexion}
                className="text-sm text-gray-500 hover:text-red-600 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-1.5 rounded-lg transition-colors"
            >
              Connexion
            </button>
          )}
        </div>
      </div>

      {showAuth && (
        <AuthModal
          onFermer={() => setShowAuth(false)}
          onConnecte={() => setShowAuth(false)}
        />
      )}
    </header>
  );
}
