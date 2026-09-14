import { Zap } from "lucide-react";

export function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed top-5 right-5 z-50 bg-slate-900/95 text-cyan-300 border border-cyan-500/50 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center space-x-2 animate-[fadeIn_0.3s_ease]">
      <Zap className="w-5 h-5 text-cyan-400 shrink-0" />
      <span className="text-xs font-mono font-bold">{message}</span>
    </div>
  );
}
