import { Gift, Lock } from "lucide-react";
import { soundService } from "../../services/soundService";

export function EnvelopeView({ deck, onOpen }) {
  const open = () => {
    soundService.playFanfare();
    onOpen();
  };
  return (
    <div
      onClick={open}
      className="w-full max-w-md aspect-[4/3] bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-2 border-pink-500/50 rounded-3xl p-8 shadow-2xl flex flex-col justify-between items-center cursor-pointer transform hover:scale-105 transition duration-300 relative overflow-hidden group backdrop-blur-xl"
    >
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-500 text-white flex items-center justify-center shadow-xl group-hover:rotate-12 transition">
        <Gift className="w-10 h-10 animate-bounce" />
      </div>
      <div className="text-center space-y-1">
        <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-bold">
          Unseal Hologram Envelope
        </span>
        <h2 className="text-3xl font-extrabold text-white">{deck.recipientName || "Someone Special"}</h2>
        <p className="text-xs text-slate-400 font-medium pt-1">Tap envelope to open 3D multi-card deck</p>
      </div>
      <div className="text-xs text-slate-400 font-mono font-semibold flex items-center space-x-1">
        <Lock className="w-3.5 h-3.5 text-pink-400" />
        <span>From {deck.senderName || "a friend"} ({deck.cards.length} Interactive Slides)</span>
      </div>
    </div>
  );
}
