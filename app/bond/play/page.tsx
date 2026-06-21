"use client";

import { Suspense } from "react";
import PlayContent from "./PlayContent";

function PlayFallback() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#0A0A0A] px-6">
      {/* Background (match PlayContent) */}
      <div className="absolute inset-0 -z-20 pointer-events-none select-none">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/dpnzmcban/image/upload/v1768124994/ba8728b6-a5a4-4659-b3d5-3b2946b04fcb_qtq1yh.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/65 via-black/80 to-black/90" />
        <div className="absolute inset-0 shadow-[inset_0_0_160px_rgba(0,0,0,0.85)]" />
      </div>

      <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-center py-10 text-center">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <div className="mx-auto mb-4 h-7 w-40 rounded-full bg-white/10" />
          <div className="space-y-3">
            <div className="h-6 w-full rounded-lg bg-white/10" />
            <div className="h-6 w-11/12 rounded-lg bg-white/10" />
            <div className="h-6 w-10/12 rounded-lg bg-white/10" />
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/60">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/40" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/30 [animation-delay:120ms]" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/20 [animation-delay:240ms]" />
            <span className="ml-2">Preparing your session…</span>
          </div>
        </div>

        <div className="mt-6 mx-auto h-12 w-full max-w-sm rounded-full bg-white/10" />
      </div>
    </main>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={<PlayFallback />}>
      <PlayContent />
    </Suspense>
  );
}
