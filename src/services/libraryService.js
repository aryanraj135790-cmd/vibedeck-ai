const LIB_KEY = "vibedeck_saved_decks_v1";
const MAX_SAVED = 24;

function readAll() {
  try {
    const raw = localStorage.getItem(LIB_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function writeAll(list) {
  try {
    localStorage.setItem(LIB_KEY, JSON.stringify(list.slice(0, MAX_SAVED)));
    return true;
  } catch {
    return false;
  }
}

export const libraryService = {
  list() {
    return readAll().sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));
  },
  save(name, deck) {
    const list = readAll();
    const id = `deck_${Date.now().toString(36)}${Math.floor(Math.random() * 999)}`;
    const entry = {
      id,
      name: name?.trim() || `${deck?.recipientName || "Untitled"} • ${new Date().toLocaleDateString()}`,
      savedAt: Date.now(),
      deck: JSON.parse(JSON.stringify(deck)),
    };
    writeAll([entry, ...list]);
    return entry;
  },
  update(id, name, deck) {
    const list = readAll();
    const next = list.map((e) =>
      e.id === id
        ? { ...e, name: name?.trim() || e.name, savedAt: Date.now(), deck: JSON.parse(JSON.stringify(deck)) }
        : e
    );
    writeAll(next);
    return next.find((e) => e.id === id) || null;
  },
  remove(id) {
    writeAll(readAll().filter((e) => e.id !== id));
  },
  get(id) {
    return readAll().find((e) => e.id === id) || null;
  },
  clear() {
    try {
      localStorage.removeItem(LIB_KEY);
    } catch { /* ignore */ }
  },
};
