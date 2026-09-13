import { Wand2 } from "lucide-react";
import { soundService } from "../../services/soundService";

export function AiBar({ prompt, setPrompt, loading, onGenerate }) {
  return (
    <form
      onSubmit={onGenerate}
      className="w-full bg-slate-900/70 border border-slate-800 rounded-3xl p-4 flex flex-col sm:flex-row gap-3 items-stretch"
    >
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe a vibe — AI builds the deck (e.g. cyberpunk birthday for Alex)..."
        className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
      />
      <button
        type="submit"
        disabled={loading || !prompt.trim()}
        onClick={() => soundService.playSuccess()}
        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 text-xs font-bold text-white disabled:opacity-50 flex items-center justify-center gap-1.5"
      >
        <Wand2 className="w-3.5 h-3.5" />
        {loading ? "Generating..." : "AI Generate"}
      </button>
    </form>
  );
}
