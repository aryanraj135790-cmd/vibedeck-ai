import { Trash2 } from "lucide-react";

export function OptionsEditor({ activeCard, updateCurrentCard }) {
  const updateCardOption = (optIdx, val) => {
    const opts = [...(activeCard.options || [])];
    opts[optIdx] = val;
    updateCurrentCard("options", opts);
  };
  const addOptionToCard = () => {
    updateCurrentCard("options", [...(activeCard.options || []), "New option"]);
  };
  const removeOptionFromCard = (optIdx) => {
    updateCurrentCard("options", (activeCard.options || []).filter((_, i) => i !== optIdx));
  };
  return (
    <div className="space-y-2 pt-2 border-t border-slate-800">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-slate-300">Choice Chips:</span>
        {activeCard.type === "options" && (
          <button onClick={addOptionToCard} className="text-[11px] text-pink-400 font-bold hover:underline">
            + Add Choice Chip
          </button>
        )}
      </div>
      {(activeCard.options || []).map((opt, oIdx) => (
        <div key={oIdx} className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 font-mono w-4">{oIdx + 1}.</span>
          <input
            type="text"
            value={opt}
            onChange={(e) => updateCardOption(oIdx, e.target.value)}
            className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-1 text-xs text-white focus:outline-none focus:border-pink-500"
          />
          {activeCard.type === "options" && (activeCard.options || []).length > 1 && (
            <Trash2
              className="w-3.5 h-3.5 text-slate-500 hover:text-rose-400 cursor-pointer"
              onClick={() => removeOptionFromCard(oIdx)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
