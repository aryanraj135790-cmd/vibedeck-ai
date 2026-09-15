import { Sparkles } from "lucide-react";

export function AiSparkleButton({ loading, disabled, onClick, title, tooltip }) {
  const isDisabled = loading || disabled;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      title={title}
      className="ai-sparkle-btn"
      aria-label={tooltip || "AI suggest rewrite"}
    >
      {loading ? (
        <span className="ai-sparkle-spinner" />
      ) : (
        <Sparkles size={15} strokeWidth={1.75} />
      )}
    </button>
  );
}
