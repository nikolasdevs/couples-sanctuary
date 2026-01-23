// app/page.tsx
"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
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
              "url('https://res.cloudinary.com/dpnzmcban/image/upload/v1768124985/e1648837-0c91-43d7-9c03-a6e0273b7719_lxwa6o.jpg')",
          }}
        />
        <motion.div
          className="absolute inset-0 bg-linear-to-b from-black/70 via-black/80 to-black/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.8 }}
        />
        <motion.div
          className="absolute inset-0 shadow-[inset_0_0_160px_rgba(0,0,0,0.85)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: reduceMotion ? 0 : 1.0,
            delay: reduceMotion ? 0 : 0.05,
          }}
        />
      </div>

      <motion.div
        className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center py-10"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: reduceMotion ? 0 : 0.08,
              delayChildren: 0.05,
            },
          },
        }}
      >
        {/* Logo */}
        <motion.div
          className="relative mb-6 h-24 w-24"
          variants={{
            hidden: {
              opacity: 0,
              scale: reduceMotion ? 1 : 0.96,
              y: reduceMotion ? 0 : 8,
            },
            show: {
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
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

        {/* Main card */}
        <motion.section
          className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
          variants={fadeUp}
          whileHover={reduceMotion ? undefined : { y: -2 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          <motion.h1
            className="text-center text-2xl font-semibold tracking-tight text-zinc-50"
            variants={fadeUp}
          >
            The Couples Sanctuary
          </motion.h1>

          <motion.p
            className="mt-3 text-center text-base leading-relaxed text-zinc-200"
            variants={fadeUp}
          >
            This is not a game.
            <br />
            It is a conversation you&apos;ve been postponing.
          </motion.p>

          {/* Presence Prompt */}
          <motion.div
            className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4 text-center text-sm leading-relaxed text-zinc-100"
            variants={fadeUp}
          >
            <p className="font-medium text-zinc-50">Before you begin</p>
            <p className="mt-2 text-zinc-200">
              Sit close. <br />
              Silence notifications. <br />
              Be present with each other.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div className="mt-6" variants={fadeUp}>
            <motion.div
              whileTap={reduceMotion ? undefined : { scale: 0.99 }}
              whileHover={reduceMotion ? undefined : { scale: 1.01 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Link
                href="/experience"
                className=" w-full inline-block rounded-full bg-linear-to-r from-rose-500 to-[#B11226] py-3.5 text-center text-base font-semibold text-white shadow-lg shadow-rose-900/25 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-[0.99] hover:bg-linear-to-r hover:from-rose-100 hover:to-[#ee8290]"
                aria-label="Start the experience"
              >
                <span className="relative z-10">Start Together</span>
              </Link>
            </motion.div>

            <p className="mt-4 text-center text-xs leading-relaxed text-zinc-300">
              Nothing is recorded. Nothing is saved.
              <br />
              This moment belongs only to the two of you.
            </p>
          </motion.div>
        </motion.section>

        {/* Footer */}
        <motion.p
          className="mt-6 text-center text-xs text-white/50"
          variants={fadeUp}
        >
          Built for calm. Designed for presence.
        </motion.p>
      </motion.div>
    </main>
  );
}
