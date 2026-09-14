import { BUTTON_TYPES } from "../../data/buttonTypes";
import { MediaPicker } from "./MediaPicker";
import { OptionsEditor } from "./OptionsEditor";
import { ThemePicker } from "./ThemePicker";

export function CardConfig({ activeCard, selectedCardIdx, updateCurrentCard, themeId, setDeck }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-xs font-mono font-bold text-pink-400">
          Editing Card #{selectedCardIdx + 1}
        </span>
        <span className="text-[10px] bg-slate-950 text-slate-500 px-2 py-0.5 rounded-full font-mono border border-slate-800">
          ID: {activeCard.id}
        </span>
      </div>
      <div>
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
          Card Headline / Question
        </label>
        <input
          type="text"
          value={activeCard.question || ""}
          onChange={(e) => updateCurrentCard("question", e.target.value)}
          placeholder="Ask something fun..."
          maxLength={120}
          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 font-bold transition"
        />
      </div>
      <div>
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
          Subtext / Story Subtitle
        </label>
        <textarea
          rows={2}
          value={activeCard.subtitle || ""}
          onChange={(e) => updateCurrentCard("subtitle", e.target.value)}
          placeholder="Add a playful subtext..."
          maxLength={300}
          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 resize-none transition"
        />
      </div>
      <MediaPicker
        value={activeCard.mediaUrl || ""}
        onChange={(url) => updateCurrentCard("mediaUrl", url)}
      />
      <div>
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Card Interaction Type
        </label>
        <div className="grid grid-cols-1 gap-2">
          {BUTTON_TYPES.map((bt) => (
            <div
              key={bt.id}
              onClick={() => updateCurrentCard("type", bt.id)}
              className={`p-3 rounded-2xl border cursor-pointer transition flex items-start space-x-3 ${
                activeCard.type === bt.id
                  ? "border-pink-500 bg-pink-500/10 text-white shadow-lg"
                  : "border-slate-800/80 bg-slate-950/40 text-slate-400 hover:border-slate-700"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center ${
                  activeCard.type === bt.id ? "border-pink-400 bg-pink-500" : "border-slate-600"
                }`}
              >
                {activeCard.type === bt.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">{bt.name}</h4>
                <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{bt.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {(activeCard.type === "runaway" || activeCard.type === "options" || activeCard.type === "password") && (
        <OptionsEditor activeCard={activeCard} updateCurrentCard={updateCurrentCard} />
      )}
      <ThemePicker themeId={themeId} setDeck={setDeck} />
    </div>
  );
}
