import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";
import { Download, RefreshCw } from "lucide-react";

export function SocialExporter({ recipientName, senderName, cards, onToast, deckUrl }) {
  const canvasRef = useRef(null);
  const [socialImageUri, setSocialImageUri] = useState("");

  const generate = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = 1200;
    canvas.height = 630;
    const bg = ctx.createLinearGradient(0, 0, 1200, 630);
    bg.addColorStop(0, "#090d16");
    bg.addColorStop(0.5, "#111827");
    bg.addColorStop(1, "#030712");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1200, 630);
    const glow = ctx.createRadialGradient(900, 150, 10, 900, 150, 400);
    glow.addColorStop(0, "rgba(236,72,153,0.35)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 1200, 630);
    const glow2 = ctx.createRadialGradient(200, 500, 10, 200, 500, 400);
    glow2.addColorStop(0, "rgba(6,182,212,0.35)");
    glow2.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, 1200, 630);
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(60, 60, 1080, 510, 32);
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.beginPath();
    ctx.roundRect(60, 60, 1080, 510, 32);
    ctx.fill();
    ctx.fillStyle = "#ec4899";
    ctx.beginPath();
    ctx.roundRect(100, 110, 220, 44, 22);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px Inter, sans-serif";
    ctx.fillText("SPECIAL CARD DECK", 120, 138);
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 52px Inter, sans-serif";
    ctx.fillText(`For ${recipientName || "Someone Special"}!`, 100, 230);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "24px Inter, sans-serif";
    ctx.fillText(`An interactive multi-card story by ${senderName || "a friend"}`, 100, 280);
    ctx.fillStyle = "rgba(15,23,42,0.8)";
    ctx.strokeStyle = "rgba(236,72,153,0.4)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(100, 330, 640, 180, 24);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 28px Inter, sans-serif";
    ctx.fillText((cards[0]?.question || "Interactive Celebration Deck").slice(0, 34), 130, 385);
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "20px Inter, sans-serif";
    ctx.fillText((cards[0]?.subtitle || "Tap link to open & answer...").slice(0, 44), 130, 430);
    ctx.fillStyle = "#06b6d4";
    ctx.font = "bold 18px Inter, sans-serif";
    ctx.fillText(`Includes ${cards.length} cards with Sound & 3D`, 130, 475);
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(820, 330, 180, 180, 16);
    ctx.fill();

    try {
      const qrCanvas = document.createElement("canvas");
      qrCanvas.width = 150;
      qrCanvas.height = 150;
      await QRCode.toCanvas(qrCanvas, deckUrl || window.location.href, { width: 150, margin: 1, color: { dark: "#0f172a", light: "#ffffff" } });
      ctx.save();
      ctx.clearRect(835, 345, 150, 150);
      ctx.drawImage(qrCanvas, 835, 345, 150, 150);
      ctx.restore();
    } catch (err) {
      console.error("[SocialExporter] QR code generation failed:", err);
      onToast("Failed to generate QR code. Try again later.");
    }

    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px monospace";
    ctx.fillText("Scan to play ✨", 910, 528);
    try {
      setSocialImageUri(canvas.toDataURL("image/png"));
    } catch {
      onToast("Could not render preview card.");
    }
  };

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipientName, senderName, cards]);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 max-w-4xl mx-auto py-4 w-full">
      <canvas ref={canvasRef} className="hidden" />
      <div className="text-center space-y-2">
        <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
          Rich Open Graph Social Card Generator
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white">Share as Visual Card on Social Apps</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Download or copy this rich preview card image to attach when sending your card link on WhatsApp, Instagram, Telegram, or iMessage!
        </p>
      </div>
      {socialImageUri && (
        <div className="w-full max-w-2xl bg-slate-900/80 p-4 rounded-3xl border border-cyan-500/40 shadow-2xl space-y-4">
          <img src={socialImageUri} alt="Social Card Preview" className="w-full rounded-2xl shadow-lg border border-slate-800" />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
            <a
              href={socialImageUri}
              download={`card_preview_${recipientName || "special"}.png`}
              className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>Download Rich Card Image</span>
            </a>
            <button
              onClick={() => {
                generate();
                onToast("Regenerated visual preview card!");
              }}
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs border border-slate-700 flex items-center justify-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Preview</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
