import { useRef, useState } from "react";
import { ImagePlus, Link2, RefreshCw, Upload, X } from "lucide-react";
import { DEFAULT_GIFS } from "../../data/defaults";

const MAX_BYTES = 1.5 * 1024 * 1024; // keep share-link + localStorage safe

export function MediaPicker({ value, onChange }) {
  const fileRef = useRef(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);

  const readFile = (file) => {
    setError("");
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Only image files work here (PNG, JPG, GIF, WebP).");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That file is over 1.5MB — big files break share links. Try a smaller image or paste a URL.");
      return;
    }
    setBusy(true);
    const reader = new FileReader();
    reader.onload = () => {
      onChange(String(reader.result || ""));
      setBusy(false);
    };
    reader.onerror = () => {
      setError("Could not read that file. Try another.");
      setBusy(false);
    };
    reader.readAsDataURL(file);
  };

  const hasImage = Boolean(value);
  const isDataUrl = value?.startsWith("data:");

  return (
    <div>
      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
        Header Media / GIF URL
      </label>
      <div className="flex gap-2 mb-1.5">
        <div className="relative flex-1">
          <Link2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="url"
            inputMode="url"
            value={isDataUrl ? "" : value || ""}
            onChange={(e) => {
              setError("");
              onChange(e.target.value.trim());
            }}
            placeholder="Paste image / GIF URL, or upload below"
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-pink-500"
          />
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="shrink-0 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Upload</span>
        </button>
        {hasImage && (
          <button
            type="button"
            onClick={() => {
              setError("");
              onChange("");
            }}
            aria-label="Remove media"
            className="shrink-0 bg-slate-800 hover:bg-rose-900/60 border border-slate-700 text-slate-300 px-2.5 py-1.5 rounded-xl transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp"
        className="hidden"
        onChange={(e) => readFile(e.target.files?.[0])}
      />
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          readFile(e.dataTransfer?.files?.[0]);
        }}
        className={`rounded-xl border border-dashed p-2.5 mb-1.5 text-center cursor-pointer transition ${
          dragOver ? "border-pink-400 bg-pink-500/10" : "border-slate-800 bg-slate-950/40 hover:border-slate-700"
        }`}
        onClick={() => fileRef.current?.click()}
      >
        {hasImage ? (
          <div className="relative">
            <img
              src={value}
              alt="Card media preview"
              loading="lazy"
              className="h-20 object-contain rounded-lg mx-auto border border-white/10"
              onError={() => setError("Preview failed — that URL may block hotlinking. Try uploading instead.")}
            />
            {busy && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 rounded-lg">
                <RefreshCw className="w-4 h-4 text-pink-400 animate-spin" />
              </div>
            )}
          </div>
        ) : (
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <ImagePlus className="w-3.5 h-3.5" />
            Drop an image here, or click to browse (max 1.5MB)
          </p>
        )}
      </div>
      {error && <p className="text-[11px] text-rose-400 mb-1.5">{error}</p>}
      <div className="flex space-x-2 overflow-x-auto nice-scroll pb-1">
        {DEFAULT_GIFS.map((gif, gIdx) => (
          <img
            key={gIdx}
            src={gif}
            alt="GIF preset"
            loading="lazy"
            onClick={() => {
              setError("");
              onChange(gif);
            }}
            className={`w-10 h-10 object-cover rounded-lg cursor-pointer border transition shrink-0 ${
              value === gif ? "border-pink-500 scale-105 shadow-md" : "border-slate-800 opacity-60 hover:opacity-100"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
