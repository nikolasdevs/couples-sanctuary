"use client";

import { useEffect, useRef, useState } from "react";
import { MdPauseCircle, MdPlayCircle } from "react-icons/md";

const STORAGE_ENABLED = "cs:ambientAudio:enabled";
const STORAGE_VOLUME = "cs:ambientAudio:volume";

export default function AmbientAudio({
  src = "https://res.cloudinary.com/dpnzmcban/video/upload/v1768079634/Making_Love_Music_Ensemble_-_Moment_of_Love__mp3.pm_miy137.mp3", // use a file you have rights to
}: {
  src?: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [playing, setPlaying] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_ENABLED) === "true";
    } catch {
      return false;
    }
  });

  const [volume, setVolume] = useState<number>(() => {
    try {
      const savedVolume = localStorage.getItem(STORAGE_VOLUME);
      if (savedVolume) {
        const v = Number(savedVolume);
        if (!Number.isNaN(v)) return Math.min(1, Math.max(0, v));
      }
    } catch {
      // ignore
    }
    return 0.35;
  });

  // Keep element in sync with state
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    el.volume = volume;

    if (playing) {
      const p = el.play();
      // Autoplay policies can reject; fall back to "off"
      if (p && typeof p.catch === "function") {
        p.catch(() => setPlaying(false));
      }
    } else {
      el.pause();
    }
  }, [playing, volume]);

  // Persist preferences
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ENABLED, String(playing));
      localStorage.setItem(STORAGE_VOLUME, String(volume));
    } catch {
      // ignore
    }
  }, [playing, volume]);

  return (
    <div className="flex items-center gap-2">
      <audio ref={audioRef} loop preload="none" src={src} />

      <button
        type="button"
        onClick={() => setPlaying((p) => !p)}
        aria-pressed={playing}
        aria-label={playing ? "Turn sound off" : "Turn sound on"}
        className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-zinc-100 transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226]/70 active:scale-[0.99]"
      >
        <span className={playing ? "text-rose-300" : "text-emerald-200"}>
          {playing ? (
            <MdPauseCircle className="text-xl" />
          ) : (
            <MdPlayCircle className="text-xl" />
          )}
        </span>
        <span className="text-xs text-white/70">
          {playing ? "Sound on" : "Sound off"}
        </span>
      </button>

      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
        className="w-24 accent-[#B11226] md:w-28"
        aria-label="Ambient volume"
      />
    </div>
  );
}
