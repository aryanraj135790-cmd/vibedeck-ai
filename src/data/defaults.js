import { getTheme } from "./themes";
import { BUTTON_TYPE_IDS } from "./buttonTypes";

export const DEFAULT_GIFS = [
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnFlcWsxcnh2bmQ3dnJicTFtYmRwOHdpcWs2NWR1b244enllOXF3ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Lq0h93752f6J9tijrh/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZtMTM4amc3eWZrbTlhYXZyZWVqMG51eWJzbjJldnlsajdzdmE2ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Kkxv9HthM0Dmg/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmNwcDFuM21vbDJhbmsycnlqOHRwMTZ5bnEyb2hzcGpwMW42bGZiMjFxN3AxcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Lq0h93752f6J9tijrh/giphy.gif",
];

/**
 * Creates a sensible default 3-card deck in the canonical "studio" shape.
 */
export function createDefaultDeck() {
  return {
    title: "A Special Message 💖",
    themeId: "romantic",
    senderName: "Taylor",
    recipientName: "Alex",
    phoneNum: "",
    cards: [
      {
        id: "c1",
        type: "runaway",
        question: "Will you go on a romantic getaway with me?",
        subtitle: "Life in 3D is so much brighter with you...",
        options: ["YES! Absolutely! ✨", "Nope 🙈"],
        mediaUrl: DEFAULT_GIFS[0],
      },
      {
        id: "c2",
        type: "options",
        question: "Select our destination 🚀",
        subtitle: "Pick our next adventure spot together!",
        options: [
          "Cyber Neon Arcade 👾",
          "Starry Night Dinner 🍕",
          "Beach Sunset Picnic 🌅",
          "Cozy Movie Marathon 🍿",
        ],
        mediaUrl: DEFAULT_GIFS[1],
      },
      {
        id: "c3",
        type: "slider",
        question: "Affection Vibe Meter 📊",
        subtitle: "Slide to transmit your true feelings level!",
        options: [],
        mediaUrl: DEFAULT_GIFS[2],
      },
    ],
  };
}

/**
 * Normalizes any deck (AI or legacy shape) into the canonical "studio" shape.
 *
 * Accepts:
 *   { title, themeId, senderName, recipientName, phoneNum, cards }
 *   { title, theme, cards }  (AI/legacy shape)
 */
export function normalizeDeck(deck) {
  if (!deck || !Array.isArray(deck.cards)) return createDefaultDeck();

  const themeId = deck.themeId || deck.theme || "romantic";
  const theme = getTheme(themeId);

  const cards = deck.cards
    .filter((c) => c && typeof c === "object")
    .map((c) => {
      let type = c.type || c.buttonType || "options";
      // Legacy alias: multichoice -> options
      if (type === "multichoice") type = "options";
      if (!BUTTON_TYPE_IDS.includes(type)) type = "options";

      return {
        id: c.id || `c_${Math.random().toString(36).slice(2, 7)}`,
        type,
        question: c.question || c.title || "A fun question ✨",
        subtitle: c.subtitle || "",
        passcode: c.passcode || "",
        passwordHint: c.passwordHint || "",
        options: Array.isArray(c.options) ? c.options : [],
        mediaUrl: c.mediaUrl || "",
      };
    });

  return {
    title: deck.title || theme.name,
    themeId: theme.id,
    senderName: deck.senderName || "",
    recipientName: deck.recipientName || "Someone Special",
    phoneNum: deck.phoneNum || "",
    cards,
  };
}
