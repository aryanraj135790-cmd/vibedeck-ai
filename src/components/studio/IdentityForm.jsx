import { Activity, Smartphone } from "lucide-react";

export function IdentityForm({ deck, setDeck }) {
  return (
    <div className="space-y-3 pb-4 border-b border-slate-800">
      <label className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center space-x-1">
        <Activity className="w-3.5 h-3.5" />
        <span>1. Sender & Recipient Identity</span>
      </label>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-[11px] text-slate-400 block mb-1">To (Recipient):</span>
          <input
            type="text"
            value={deck.recipientName || ""}
            onChange={(e) => setDeck((p) => ({ ...p, recipientName: e.target.value }))}
            placeholder="Alex"
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <span className="text-[11px] text-slate-400 block mb-1">From (Your Name):</span>
          <input
            type="text"
            value={deck.senderName || ""}
            onChange={(e) => setDeck((p) => ({ ...p, senderName: e.target.value }))}
            placeholder="Taylor"
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>
      <div>
        <span className="text-[11px] text-slate-400 block mb-1">
          Creator Phone / WhatsApp (To Receive Direct Responses):
        </span>
        <div className="relative">
          <Smartphone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={deck.phoneNum || ""}
            onChange={(e) => setDeck((p) => ({ ...p, phoneNum: e.target.value }))}
            placeholder="e.g. +14155552671"
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>
    </div>
  );
}
