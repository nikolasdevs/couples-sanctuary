"use client";

import { BottomNav } from "@/components/dashboard/BottomNav";
import { HealthGauge } from "@/components/dashboard/HealthGauge";
import { useCheckinStorage } from "@/lib/useCheckinStorage";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CheckInPage() {
  const reduceMotion = useReducedMotion();
  const { latestResult, history, ready } = useCheckinStorage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || !ready) {
    return (
      <main className="min-h-dvh bg-[#0A0A0A] flex items-center justify-center">
        <div className="h-6 w-40 animate-pulse rounded-lg bg-white/5" />
      </main>
    );
  }

  const hasResults = history.results.length > 0;

  return (
    <main className="min-h-dvh bg-[#0A0A0A] pb-24">
      <div className="mx-auto w-full max-w-xl px-5 pt-8">
        <motion.div
          className="flex flex-col gap-6"
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
          {/* Header */}
          <motion.div
            className="flex items-center justify-between"
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10">
                <span className="text-xl">💬</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-zinc-50">Check-In</h1>
                <p className="text-xs text-white/40">Weekly relationship reflection</p>
              </div>
            </div>
          </motion.div>

          {/* Current health / CTA */}
          {hasResults ? (
            <motion.div
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            >
              <p className="mb-4 text-center text-xs font-medium uppercase tracking-wider text-white/40">
                Latest Score
              </p>
              <HealthGauge score={latestResult?.overallScore ?? null} size={140} />
            </motion.div>
          ) : (
            <motion.div
              className="rounded-2xl border border-dashed border-amber-500/20 bg-amber-500/5 p-6 text-center"
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            >
              <span className="text-3xl mb-3 block">📊</span>
              <p className="text-sm text-white/50 leading-relaxed">
                Your first check-in will reveal your relationship health score.
                Both partners answer 12 questions independently, then see where
                you align.
              </p>
            </motion.div>
          )}

          {/* Start check-in button */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
          >
            <Link
              href="/checkin/active"
              className="block w-full rounded-full bg-amber-500 py-3.5 text-center text-sm font-semibold text-black transition hover:bg-amber-400"
            >
              {hasResults ? "Start This Week's Check-In" : "Begin Your First Check-In"}
            </Link>
          </motion.div>

          {/* Past results */}
          {hasResults && (
            <motion.div
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            >
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-white/40">
                History
              </p>
              <div className="flex flex-col gap-2">
                {history.results.map((r) => (
                  <Link
                    key={r.weekKey}
                    href="/checkin/results"
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:bg-white/[0.06]"
                  >
                    <span className="text-xs text-white/50">
                      Week of {r.weekKey}
                    </span>
                    <span
                      className="text-sm font-semibold tabular-nums"
                      style={{
                        color:
                          r.overallScore >= 75
                            ? "#22c55e"
                            : r.overallScore >= 60
                              ? "#eab308"
                              : "#f97316",
                      }}
                    >
                      {r.overallScore}/100
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Latest insight */}
          {latestResult?.insight && (
            <motion.div
              className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-5"
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">💡</span>
                <p className="text-sm font-semibold text-zinc-50">Latest Insight</p>
              </div>
              <p className="text-sm leading-relaxed text-white/60">
                {latestResult.insight}
              </p>
              <Link
                href="/checkin/results"
                className="mt-3 inline-block text-xs text-amber-400 underline underline-offset-4"
              >
                View full results →
              </Link>
            </motion.div>
          )}

          {/* Back to dashboard */}
          <motion.div
            className="text-center pb-2"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
          >
            <Link
              href="/dashboard"
              className="text-sm text-white/40 underline underline-offset-4 transition hover:text-white/60"
            >
              ← Back to Dashboard
            </Link>
          </motion.div>
        </motion.div>
      </div>
      <BottomNav />
    </main>
  );
}
