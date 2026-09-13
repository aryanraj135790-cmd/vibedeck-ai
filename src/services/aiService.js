import { GoogleGenAI, Type } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const deckSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    theme: { type: Type.STRING, enum: ["romantic", "playful", "sarcastic", "cyberpunk"] },
    cards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          type: { type: Type.STRING, enum: ["multichoice", "slider", "runaway"] },
          question: { type: Type.STRING },
          subtitle: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
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
  let theme = "playful";
  const lower = prompt.toLowerCase();
  if (lower.includes("romance") || lower.includes("date") || lower.includes("love") || lower.includes("anniversary")) {
    theme = "romantic";
  } else if (lower.includes("roast") || lower.includes("sarcastic") || lower.includes("funny")) {
    theme = "sarcastic";
  } else if (lower.includes("cyber") || lower.includes("sci-fi") || lower.includes("hack") || lower.includes("future")) {
    theme = "cyberpunk";
  }

  return {
    title: capitalized,
    theme: theme,
    cards: [
      {
        id: "c1",
        type: "multichoice",
        question: `Let's talk about: ${cleanPrompt}. Where should we start?`,
        subtitle: "Make your choice",
        options: ["Option A: The bold approach", "Option B: The creative route", "Option C: Total chaos"]
      },
      {
        id: "c2",
        type: "slider",
        question: `How intense is your excitement for ${cleanPrompt}?`,
        subtitle: "Slide to lock in your vibe level"
      },
      {
        id: "c3",
        type: "runaway",
        question: `Are you ready to commit to ${cleanPrompt}?`,
        subtitle: "Try clicking 'No' if you dare!"
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
      contents: `Generate a 3-card deck for: "${userPrompt}". Card 1: multichoice, Card 2: slider, Card 3: runaway.`,
      config: {
        systemInstruction: "Return ONLY raw JSON matching the schema. No markdown formatting outside json, no chat text.",
        responseMimeType: 'application/json',
        responseSchema: deckSchema,
        temperature: 0.3,
        maxOutputTokens: 1000,
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