import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const SimplifySchema = z.object({
  question: z.string().min(1).max(500),
  reponseCorrecte: z.string().min(1).max(500),
  explication: z.string().max(1000),
  matiere: z.string().max(100).optional(),
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

function sanitize(input: string): string {
  return input.replace(/[<>]/g, "").trim();
}

const NO_STORE = { "Cache-Control": "no-store" };

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Trop de requêtes. Attendez une minute." },
      { status: 429, headers: NO_STORE }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide." }, { status: 400, headers: NO_STORE });
  }

  const parsed = SimplifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Paramètres invalides." }, { status: 400, headers: NO_STORE });
  }

  const { question, reponseCorrecte, explication, matiere } = parsed.data;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        explicationSimplifiee: `La réponse correcte est : "${reponseCorrecte}". ${explication}`,
        analogie: null,
      },
      { headers: NO_STORE }
    );
  }

  try {
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey });

    const systemPrompt = `Tu es un professeur bienveillant qui aide un élève qui n'a pas compris. Explique le concept de manière très simple, comme si l'élève avait 12 ans. Utilise des mots simples, des exemples concrets du quotidien et une analogie si possible. Réponds en JSON uniquement.

Format : {"explicationSimplifiee":"...","analogie":"..." ou null}`;

    const userPrompt = `Matière : ${matiere ?? "cours"}
Question : ${sanitize(question)}
Réponse correcte : ${sanitize(reponseCorrecte)}
Explication officielle : ${sanitize(explication)}

Reformule cette explication en langage très simple pour un élève débutant.`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 400,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const text = completion.choices[0]?.message?.content ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON introuvable");

    const data = JSON.parse(jsonMatch[0]) as { explicationSimplifiee?: string; analogie?: string | null };

    return NextResponse.json(
      {
        explicationSimplifiee: typeof data.explicationSimplifiee === "string" ? data.explicationSimplifiee : explication,
        analogie: typeof data.analogie === "string" ? data.analogie : null,
      },
      { headers: NO_STORE }
    );
  } catch {
    return NextResponse.json(
      {
        explicationSimplifiee: `En résumé : la réponse correcte est "${reponseCorrecte}". ${explication}`,
        analogie: null,
      },
      { headers: NO_STORE }
    );
  }
}
