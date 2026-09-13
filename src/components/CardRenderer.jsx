import { useState, useMemo, useRef } from "react";
import {
  Sparkles,
  ChevronRight,
  RotateCcw,
  Link as LinkIcon,
  Check,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useRunawayButton } from "../hooks/useRunawayButton";
import { soundService } from "../services/soundService";
import { shareService } from "../services/shareService";

export function CardRenderer({ deck, onReset }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [copied, setCopied] = useState(false);

  const celebrate = useMemo(
    () => () => {
      soundService.playSuccess();
      confetti({ particleCount: 120, spread: 75, origin: { y: 0.6 } });
    },
    [],
  );

  // Guard against empty/invalid decks after all hooks have been called.
  if (!deck || !Array.isArray(deck.cards) || deck.cards.length === 0) {
    return <EmptyDeck onReset={onReset} />;
  }

  const currentCard = isComplete ? null : deck.cards[currentIndex];
  const isLastCard = !isComplete && currentIndex === deck.cards.length - 1;

  const handleNext = () => {
    if (isLastCard) {
      setIsComplete(true);
      celebrate();
    } else {
      soundService.playFlip();
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleRunawaySuccess = () => {
    setIsComplete(true);
    celebrate();
  };

  const handleOptionClick = () => {
    soundService.playSuccess();
    handleNext();
  };

  const handleResetClick = () => {
    soundService.playFlip();
    onReset();
  };

  const handleShare = async () => {
    soundService.playFlip();
    try {
      const shareUrl = shareService.encodeDeckToUrl(deck);
      const success = await shareService.copyToClipboard(shareUrl);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        console.error("[CardRenderer] Failed to copy link to clipboard");
      }
    } catch (err) {
      console.error("[CardRenderer] Share failed:", err);
    }
  };

  // ---------- Completion Screen ----------
  if (isComplete) {
    return (
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center shadow-2xl flex flex-col items-center min-h-[440px] justify-between relative">
        <div className="w-full flex justify-between items-center text-xs text-slate-400 font-medium">
          <span className="capitalize text-pink-400 font-semibold">
            {deck.theme || "Vibe"} Deck
          </span>
          <span>Complete ✓</span>
        </div>

        <div className="my-auto w-full py-4 flex flex-col items-center gap-4">
          <span className="text-6xl">💖</span>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            You&apos;re all set!
          </h2>
          <p className="text-slate-400 text-sm max-w-xs">
            {deck.title} — go make it happen!
          </p>
        </div>

        <div className="w-full flex flex-col items-center gap-3">
          <button
            onClick={handleShare}
            className={`w-full py-3 px-4 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              copied
                ? "bg-emerald-600 text-white"
                : "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-500/25"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> Link Copied!
              </>
            ) : (
              <>
                <LinkIcon className="w-4 h-4" /> Share This Deck
              </>
            )}
          </button>

          <button
            onClick={handleResetClick}
            className="px-6 py-2.5 bg-white/5 border border-white/15 hover:bg-white/10 rounded-full font-semibold text-sm text-slate-200 transition-all"
          >
            Start a New Deck
          </button>
        </div>

        <div className="w-full flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-white/10">
          <button
            onClick={handleResetClick}
            className="flex items-center gap-1 hover:text-slate-300 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Create New
          </button>
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-pink-400" /> VibeDeck AI
          </div>
        </div>
      </div>
    );
  }

  // ---------- Active Card Screen ----------
  return (
    <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center shadow-2xl flex flex-col items-center min-h-[440px] justify-between relative">
      {/* Header */}
      <div className="w-full flex justify-between items-center text-xs text-slate-400 font-medium">
        <span className="capitalize text-pink-400 font-semibold">
          {deck.theme || "Vibe"} Deck
        </span>
        <span>
          Card {currentIndex + 1} of {deck.cards.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-2">
        <div
          className="bg-gradient-to-r from-pink-500 to-rose-500 h-full transition-all duration-300 ease-out"
          style={{
            width: `${((currentIndex + 1) / deck.cards.length) * 100}%`,
          }}
        />
      </div>

      {/* Card Body */}
      <div className="my-auto w-full py-4 flex flex-col items-center gap-4">
        <h2 className="text-xl font-bold tracking-tight text-white">
          {currentCard.question || currentCard.title}
        </h2>
        {currentCard.subtitle && currentCard.type !== "reveal" && (
          <p className="text-slate-400 text-sm">{currentCard.subtitle}</p>
        )}

        <div className="w-full mt-4">
          {currentCard.type === "multichoice" && (
            <div className="flex flex-col gap-2 w-full">
              {(currentCard.options?.length
                ? currentCard.options
                : ["Definitely YES! 🌟", "Count me in! 🎉", "Let's do it! 🚀"]
              ).map((option, idx) => (
                <button
                  key={idx}
                  onClick={handleOptionClick}
                  className="w-full py-3 px-4 bg-white/5 border border-white/15 rounded-2xl text-sm font-medium hover:bg-pink-500/20 hover:border-pink-500/50 transition-all text-slate-200 text-left flex justify-between items-center group"
                >
                  {option}
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-pink-400 transition-transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          )}

          {currentCard.type === "slider" && (
            <div className="flex flex-col gap-4 items-center">
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="80"
                onChange={() => soundService.playTick?.()}
                className="w-full accent-pink-500 cursor-pointer h-2"
              />
              <button
                onClick={handleOptionClick}
                className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-full font-semibold text-sm text-white shadow-lg shadow-pink-500/30 transition-all"
              >
                Lock It In! 🎯
              </button>
            </div>
          )}

          {currentCard.type === "reveal" && (
            <RevealCardContent
              subtitle={currentCard.subtitle}
              onComplete={handleNext}
            />
          )}

          {currentCard.type === "runaway" && (
            <RunawayCardContent onSuccess={handleRunawaySuccess} />
          )}

          {/* Fallback for legacy {title, content, actionItem} cards */}
          {!["multichoice", "slider", "reveal", "runaway"].includes(
            currentCard.type,
          ) && (
            <div className="flex flex-col gap-4 text-left">
              {currentCard.content && (
                <p className="text-slate-300 leading-relaxed text-sm">
                  {currentCard.content}
                </p>
              )}
              {currentCard.actionItem && (
                <div className="p-4 bg-pink-950/30 border border-pink-800/40 rounded-xl">
                  <span className="text-xs font-semibold uppercase tracking-wider text-pink-400 block mb-1">
                    Action Item
                  </span>
                  <p className="text-sm text-pink-100">
                    {currentCard.actionItem}
                  </p>
                </div>
              )}
              <button
                onClick={handleOptionClick}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-2xl font-semibold text-sm text-white shadow-lg shadow-pink-500/25 transition-all"
              >
                {isLastCard ? "Finish ✨" : "Next ➜"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="w-full flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-white/10">
        <button
          onClick={handleResetClick}
          className="flex items-center gap-1 hover:text-slate-300 transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Create New
        </button>
        <div className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-pink-400" /> VibeDeck AI
        </div>
      </div>
    </div>
  );
}

// ---------- Empty / fallback state ----------
function EmptyDeck({ onReset }) {
  return (
    <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center shadow-2xl">
      <p className="text-slate-400 text-sm mb-4">No deck loaded.</p>
      <button
        onClick={onReset}
        className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-full font-semibold text-sm text-white shadow-lg shadow-pink-500/25 transition-all"
      >
        Create New Deck
      </button>
    </div>
  );
}

// ---------- Reveal card ----------
function RevealCardContent({ subtitle, onComplete }) {
  const [revealed, setRevealed] = useState(false);

  const handleClick = () => {
    if (revealed) {
      soundService.playFlip();
      onComplete();
    } else {
      soundService.playSuccess();
      setRevealed(true);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      {revealed ? (
        <div className="w-full p-4 bg-white/5 border border-white/15 rounded-2xl text-slate-200 text-sm">
          {subtitle || "✨ It's a surprise — you've got this!"}
        </div>
      ) : (
        <p className="text-slate-400 text-sm">Tap to reveal the secret ✨</p>
      )}
      <button
        onClick={handleClick}
        className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-full font-semibold text-sm text-white shadow-lg shadow-pink-500/30 transition-all"
      >
        {revealed ? "Continue ➜" : "Reveal ✨"}
      </button>
    </div>
  );
}

// ---------- Runaway card ----------
function RunawayCardContent({ onSuccess }) {
  const containerRef = useRef(null);
  const { yesScale, noPosition, evasionCount, handleEvasion } =
    useRunawayButton(containerRef);

  const onEvolveEvasion = (e) => {
    soundService.playEvasion?.();
    handleEvasion(e);
  };

  const handleYesClick = () => {
    soundService.playSuccess();
    onSuccess();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-32 flex items-center justify-center gap-4"
    >
      <button
        style={{ transform: `scale(${yesScale})` }}
        onClick={handleYesClick}
        className="z-20 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full font-semibold text-white shadow-lg shadow-pink-500/30 transition-transform duration-200 hover:brightness-110 text-sm"
      >
        YES! 💖
      </button>

      <button
        onMouseEnter={onEvolveEvasion}
        onTouchStart={onEvolveEvasion}
        style={{
          transform: `translate(${noPosition.x}px, ${noPosition.y}px)`,
          transition: "transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
        className="z-10 px-6 py-3 bg-white/5 border border-white/15 rounded-full text-slate-300 font-medium hover:bg-white/10 select-none text-sm"
      >
        {evasionCount > 3 ? "Nice try! 😉" : "No 💔"}
      </button>
    </div>
  );
}
