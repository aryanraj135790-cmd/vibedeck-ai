import { useState, useEffect } from "react";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
import { soundService } from "./services/soundService";
import { CardRenderer } from "./components/CardRenderer";
import { generateDeckFromPrompt } from "./services/aiService";

export default function App() {
  const [deck, setDeck] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(
    () => localStorage.getItem("vibedeck_muted") === "true",
  );

  // Initialize mute state from localStorage / soundService on mount
  useEffect(() => {
    const savedMute = localStorage.getItem("vibedeck_muted") === "true";
    if (savedMute) {
      soundService.toggleMute();
    }
  }, []);

  const handleToggleAudio = () => {
    const nextState = soundService.toggleMute();
    setIsMuted(nextState);
    localStorage.setItem("vibedeck_muted", String(nextState));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    soundService.playSuccess();
    setLoading(true);
    try {
      const generatedDeck = await generateDeckFromPrompt(prompt);
      setDeck(generatedDeck);
    } catch (err) {
      console.error("Failed to generate deck:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-4 relative overflow-hidden font-sans">
      {/* Top Header */}
      <header className="w-full max-w-md flex justify-between items-center py-4 mb-6 z-10 border-b border-white/10">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <Sparkles className="w-5 h-5 text-pink-400" />
          <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
            VibeDeck AI
          </span>
        </div>

        {/* Audio Toggle Button */}
        <button
          onClick={handleToggleAudio}
          aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
          className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white transition-all"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-rose-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-pink-400" />
          )}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-md flex-1 flex flex-col items-center justify-center z-10">
        {!deck ? (
          <form
            onSubmit={handleGenerate}
            className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl flex flex-col gap-6"
          >
            <div className="text-center flex flex-col gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                Create Your Vibe Deck
              </h1>
              <p className="text-xs text-slate-400">
                Enter any vibe, date idea, or challenge to build an interactive
                deck.
              </p>
            </div>

            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Cyberpunk late night coffee run..."
              className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:border-pink-500/50 transition-colors"
            />

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 rounded-2xl font-semibold text-sm shadow-lg shadow-pink-500/25 transition-all"
            >
              {loading ? "Generating Magic..." : "Generate Deck ✨"}
            </button>
          </form>
        ) : (
          <CardRenderer deck={deck} onReset={() => setDeck(null)} />
        )}
      </main>
    </div>
  );
}
