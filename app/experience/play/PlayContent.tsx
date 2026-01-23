"use client";

import AmbientAudio from "@/components/AmbientAudio";
import CategoryRedirect from "@/components/CategoryRedirect";
import PauseOverlay from "@/components/PauseOverlay";
import Progress from "@/components/Progress";
import SafeConfirm from "@/components/SafeConfirm";
import SafeFlow from "@/components/SafeFlow";
import { decks } from "@/data";
import { sanctuaryFlow } from "@/data/sanctuaryFlow";
import { randomItem } from "@/lib/random";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Card = { category: string; text: string };
type SafeState = null | "active" | "confirm" | "redirect";

const SAFE_REDIRECT_COUNT = 3;

const pillBase =
  "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold " +
  "transition-all duration-200 ease-out " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black " +
  "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]";

const actionBase =
  "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold " +
  "transition-all duration-200 ease-out " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black " +
  "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]";

export default function PlayContent() {
  const params = useSearchParams();
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const mode = params.get("mode") || "shuffle";

  const [index, setIndex] = useState(0);
  const [pause, setPause] = useState(false);
  const [safe, setSafe] = useState<SafeState>(null);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const needsCategoryPick = mode === "category" && !selectedCategory;

  // ✅ Temporary “change direction” override (works in shuffle/sanctuary)
  const [forcedCategory, setForcedCategory] = useState<string | null>(null);
  const [forcedRemaining, setForcedRemaining] = useState<number>(0);

  const storageKey = useMemo(() => {
    if (mode === "category")
      return `sanctuary-current-card:${mode}:${selectedCategory ?? ""}`;
    return `sanctuary-current-card:${mode}`;
  }, [mode, selectedCategory]);

  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [mounted, setMounted] = useState(false);

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const generateCard = (
    nextIndex: number,
    overrideCategory?: string | null,
  ): Card => {
    // 1) If a temporary direction is active, use it first (for shuffle/sanctuary)
    if (overrideCategory) {
      return {
        category: overrideCategory,
        text: randomItem(decks[overrideCategory as keyof typeof decks]),
      };
    }

    // 2) Sanctuary flow uses fixed category order
    if (mode === "sanctuary") {
      const category = sanctuaryFlow[nextIndex];
      return {
        category,
        text: randomItem(decks[category as keyof typeof decks]),
      };
    }

    // 3) Category mode uses the selected category
    if (mode === "category" && selectedCategory) {
      return {
        category: selectedCategory,
        text: randomItem(decks[selectedCategory as keyof typeof decks]),
      };
    }

    // 4) Shuffle
    const categories = Object.keys(decks) as (keyof typeof decks)[];
    const category = randomItem(categories);
    return { category, text: randomItem(decks[category]) };
  };

  // Mount + restore
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize / restore whenever mode or selectedCategory changes
  useEffect(() => {
    if (!mounted) return;

    if (needsCategoryPick) {
      setCurrentCard(null);
      setIndex(0);
      return;
    }

    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as {
          index: number;
          card: Card;
          mode: string;
          selectedCategory: string | null;
          forcedCategory?: string | null;
          forcedRemaining?: number;
        };

        // ✅ Only validate selectedCategory in category mode
        const okCategory =
          mode !== "category" ||
          parsed.selectedCategory === (selectedCategory ?? null);

        if (parsed.mode === mode && okCategory) {
          setIndex(parsed.index);
          setCurrentCard(parsed.card);

          // restore temporary direction (only meaningful outside category mode)
          setForcedCategory(parsed.forcedCategory ?? null);
          setForcedRemaining(parsed.forcedRemaining ?? 0);

          return;
        }
      } catch {
        // ignore
      }
    }

    setIndex(0);
    setCurrentCard(generateCard(0, null));
    setForcedCategory(null);
    setForcedRemaining(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, mode, selectedCategory, needsCategoryPick, storageKey]);

  useEffect(() => {
    if (!mounted || !currentCard) return;

    localStorage.setItem(
      storageKey,
      JSON.stringify({
        card: currentCard,
        index,
        mode,
        // ✅ Only persist selectedCategory for category mode
        selectedCategory:
          mode === "category" ? (selectedCategory ?? null) : null,
        forcedCategory: mode === "category" ? null : forcedCategory,
        forcedRemaining: mode === "category" ? 0 : forcedRemaining,
      }),
    );
  }, [
    mounted,
    currentCard,
    index,
    mode,
    selectedCategory,
    storageKey,
    forcedCategory,
    forcedRemaining,
  ]);

  const endSession = () => {
    localStorage.removeItem(storageKey);
    router.push("/experience/end");
  };

  const handleNext = () => {
    if (!mounted || pause || safe || busy) return;

    // End automatically when sanctuary flow completes
    if (mode === "sanctuary" && index + 1 >= sanctuaryFlow.length) {
      endSession();
      return;
    }

    setBusy(true);

    const nextIndex = index + 1;

    // If a temporary direction is active, use it for the next card (outside category mode)
    const shouldForce =
      mode !== "category" && forcedCategory && forcedRemaining > 0;
    const nextCard = generateCard(
      nextIndex,
      shouldForce ? forcedCategory : null,
    );

    setIndex(nextIndex);
    setCurrentCard(nextCard);

    if (shouldForce) {
      setForcedRemaining((n) => {
        const next = n - 1;
        if (next <= 0) {
          setForcedCategory(null);
          return 0;
        }
        return next;
      });
    }

    // small lock to prevent double-advancing
    window.setTimeout(() => setBusy(false), reduceMotion ? 0 : 280);
  };

  const skipCard = () => {
    setSafe(null);
    handleNext();
  };

  // Keyboard shortcuts: → / Space next, P pause, S safe, Esc close overlays
  useEffect(() => {
    if (!mounted) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (pause) setPause(false);
        if (safe) setSafe(null);
        return;
      }

      // don’t steal keys when overlays are open
      if (pause || safe || needsCategoryPick) return;

      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        handleNext();
      }
      if (e.key.toLowerCase() === "p") setPause(true);
      if (e.key.toLowerCase() === "s") setSafe("active");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mounted,
    pause,
    safe,
    needsCategoryPick,
    index,
    mode,
    busy,
    forcedCategory,
    forcedRemaining,
  ]);

  // Lightweight skeleton while mounting/initializing
  if (!mounted) return null;

  return (
    <main
      className="relative min-h-dvh overflow-hidden bg-[#0A0A0A] px-6"
      onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStartX === null) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        if (deltaX < -60) handleNext();
        setTouchStartX(null);
      }}
    >
      {/* Background */}
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

      {/* Overlays */}
      <AnimatePresence>
        {pause && <PauseOverlay key="pause" onResume={() => setPause(false)} />}

        {safe === "active" && (
          <SafeFlow
            key="safe-active"
            onRedirect={() => setSafe("redirect")}
            onSkip={() => setSafe("confirm")}
            onEnd={endSession}
            onReconsider={() => setSafe(null)}
          />
        )}

        {safe === "confirm" && (
          <SafeConfirm
            key="safe-confirm"
            onConfirm={skipCard}
            onCancel={() => setSafe("redirect")}
            onReconsider={() => setSafe("active")}
          />
        )}

        {safe === "redirect" && (
          <CategoryRedirect
            key="safe-redirect"
            onSelect={(category) => {
              setSafe(null);

              if (mode === "category") {
                // category mode: this really changes the mode’s category
                setSelectedCategory(category);
                setIndex(0);
                setCurrentCard({
                  category,
                  text: randomItem(decks[category as keyof typeof decks]),
                });
                return;
              }

              // shuffle/sanctuary: temporarily steer the next N cards
              setForcedCategory(category);
              setForcedRemaining(SAFE_REDIRECT_COUNT);

              // show the chosen direction immediately
              setCurrentCard({
                category,
                text: randomItem(decks[category as keyof typeof decks]),
              });
            }}
          />
        )}

        {needsCategoryPick && (
          <CategoryRedirect
            key="pick-category"
            onSelect={(category) => {
              setSelectedCategory(category);
              setIndex(0);
              setCurrentCard({
                category,
                text: randomItem(decks[category as keyof typeof decks]),
              });
            }}
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      {!needsCategoryPick && currentCard && (
        <>
          {/* Bottom audio dock (premium) */}
          <div className="fixed inset-x-0 bottom-4 z-30 px-6 pb-[env(safe-area-inset-bottom)]">
            <div className="mx-auto w-full max-w-xl">
              <div className="pointer-events-auto flex justify-center">
                <div className="rounded-full border border-white/10 bg-black/30 px-2 py-2 shadow-2xl shadow-black/40 backdrop-blur-md">
                  <AmbientAudio />
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-center py-10 text-center">
            {/* Top row */}
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={() => setPause(true)}
                className={[
                  pillBase,
                  "border border-white/10 bg-white/5 text-zinc-50 backdrop-blur-md",
                  "hover:bg-white/10 hover:shadow-xl hover:shadow-black/30",
                ].join(" ")}
              >
                Pause
              </button>

              {mode === "sanctuary" ? (
                <div className="min-w-[180px]">
                  <Progress
                    current={Math.min(index + 1, sanctuaryFlow.length)}
                    total={sanctuaryFlow.length}
                  />
                </div>
              ) : (
                <span className="text-xs text-white/55">
                  Swipe left for next
                </span>
              )}

              <button
                onClick={() => {
                  setSafe("active");
                  setPause(false);
                }}
                className={[
                  pillBase,
                  "border border-emerald-500/25 bg-emerald-500/10 text-emerald-200 backdrop-blur-md",
                  "hover:bg-emerald-500/15 hover:shadow-xl hover:shadow-emerald-900/20",
                  "focus-visible:ring-emerald-400/60",
                ].join(" ")}
              >
                Safe
              </button>
            </div>

            {/* Prompt card */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${mode}:${selectedCategory ?? ""}:${forcedCategory ?? ""}:${forcedRemaining}:${index}`}
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.22,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-semibold tracking-widest text-amber-200 backdrop-blur-md">
                      {currentCard.category.toUpperCase()}
                    </span>

                    {mode !== "category" &&
                      forcedCategory &&
                      forcedRemaining > 0 && (
                        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold text-white/70">
                          Direction: {forcedCategory} • {forcedRemaining} left
                        </span>
                      )}
                  </div>

                  <p className="text-2xl font-semibold leading-snug text-zinc-50 md:text-3xl">
                    {currentCard.text}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Action bar */}
            <div className="mt-6 grid grid-cols-1 gap-3">
              <motion.button
                onClick={handleNext}
                whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                className={[
                  "w-full rounded-full py-4 text-base font-semibold text-white",
                  "bg-gradient-to-r from-rose-500 to-[#B11226]",
                  "shadow-lg shadow-rose-900/25 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:opacity-95 active:translate-y-0",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                  "disabled:opacity-60 disabled:hover:translate-y-0 disabled:active:scale-100",
                ].join(" ")}
                disabled={busy || pause || !!safe}
              >
                Next
              </motion.button>

              <div className="flex items-center justify-between gap-3">
                {mode === "category" && selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={[
                      actionBase,
                      "border border-white/10 bg-white/5 text-amber-200 backdrop-blur-md",
                      "hover:bg-white/10 hover:shadow-xl hover:shadow-black/30",
                    ].join(" ")}
                  >
                    Change category
                  </button>
                )}

                <button
                  onClick={endSession}
                  className={[
                    actionBase,
                    "ml-auto border border-[#B11226]/60 text-[#B11226]",
                    "hover:bg-[#B11226] hover:text-red-50 hover:shadow-xl hover:shadow-[#B11226]/20",
                  ].join(" ")}
                >
                  End session
                </button>
              </div>

              <p className="mt-2 text-xs text-white/50">
                Shortcuts: Right Arrow / Space = Next, P = Pause, S = Safe, Esc
                = Close
              </p>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
