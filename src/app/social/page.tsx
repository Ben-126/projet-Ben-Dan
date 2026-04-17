"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "@/components/navigation/Header";
import Classement from "@/components/social/Classement";
import ListeAmis from "@/components/social/ListeAmis";
import type { User } from "@supabase/supabase-js";

type OngletSocial = "classement" | "amis" | "defis";

export default function PageSocial() {
  const [user, setUser] = useState<User | null>(null);
  const [chargement, setChargement] = useState(true);
  const [onglet, setOnglet] = useState<OngletSocial>("classement");
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/");
        return;
      }
      setUser(user);
      setChargement(false);
    });
  }, [router]);

  if (chargement) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Social</h1>

        <div className="flex gap-2 border-b border-gray-200 pb-2">
          {([
            { id: "classement", label: "🏆 Classement" },
            { id: "amis", label: "👥 Amis" },
            { id: "defis", label: "⚡ Défis" },
          ] as { id: OngletSocial; label: string }[]).map((o) => (
            <button
              key={o.id}
              onClick={() => setOnglet(o.id)}
              className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${
                onglet === o.id
                  ? "bg-indigo-600 text-white"
                  : "text-gray-500 hover:text-indigo-600"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        {onglet === "classement" && <Classement userId={user.id} />}
        {onglet === "amis" && <ListeAmis userId={user.id} />}
        {onglet === "defis" && (
          <p className="text-center text-gray-400 py-8 text-sm">
            Les défis arrivent bientôt !
          </p>
        )}
      </main>
    </div>
  );
}
