"use client";

import { Suspense } from "react";
import PlayContent from "./PlayContent";

export default function PlayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-neutral-400">
          Loading...
        </div>
      }
    >
      <PlayContent />
    </Suspense>
  );
}
