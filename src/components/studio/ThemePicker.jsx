import { THEMES } from "../../data/themes";
import { soundService } from "../../services/soundService";

export function ThemePicker({ themeId, setDeck }) {
  return (
    <div className="pt-2 border-t border-slate-800">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
        Overall Visual Theme & Glow
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {THEMES.map((th) => (
          <button
            key={th.id}
            onClick={() => {
              soundService.playTick();
              setDeck((p) => ({ ...p, themeId: th.id }));
            }}
            className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center space-x-2 ${
              themeId === th.id
                ? "border-pink-400 bg-slate-800 text-white shadow-lg"
                : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700"
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${th.gradient}`} />
            <span className="truncate">{th.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
