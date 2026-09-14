import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, ArrowRight, Lock, Unlock } from "lucide-react";
import { useRunawayButton } from "../../hooks/useRunawayButton";
import { soundService } from "../../services/soundService";

export function RunawayBody({ card, onAnswer }) {
  const containerRef = useRef(null);
  const { noPosition, yesScale, handleEvasion, resetRunaway } = useRunawayButton(containerRef);
  const yesLabel = card.options?.[0] || "YES!";
  const noLabel = card.options?.[1] || "No";
  return (
    <div ref={containerRef} className="flex justify-center items-center space-x-4 relative min-h-[50px]">
      <button
        onClick={() => {
          soundService.playSuccess();
          resetRunaway();
          onAnswer(yesLabel);
        }}
        style={{ transform: `scale(${yesScale})` }}
        className="bg-emerald-500 hover:bg-emerald-400 text-white font-black px-6 py-2.5 rounded-2xl shadow-xl transition active:scale-95 text-xs sm:text-sm z-30"
      >
        <span>{yesLabel}</span>
      </button>
      <button
        onMouseEnter={handleEvasion}
        onTouchStart={handleEvasion}
        onClick={handleEvasion}
        style={{ transform: `translate(${noPosition.x}px, ${noPosition.y}px)`, transition: "transform 0.15s ease-out" }}
        className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-5 py-2.5 rounded-2xl shadow-xl text-xs sm:text-sm border border-rose-300/40 cursor-pointer select-none"
      >
        <span>{noLabel}</span>
      </button>
    </div>
  );
}

export function OptionsBody({ card, onAnswer }) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {(card.options || []).map((opt, i) => (
        <button
          key={i}
          onClick={() => onAnswer(opt)}
          className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-2.5 px-4 rounded-xl border border-white/30 shadow transition transform active:scale-95 text-xs sm:text-sm text-center"
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function SliderBody({ onAnswer }) {
  const [val, setVal] = useState(100);
  return (
    <div className="bg-slate-950/40 backdrop-blur-md p-4 rounded-2xl border border-white/20 space-y-3 text-center">
      <p className="text-xs text-white font-bold">{val}% Vibe</p>
      <input
        type="range"
        min="0"
        max="100"
        value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        className="w-full accent-pink-500"
      />
      <button
        onClick={() => onAnswer(`${val}% Love`)}
        className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2 rounded-xl text-xs shadow-md"
      >
        Transmit Vibe Rating 💕
      </button>
    </div>
  );
}

export function VoiceBody({ onAnswer, onRecorded }) {
  const [phase, setPhase] = useState("idle");
  const [audioUrl, setAudioUrl] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const urlRef = useRef(null);

  const releaseResources = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      try {
        recorderRef.current.stop();
      } catch {
        /* already stopped */
      }
    }
    recorderRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      releaseResources();
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = null;
      }
    };
  }, []);

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === "undefined") {
      setPhase("unsupported");
      soundService.playCyberBeep();
      return;
    }
    setPhase("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        const url = URL.createObjectURL(blob);
        urlRef.current = url;
        setAudioUrl(url);
        setPhase("recorded");
        soundService.playSuccess();
        onRecorded();
      };
      recorder.start();
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
      setPhase("recording");
      soundService.playCyberBeep();
    } catch (err) {
      releaseResources();
      if (err && err.name === "NotAllowedError") setPhase("denied");
      else if (err && err.name === "NotFoundError") setPhase("no-device");
      else setPhase("error");
      soundService.playCyberBeep();
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    } else {
      releaseResources();
    }
  };

  return (
    <div className="bg-slate-950/50 backdrop-blur-md p-4 rounded-2xl border border-white/20 space-y-3 text-center">
      {(phase === "idle" || phase === "unsupported" || phase === "denied" || phase === "no-device" || phase === "error") && (
        <button
          onClick={startRecording}
          className="w-full font-bold py-2.5 px-4 rounded-xl border transition text-xs flex items-center justify-center space-x-2 bg-pink-600/40 text-white border-pink-400/50"
        >
          <Mic className="w-4 h-4" />
          <span>Tap & Speak Voice Note</span>
        </button>
      )}
      {phase === "requesting" && (
        <p className="text-xs text-slate-400">Waiting for microphone permission...</p>
      )}
      {phase === "recording" && (
        <button
          onClick={stopRecording}
          className="w-full font-bold py-2.5 px-4 rounded-xl border transition text-xs flex items-center justify-center space-x-2 bg-rose-600 text-white border-rose-400 animate-pulse"
        >
          <MicOff className="w-4 h-4" />
          <span>Stop Voice Recording... ({seconds}s)</span>
        </button>
      )}
      {phase === "recorded" && audioUrl && (
        <div className="space-y-2">
          <audio src={audioUrl} controls className="w-full h-9" />
          <button
            onClick={() => onAnswer("Voice Note Recorded 🎙️")}
            className="w-full bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs shadow-md"
          >
            Attach Voice Note & Proceed ➔
          </button>
        </div>
      )}
      {phase === "denied" && (
        <p className="text-[11px] text-rose-300">Mic blocked — allow microphone access and retry, or continue without audio.</p>
      )}
      {phase === "no-device" && (
        <p className="text-[11px] text-rose-300">No microphone found on this device — continue with text instead.</p>
      )}
      {phase === "error" && (
        <p className="text-[11px] text-rose-300">Recording failed — please retry or continue without audio.</p>
      )}
      {phase === "unsupported" && (
        <p className="text-[11px] text-slate-400">Voice capture is not supported in this browser — simulation mode.</p>
      )}
    </div>
  );
}

export function TextBody({ onAnswer }) {
  const [text, setText] = useState("");
  return (
    <div className="space-y-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your response memory here..."
        className="w-full bg-slate-950/50 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
      />
      <button
        onClick={() => onAnswer(text.trim() || "No response")}
        className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2 rounded-xl text-xs shadow-md"
      >
        Send Answer & Next ➔
      </button>
    </div>
  );
}

export function NextBody({ onAnswer }) {
  return (
    <button
      onClick={() => onAnswer("Completed Step")}
      className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold py-3 px-4 rounded-2xl shadow-xl transition text-xs sm:text-sm flex items-center justify-center space-x-2"
    >
      <span>Proceed Next</span>
      <ArrowRight className="w-4 h-4" />
    </button>
  );
}

export function PasswordBody({ card, onAnswer }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  // New dedicated shape preferred; falls back to options[0] for legacy decks.
  const passcode = String(card.passcode || card.options?.[0] || "").trim();
  const hint = card.passwordHint || card.subtitle || "";

  const attempt = () => {
    // No passcode configured = card creator left it open; accept any entry.
    if (!passcode || code.trim().toLowerCase() === passcode.toLowerCase()) {
      setError(false);
      setUnlocked(true);
      soundService.playSuccess();
      onAnswer(passcode ? "Unlocked with secret code" : "Unlocked");
    } else {
      setError(true);
      soundService.playPop();
    }
  };

  return (
    <div className="bg-slate-950/50 backdrop-blur-md p-4 rounded-2xl border border-white/20 space-y-3 text-center">
      {unlocked ? (
        <div className="space-y-2">
          <Unlock className="w-8 h-8 text-emerald-400 mx-auto" />
          <p className="text-xs font-bold text-emerald-300">Unsealed! Moving on...</p>
          <button
            onClick={() => onAnswer("Unlocked with secret code")}
            className="w-full bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs shadow-md"
          >
            Continue ➔
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <Lock className={`w-8 h-8 mx-auto ${error ? "text-rose-400 animate-bounce" : "text-pink-400"}`} />
          {hint && (
            <p className="text-[11px] text-pink-200/80 italic">
              {hint}
            </p>
          )}
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && attempt()}
            placeholder="Enter the secret code..."
            maxLength={40}
            className={`w-full bg-slate-950 border rounded-xl px-3 py-2 text-xs text-white text-center focus:outline-none ${
              error ? "border-rose-500/70" : "border-white/20 focus:border-pink-500"
            }`}
          />
          {error && <p className="text-[11px] text-rose-300">Wrong code — check the clue and try again.</p>}
          <button
            onClick={attempt}
            disabled={!code.trim()}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-white font-bold py-2 rounded-xl text-xs shadow-md"
          >
            Unlock
          </button>
        </div>
      )}
    </div>
  );
}
