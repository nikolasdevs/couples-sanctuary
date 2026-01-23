// app/experience/page.tsx
"use client";

import { FocusCardsDemo } from "@/components/FocusCards";
import { motion, useReducedMotion, Variants } from "framer-motion";
import Link from "next/link";

export default function ExperiencePage() {
  const reduceMotion = useReducedMotion();

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };

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

        {/* Content surface */}
        <motion.section
          className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md md:p-6"
          variants={fadeUp}
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-50">Start here</p>
            <div className="h-px flex-1 bg-white/10 mx-4" />
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
    </main>
  );
}
