import { BUTTON_TYPES } from "../../data/buttonTypes";
import { MediaPicker } from "./MediaPicker";
import { OptionsEditor } from "./OptionsEditor";
import { ThemePicker } from "./ThemePicker";
import { AiSparkleButton } from "./AiSparkleButton";

function PasswordEditor({ activeCard, updateCurrentCard }) {
  const passcode = activeCard.passcode || "";
  const hint = activeCard.passwordHint || "";

  return (
    <div className="space-y-3 pt-2 border-t border-slate-800">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-slate-300">Secret Passcode</span>
        <span className="text-[10px] text-slate-500 font-mono">
          {passcode ? `${"•".repeat(Math.min(passcode.length, 6))} ${passcode.length > 6 ? "…" : ""}` : "(not set)"}
        </span>
      </div>
      <div>
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
          Passcode (the code they type to unlock)
        </label>
        <input
          type="text"
          value={passcode}
          onChange={(e) => updateCurrentCard("passcode", e.target.value)}
          placeholder="e.g. midnight, ourdate2025, insidejoke"
          maxLength={40}
          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 font-mono"
        />
        <p className="text-[10px] text-slate-500 mt-1">
          Leave empty to leave the card open — anyone can pass.
        </p>
      </div>
      <div>
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
          Hint / Clue (shown above the input to the recipient)
        </label>
        <input
          type="text"
          value={hint}
          onChange={(e) => updateCurrentCard("passwordHint", e.target.value)}
          placeholder="e.g. Think of the theme, our first date, etc."
          maxLength={120}
          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
        />
        <p className="text-[10px] text-slate-500 mt-1">
          Falls back to the card Subtitle if left blank.
        </p>
      </div>
    </div>
  );
}

export function CardConfig({
  activeCard,
  selectedCardIdx,
  updateCurrentCard,
  themeId,
  setDeck,
  activeTone,
  suggestingCardId,
  onSuggestCard,
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-xs font-mono font-bold text-pink-400">
          Editing Card #{selectedCardIdx + 1}
        </span>
        <span className="text-[10px] bg-slate-950 text-slate-500 px-2 py-0.5 rounded-full font-mono border border-slate-800">
          ID: {activeCard.id}
        </span>
      </div>
      <div>
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
          Card Headline / Question
        </label>
        <div className="flex items-stretch gap-1">
          <input
            type="text"
            value={activeCard.question || ""}
            onChange={(e) => updateCurrentCard("question", e.target.value)}
            placeholder="Ask something fun..."
            maxLength={120}
            className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 font-bold transition"
          />
          {activeTone && onSuggestCard && (
            <AiSparkleButton
              loading={suggestingCardId === activeCard.id}
              disabled={!activeCard.id || !activeCard.question}
              onClick={() => onSuggestCard(activeCard.id)}
              title={`AI suggest this question in “${activeTone}” tone`}
              tooltip="AI suggest question"
            />
          )}
        </div>
      </div>
      <div>
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
          Subtext / Story Subtitle
        </label>
        <div className="flex items-stretch gap-1">
          <textarea
            rows={2}
            value={activeCard.subtitle || ""}
            onChange={(e) => updateCurrentCard("subtitle", e.target.value)}
            placeholder="Add a playful subtext..."
            maxLength={300}
            className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 resize-none transition"
          />
          {activeTone && onSuggestCard && (
            <AiSparkleButton
              loading={suggestingCardId === activeCard.id}
              disabled={!activeCard.id || !activeCard.subtitle}
              onClick={() => onSuggestCard(activeCard.id)}
              title={`AI suggest this subtitle in “${activeTone}” tone`}
              tooltip="AI suggest subtitle"
            />
          )}
        </div>
      </div>
      <MediaPicker
        value={activeCard.mediaUrl || ""}
        onChange={(url) => updateCurrentCard("mediaUrl", url)}
      />
      <div>
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Card Interaction Type
        </label>
        <div className="grid grid-cols-1 gap-2">
          {BUTTON_TYPES.map((bt) => (
            <div
              key={bt.id}
              onClick={() => updateCurrentCard("type", bt.id)}
              className={`p-3 rounded-2xl border cursor-pointer transition flex items-start space-x-3 ${
                activeCard.type === bt.id
                  ? "border-pink-500 bg-pink-500/10 text-white shadow-lg"
                  : "border-slate-800/80 bg-slate-950/40 text-slate-400 hover:border-slate-700"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center ${
                  activeCard.type === bt.id ? "border-pink-400 bg-pink-500" : "border-slate-600"
                }`}
              >
                {activeCard.type === bt.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">{bt.name}</h4>
                <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{bt.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {activeCard.type === "password" ? (
        <PasswordEditor activeCard={activeCard} updateCurrentCard={updateCurrentCard} />
      ) : (
        (activeCard.type === "runaway" || activeCard.type === "options") && (
          <OptionsEditor activeCard={activeCard} updateCurrentCard={updateCurrentCard} />
        )
      )}
      <ThemePicker themeId={themeId} setDeck={setDeck} />
    </div>
  );
}
