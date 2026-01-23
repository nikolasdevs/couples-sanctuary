// app/experience/page.tsx
"use client";

import { FocusCardsDemo } from "@/components/FocusCards";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

type SanctuaryLen = "quick" | "standard" | "deep";

function ExperienceFallback() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#0A0A0A] px-6">
      <div className="absolute inset-0 -z-20">
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

      <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col justify-center py-10 text-center">
        <div className="text-white/50">Loading experience options...</div>
      </div>
    </main>
  );
}

function ExperienceContent() {
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const params = useSearchParams();

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };

  // ✅ modal is closed by default (so it never appears initially)
  const [showSanctuaryLen, setShowSanctuaryLen] = useState(false);
  const [sanctuaryLen, setSanctuaryLen] = useState<SanctuaryLen>("standard");

  // Optional: open modal only when user has explicitly "picked" sanctuary via URL
  useEffect(() => {
    const flow = params.get("flow");
    const focus = params.get("focus");
    const len = params.get("len");

    // Schedule state updates asynchronously to avoid cascading synchronous renders
    if (flow === "sanctuary" || focus === "sanctuary") {
      Promise.resolve().then(() => {
        setShowSanctuaryLen(true);
        if (len === "quick" || len === "standard" || len === "deep")
          setSanctuaryLen(len);
      });
    } else if (len === "quick" || len === "standard" || len === "deep") {
      Promise.resolve().then(() => setSanctuaryLen(len));
    }
  }, [params]);

  const sanctuaryMeta = useMemo(() => {
    const map: Record<SanctuaryLen, { total: number; hint: string }> = {
      quick: { total: 20, hint: "15–25 min" },
      standard: { total: 40, hint: "30–50 min" },
      deep: { total: 60, hint: "50–80 min" },
    };
    return map[sanctuaryLen];
  }, [sanctuaryLen]);

  const closeModal = () => {
    setShowSanctuaryLen(false);
    // Clean up any deep-link params so refresh doesn't re-open the modal
    router.replace("/experience", { scroll: false });
  };

  const segBtn = (active: boolean) =>
    [
      "flex-1 rounded-full px-4 py-2 text-sm font-semibold transition",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
      active
        ? "bg-white/10 text-zinc-50 border border-white/15 shadow-lg shadow-black/25"
        : "bg-transparent text-white/70 hover:bg-white/5 border border-white/10",
    ].join(" ");

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#0A0A0A] px-6">
      {/* Background */}
      <div className="absolute inset-0 -z-20">
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

      <motion.div
        className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col justify-center py-10"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: reduceMotion ? 0 : 0.08,
              delayChildren: 0.04,
            },
          },
        }}
      >
        {/* Top row */}
        <motion.div
          className="mb-6 flex items-center justify-between"
          variants={fadeUp}
        >
          <Link
            href="/"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-100 backdrop-blur-md transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            ← Home
          </Link>

          <p className="text-xs text-white/55">
            Private • No tracking • No saves
          </p>
        </motion.div>

        {/* Header */}
        <motion.header className="text-center" variants={fadeUp}>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            Choose your experience
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-200 md:text-base">
            Pick a pace that matches your mood. You can pause, breathe, and
            return whenever you’re ready.
          </p>
        </motion.header>

        {/* Sanctuary pick (opens modal) */}
        {/* <motion.section
          className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md md:p-6"
          variants={fadeUp}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-zinc-50">
                Sanctuary (guided)
              </p>
              <p className="mt-1 text-xs text-white/60">
                Structured flow with gentle progression.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowSanctuaryLen(true)}
              className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-semibold text-white/75 backdrop-blur-md transition hover:bg-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Choose length
            </button>
          </div>
        </motion.section> */}

        {/* Other experiences (unchanged) */}
        <motion.section
          className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md md:p-6"
          variants={fadeUp}
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-50">Start here</p>
            <div className="mx-4 h-px flex-1 bg-white/10" />
            <p className="text-xs text-zinc-300">Tap a card to begin</p>
          </div>

          <div className="mt-2">
            <FocusCardsDemo />
          </div>

          <p className="mt-6 text-center text-xs leading-relaxed text-white/60">
            Tip: put phones on silent and sit close. If anything feels too
            intense, you can stop at any time.
          </p>
        </motion.section>
      </motion.div>

      {/* ✅ Sanctuary length modal (only appears after sanctuary is picked) */}
      <AnimatePresence>
        {showSanctuaryLen && (
          <motion.div
            key="sanctuary-len-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            role="dialog"
            aria-modal="true"
            aria-label="Choose Sanctuary length"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) closeModal();
            }}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            <div className="relative mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-center px-6 py-10">
              <motion.div
                initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-widest text-white/70">
                      SANCTUARY
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-zinc-50">
                      Choose your session length
                    </h2>
                    <p className="mt-1 text-xs text-white/60">
                      {sanctuaryMeta.total} prompts • {sanctuaryMeta.hint}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-full border border-white/10 bg-black/30 px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    Close
                  </button>
                </div>

                <div className="mt-5 flex w-full items-center gap-2 rounded-full bg-black/25 p-1 border border-white/10">
                  <button
                    type="button"
                    className={segBtn(sanctuaryLen === "quick")}
                    onClick={() => setSanctuaryLen("quick")}
                  >
                    Quick
                  </button>
                  <button
                    type="button"
                    className={segBtn(sanctuaryLen === "standard")}
                    onClick={() => setSanctuaryLen("standard")}
                  >
                    Standard
                  </button>
                  <button
                    type="button"
                    className={segBtn(sanctuaryLen === "deep")}
                    onClick={() => setSanctuaryLen("deep")}
                  >
                    Deep
                  </button>
                </div>

                <Link
                  href={`/experience/play?mode=sanctuary&len=${sanctuaryLen}`}
                  className="mt-5 block w-full rounded-full bg-linear-to-r from-rose-500 to-[#B11226] py-4 text-center text-base font-semibold text-white shadow-lg shadow-rose-900/25 transition-all duration-200 ease-out hover:from-rose-100 hover:to-[#ff7b8b] hover:shadow-xl hover:shadow-rose-900/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-[0.99]"
                >
                  Start Sanctuary
                </Link>

                <p className="mt-3 text-center text-xs text-white/55">
                  You can pause anytime. Use{" "}
                  <span className="text-white/75">Safe</span> if anything feels
                  intense.
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function ExperiencePage() {
  return (
    <Suspense fallback={<ExperienceFallback />}>
      <ExperienceContent />
    </Suspense>
  );
}
