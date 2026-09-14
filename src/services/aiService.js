import { GoogleGenAI, Type } from '@google/genai';
import { THEME_IDS } from '../data/themes';
import { BUTTON_TYPE_IDS } from '../data/buttonTypes';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const deckSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    theme: { type: Type.STRING, enum: THEME_IDS },
    cards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          type: { type: Type.STRING, enum: BUTTON_TYPE_IDS },
          question: { type: Type.STRING },
          subtitle: { type: Type.STRING },
          passcode: { type: Type.STRING },
          passwordHint: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          mediaUrl: { type: Type.STRING }
        },
        required: ["id", "type", "question"]
      }
    }
  },
  required: ["title", "theme", "cards"]
};

/**
 * Dynamically builds a custom deck based on the user's prompt if the AI service fails.
 */
function createDynamicFallbackDeck(prompt) {
  const cleanPrompt = prompt.trim() || "Special Adventure";
  const capitalized = cleanPrompt.charAt(0).toUpperCase() + cleanPrompt.slice(1);

  // Detect theme based on keywords in prompt
  let theme = "romantic";
  const lower = prompt.toLowerCase();
  if (lower.includes("cyber") || lower.includes("sci-fi") || lower.includes("hack") || lower.includes("future")) {
    theme = "cyberpunk";
  } else if (lower.includes("sunset") || lower.includes("beach") || lower.includes("gold")) {
    theme = "sunset";
  } else if (lower.includes("emerald") || lower.includes("matrix") || lower.includes("green")) {
    theme = "emerald";
  } else if (lower.includes("midnight") || lower.includes("cosmic") || lower.includes("star")) {
    theme = "midnight";
  }

  return {
    title: capitalized,
    theme,
    cards: [
      {
        id: "c1",
        type: "runaway",
        question: `Are you ready to commit to ${cleanPrompt}?`,
        subtitle: "Try clicking 'No' if you dare!",
        options: ["YES! Let's go! ✨", "Nope 🙈"]
      },
      {
        id: "c2",
        type: "options",
        question: `Let's talk about: ${cleanPrompt}. Where should we start?`,
        subtitle: "Make your choice",
        options: ["The bold approach", "The creative route", "Total chaos"]
      },
      {
        id: "c3",
        type: "slider",
        question: `How intense is your excitement for ${cleanPrompt}?`,
        subtitle: "Slide to lock in your vibe level",
        options: []
      },
      {
        id: "c4",
        type: "text",
        question: "Leave a secret note ✉️",
        subtitle: "One line they'll never forget...",
        options: []
      }
    ]
  };
}

export async function generateDeckFromPrompt(userPrompt) {
  if (!apiKey) {
    throw new Error("Missing VITE_GEMINI_API_KEY in your .env.local file.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Generate a 3-5 card interactive deck for: "${userPrompt}". Mix the interaction types to feel fresh (e.g. runaway, options, slider, voice, text, password, next) and pick a theme that fits the vibe. Include a mediaUrl (a giphy gif url) on at least one card. For a "password" card: put the secret code in the dedicated "passcode" field (short, lowercase), put the hint/clue in "passwordHint" (or subtitle if you prefer). Do not put the passcode in options — options are for runaway/options choice chips only.`,
      config: {
        systemInstruction: "Return ONLY raw JSON matching the schema. No markdown formatting outside json, no chat text.",
        responseMimeType: 'application/json',
        responseSchema: deckSchema,
        temperature: 0.4,
        maxOutputTokens: 1500,
      }
    });

    if (!response || !response.text) {
      return createDynamicFallbackDeck(userPrompt);
    }

    let cleaned = response.text.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    }

    return JSON.parse(cleaned);

  } catch (error) {
    console.warn("[AI Service] API or parsing error encountered. Switching to dynamic local generator:", error.message);
    return createDynamicFallbackDeck(userPrompt);
  }
}

/**
 * Rewrites a deck's card copy (question + subtitle + option wording) in a chosen
 * tone of voice. Returns a NEW deck object; card ids, types, mediaUrls,
 * passcodes and deck-level metadata are preserved. Only question/subtitle/options
 * text change.
 *
 * tone: one of 'playful' | 'romantic' | 'sarcastic' | 'dramatic' | 'minimal'
 * tweakPrompt: optional one-line instruction e.g. 'shorter', 'more puns', 'less cheesy'
 */
export async function rewriteDeckCopy(deck, tone, tweakPrompt) {
  if (!apiKey) {
    throw new Error("Missing VITE_GEMINI_API_KEY in your .env.local file.");
  }

  const TONE_NOTES = {
    playful: "light, fun, breezy, emoji-friendly",
    romantic: "warm, sincere, intimate, soft",
    sarcastic: "dry, witty, slightly biting, self-aware, tongue-in-cheek",
    dramatic: "bold, heightened, cinematic, urgent",
    minimal: "short, clean, direct, spare — cut the fluff",
  };

  const toneNote = TONE_NOTES[tone] || TONE_NOTES.playful;
  const tweakLine = tweakPrompt && tweakPrompt.trim()
    ? `Additional instruction: "${tweakPrompt.trim()}".`
    : "";

  // Build per-card copy snapshots for the prompt
  const cardSnapshots = deck.cards.map((c, i) =>
    `Card ${i + 1} (id=${c.id}, type=${c.type}):
  question: ${c.question || ""}
  subtitle: ${c.subtitle || ""}
  options: ${(c.options || []).join(" | ")}`
  ).join("\n\n");

  const prompt =
    `You are a copywriter for an interactive celebration deck. Rewrite the copy on every card below so the whole deck sounds like ONE consistent voice: "${tone}" — ${toneNote}. ${tweakLine} Keep each question short (it's a card headline). Keep the same number of options per card and just rewrite each option's wording in the tone. Preserve all meaning — don't drop the ask. Return ONLY a JSON array of objects, one per card, each with { "id": "<same card id>", "question": "<rewritten>", "subtitle": "<rewritten>", "options": ["<rewritten>", ...] }. Do not change ids. Do not add or remove cards. No markdown, no text outside the JSON.

Card copy to rewrite:
${cardSnapshots}`;

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Return ONLY a raw JSON array matching the schema. No markdown fences, no text outside the JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["id", "question", "subtitle", "options"],
          },
        },
        temperature: 0.6,
        maxOutputTokens: 1200,
      },
    });

    if (!response || !response.text) {
      // Gemini returned nothing — keep deck unchanged
      return deck;
    }

    let cleaned = response.text.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    }

    const rewritten = JSON.parse(cleaned);

    if (!Array.isArray(rewritten)) {
      console.warn("[AI Rewrite] unexpected non-array response, keeping deck unchanged");
      return deck;
    }

    // Merge by id: rewrite question/subtitle/options only; keep everything else.
    const idMap = new Map(rewritten.map((r) => [r.id, r]));
    const newCards = deck.cards.map((c) => {
      const r = idMap.get(c.id);
      if (!r) return c; // no matching rewritten card → keep original
      const opts = Array.isArray(r.options) && r.options.length > 0 ? r.options : c.options;
      return {
        ...c,
        question: typeof r.question === "string" ? r.question : c.question,
        subtitle: typeof r.subtitle === "string" ? r.subtitle : c.subtitle,
        options: opts,
      };
    });

    return {
      ...deck,
      cards: newCards,
    };
  } catch (error) {
    console.warn("[AI Rewrite] API or parsing error, keeping deck unchanged:", error.message);
    return deck;
  }
}

