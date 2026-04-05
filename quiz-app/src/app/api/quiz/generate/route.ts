import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { genererQuizMock } from "@/lib/mock-quiz";
import { getMatiereBySlug, getChapitreBySlug } from "@/data/programme-seconde";
import { QuizSchema } from "@/lib/quiz-schema";
import { QUESTIONS_PAR_QUIZ } from "@/lib/constants";

const RequestSchema = z.object({
  matiereSlug: z.string().min(1).max(100),
  chapitreSlug: z.string().min(1).max(100),
});

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const MAX_REQ = 10;
const WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_REQ) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Trop de requêtes. Attendez une minute avant de réessayer." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    // Ne pas exposer les détails Zod au client
    return NextResponse.json({ error: "Paramètres invalides." }, { status: 400 });
  }

  const { matiereSlug, chapitreSlug } = parsed.data;

  if (!getMatiereBySlug(matiereSlug)) {
    return NextResponse.json({ error: "Matière introuvable." }, { status: 404 });
  }

  if (!getChapitreBySlug(matiereSlug, chapitreSlug)) {
    return NextResponse.json({ error: "Chapitre introuvable." }, { status: 404 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (apiKey) {
    try {
      const { default: Anthropic } = await import("@anthropic-ai/sdk");
      const client = new Anthropic({ apiKey });

      const matiere = getMatiereBySlug(matiereSlug)!;
      const { chapitre } = getChapitreBySlug(matiereSlug, chapitreSlug)!;
      const competences = chapitre.competences.map((c) => c.titre).join(", ");

      const prompt = `Tu es un professeur expert pour la classe de Seconde en France.
Génère exactement ${QUESTIONS_PAR_QUIZ} questions de quiz sur le chapitre suivant :
- Matière : ${matiere.nom}
- Chapitre : ${chapitre.titre}
- Compétences ciblées : ${competences}

Génère un mélange de types : QCM (4 options), Vrai/Faux, et Réponse courte.
Les questions doivent être précises, pédagogiquement correctes et adaptées au niveau Seconde.

Réponds UNIQUEMENT avec un JSON valide, sans texte avant ou après :
{
  "questions": [
    {
      "type": "qcm",
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "reponseCorrecte": "A",
      "explication": "..."
    },
    {
      "type": "vrai_faux",
      "question": "...",
      "reponseCorrecte": true,
      "explication": "..."
    },
    {
      "type": "reponse_courte",
      "question": "...",
      "reponseCorrecte": "...",
      "explication": "..."
    }
  ]
}`;

      const message = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 2048,
        messages: [{ role: "user", content: prompt }],
      });

      const content = message.content[0];
      if (content.type !== "text") throw new Error("Réponse inattendue de l'IA");

      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Format JSON introuvable dans la réponse");

      const rawParsed = JSON.parse(jsonMatch[0]);

      // SÉCURITÉ : valider la réponse IA avec le schéma Zod avant de l'envoyer au client
      const validated = QuizSchema.safeParse(rawParsed);
      if (!validated.success) {
        throw new Error("Réponse IA non conforme au schéma attendu");
      }

      return NextResponse.json(validated.data, { headers: { "Cache-Control": "no-store" } });
    } catch (err: unknown) {
      // Log serveur uniquement, jamais exposé au client
      if (process.env.NODE_ENV !== "production") {
        console.error("[quiz/generate] Erreur Anthropic, fallback mock:", err);
      }
      const questions = genererQuizMock(matiereSlug, chapitreSlug);
      return NextResponse.json({ questions }, { headers: { "Cache-Control": "no-store" } });
    }
  }

  const questions = genererQuizMock(matiereSlug, chapitreSlug);
  return NextResponse.json({ questions }, { headers: { "Cache-Control": "no-store" } });
}
