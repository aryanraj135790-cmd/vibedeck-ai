import { useState } from "react";
import { Layers, Edit3, Eye, Share, Volume2, VolumeX, Share2, RefreshCw, FolderOpen, Menu, X } from "lucide-react";

export function Header({ activeTab, onTab, muted, onToggleMute, savedUrl, saving, onSave }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const tabs = [
    { id: "editor", Icon: Edit3, label: "Studio", activeClass: "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow" },
    { id: "preview", Icon: Eye, label: "Play Deck", activeClass: "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow" },
    { id: "social_exporter", Icon: Share, label: "Social Card", activeClass: "bg-cyan-600 text-white shadow" },
    { id: "saved", Icon: FolderOpen, label: "Saved", activeClass: "bg-amber-500 text-slate-950 shadow" },
  ];

  const handleTab = (id) => {
    onTab(id);
    setMenuOpen(false);
  };

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer shrink-0" onClick={() => onTab("editor")}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-pulse" />
            </div>
            <div className="hidden xxs:block">
              <h1 className="font-black text-sm sm:text-lg leading-none bg-gradient-to-r from-pink-400 via-rose-300 to-cyan-400 bg-clip-text text-transparent">
                VibeDeck 3D
              </h1>
              <span className="text-[8px] sm:text-[10px] font-mono text-cyan-400/80 tracking-widest uppercase hidden sm:inline">
                Cyber Deck & Social Card Studio
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 backdrop-blur-sm">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onTab(t.id)}
                  aria-pressed={activeTab === t.id}
                  title={t.label}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 ${
                    activeTab === t.id ? t.activeClass : "text-slate-400 hover:text-white"
                  }`}
                >
                  <t.Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              ))}
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

          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={onSave}
              disabled={saving}
              title={savedUrl ? "Update Deck Link" : "Save & Share"}
              className="w-9 h-9 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/25 disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onToggleMute}
              className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white"
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white"
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden mt-2 pb-2 border-t border-slate-800 pt-2 animate-[fadeIn_0.2s_ease]">
            <div className="grid grid-cols-2 gap-2">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleTab(t.id)}
                  aria-pressed={activeTab === t.id}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 ${
                    activeTab === t.id ? t.activeClass : "bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-white"
                  }`}
                >
                  <t.Icon className="w-4 h-4" />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}