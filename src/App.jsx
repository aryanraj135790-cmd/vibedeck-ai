import { useRef } from "react";
import { Heart, Sparkles } from "lucide-react";
import { useRunawayButton } from "./hooks/useRunawayButton";

export default function App() {
  const containerRef = useRef(null);
  const { yesScale, noPosition, evasionCount, handleEvasion } =
    useRunawayButton(containerRef);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/20 blur-3xl rounded-full pointer-events-none" />

      <div
        ref={containerRef}
        className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center shadow-2xl flex flex-col items-center min-h-105 justify-between"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-pink-500/20 rounded-2xl text-pink-400">
            <Heart className="w-8 h-8 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Will you go on a romantic getaway with me?
          </h1>
          <p className="text-slate-400 text-sm">
            Choose carefully... (Hint: You can't say no!)
          </p>
        </div>

        <div className="relative w-full h-32 flex items-center justify-center gap-4">
          <button
            style={{ transform: `scale(${yesScale})` }}
            onClick={() => alert("Woohoo! Best decision ever! 💖")}
            className="z-20 px-6 py-3 bg-linear-to-r from-pink-500 to-rose-500 rounded-full font-semibold shadow-lg shadow-pink-500/30 transition-transform duration-200 hover:brightness-110 active:scale-95"
          >
            YES! 💖
          </button>

          <button
            onMouseEnter={handleEvasion}
            onTouchStart={handleEvasion}
            style={{
              transform: `translate(${noPosition.x}px, ${noPosition.y}px)`,
              transition: "transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
            className="z-10 px-6 py-3 bg-slate-800 border border-slate-700 rounded-full text-slate-300 font-medium hover:bg-slate-700 select-none"
          >
            {evasionCount > 3 ? "Nice try! 😉" : "No 💔"}
          </button>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-pink-400" /> Powered by VibeDeck AI
        </div>
      </div>
    </div>
  );
}
