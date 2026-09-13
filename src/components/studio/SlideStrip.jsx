import { Layers, Plus, Trash2 } from "lucide-react";
import { soundService } from "../../services/soundService";
import { DEFAULT_GIFS } from "../../data/defaults";

export function SlideStrip({ cards, selectedCardIdx, setSelectedCardIdx, setDeck, onToast }) {
  const addCard = () => {
    soundService.playPop();
    setDeck((p) => ({
      ...p,
      cards: [
        ...p.cards,
        {
          id: `c_${Math.random().toString(36).slice(2, 7)}`,
          question: "New Story Question",
          subtitle: "Add details...",
          mediaUrl: DEFAULT_GIFS[p.cards.length % DEFAULT_GIFS.length],
          type: "options",
          options: ["Option 1", "Option 2", "Option 3"],
        },
      ],
    }));
    setSelectedCardIdx(cards.length);
  };
  const removeCard = (idx) => {
    if (cards.length <= 1) {
      onToast("Must keep at least one card in deck!");
      return;
    }
    soundService.playTick();
    setDeck((p) => ({ ...p, cards: p.cards.filter((_, i) => i !== idx) }));
    setSelectedCardIdx(Math.max(0, idx - 1));
  };
  return (
    <div className="space-y-3 pb-4 border-b border-slate-800">
      <div className="flex justify-between items-center">
        <label className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center space-x-1">
          <Layers className="w-3.5 h-3.5" />
          <span>2. Card Deck Sequence ({cards.length} Cards)</span>
        </label>
        <button
          onClick={addCard}
          className="bg-pink-600/20 hover:bg-pink-600/30 text-pink-300 border border-pink-500/30 px-3 py-1 rounded-xl text-xs font-bold flex items-center space-x-1 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Slide</span>
        </button>
      </div>
      <div className="flex space-x-2 overflow-x-auto py-1">
        {cards.map((c, idx) => (
          <button
            key={c.id}
            onClick={() => setSelectedCardIdx(idx)}
            className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center space-x-1.5 ${
              selectedCardIdx === idx
                ? "bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 text-white shadow-lg"
                : "bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <span>Slide {idx + 1}</span>
            {selectedCardIdx === idx && (
              <Trash2
                className="w-3 h-3 text-white/80 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  removeCard(idx);
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
