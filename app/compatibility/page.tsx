"use client";

import { BottomNav } from "@/components/dashboard/BottomNav";
import { DIMENSION_META, type Dimension } from "@/data/compatQuestions";
import { useCompatStorage } from "@/lib/useCompatStorage";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const variant = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function CompatibilityPage() {
  const reduceMotion = useReducedMotion();
  const { result, ready } = useCompatStorage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || !ready) {
    return (
      <main className="min-h-dvh bg-[#0A0A0A] flex items-center justify-center">
        <div className="h-6 w-40 animate-pulse rounded-lg bg-white/5" />
      </main>
    );
  }

  const hasResult = result !== null;

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
          <motion.div className="flex items-center gap-3" variants={variant}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-500/20 bg-purple-500/10">
              <span className="text-xl">🔮</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-zinc-50">Compatibility</h1>
              <p className="text-xs text-white/40">Understand your alignment</p>
            </div>
          </motion.div>

          {/* Score or intro */}
          {hasResult ? (
            <motion.div
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm text-center"
              variants={variant}
            >
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-white/40">
                Overall Alignment
              </p>
              <p
                className="text-5xl font-bold tabular-nums"
                style={{
                  color:
                    result.overallAlignment >= 80
                      ? "#22c55e"
                      : result.overallAlignment >= 60
                        ? "#eab308"
                        : "#f97316",
                }}
              >
                {result.overallAlignment}%
              </p>
              <p className="mt-1 text-xs text-white/40">
                {result.overallAlignment >= 80
                  ? "Deeply aligned"
                  : result.overallAlignment >= 60
                    ? "Solid foundation"
                    : "Room to grow together"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              className="rounded-2xl border border-dashed border-purple-500/20 bg-purple-500/5 p-6 text-center"
              variants={variant}
            >
              <span className="text-3xl mb-3 block">🔮</span>
              <p className="text-sm text-white/50 leading-relaxed">
                Discover how aligned you are across love language, conflict
                style, life vision, and more. Both partners answer independently
                — then see where you connect and where you can grow.
              </p>
            </motion.div>
          )}

          {/* CTA */}
          <motion.div variants={variant}>
            <Link
              href="/compatibility/assess"
              className="block w-full rounded-full bg-purple-600 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-purple-500"
            >
              {hasResult ? "Retake Assessment" : "Start Assessment"}
            </Link>
          </motion.div>

          {/* Dimension breakdown */}
          {hasResult && (
            <motion.div
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
              variants={variant}
            >
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-white/40">
                Dimensions
              </p>
              <div className="flex flex-col gap-3">
                {result.dimensions.map((d) => {
                  const meta = DIMENSION_META[d.dimension as Dimension];
                  return (
                    <div key={d.dimension} className="flex items-center gap-3">
                      <span className="text-lg">{meta?.icon ?? "•"}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-zinc-50 truncate">
                            {d.dimension}
                          </span>
                          <span
                            className="text-xs font-semibold tabular-nums"
                            style={{
                              color:
                                d.alignment >= 80
                                  ? "#22c55e"
                                  : d.alignment >= 60
                                    ? "#eab308"
                                    : "#f97316",
                            }}
                          >
                            {d.alignment}%
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${d.alignment}%`,
                              backgroundColor:
                                d.alignment >= 80
                                  ? "#22c55e"
                                  : d.alignment >= 60
                                    ? "#eab308"
                                    : "#f97316",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Link
                href="/compatibility/results"
                className="mt-4 inline-block text-xs text-purple-400 underline underline-offset-4"
              >
                View full results →
              </Link>
            </motion.div>
          )}

          {/* Strengths & Growth */}
          {hasResult && result.strengths.length > 0 && (
            <motion.div className="grid grid-cols-2 gap-3" variants={variant}>
              <div className="rounded-2xl border border-green-500/15 bg-green-500/5 p-4">
                <p className="text-xs font-medium text-green-400 mb-2">Strengths</p>
                {result.strengths.map((s) => (
                  <p key={s.dimension} className="text-xs text-white/60 leading-relaxed">
                    {DIMENSION_META[s.dimension as Dimension]?.icon} {s.dimension}
                  </p>
                ))}
              </div>
              <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-4">
                <p className="text-xs font-medium text-amber-400 mb-2">Growth Areas</p>
                {result.growthAreas.map((g) => (
                  <p key={g.dimension} className="text-xs text-white/60 leading-relaxed">
                    {DIMENSION_META[g.dimension as Dimension]?.icon} {g.dimension}
                  </p>
                ))}
              </div>
            </motion.div>
          )}

          {/* Back to dashboard */}
          <motion.div className="text-center pb-2" variants={variant}>
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
