// Available interaction types (port of the reference "BUTTON_TYPES" array).
// These are the canonical ids used across aiService, CardRenderer and DeckStudio.
export const BUTTON_TYPES = [
  {
    id: "runaway",
    name: 'Playful Runaway "No" Trap',
    desc: "Positive button grows while the \"No\" button flees on hover/touch",
  },
  {
    id: "options",
    name: "Multi-Choice Matrix",
    desc: "Interactive grid of selectable choice chips",
  },
  {
    id: "slider",
    name: "Holo Vibe Slider",
    desc: "0-100% slider to measure intensity or affection",
  },
  {
    id: "voice",
    name: "Voice Note",
    desc: "Record a secret voice note response",
  },
  {
    id: "text",
    name: "Custom Text",
    desc: "Open textbox response for notes or secret codes",
  },
  {
    id: "password",
    name: "Secret Password Box",
    desc: "Locks the card until the recipient enters the secret code (first option = code)",
  },
  {
    id: "next",
    name: "Holo Wave / Next",
    desc: "Celebratory step forward with audio fanfare",
  },
];

export const BUTTON_TYPE_IDS = BUTTON_TYPES.map((t) => t.id);
