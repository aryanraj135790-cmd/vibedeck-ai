import { Header } from "./components/chrome/Header";
import { Toast } from "./components/chrome/Toast";
import { CanvasParticles, CanvasConfettiBurst } from "./components/chrome/Backdrop";
import { AiBar } from "./components/studio/AiBar";
import { DeckStudio } from "./components/studio/DeckStudio";
import { SocialExporter } from "./components/studio/SocialExporter";
import { SavedDecks } from "./components/studio/SavedDecks";
import { ShareLinkBanner } from "./components/studio/ShareLinkBanner";
import { CardRenderer } from "./components/player/CardRenderer";
import { PlayView } from "./components/player/PlayView";
import { useApp } from "./hooks/useApp";

export default function App() {
  const {
    activeTab,
    deckWithTheme,
    setDeck,
    prompt,
    setPrompt,
    loading,
    rewriting,
    activeTone,
    suggestingCardId,
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
    handleSuggestCard,
  } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-pink-500 selection:text-white relative overflow-x-hidden">
      <CanvasParticles />
      <CanvasConfettiBurst trigger={burst} />
      <Toast message={toastMessage} />
      {activeTab !== "view" && (
        <Header
          activeTab={activeTab}
          onTab={handleTab}
          muted={muted}
          onToggleMute={toggleMute}
          savedUrl={savedUrl}
          saving={saving}
          onSave={handleSaveShare}
        />
      )}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        {activeTab === "editor" && (
          <div className="flex flex-col gap-6 animate-[fadeIn_0.35s_ease]">
            <AiBar prompt={prompt} setPrompt={setPrompt} loading={loading} onGenerate={handleGenerate} />
            <ShareLinkBanner savedUrl={savedUrl} onToast={showToast} />
            <DeckStudio
              deck={deckWithTheme}
              setDeck={setDeck}
              onToast={showToast}
              onPreview={() => handleTab("preview")}
              rewriting={rewriting}
              onRewrite={handleRewrite}
              activeTone={activeTone}
              suggestingCardId={suggestingCardId}
              onSuggestCard={handleSuggestCard}
            />
          </div>
        )}
        {activeTab === "preview" && (
          <CardRenderer
            key={envelopeKey}
            deck={deckWithTheme}
            theme={theme}
            onToast={showToast}
            onBurst={setBurst}
          />
        )}
        {activeTab === "view" && (
          <PlayView
            deck={deckWithTheme}
            theme={theme}
            envelopeKey={envelopeKey}
            onToast={showToast}
            onBurst={setBurst}
          />
        )}
        {activeTab === "social_exporter" && (
          <div className="flex flex-col items-center gap-4">
            <SocialExporter
              recipientName={deckWithTheme.recipientName}
              senderName={deckWithTheme.senderName}
              cards={deckWithTheme.cards}
              onToast={showToast}
              deckUrl={savedUrl || window.location.href}
            />
          </div>
        )}
        {activeTab === "saved" && (
          <div className="flex flex-col items-center gap-4 animate-[fadeIn_0.35s_ease]">
            <SavedDecks
              key={refreshKey}
              onLoad={handleLoadSaved}
              onPlay={handlePlaySaved}
              onToast={showToast}
            />
          </div>
        )}
      </main>
    </div>
  );
}