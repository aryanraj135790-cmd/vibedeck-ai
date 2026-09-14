import { useRef, useState } from "react";
import { Mic, MicOff, ArrowRight } from "lucide-react";
import { useRunawayButton } from "../../hooks/useRunawayButton";
import { soundService } from "../../services/soundService";

export function RunawayBody({ card, onAnswer }) {
  const containerRef = useRef(null);
  const { noPosition, yesScale, handleEvasion, resetRunaway } = useRunawayButton(containerRef);
  const yesLabel = card.options?.[0] || "YES!";
  const noLabel = card.options?.[1] || "No";
  return (
    <div ref={containerRef} className="flex justify-center items-center space-x-4 relative min-h-[50px]">
      <button
        onClick={() => {
          soundService.playSuccess();
          resetRunaway();
          onAnswer(yesLabel);
        }}
        style={{ transform: `scale(${yesScale})` }}
        className="bg-emerald-500 hover:bg-emerald-400 text-white font-black px-6 py-2.5 rounded-2xl shadow-xl transition active:scale-95 text-xs sm:text-sm z-30"
      >
        <span>{yesLabel}</span>
      </button>
      <button
        onMouseEnter={handleEvasion}
        onTouchStart={handleEvasion}
        onClick={handleEvasion}
        style={{ transform: `translate(${noPosition.x}px, ${noPosition.y}px)`, transition: "transform 0.15s ease-out" }}
        className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-5 py-2.5 rounded-2xl shadow-xl text-xs sm:text-sm border border-rose-300/40 cursor-pointer select-none"
      >
        <span>{noLabel}</span>
      </button>
    </div>
  );
}

export function OptionsBody({ card, onAnswer }) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {(card.options || []).map((opt, i) => (
        <button
          key={i}
          onClick={() => onAnswer(opt)}
          className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-2.5 px-4 rounded-xl border border-white/30 shadow transition transform active:scale-95 text-xs sm:text-sm text-center"
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function SliderBody({ onAnswer }) {
  const [val, setVal] = useState(100);
  return (
    <div className="bg-slate-950/40 backdrop-blur-md p-4 rounded-2xl border border-white/20 space-y-3 text-center">
      <p className="text-xs text-white font-bold">{val}% Vibe</p>
      <input
        type="range"
        min="0"
        max="100"
        value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        className="w-full accent-pink-500"
      />
      <button
        onClick={() => onAnswer(`${val}% Love`)}
        className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2 rounded-xl text-xs shadow-md"
      >
        Transmit Vibe Rating 💕
      </button>
    </div>
  );
}

export function VoiceBody({ onAnswer, onRecorded }) {
  const [recording, setRecording] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <div className="bg-slate-950/50 backdrop-blur-md p-4 rounded-2xl border border-white/20 space-y-3 text-center">
      <button
        onClick={() => {
          if (recording) {
            soundService.playSuccess();
            setDone(true);
            onRecorded();
          } else {
            soundService.playCyberBeep();
          }
          setRecording((r) => !r);
        }}
        className={`w-full font-bold py-2.5 px-4 rounded-xl border transition text-xs flex items-center justify-center space-x-2 ${
          recording ? "bg-rose-600 text-white border-rose-400 animate-pulse" : "bg-pink-600/40 text-white border-pink-400/50"
        }`}
      >
        {recording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        <span>{recording ? "Stop Voice Recording..." : "Tap & Speak Voice Note"}</span>
      </button>
      {done && (
        <button
          onClick={() => onAnswer("Voice Note Recorded 🎙️")}
          className="w-full bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs shadow-md"
        >
          Attach Voice Note & Proceed ➔
        </button>
      )}
    </div>
  );
}

export function TextBody({ onAnswer }) {
  const [text, setText] = useState("");
  return (
    <div className="space-y-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your response memory here..."
        className="w-full bg-slate-950/50 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
      />
      <button
        onClick={() => onAnswer(text.trim() || "No response")}
        className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2 rounded-xl text-xs shadow-md"
      >
        Send Answer & Next ➔
      </button>
    </div>
  );
}

export function NextBody({ onAnswer }) {
  return (
    <button
      onClick={() => onAnswer("Completed Step")}
      className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold py-3 px-4 rounded-2xl shadow-xl transition text-xs sm:text-sm flex items-center justify-center space-x-2"
    >
      <span>Proceed Next</span>
      <ArrowRight className="w-4 h-4" />
    </button>
  );
}
