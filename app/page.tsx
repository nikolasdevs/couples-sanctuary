// app/page.tsx
"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const EASE = [0.22, 1, 0.36, 1] as const;

const pillars = [
  {
    icon: "🕯️",
    label: "Bond",
    color: "from-rose-500/20 to-rose-500/5",
    border: "border-rose-500/20",
    accent: "text-rose-400",
    description:
      "73 intimate prompts across Connection, Memory, Vulnerability, Desire & Challenge. No screens between you — just words that open doors.",
  },
  {
    icon: "🔮",
    label: "Compatibility",
    color: "from-violet-500/20 to-violet-500/5",
    border: "border-violet-500/20",
    accent: "text-violet-400",
    description:
      "Discover your alignment across 8 dimensions — from Love Language to Life Vision to Financial Values. See where you sync and where you can grow.",
  },
  {
    icon: "💬",
    label: "Check-In",
    color: "from-amber-500/20 to-amber-500/5",
    border: "border-amber-500/20",
    accent: "text-amber-400",
    description:
      "A weekly pulse on your relationship health. 6 pillars, honest answers, and insights that reveal what you both feel but rarely say.",
  },
];

const steps = [
  { num: "01", text: "Sit together or connect remotely with a sync code" },
  { num: "02", text: "Choose an experience — Bond, Compatibility, or Check-In" },
  { num: "03", text: "Answer honestly, listen deeply, and grow closer" },
];

export default function LandingPage() {
  const reduceMotion = useReducedMotion();

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: EASE },
    },
  };

  const stagger = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.09,
        delayChildren: 0.05,
      },
    },
  };

  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-[#0A0A0A]">
      {/* ─── HERO ─── */}
      <section className="relative px-6">
        {/* Background image */}
        <div className="absolute inset-0 -z-20">
          <div
            className="h-full w-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://res.cloudinary.com/dpnzmcban/image/upload/v1768124985/e1648837-0c91-43d7-9c03-a6e0273b7719_lxwa6o.jpg')",
            }}
          />
          <motion.div
            className="absolute inset-0 bg-linear-to-b from-black/60 via-black/80 to-[#0A0A0A]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.8 }}
          />
          <div className="absolute inset-0 shadow-[inset_0_0_160px_rgba(0,0,0,0.85)]" />
        </div>

        <motion.div
          className="mx-auto flex min-h-dvh w-full max-w-lg flex-col items-center justify-center py-16"
          initial="hidden"
          animate="show"
          variants={stagger}
        >
          {/* Logo */}
          <motion.div
            className="relative mb-5 h-20 w-20"
            variants={{
              hidden: { opacity: 0, scale: reduceMotion ? 1 : 0.92 },
              show: {
                opacity: 1,
                scale: 1,
                transition: { duration: 0.6, ease: EASE },
              },
            }}
          >
            <Image
              src="https://res.cloudinary.com/dpnzmcban/image/upload/v1768054589/Group_2263-_riwvag.png"
              alt="The Couples Sanctuary"
              fill
              className="object-contain drop-shadow"
              priority
            />
          </motion.div>

          <motion.h1
            className="text-center text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl"
            variants={fadeUp}
          >
            The Couples Sanctuary
          </motion.h1>

          <motion.p
            className="mt-4 max-w-sm text-center text-base leading-relaxed text-zinc-300"
            variants={fadeUp}
          >
            A private space for two — to bond deeper, understand each other
            better, and keep your relationship healthy. No therapist&apos;s
            office. Just you two and the right questions.
          </motion.p>

          {/* Hero CTA */}
          <motion.div className="mt-8 w-full max-w-xs" variants={fadeUp}>
            <motion.div
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              whileHover={reduceMotion ? undefined : { scale: 1.02 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Link
                href="/dashboard"
                className="block w-full rounded-full bg-linear-to-r from-rose-500 to-[#B11226] py-3.5 text-center text-base font-semibold text-white shadow-lg shadow-rose-900/30 transition hover:from-rose-400 hover:to-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
              >
                Enter the Sanctuary
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            className="mt-12"
            variants={fadeUp}
            animate={
              reduceMotion
                ? {}
                : { y: [0, 6, 0] }
            }
            transition={
              reduceMotion
                ? undefined
                : { repeat: Infinity, duration: 2, ease: "easeInOut" }
            }
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-white/30"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── THREE PILLARS ─── */}
      <section className="px-6 py-20">
        <motion.div
          className="mx-auto max-w-lg"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
        >
          <motion.p
            className="text-center text-xs font-medium uppercase tracking-[0.2em] text-zinc-500"
            variants={fadeUp}
          >
            Three experiences, one sanctuary
          </motion.p>
          <motion.h2
            className="mt-3 text-center text-2xl font-semibold tracking-tight text-zinc-50"
            variants={fadeUp}
          >
            Everything you need — nothing you don&apos;t
          </motion.h2>

          <div className="mt-10 space-y-4">
            {pillars.map((p) => (
              <motion.div
                key={p.label}
                className={`rounded-2xl border ${p.border} bg-linear-to-br ${p.color} p-5 backdrop-blur-sm`}
                variants={fadeUp}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{p.icon}</span>
                  <h3 className={`text-lg font-semibold ${p.accent}`}>
                    {p.label}
                  </h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                  {p.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="px-6 py-16">
        <motion.div
          className="mx-auto max-w-lg"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
        >
          <motion.h2
            className="text-center text-2xl font-semibold tracking-tight text-zinc-50"
            variants={fadeUp}
          >
            How it works
          </motion.h2>

          <div className="mt-8 space-y-5">
            {steps.map((s) => (
              <motion.div
                key={s.num}
                className="flex items-start gap-4"
                variants={fadeUp}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-rose-400">
                  {s.num}
                </span>
                <p className="pt-1.5 text-sm leading-relaxed text-zinc-300">
                  {s.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── PRESENCE + PRIVACY ─── */}
      <section className="px-6 py-16">
        <motion.div
          className="mx-auto max-w-lg"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
        >
          <motion.div
            className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm"
            variants={fadeUp}
          >
            <p className="text-lg font-medium text-zinc-50">
              Before you begin
            </p>
            <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-zinc-400">
              Sit close. Silence notifications. Be present with each other.
              This is not a game — it is a conversation you&apos;ve been
              postponing.
            </p>

            <div className="mx-auto mt-6 flex max-w-xs flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {[
                { icon: "🔒", text: "Nothing saved to any server" },
                { icon: "👁️‍🗨️", text: "No one sees your answers" },
                { icon: "📱", text: "Works offline as a PWA" },
              ].map((f) => (
                <span
                  key={f.text}
                  className="flex items-center gap-1.5 text-xs text-zinc-500"
                >
                  <span>{f.icon}</span>
                  {f.text}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="px-6 pb-20 pt-4">
        <motion.div
          className="mx-auto flex max-w-lg flex-col items-center"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={stagger}
        >
          <motion.div className="w-full max-w-xs" variants={fadeUp}>
            <motion.div
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              whileHover={reduceMotion ? undefined : { scale: 1.02 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Link
                href="/dashboard"
                className="block w-full rounded-full bg-linear-to-r from-rose-500 to-[#B11226] py-3.5 text-center text-base font-semibold text-white shadow-lg shadow-rose-900/30 transition hover:from-rose-400 hover:to-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
              >
                Enter the Sanctuary
              </Link>
            </motion.div>
          </motion.div>

          <motion.p
            className="mt-5 text-center text-xs text-zinc-600"
            variants={fadeUp}
          >
            This moment belongs only to the two of you.
          </motion.p>
        </motion.div>
      </section>
    </main>
  );
}
