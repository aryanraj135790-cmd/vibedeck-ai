import LZString from "lz-string";

const DRAFT_KEY = "vibedeck_draft";

export const shareService = {
  /**
   * Encodes a deck object into a URL-safe compressed hash string.
   */
  encodeDeckToUrl(deck) {
    // Share only the cards. No title, theme, sender, recipient, or phone.
    const cardOnly = { cards: Array.isArray(deck?.cards) ? deck.cards : [] };
    const jsonString = JSON.stringify(cardOnly);
    const compressed = LZString.compressToEncodedURIComponent(jsonString);
    return `${window.location.origin}${window.location.pathname}#deck=${compressed}`;
  },

  /**
   * Reads and decodes a deck object from the current window location hash.
   */
  decodeDeckFromUrl() {
    const hash = window.location.hash;
    if (!hash || !hash.includes("#deck=")) return null;

    try {
      const compressed = hash.replace("#deck=", "");
      const jsonString = LZString.decompressFromEncodedURIComponent(compressed);
      if (!jsonString) return null;
      return JSON.parse(jsonString);
    } catch (err) {
      console.error("[ShareService] Failed to decode deck from URL:", err);
      return null;
    }
  },

  /**
   * Copies text to the clipboard with modern API + legacy fallback.
   */
  async copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.warn("[ShareService] Clipboard API failed, attempting fallback...", err);
      }
    }
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      console.error("[ShareService] Fallback copy failed:", err);
      return false;
    }
  },

  saveDraftToLocalStorage(deck) {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(deck));
      return true;
    } catch (err) {
      console.error("[ShareService] Failed to save draft:", err);
      return false;
    }
  },

  loadDraftFromLocalStorage() {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (err) {
      console.error("[ShareService] Failed to load draft:", err);
      return null;
    }
  },

  clearDraftFromLocalStorage() {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch (err) {
      console.error("[ShareService] Failed to clear draft:", err);
    }
  },
};