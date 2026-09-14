// Visual theme presets (port of the reference "THEMES" array).
export const THEMES = [
  {
    id: "cyberpunk",
    name: "Cyber Neon",
    gradient: "from-pink-500 via-purple-600 to-cyan-500",
    bg: "bg-slate-950/80",
    glow: "shadow-cyan-500/30",
    border: "border-cyan-500/40",
    accent: "text-cyan-400",
  },
  {
    id: "romantic",
    name: "Rose Quartz",
    gradient: "from-rose-500 via-pink-600 to-purple-700",
    bg: "bg-rose-950/40",
    glow: "shadow-pink-500/30",
    border: "border-rose-500/40",
    accent: "text-rose-300",
  },
  {
    id: "sunset",
    name: "Golden Aurora",
    gradient: "from-amber-400 via-orange-500 to-pink-600",
    bg: "bg-orange-950/40",
    glow: "shadow-amber-500/30",
    border: "border-amber-500/40",
    accent: "text-amber-300",
  },
  {
    id: "emerald",
    name: "Matrix Emerald",
    gradient: "from-emerald-400 via-teal-500 to-cyan-600",
    bg: "bg-teal-950/40",
    glow: "shadow-emerald-500/30",
    border: "border-emerald-500/40",
    accent: "text-emerald-300",
  },
  {
    id: "midnight",
    name: "Cosmic Abyss",
    gradient: "from-blue-600 via-indigo-600 to-purple-900",
    bg: "bg-indigo-950/40",
    glow: "shadow-blue-500/30",
    border: "border-blue-500/40",
    accent: "text-blue-300",
  },
];

export const THEME_IDS = THEMES.map((t) => t.id);

export function getTheme(themeId) {
  return THEMES.find((t) => t.id === themeId) || THEMES[0];
}
