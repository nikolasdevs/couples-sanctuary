"use client";

import { BottomNav } from "@/components/dashboard/BottomNav";
import { HealthGauge } from "@/components/dashboard/HealthGauge";
import type { PillarScore, PerceptionGap } from "@/lib/checkinScoring";
import { useCheckinStorage } from "@/lib/useCheckinStorage";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const PILLAR_COLORS: Record<string, string> = {
  "Emotional Safety": "#22c55e",
  Communication: "#3b82f6",
  "Intimacy & Affection": "#ec4899",
  "Quality Time": "#eab308",
  "Trust & Respect": "#8b5cf6",
  "Growth & Gratitude": "#f97316",
};

function pillarColor(pillar: string): string {
  return PILLAR_COLORS[pillar] ?? "#a1a1aa";
}

export default function CheckInResultsPage() {
  const { latestResult, ready } = useCheckinStorage();
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || !ready) {
    return (
      <main className="min-h-dvh bg-[#0A0A0A] flex items-center justify-center">
        <div className="h-6 w-40 animate-pulse rounded-lg bg-white/5" />
      </main>
    );
  }

  if (!latestResult) {
    return (
      <main className="min-h-dvh bg-[#0A0A0A] pb-24">
        <div className="mx-auto w-full max-w-xl px-5 pt-16 flex flex-col items-center gap-6">
          <span className="text-4xl">📊</span>
          <p className="text-sm text-white/50 text-center">
            No check-in results yet. Complete your first weekly check-in to see
            your relationship health breakdown.
          </p>
          <Link
            href="/checkin"
            className="text-sm text-amber-400 underline underline-offset-4"
          >
            Go to Check-In →
          </Link>
        </div>
        <BottomNav />
      </main>
    );
  }

  const { overallScore, pillarScores, gaps, insight } = latestResult;

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
            className="flex items-center gap-3"
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <Link
              href="/checkin"
              className="text-sm text-white/40 hover:text-white/60 transition"
            >
              ← Back
            </Link>
            <h1 className="text-lg font-semibold text-zinc-50">
              This Week&apos;s Results
            </h1>
          </motion.div>

          {/* Overall score */}
          <motion.div
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <p className="mb-4 text-center text-xs font-medium uppercase tracking-wider text-white/40">
              Relationship Health
            </p>
            <HealthGauge score={overallScore} />
          </motion.div>

          {/* Pillar breakdown */}
          <motion.div
            className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-white/40">
              Pillar Breakdown
            </p>
            <div className="flex flex-col gap-4">
              {pillarScores.map((ps) => (
                <PillarBar key={ps.pillar} pillarScore={ps} />
              ))}
            </div>
          </motion.div>

          {/* Perception Gaps */}
          {gaps.length > 0 && (
            <motion.div
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <p className="mb-4 text-xs font-medium uppercase tracking-wider text-white/40">
                Perception Gaps
              </p>
              <div className="flex flex-col gap-3">
                {gaps.map((gap, i) => (
                  <GapCard key={i} gap={gap} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Insight */}
          <motion.div
            className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-5"
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">💡</span>
              <p className="text-sm font-semibold text-zinc-50">
                Weekly Insight
              </p>
            </div>
            <p className="text-sm leading-relaxed text-white/60">{insight}</p>
          </motion.div>

          {/* Actions */}
          <motion.div
            className="flex flex-col gap-3 pb-4"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1 },
            }}
          >
            <Link
              href="/experience"
              className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-zinc-50 transition hover:bg-white/[0.07]"
            >
              🕯️ Start a Bonding Session
            </Link>
            <Link
              href="/dashboard"
              className="text-center text-sm text-white/40 underline underline-offset-4 transition hover:text-white/60"
            >
              Return to Dashboard
            </Link>
          </motion.div>
        </motion.div>
      </div>
      <BottomNav />
    </main>
  );
}

// ── Sub-components ──────────────────────────────────────────────

function PillarBar({ pillarScore }: { pillarScore: PillarScore }) {
  const color = pillarColor(pillarScore.pillar);
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-200">{pillarScore.pillar}</span>
        <span className="text-xs font-semibold tabular-nums" style={{ color }}>
          {pillarScore.combined}
        </span>
      </div>
      <div className="flex gap-1 items-center">
        {/* Combined bar */}
        <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${pillarScore.combined}%` }}
            transition={{
              duration: reduceMotion ? 0 : 0.8,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.2,
            }}
          />
        </div>
      </div>
      {/* Partner comparison */}
      <div className="flex gap-4 text-[10px] text-white/30">
        <span>A: {pillarScore.scoreA}</span>
        <span>B: {pillarScore.scoreB}</span>
        {pillarScore.gap >= 2 && (
          <span className="text-amber-400/60">
            Gap: {pillarScore.gap}
          </span>
        )}
      </div>
    </div>
  );
}

function GapCard({ gap }: { gap: PerceptionGap }) {
  const isBlindSpot = gap.severity === "blind-spot";

  return (
    <div
      className={`rounded-xl border p-4 ${
        isBlindSpot
          ? "border-rose-500/20 bg-rose-500/5"
          : "border-amber-500/15 bg-amber-500/5"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium" style={{ color: pillarColor(gap.pillar) }}>
          {gap.pillar}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
            isBlindSpot
              ? "bg-rose-500/10 text-rose-300"
              : "bg-amber-500/10 text-amber-300"
          }`}
        >
          {isBlindSpot ? "Blind Spot" : "Perception Gap"}
        </span>
      </div>
      <p className="text-sm text-white/60 leading-relaxed mb-2">
        &ldquo;{gap.question}&rdquo;
      </p>
      <div className="flex gap-4 text-xs">
        <span className="text-white/40">Partner A: <span className="font-semibold text-zinc-200">{gap.valueA}/5</span></span>
        <span className="text-white/40">Partner B: <span className="font-semibold text-zinc-200">{gap.valueB}/5</span></span>
      </div>
    </div>
  );
}
