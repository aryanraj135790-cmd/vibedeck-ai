import { useState } from "react";
import { Wand2, Loader2 } from "lucide-react";
import { generateDeckFromPrompt } from "./services/aiService";
import { CardRenderer } from "./components/CardRenderer";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedDeck, setGeneratedDeck] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const deckData = await generateDeckFromPrompt(prompt);
      setGeneratedDeck(deckData);
    } catch (err) {
      setError(err.message || "Failed to generate deck.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/20 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center gap-6">
        {/* Input Form (hidden when playing a deck) */}
        {!generatedDeck && (
          <form
            onSubmit={handleGenerate}
            className="w-full flex gap-2 bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-2xl shadow-xl"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Flirty coffee date invite for Sarah..."
              className="flex-1 bg-transparent px-4 py-2 text-sm text-white focus:outline-none placeholder:text-slate-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl font-medium text-sm flex items-center gap-2 hover:brightness-110 disabled:opacity-50 transition-all"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
              Generate Deck
            </button>
          </form>
        )}

        {error && (
          <div className="w-full p-4 bg-rose-500/20 border border-rose-500/40 rounded-2xl text-rose-300 text-xs text-center">
            {error}
          </div>
        )}

        {/* Display Interactive Deck */}
        {generatedDeck && (
          <CardRenderer
            deck={generatedDeck}
            onReset={() => setGeneratedDeck(null)}
          />
        )}
      </div>
    </div>
  );
}
