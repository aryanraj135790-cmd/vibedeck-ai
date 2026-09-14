import { PartyPopper, MessageCircle, Send, Smartphone } from "lucide-react";
import { dispatchResponse } from "../../services/dispatchService";
import { soundService } from "../../services/soundService";

export function FinaleView({ deck, responses, customNotes, setCustomNotes, recordedAudio, onToast }) {
  const args = {
    senderName: deck.senderName || "Someone",
    recipientName: deck.recipientName || "Someone Special",
    responses,
    customNotes,
    recordedAudio,
    phoneNum: deck.phoneNum || "",
  };
  const send = (method) => {
    soundService.playCyberBeep();
    dispatchResponse(method, args);
    onToast(`Opening ${method}...`);
  };
  return (
    <div className="w-full max-w-md bg-slate-900/80 p-6 rounded-3xl border border-slate-700 shadow-2xl space-y-4 text-center backdrop-blur-xl">
      <div className="space-y-1">
        <div className="w-16 h-16 bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto text-white shadow-lg">
          <PartyPopper className="w-8 h-8 animate-bounce" />
        </div>
        <h2 className="text-2xl font-black text-white">Deck Completed!</h2>
        <p className="text-xs text-slate-400">
          Your answers are compiled and ready to dispatch to {deck.senderName || "the sender"}!
        </p>
      </div>
      <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 text-left space-y-2 max-h-40 overflow-y-auto">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 block mb-1">
          Response Payload:
        </span>
        {Object.entries(responses).map(([q, a], idx) => (
          <div key={idx} className="text-xs border-b border-slate-800/80 pb-1.5">
            <span className="text-slate-400 block font-medium">{q}</span>
            <span className="text-pink-300 font-bold">Answer: {a}</span>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={customNotes}
        onChange={(e) => setCustomNotes(e.target.value)}
        placeholder="Add a final message to sender (optional)..."
        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
      />
      <div className="space-y-2">
        <button
          onClick={() => send("whatsapp")}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2.5 px-4 rounded-2xl shadow-lg transition flex items-center justify-center space-x-2 text-xs sm:text-sm"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Dispatch via WhatsApp</span>
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => send("telegram")}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-3 rounded-xl shadow transition flex items-center justify-center space-x-1.5 text-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Telegram</span>
          </button>
          <button
            onClick={() => send("sms")}
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-3 rounded-xl shadow transition flex items-center justify-center space-x-1.5 text-xs"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>SMS</span>
          </button>
        </div>
      </div>
    </div>
  );
}
