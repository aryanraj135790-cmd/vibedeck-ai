import { useState } from "react";
import { EnvelopeView } from "./EnvelopeView";
import { InteractiveCard } from "./InteractiveCard";
import { FinaleView } from "./FinaleView";
import { soundService } from "../../services/soundService";

export function CardRenderer({ deck, theme, onToast, onBurst }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [finished, setFinished] = useState(false);
  const [responses, setResponses] = useState({});
  const [customNotes, setCustomNotes] = useState("");
  const [recordedAudio, setRecordedAudio] = useState(false);

  const card = deck.cards[currentIdx];

  const fireBurst = (ms = 4000) => {
    onBurst(true);
    setTimeout(() => onBurst(false), ms);
  };

  const answer = (val) => {
    soundService.playPop();
    setResponses((p) => ({ ...p, [card.question || `Card ${currentIdx + 1}`]: val }));
    if (currentIdx < deck.cards.length - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      soundService.playFanfare();
      fireBurst(4500);
      setFinished(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-2 w-full">
      {!envelopeOpen ? (
        <EnvelopeView
          deck={deck}
          onOpen={() => {
            setEnvelopeOpen(true);
            fireBurst(3500);
          }}
        />
      ) : (
        <div className="w-full max-w-md space-y-4">
          {!finished && card ? (
            <InteractiveCard
              deck={deck}
              theme={theme}
              index={currentIdx}
              card={card}
              onAnswer={answer}
              onRecorded={() => setRecordedAudio(true)}
            />
          ) : (
            <FinaleView
              deck={deck}
              responses={responses}
              customNotes={customNotes}
              setCustomNotes={setCustomNotes}
              recordedAudio={recordedAudio}
              onToast={onToast}
            />
          )}
        </div>
      )}
    </div>
  );
}
