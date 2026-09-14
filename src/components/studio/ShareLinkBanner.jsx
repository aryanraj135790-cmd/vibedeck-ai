import { useEffect, useState } from "react";
import { Check, Copy, Zap } from "lucide-react";
import { shareService } from "../../services/shareService";
import { soundService } from "../../services/soundService";

const BANNER_TTL_MS = 60_000; // auto-dismiss after 1 minute

export function ShareLinkBanner({ savedUrl, onToast }) {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!savedUrl) return;
    const id = setTimeout(() => setVisible(false), BANNER_TTL_MS);
    return () => clearTimeout(id);
  }, [savedUrl]);

  if (!savedUrl || !visible) return null;

  const copy = async (text) => {
    soundService.playTick();
    const ok = await shareService.copyToClipboard(text);
    if (!ok) return onToast("Copy failed — select and copy manually from the field below.");
    setCopied(true);
    onToast("Deck link copied to clipboard.");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full bg-gradient-to-r from-cyan-600/20 via-pink-600/20 to-purple-600/20 border border-cyan-500/40 rounded-3xl p-5 shadow-2xl backdrop-blur-xl space-y-3 animate-[fadeIn_0.4s_ease]">
      <div className="flex items-center justify-between">
        <span className="flex items-center space-x-2 text-xs font-mono font-bold text-cyan-300">
          <Zap className="w-4 h-4 text-pink-400 animate-pulse" />
          <span>Deck Share Link Active</span>
        </span>
        <button
          onClick={() => setVisible(false)}
          className="text-[10px] text-slate-400 hover:text-white underline underline-offset-2"
        >
          dismiss
        </button>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          readOnly
          value={savedUrl}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 w-full focus:outline-none focus:border-cyan-500 font-mono"
        />
        <button
          onClick={() => copy(savedUrl)}
          className="shrink-0 bg-cyan-600 hover:bg-cyan-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <button
        onClick={() => copy(`I made you an interactive card deck! Tap to open it: ${savedUrl}`)}
        className="text-[11px] text-pink-300 hover:text-pink-200 underline underline-offset-2"
      >
        Copy with a friendly message
      </button>
    </div>
  );
}