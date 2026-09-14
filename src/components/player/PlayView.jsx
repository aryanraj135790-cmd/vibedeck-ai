import { CardRenderer } from "./CardRenderer";

export function PlayView({ deck, theme, envelopeKey, onToast, onBurst }) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-2 w-full">
      <CardRenderer
        key={envelopeKey}
        deck={deck}
        theme={theme}
        onToast={onToast}
        onBurst={onBurst}
      />
      <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 text-[10px] text-slate-600/80 font-mono tracking-widest uppercase select-none pointer-events-none">
        Powered by VibeDeck AI
      </div>
    </div>
  );
}
