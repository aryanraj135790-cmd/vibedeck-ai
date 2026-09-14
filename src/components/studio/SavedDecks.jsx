import { useMemo, useState } from "react";
import { Bookmark, Copy, FolderOpen, Pencil, Play, Trash2 } from "lucide-react";
import { libraryService } from "../../services/libraryService";
import { shareService } from "../../services/shareService";
import { soundService } from "../../services/soundService";

export function SavedDecks({ onLoad, onPlay, onToast }) {
  const [items, setItems] = useState(() => libraryService.list());
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const refresh = () => setItems(libraryService.list());
  const count = useMemo(() => items.length, [items]);

  const openDeck = (entry) => {
    soundService.playSuccess();
    onLoad(entry.deck);
    onToast(`Loaded "${entry.name}".`);
  };

  const duplicate = (entry) => {
    soundService.playPop();
    libraryService.save(`${entry.name} (copy)`, entry.deck);
    refresh();
    onToast("Duplicated to library.");
  };

  const share = async (entry) => {
    soundService.playCyberBeep();
    try {
      const url = shareService.encodeDeckToUrl(entry.deck);
      const ok = await shareService.copyToClipboard(url);
      onToast(ok ? "Share link copied." : "Copy blocked — link placed in the address bar.");
      if (!ok) window.history.replaceState(null, "", url.slice(url.indexOf("#")));
    } catch {
      onToast("Could not build a share link.");
    }
  };

  const remove = (id) => {
    libraryService.remove(id);
    refresh();
    onToast("Deleted from library.");
  };

  const commitRename = (id) => {
    const entry = libraryService.get(id);
    if (entry) libraryService.update(id, editName || entry.name, entry.deck);
    setEditingId(null);
    refresh();
  };

  if (!count) {
    return (
      <div className="max-w-xl mx-auto text-center bg-slate-900/70 border border-slate-800 rounded-3xl p-10 space-y-3">
        <FolderOpen className="w-10 h-10 text-slate-600 mx-auto" />
        <h2 className="text-lg font-black text-white">No saved decks yet</h2>
        <p className="text-xs text-slate-400">
          Build something in the Studio, then hit <span className="text-pink-300 font-bold">Save & Share</span> in
          the header — it lands here instantly, even offline.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <p className="text-xs font-mono text-slate-400 mb-3">
        {count} saved deck{count === 1 ? "" : "s"} — stored on this device
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((entry) => (
          <div
            key={entry.id}
            className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-2 hover:border-pink-500/50 transition"
          >
            {editingId === entry.id ? (
              <div className="flex gap-1.5">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && commitRename(entry.id)}
                  autoFocus
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-pink-500"
                />
                <button
                  onClick={() => commitRename(entry.id)}
                  className="text-xs font-bold text-emerald-400 px-2"
                >
                  Save
                </button>
              </div>
            ) : (
              <h3 className="text-sm font-bold text-white truncate flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                {entry.name}
              </h3>
            )}
            <p className="text-[11px] text-slate-500 font-mono">
              {entry.deck?.cards?.length || 0} cards • {new Date(entry.savedAt).toLocaleString()}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                onClick={() => onPlay(entry)}
                className="flex-1 min-w-[72px] bg-gradient-to-r from-pink-600 to-purple-600 text-white text-[11px] font-bold py-1.5 rounded-lg flex items-center justify-center gap-1"
              >
                <Play className="w-3 h-3" /> Play
              </button>
              <button
                onClick={() => openDeck(entry)}
                className="flex-1 min-w-[72px] bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold py-1.5 rounded-lg flex items-center justify-center gap-1"
              >
                Edit
              </button>
              <button
                onClick={() => share(entry)}
                title="Copy share link"
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-1.5 rounded-lg"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setEditingId(entry.id);
                  setEditName(entry.name);
                }}
                title="Rename"
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-1.5 rounded-lg"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => duplicate(entry)}
                title="Duplicate"
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-1.5 rounded-lg"
              >
                <Copy className="w-3.5 h-3.5 opacity-60" />
              </button>
              <button
                onClick={() => remove(entry.id)}
                title="Delete"
                className="bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 p-1.5 rounded-lg"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
