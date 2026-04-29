import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "").trim();

  if (!token) {
    return NextResponse.json(
      { error: "Authentification requise. Connecte-toi pour exporter tes données." },
      { status: 401 }
    );
  }

  // Crée un client Supabase avec le JWT de l'utilisateur pour respecter RLS
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "Session invalide ou expirée. Reconnecte-toi." },
      { status: 401 }
    );
  }

  const [{ data: profil, error: profilError }, { data: badges, error: badgesError }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("user_badges").select("*").eq("user_id", user.id),
    ]);

  if (profilError && profilError.code !== "PGRST116") {
    return NextResponse.json(
      { error: "Erreur lors de la récupération du profil." },
      { status: 500 }
    );
  }

  const exportData = {
    export_date: new Date().toISOString(),
    export_version: "1.0",
    base_legale: "Art. 20 RGPD — Droit à la portabilité des données",
    responsable_traitement: "Ben Podrojsky — benpodrojsky@gmail.com",
    compte: {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
    },
    profil: profil ?? null,
    badges: badges ?? [],
    donnees_locales: {
      note: "Les données stockées localement dans ton navigateur (historique de quiz, performances, objectifs, révision espacée) ne transitent pas par nos serveurs. Pour les exporter, utilise la fonction d'export dans les paramètres de l'application.",
      cles_concernees: [
        "quiz-history",
        "quiz-performances",
        "gamification-profil",
        "objectifs-personnalises",
        "revision-espacee",
      ],
    },
  };

  return NextResponse.json(exportData, {
    headers: {
      "Content-Disposition": `attachment; filename="revioria-mes-donnees-${new Date().toISOString().split("T")[0]}.json"`,
      "Content-Type": "application/json",
    },
  });
}
