import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getTheme } from "../data/themes";
import { createDefaultDeck, normalizeDeck } from "../data/defaults";
import { generateDeckFromPrompt } from "../services/aiService";
import { rewriteDeckCopy } from "../services/aiService";
import { shareService } from "../services/shareService";
import { libraryService } from "../services/libraryService";
import { soundService } from "../services/soundService";

export function useApp() {
  const [activeTab, setActiveTab] = useState("editor");
  const [deck, setDeck] = useState(() => {
    try {
      return normalizeDeck(shareService.loadDraftFromLocalStorage() || createDefaultDeck());
    } catch {
      return createDefaultDeck();
    }
  });
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [rewriting, setRewriting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [savedUrl, setSavedUrl] = useState("");
  const [envelopeKey, setEnvelopeKey] = useState(0);
  const [burst, setBurst] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [muted, setMuted] = useState(() => localStorage.getItem("vibedeck_muted") === "true");
  const toastTimer = useRef(null);

  const theme = useMemo(() => getTheme(deck.themeId), [deck.themeId]);
  const deckWithTheme = useMemo(() => ({ ...deck, themeObj: theme }), [deck, theme]);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(""), 3500);
  }, []);
  useEffect(() => {
    if (localStorage.getItem("vibedeck_muted") === "true" && !soundService.getIsMuted()) {
      soundService.toggleMute();
    }
  }, []);

  useEffect(() => {
    shareService.saveDraftToLocalStorage(deck);
  }, [deck]);

  useEffect(() => {
    const shared = shareService.decodeDeckFromUrl();
    if (!shared) return;
    Promise.resolve().then(() => {
      try {
        setDeck(normalizeDeck(shared));
        setActiveTab("view");
        setEnvelopeKey((k) => k + 1);
        showToast("Deck loaded from share link.");
      } catch {
        showToast("Could not load shared deck.");
      }
    });
  }, [showToast]);
  const handleTab = useCallback((id) => {
    soundService.playTick();
    if (id === "preview") setEnvelopeKey((k) => k + 1);
    setActiveTab(id);
  }, []);

  const toggleMute = useCallback(() => {
    const next = soundService.toggleMute();
    setMuted(next);
    localStorage.setItem("vibedeck_muted", String(next));
  }, []);

  const handleSaveShare = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      const name = `${deck.recipientName || "Untitled deck"} • ${new Date().toLocaleString()}`;
      libraryService.save(name, deck);
      setRefreshKey((k) => k + 1);
      const url = shareService.encodeDeckToUrl(deck);
      window.history.replaceState(null, "", url.slice(url.indexOf("#")));
      setSavedUrl(url);
      const ok = await shareService.copyToClipboard(url);
      soundService.playSuccess();
      showToast(ok ? "Saved! Share link copied." : "Saved! Copy the link from the banner below.");
    } catch (err) {
      console.error("[Save&Share] failed:", err);
      showToast("Save failed — try removing an uploaded image.");
    } finally {
      setSaving(false);
    }
  }, [deck, saving, showToast]);

  const handleLoadSaved = useCallback((savedDeck) => {
    setDeck(normalizeDeck(savedDeck));
    setSavedUrl("");
    window.history.replaceState(null, "", window.location.pathname);
    setEnvelopeKey((k) => k + 1);
    setActiveTab("editor");
  }, []);

  const handlePlaySaved = useCallback((savedDeck) => {
    setDeck(normalizeDeck(savedDeck));
    setSavedUrl("");
    window.history.replaceState(null, "", window.location.pathname);
    setEnvelopeKey((k) => k + 1);
    setActiveTab("preview");
  }, []);

  const handleGenerate = useCallback(
    async (e) => {
      e.preventDefault();
      if (!prompt.trim() || loading) return;
      setLoading(true);
      try {
        const generated = await generateDeckFromPrompt(prompt);
        setDeck(normalizeDeck(generated));
        setEnvelopeKey((k) => k + 1);
        setActiveTab("view");
        window.history.replaceState(null, "", window.location.pathname);
        showToast("AI deck generated — test play it.");
      } catch (err) {
        console.error("AI generate failed:", err);
        showToast("AI generation failed — studio draft kept.");
      } finally {
        setLoading(false);
      }
    },
    [prompt, loading, showToast]
  );

  const handleRewrite = useCallback(
    async (deck, tone, tweak) => {
      if (rewriting) return;
      setRewriting(true);
      try {
        const rewritten = await rewriteDeckCopy(deck, tone, tweak || "");
        setDeck(rewritten);
        setEnvelopeKey((k) => k + 1);
        showToast(`Rewritten in ${tone} tone.`);
      } catch (err) {
        console.error("AI rewrite failed:", err);
        showToast("AI rewrite failed — deck kept as is.");
      } finally {
        setRewriting(false);
      }
    },
    [rewriting, setDeck, showToast]
  );

  return {
    activeTab,
    deck,
    deckWithTheme,
    setDeck,
    prompt,
    setPrompt,
    loading,
    saving,
    refreshKey,
    savedUrl,
    envelopeKey,
    burst,
    setBurst,
    toastMessage,
    muted,
    theme,
    showToast,
    handleTab,
    toggleMute,
    handleSaveShare,
    handleLoadSaved,
    handlePlaySaved,
    handleGenerate,
    handleRewrite,
  };
}