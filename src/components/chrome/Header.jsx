import { Layers, Edit3, Eye, Share, Volume2, VolumeX, Share2, RefreshCw, FolderOpen } from "lucide-react";

export function Header({ activeTab, onTab, muted, onToggleMute, savedUrl, saving, onSave }) {
  const tabs = [
    { id: "editor", Icon: Edit3, label: "Studio", activeClass: "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow" },
    { id: "preview", Icon: Eye, label: "Play", activeClass: "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow" },
    { id: "social_exporter", Icon: Share, label: "Social", activeClass: "bg-cyan-600 text-white shadow" },
    { id: "saved", Icon: FolderOpen, label: "Saved", activeClass: "bg-amber-500 text-slate-950 shadow" },
  ];

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 py-2 sm:py-3 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2 cursor-pointer shrink-0" onClick={() => onTab("editor")}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
            <Layers className="w-4 h-4 text-white animate-pulse" />
          </div>
          <span className="font-black text-sm leading-none bg-gradient-to-r from-pink-400 via-rose-300 to-cyan-400 bg-clip-text text-transparent hidden sm:inline">
            VibeDeck 3D
          </span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto nice-scroll">
          <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 backdrop-blur-sm shrink-0">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => onTab(t.id)}
                aria-pressed={activeTab === t.id}
                title={t.label}
                className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 shrink-0 ${
                  activeTab === t.id ? t.activeClass : "text-slate-400 hover:text-white"
                }`}
              >
                <t.Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>
          <button
            onClick={onSave}
            disabled={saving}
            title={savedUrl ? "Update Deck Link" : "Save & Share"}
            className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 active:scale-95 text-white px-2 sm:px-3.5 py-2 rounded-xl text-xs font-black shadow-lg shadow-pink-500/25 flex items-center space-x-1.5 transition disabled:opacity-50 disabled:cursor-wait shrink-0"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{savedUrl ? "Update" : "Save & Share"}</span>
          </button>
          <button
            onClick={onToggleMute}
            className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white shrink-0"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}