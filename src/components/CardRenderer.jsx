import React, { useState, useMemo } from "react";
import { Sparkles, ChevronRight, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";
import { useRunawayButton } from "../hooks/useRunawayButton";

export function CardRenderer({ deck, onReset }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentCard = useMemo(
    () => (isComplete ? null : deck.cards[currentIndex]),
    [deck, currentIndex, isComplete],
  );
  const isLastCard = useMemo(
    () => !isComplete && currentIndex === deck.cards.length - 1,
    [deck.cards.length, currentIndex, isComplete],
  );

  const celebrate = useMemo(
    () => () =>
      confetti({ particleCount: 120, spread: 75, origin: { y: 0.6 } }),
    [],
  );

  const handleNext = () => {
    if (isLastCard) {
      setIsComplete(true);
      celebrate();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleRunawaySuccess = () => {
    setIsComplete(true);
    celebrate();
  };

  // Full-deck completion celebration screen (replaces the blocking alert())
  if (isComplete) {
    return (
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center shadow-2xl flex flex-col items-center min-h-[440px] justify-between relative">
        <div className="w-full flex justify-between items-center text-xs text-slate-400 font-medium">
          <span className="capitalize text-pink-400 font-semibold">
            {deck.theme} Deck
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
            onClick={onReset}
            className="px-6 py-2.5 bg-pink-500 hover:bg-pink-600 rounded-full font-semibold text-sm shadow-lg shadow-pink-500/30 transition-all"
          >
            Start a New Deck
          </button>
        </div>

        <div className="w-full flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-white/10">
          <button
            onClick={onReset}
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

  return (
    <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center shadow-2xl flex flex-col items-center min-h-[440px] justify-between relative">
      {/* Progress Indicator */}
      <div className="w-full flex justify-between items-center text-xs text-slate-400 font-medium">
        <span className="capitalize text-pink-400 font-semibold">
          {deck.theme} Deck
        </span>
        <span>
          Card {currentIndex + 1} of {deck.cards.length}
        </span>
      </div>

      {/* Card Body */}
      <div className="my-auto w-full py-4 flex flex-col items-center gap-4">
        <h2 className="text-xl font-bold tracking-tight text-white">
          {currentCard.question}
        </h2>
        {currentCard.subtitle && (
          <p className="text-slate-400 text-sm">{currentCard.subtitle}</p>
        )}

        {/* Dynamic Card Type Switcher */}
        <div className="w-full mt-4">
          {currentCard.type === "multichoice" && (
            <div className="flex flex-col gap-2 w-full">
              {(currentCard.options && currentCard.options.length > 0
                ? currentCard.options
                : ["Definitely YES! 🌟", "Count me in! 🎉", "Let's do it! 🚀"]
              ).map((option, idx) => (
                <button
                  key={idx}
                  onClick={handleNext}
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
                className="w-full accent-pink-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-pink-500 hover:bg-pink-600 rounded-full font-semibold text-sm shadow-lg shadow-pink-500/30 transition-all"
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
        </div>
      </div>

      {/* Deck Controls */}
      <div className="w-full flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-white/10">
        <button
          onClick={onReset}
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

// Reveal card: shows the secret when tapped, then advances the deck.
function RevealCardContent({ subtitle, onComplete }) {
  const [revealed, setRevealed] = useState(false);

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
        onClick={() => (revealed ? onComplete() : setRevealed(true))}
        className="px-6 py-2.5 bg-pink-500 hover:bg-pink-600 rounded-full font-semibold text-sm shadow-lg shadow-pink-500/30 transition-all"
      >
        {revealed ? "Continue ➜" : "Reveal ✨"}
      </button>
    </div>
  );
}

// Sub-component encapsulating runaway behavior for specific cards
function RunawayCardContent({ onSuccess }) {
  const containerRef = React.useRef(null);
  const { yesScale, noPosition, evasionCount, handleEvasion } =
    useRunawayButton(containerRef);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-32 flex items-center justify-center gap-4"
    >
      <button
        style={{ transform: `scale(${yesScale})` }}
        onClick={onSuccess}
        className="z-20 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full font-semibold shadow-lg shadow-pink-500/30 transition-transform duration-200 hover:brightness-110 active:scale-95 text-sm"
      >
        YES! 💖
      </button>

      <button
        onMouseEnter={handleEvasion}
        onTouchStart={handleEvasion}
        style={{
          transform: `translate(${noPosition.x}px, ${noPosition.y}px)`,
          transition: "transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
        className="z-10 px-6 py-3 bg-slate-800 border border-slate-700 rounded-full text-slate-300 font-medium hover:bg-slate-700 select-none text-sm"
      >
        {evasionCount > 3 ? "Nice try! 😉" : "No 💔"}
      </button>
    </div>
  );
}
