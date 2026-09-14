import { useState } from "react";
import { IdentityForm } from "./IdentityForm";
import { SlideStrip } from "./SlideStrip";
import { CardConfig } from "./CardConfig";
import { StudioPreview } from "./StudioPreview";
import { soundService } from "../../services/soundService";

export function DeckStudio({ deck, setDeck, onPreview, onToast }) {
  const [selectedCardIdx, setSelectedCardIdx] = useState(0);
  const cards = deck.cards || [];
  const activeCard = cards[Math.min(selectedCardIdx, cards.length - 1)] || cards[0] || {};

  const updateCurrentCard = (key, val) => {
    soundService.playTick();
    setDeck((p) => ({
      ...p,
      cards: p.cards.map((c, i) => (i === selectedCardIdx ? { ...c, [key]: val } : c)),
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
      <div className="lg:col-span-6 space-y-6 bg-slate-900/70 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-xl">
        <IdentityForm deck={deck} setDeck={setDeck} />
        <SlideStrip
          cards={cards}
          selectedCardIdx={selectedCardIdx}
          setSelectedCardIdx={setSelectedCardIdx}
          setDeck={setDeck}
          onToast={onToast}
        />
        <CardConfig
          activeCard={activeCard}
          selectedCardIdx={selectedCardIdx}
          updateCurrentCard={updateCurrentCard}
          themeId={deck.themeId || "cyberpunk"}
          setDeck={setDeck}
        />
      </div>
      <StudioPreview
        deck={deck}
        cards={cards}
        selectedCardIdx={selectedCardIdx}
        onPreview={onPreview}
      />
    </div>
  );
}
