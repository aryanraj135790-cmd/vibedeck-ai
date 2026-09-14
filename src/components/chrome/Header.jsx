import { Layers, Edit3, Eye, Share, Volume2, VolumeX, Share2, RefreshCw, FolderOpen } from "lucide-react";

export function Header({ activeTab, onTab, muted, onToggleMute, savedUrl, saving, onSave }) {
  const tabBtn = (id, Icon, label, activeClass) => (
    <button
      key={id}
      onClick={() => onTab(id)}
      aria-pressed={activeTab === id}
      title={label}
      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 ${
        activeTab === id
          ? activeClass
          : "text-slate-400 hover:text-white"
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTab("editor")}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
            <Layers className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="font-black text-lg leading-none bg-gradient-to-r from-pink-400 via-rose-300 to-cyan-400 bg-clip-text text-transparent">
              JOY CRAFT 3D
            </h1>
            <span className="text-[10px] font-mono text-cyan-400/80 tracking-widest uppercase">
              Cyber Deck & Social Card Studio
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 backdrop-blur-sm">
            {tabBtn("editor", Edit3, "Studio", "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow")}
            {tabBtn("preview", Eye, "Play Deck", "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow")}
            {tabBtn("social_exporter", Share, "Social Card", "bg-cyan-600 text-white shadow")}
            {tabBtn("saved", FolderOpen, "Saved", "bg-amber-500 text-slate-950 shadow")}
          </div>
          <button
            onClick={onSave}
            disabled={saving}
            title={savedUrl ? "Save changes & copy fresh link" : "Save deck & copy share link"}
            className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 active:scale-95 text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-lg shadow-pink-500/25 flex items-center space-x-1.5 transition disabled:opacity-50 disabled:cursor-wait"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
            <span>{savedUrl ? "Update Deck Link" : "Save & Share"}</span>
          </button>
          <button
            onClick={onToggleMute}
            className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
