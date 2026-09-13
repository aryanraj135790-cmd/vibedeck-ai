import LZString from "lz-string";

export const shareService = {
  /**
   * Encodes a deck object into a URL-safe compressed hash string.
   */
  encodeDeckToUrl(deck) {
    const jsonString = JSON.stringify(deck);
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
    // Strategy 1: Modern Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.warn("[ShareService] Clipboard API failed, attempting fallback...", err);
      }
    }

    // Strategy 2: ExecCommand fallback (works on HTTP & local dev servers)
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
  }
};