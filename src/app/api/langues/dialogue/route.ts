import { NextRequest } from "next/server";
import { z } from "zod";

const LANGUES_SUPPORTEES = ["en", "es", "de", "it", "pt"] as const;
type CodeLangue = (typeof LANGUES_SUPPORTEES)[number];

const NOMS_LANGUES: Record<CodeLangue, { fr: string; natif: string }> = {
  en: { fr: "anglais", natif: "English" },
  es: { fr: "espagnol", natif: "Español" },
  de: { fr: "allemand", natif: "Deutsch" },
  it: { fr: "italien", natif: "Italiano" },
  pt: { fr: "portugais", natif: "Português" },
};

const REPONSES_LOCALES: Record<CodeLangue, string[]> = {
  en: [
    "Hello! I'm your English practice partner. What would you like to talk about today?",
    "Good effort! Keep practicing — your English will improve with each conversation.",
    "Excellent! You're doing really well. Let's keep talking!",
  ],
  es: [
    "¡Hola! Soy tu compañero de práctica de español. ¿De qué quieres hablar hoy?",
    "¡Buen intento! Sigue practicando, tu español mejorará con cada conversación.",
    "¡Excelente! Lo estás haciendo muy bien. ¡Sigamos hablando!",
  ],
  de: [
    "Hallo! Ich bin dein Deutschlernpartner. Worüber möchtest du heute sprechen?",
    "Gut gemacht! Übe weiter — dein Deutsch wird mit jedem Gespräch besser.",
    "Ausgezeichnet! Du machst das wirklich gut. Lass uns weitermachen!",
  ],
  it: [
    "Ciao! Sono il tuo partner per praticare l'italiano. Di cosa vuoi parlare oggi?",
    "Buon tentativo! Continua a praticare, il tuo italiano migliorerà ad ogni conversazione.",
    "Eccellente! Stai andando molto bene. Continuiamo a parlare!",
  ],
  pt: [
    "Olá! Sou seu parceiro para praticar português. Sobre o que você quer falar hoje?",
    "Bom esforço! Continue praticando, seu português vai melhorar a cada conversa.",
    "Excelente! Você está indo muito bem. Vamos continuar falando!",
  ],
};

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});

const RequestSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(20),
  langue: z.enum(LANGUES_SUPPORTEES),
  niveau: z.enum(["debutant", "intermediaire", "avance"]).default("intermediaire"),
});

const rateLimit = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 15) return false;
  entry.count++;
  return true;
}

function repondreLocalement(
  messages: Array<{ role: string; content: string }>,
  langue: CodeLangue
): string {
  const responses = REPONSES_LOCALES[langue];
  const index = Math.min(Math.floor(messages.length / 2), responses.length - 1);
  return (
    responses[Math.max(0, index)] +
    "\n\n*(Mode hors ligne — configurez OPENAI_API_KEY pour un dialogue IA complet)*"
  );
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return new Response("Trop de requêtes. Attendez une minute.", { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Corps de requête invalide.", { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return new Response("Paramètres invalides.", { status: 400 });
  }

  const { messages, langue, niveau } = parsed.data;
  const nomLangue = NOMS_LANGUES[langue];

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(repondreLocalement(messages, langue), {
      headers: { "Content-Type": "text/plain; charset=utf-8", "X-Mode": "local" },
    });
  }

  const niveauLabel =
    niveau === "debutant" ? "A1/A2" : niveau === "avance" ? "B2/C1" : "B1/B2";

  const systemPrompt = `Tu es un professeur de ${nomLangue.fr} bienveillant pour lycéens français (niveau CECRL ${niveauLabel}).

Règles STRICTES :
- Réponds UNIQUEMENT en ${nomLangue.natif} (${nomLangue.fr})
- Si l'élève écrit en français, réponds en ${nomLangue.natif} et reformule sa phrase dans la langue cible
- Corrige les fautes grammaticales et de vocabulaire de façon encourageante : montre la version correcte entre (parenthèses ✓)
- Adapte ton vocabulaire au niveau ${niveauLabel} — simple pour débutant, riche pour avancé
- Sois conversationnel, pose des questions ouvertes pour maintenir le dialogue
- Limite-toi à 4-5 phrases par réponse`;

  try {
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey });

    const stream = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 300,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
      stream: true,
    });

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? "";
            if (text) controller.enqueue(new TextEncoder().encode(text));
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch {
    return new Response(repondreLocalement(messages, langue), {
      headers: { "Content-Type": "text/plain; charset=utf-8", "X-Mode": "local" },
    });
  }
}
