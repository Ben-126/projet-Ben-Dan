import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const VerifySchema = z.object({
  question: z.string().min(1).max(500),
  reponseCorrecte: z.string().min(1).max(500),
  reponseUser: z.string().min(1).max(500),
  explication: z.string().max(1000),
});

const AiResponseSchema = z.object({
  niveauCorrection: z.enum(["correct", "partiel", "incorrect"]),
  feedback: z.string().max(500),
  feedbackDetaille: z
    .object({
      pointsPositifs: z.string().max(500).optional().nullable(),
      pointsManquants: z.string().max(500).optional().nullable(),
      pourquoi: z.string().max(500).optional().nullable(),
    })
    .optional(),
});

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const MAX_REQ = 20;
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

function sanitizeForPrompt(input: string): string {
  return input.replace(/[<>]/g, "").trim();
}

function normaliserSimple(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,;:!?'"()\-]/g, "")
    .replace(/\s+/g, " ");
}

function verifierLocalReponse(reponseUser: string, reponseCorrecte: string): "correct" | "incorrect" {
  const u = normaliserSimple(reponseUser);
  const c = normaliserSimple(reponseCorrecte);
  return u === c || u.includes(c) || c.includes(u) ? "correct" : "incorrect";
}

const NO_STORE = { "Cache-Control": "no-store" };

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Trop de requêtes. Attendez une minute avant de réessayer." },
      { status: 429, headers: NO_STORE }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400, headers: NO_STORE });
  }

  const parsed = VerifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Paramètres invalides." }, { status: 400, headers: NO_STORE });
  }

  const { question, reponseCorrecte, reponseUser, explication } = parsed.data;

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    const niveau = verifierLocalReponse(reponseUser, reponseCorrecte);
    return NextResponse.json(
      {
        correcte: niveau === "correct",
        niveauCorrection: niveau,
        feedback: niveau === "correct"
          ? "Bonne réponse !"
          : `La réponse attendue était : « ${reponseCorrecte} »`,
      },
      { headers: NO_STORE }
    );
  }

  try {
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey });

    const safeQuestion = sanitizeForPrompt(question);
    const safeReponseCorrecte = sanitizeForPrompt(reponseCorrecte);
    const safeReponseUser = sanitizeForPrompt(reponseUser);
    const safeExplication = sanitizeForPrompt(explication);

    const systemPrompt = `Tu es un professeur de Seconde qui corrige une réponse courte. Réponds UNIQUEMENT avec du JSON valide, sans texte avant ou après.

Évalue la réponse de l'élève avec 3 niveaux :
- "correct" : réponse juste (synonymes acceptés, fautes mineures tolérées)
- "partiel" : idée juste mais incomplète ou imprécise
- "incorrect" : réponse fausse, hors sujet, ou concept clé absent

Format de réponse :
Pour "correct" : {"niveauCorrection":"correct","feedback":"Très bien !","feedbackDetaille":{}}
Pour "partiel" : {"niveauCorrection":"partiel","feedback":"Partiellement correct.","feedbackDetaille":{"pointsPositifs":"...","pointsManquants":"...","pourquoi":"..."}}
Pour "incorrect" : {"niveauCorrection":"incorrect","feedback":"Réponse incorrecte.","feedbackDetaille":{"pointsPositifs":"...","pointsManquants":"...","pourquoi":"..."}}`;

    const userPrompt = `Question : ${safeQuestion}
Réponse correcte de référence : ${safeReponseCorrecte}
Explication : ${safeExplication}
Réponse de l'élève : ${safeReponseUser}`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 300,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const text = completion.choices[0]?.message?.content ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Format JSON introuvable");

    const validated = AiResponseSchema.safeParse(JSON.parse(jsonMatch[0]));
    if (!validated.success) throw new Error("Réponse IA non conforme au schéma");

    const { niveauCorrection, feedback, feedbackDetaille } = validated.data;
    const cleanFeedbackDetaille = feedbackDetaille
      ? {
          pointsPositifs: feedbackDetaille.pointsPositifs ?? undefined,
          pointsManquants: feedbackDetaille.pointsManquants ?? undefined,
          pourquoi: feedbackDetaille.pourquoi ?? undefined,
        }
      : undefined;

    return NextResponse.json(
      { correcte: niveauCorrection === "correct", niveauCorrection, feedback, feedbackDetaille: cleanFeedbackDetaille },
      { headers: NO_STORE }
    );
  } catch {
    const niveau = verifierLocalReponse(reponseUser, reponseCorrecte);
    return NextResponse.json(
      {
        correcte: niveau === "correct",
        niveauCorrection: niveau,
        feedback: niveau === "correct"
          ? "Bonne réponse !"
          : `La réponse attendue était : « ${reponseCorrecte} »`,
      },
      { headers: NO_STORE }
    );
  }
}
