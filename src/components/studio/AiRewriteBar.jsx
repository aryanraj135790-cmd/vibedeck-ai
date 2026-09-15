import { useState } from "react";
import { Heart, FaceSlightlySmiling, Zap, Circle, Sparkles } from "lucide-react";

const TONES = [
  { id: "playful", label: "Playful", icon: Sparkles },
  { id: "romantic", label: "Romantic", icon: Heart },
  { id: "sarcastic", label: "Sarcastic", icon: FaceSlightlySmiling },
  { id: "dramatic", label: "Dramatic", icon: Zap },
  { id: "minimal", label: "Minimal", icon: Circle },
];

export function AiRewriteBar({ deck, rewriting, onRewrite }) {
  const cards = deck?.cards || [];
  const hasCards = cards.length > 0;
  const [tone, setTone] = useState("playful");
  const [tweak, setTweak] = useState("");

  const activeTone = tone || "playful";
  const activeTweak = tweak || "";

  return (
    <section className="space-y-3 pb-5 border-b border-slate-800">
      <label className="text-[11px] font-mono font-bold text-pink-400 uppercase tracking-widest flex items-center space-x-1">
        <Sparkles className="w-3.5 h-3.5" />
        <span>2. Deck-Wide Voice & Tweak</span>
      </label>

      <div className="space-y-2.5">
        <div className="flex flex-wrap gap-1.5">
          {TONES.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTone(t.id)}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition ${
                  activeTone === t.id
                    ? "border-pink-400 bg-pink-500/15 text-pink-200 shadow-sm"
                    : "border-slate-700 bg-slate-950/50 text-slate-400 hover:border-slate-600"
                }`}
              >
                <Icon className="w-3 h-3" />
                {t.label}
              </button>
            );
          })}
        </div>

        <input
          value={tweak}
          onChange={(e) => setTweak(e.target.value)}
          placeholder="Optional tweak — shorter, more puns, less cheesy..."
          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-pink-500"
        />
      </div>

      <button
        type="button"
        disabled={rewriting || !hasCards}
        onClick={() => onRewrite(deck, activeTone, activeTweak)}
        className="w-full px-5 py-2.5 rounded-xl bg-linear-to-r from-pink-500 via-purple-600 to-cyan-500 text-xs font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
      >
        {rewriting ? (
          <>
            <span className="inline-block animate-spin h-3 w-3 rounded-full border-2 border-white border-t-transparent" />
            Rewriting...
          </>
        ) : (
          "Rewrite copy"
        )}
      </button>
    </section>
  );
}
