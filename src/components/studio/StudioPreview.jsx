import { Sparkles, Play, Radio, ArrowRight, Lock } from "lucide-react";
import { useTilt } from "../../hooks/useTilt";

export function StudioPreview({ deck, cards, selectedCardIdx, onPreview }) {
  const { tiltStyle, tiltHandlers } = useTilt();
  const theme = deck.themeObj;
  const activeCard = cards[selectedCardIdx] || cards[0] || {};
  return (
    <div className="lg:col-span-6 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-3 px-2">
        <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>3D Interactive Preview</span>
        </span>
        <span className="text-xs text-pink-400 font-mono">
          Card {selectedCardIdx + 1} / {cards.length}
        </span>
      </div>
      <div
        {...tiltHandlers}
        style={tiltStyle}
        className={`w-full max-w-md aspect-[4/5] rounded-3xl bg-gradient-to-br ${theme.gradient} p-6 sm:p-7 shadow-2xl ${theme.glow} relative flex flex-col justify-between overflow-hidden border border-white/20 backdrop-blur-md`}
      >
        <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-[2px] pointer-events-none" />
        <div className="relative z-10 flex justify-between items-center">
          <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-mono px-3 py-1 rounded-full uppercase tracking-widest font-bold border border-white/30">
            Step {selectedCardIdx + 1} of {cards.length}
          </span>
          <span className="text-xs font-bold text-white/90">For {deck.recipientName || "Them"}</span>
        </div>
        {activeCard.mediaUrl && (
          <div className="relative z-10 my-2 flex justify-center">
            <img
              src={activeCard.mediaUrl}
              alt="Card Header"
              className="h-28 sm:h-32 object-contain rounded-2xl shadow-xl border border-white/20"
            />
          </div>
        )}
        <div className="relative z-10 my-auto bg-slate-950/40 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-white space-y-1 shadow-xl">
          <h3 className="text-base sm:text-lg font-black text-amber-200 leading-tight">
            {activeCard.question}
          </h3>
          <p className="text-xs leading-relaxed text-slate-100/90">{activeCard.subtitle}</p>
        </div>
        <div className="relative z-20 my-2 space-y-2">
          {(activeCard.type === "runaway") && (
            <div className="flex justify-center items-center space-x-3">
              <span className="bg-emerald-500 text-white font-bold px-5 py-2 rounded-2xl shadow-lg text-xs">
                {(activeCard.options || [])[0] || "YES!"}
              </span>
              <span className="bg-rose-500/80 text-white font-bold px-4 py-2 rounded-2xl shadow-lg text-xs">
                {(activeCard.options || [])[1] || "No"}
              </span>
            </div>
          )}
          {activeCard.type === "options" && (
            <div className="grid grid-cols-2 gap-2">
              {(activeCard.options || []).map((opt, i) => (
                <span
                  key={i}
                  className="bg-white/20 text-white font-bold py-2 px-3 rounded-xl border border-white/30 text-xs truncate text-center"
                >
                  {opt}
                </span>
              ))}
            </div>
          )}
          {activeCard.type === "slider" && (
            <div className="space-y-1 bg-slate-950/30 p-3 rounded-xl border border-white/20 text-center">
              <span className="text-xs text-white font-bold">Slide Love Level: 100% 💕</span>
              <input type="range" min="0" max="100" defaultValue="100" className="w-full accent-pink-500" readOnly />
            </div>
          )}
          {activeCard.type === "voice" && (
            <div className="bg-slate-950/40 p-3 rounded-xl border border-white/20 flex items-center justify-between text-white text-xs">
              <span className="flex items-center space-x-1 font-mono">
                <Radio className="w-4 h-4 text-pink-400 animate-pulse" />
                <span>Record Voice Note</span>
              </span>
              <span className="bg-pink-500/30 px-2 py-0.5 rounded text-[10px] font-bold">HOLD MIC</span>
            </div>
          )}
          {activeCard.type === "password" && (
            <div className="bg-slate-950/40 p-3 rounded-xl border border-white/20 flex items-center justify-between text-white text-xs">
              <span className="flex items-center space-x-1 font-mono">
                <Lock className="w-4 h-4 text-pink-400" />
                <span>Secret code: {activeCard.options?.[0] ? "•".repeat(Math.min(activeCard.options[0].length, 10)) : "(not set)"}</span>
              </span>
              <span className="bg-pink-500/30 px-2 py-0.5 rounded text-[10px] font-bold">LOCKED</span>
            </div>
          )}
          {activeCard.type === "text" && (
            <div className="space-y-1">
              <input
                type="text"
                placeholder="Recipient types open response..."
                readOnly
                className="w-full bg-slate-950/50 border border-white/20 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          )}
          {activeCard.type === "next" && (
            <button className="w-full bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1">
              <span>Continue Deck</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="relative z-10 border-t border-white/20 pt-2 flex justify-between items-center text-white">
          <span className="text-[10px] opacity-80 font-mono uppercase tracking-widest font-semibold">JOY CRAFT 3D</span>
          <span className="text-xs font-bold">— {deck.senderName || "Taylor"}</span>
        </div>
      </div>
      <button
        onClick={onPreview}
        className="mt-4 w-full max-w-md py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-cyan-500 text-sm font-bold text-white flex items-center justify-center gap-2"
      >
        <Play className="w-4 h-4" /> Test Play This Deck
      </button>
    </div>
  );
}
