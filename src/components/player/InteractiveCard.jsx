import { useTilt } from "../../hooks/useTilt";
import {
  RunawayBody,
  OptionsBody,
  SliderBody,
  VoiceBody,
  TextBody,
  NextBody,
} from "./InteractionBodies";

export function InteractiveCard({ deck, theme, index, card, onAnswer, onRecorded }) {
  const { tiltStyle, tiltHandlers } = useTilt();
  return (
    <div
      {...tiltHandlers}
      style={tiltStyle}
      className={`w-full aspect-[4/5] rounded-3xl bg-gradient-to-br ${theme.gradient} p-6 sm:p-8 shadow-2xl ${theme.glow} flex flex-col justify-between relative overflow-hidden border border-white/20 backdrop-blur-md`}
    >
      <div className="absolute inset-0 bg-slate-950/25 backdrop-blur-[2px] pointer-events-none" />
      <div className="relative z-10 flex justify-between items-center">
        <span className="bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full uppercase tracking-widest font-mono font-bold">
          Card {index + 1} of {deck.cards.length}
        </span>
        <span className="text-xs font-bold text-white">For {deck.recipientName || "Someone"}</span>
      </div>
      {card.mediaUrl && (
        <div className="relative z-10 my-2 flex justify-center">
          <img
            src={card.mediaUrl}
            alt="Media GIF"
            className="h-32 object-contain rounded-2xl shadow-xl border border-white/20"
          />
        </div>
      )}
      <div className="relative z-10 my-auto bg-slate-950/40 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-white space-y-1.5 shadow-xl">
        <h3 className="text-lg sm:text-xl font-black text-amber-200 leading-tight">
          {card.question}
        </h3>
        <p className="text-xs sm:text-sm leading-relaxed text-slate-100/90 whitespace-pre-line">
          {card.subtitle}
        </p>
      </div>
      <div className="relative z-20 my-2 space-y-3">
        {card.type === "runaway" && <RunawayBody card={card} onAnswer={onAnswer} />}
        {card.type === "options" && <OptionsBody card={card} onAnswer={onAnswer} />}
        {card.type === "slider" && <SliderBody onAnswer={onAnswer} />}
        {card.type === "voice" && <VoiceBody onAnswer={onAnswer} onRecorded={onRecorded} />}
        {card.type === "text" && <TextBody onAnswer={onAnswer} />}
        {card.type === "next" && <NextBody onAnswer={onAnswer} />}
      </div>
    </div>
  );
}
