"use client";

import { BottomNav } from "@/components/dashboard/BottomNav";
import { JoinPartner } from "@/components/sync/JoinPartner";
import { ModeSelect } from "@/components/sync/ModeSelect";
import { WaitingRoom } from "@/components/sync/WaitingRoom";
import {
  compatQuestions,
  DIMENSIONS,
  DIMENSION_META,
  type Dimension,
} from "@/data/compatQuestions";
import { scoreCompatibility, type CompatResponses } from "@/lib/compatScoring";
import { useCompatStorage } from "@/lib/useCompatStorage";
import { useDashboard } from "@/lib/useDashboard";
import { useSync } from "@/lib/useSync";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";

type Phase =
  | "mode-select"
  | "pick-partner"
  | "join"
  | "answering"
  | "waiting"
  | "sync-waiting"
  | "done";

function CompatAssessmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();
  const { savePartnerResponses, getResponses, saveResult } = useCompatStorage();
  const { update: updateDashboard } = useDashboard();
  const sync = useSync();

  const questions = useMemo(() => compatQuestions, []);

  // Sync state
  const [syncCode, setSyncCode] = useState<string | null>(null);
  const [syncMode, setSyncMode] = useState(false);

  // Check URL params for incoming sync join
  const urlSyncCode = searchParams.get("sync");
  const urlPartner = searchParams.get("partner") as "A" | "B" | null;

  const [phase, setPhase] = useState<Phase>("mode-select");
  const [currentPartner, setCurrentPartner] = useState<"A" | "B">("A");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<CompatResponses>({});
  const [mounted, setMounted] = useState(false);
  const [aCompleted, setACompleted] = useState(false);
  const [bCompleted, setBCompleted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = getResponses();
    if (saved.partnerA) setACompleted(true);
    if (saved.partnerB) setBCompleted(true);

    // If joined via URL, go straight to answering
    if (urlSyncCode && urlPartner) {
      setSyncCode(urlSyncCode);
      setSyncMode(true);
      setCurrentPartner(urlPartner);
      setPhase("answering");
    }
  }, [getResponses, urlSyncCode, urlPartner]);

  const currentQ = questions[questionIndex];
  const isLast = questionIndex === questions.length - 1;
  const progress = ((questionIndex + 1) / questions.length) * 100;

  // Current dimension info
  const currentDim = currentQ?.dimension as Dimension;
  const dimMeta = currentDim ? DIMENSION_META[currentDim] : null;

  // Show dimension label when it changes
  const prevDim = questionIndex > 0 ? questions[questionIndex - 1]?.dimension : null;
  const isDimChange = currentDim !== prevDim;

  // ── Mode selection handlers ──
  const handleTogether = useCallback(() => {
    setPhase("pick-partner");
  }, []);

  const handleApart = useCallback(async () => {
    const code = await sync.createSession("compatibility");
    if (code) {
      setSyncCode(code);
      setSyncMode(true);
      setCurrentPartner("A");
      setPhase("answering");
    }
  }, [sync]);

  const handleJoinScreen = useCallback(() => {
    setPhase("join");
  }, []);

  const handleJoinCode = useCallback(
    async (code: string) => {
      const session = await sync.getSession(code);
      if (!session) return;
      setSyncCode(code);
      setSyncMode(true);
      const partner = session.partnerA ? "B" : "A";
      setCurrentPartner(partner);
      setPhase("answering");
    },
    [sync],
  );

  const handleSelectPartner = useCallback(
    (partner: "A" | "B") => {
      const saved = getResponses();
      if (partner === "A" && saved.partnerA) {
        setCurrentPartner("B");
        setPhase("answering");
        return;
      }
      if (partner === "B" && saved.partnerB) {
        setCurrentPartner("A");
        setPhase("answering");
        return;
      }
      setCurrentPartner(partner);
      setPhase("answering");
    },
    [getResponses],
  );

  // Score and save results (shared between together and sync modes)
  const scoreAndFinish = useCallback(
    (respA: CompatResponses, respB: CompatResponses) => {
      const result = scoreCompatibility(respA, respB);
      saveResult(result);
      updateDashboard({ compatibilityDone: true });
      setPhase("done");
      setTimeout(() => router.push("/compatibility/results"), 800);
    },
    [saveResult, updateDashboard, router],
  );

  const handleAnswer = useCallback(
    async (optionLabel: string) => {
      if (!currentQ) return;
      const next = { ...responses, [currentQ.id]: optionLabel };
      setResponses(next);

      if (isLast) {
        if (syncMode && syncCode) {
          // ── Sync mode: submit to server ──
          const result = await sync.submitResponses(
            syncCode,
            currentPartner,
            currentPartner === "A" ? "Partner A" : "Partner B",
            next as Record<string, unknown>,
          );

          // Also save locally
          savePartnerResponses(currentPartner, next);

          if (result.complete) {
            // Both done
            const session = await sync.getSession(syncCode);
            if (session?.partnerA && session?.partnerB) {
              const respA = (currentPartner === "A" ? next : session.partnerA.responses) as CompatResponses;
              const respB = (currentPartner === "B" ? next : session.partnerB.responses) as CompatResponses;
              scoreAndFinish(respA, respB);
            }
          } else {
            setPhase("sync-waiting");
          }
        } else {
          // ── Together mode ──
          savePartnerResponses(currentPartner, next);
          const saved = getResponses();
          const otherDone =
            currentPartner === "A"
              ? saved.partnerB !== null
              : saved.partnerA !== null;

          if (otherDone) {
            const respA = currentPartner === "A" ? next : saved.partnerA!;
            const respB = currentPartner === "B" ? next : saved.partnerB!;
            scoreAndFinish(respA, respB);
          } else {
            if (currentPartner === "A") setACompleted(true);
            else setBCompleted(true);
            setPhase("waiting");
          }
        }
      } else {
        setQuestionIndex((i) => i + 1);
      }
    },
    [
      currentQ,
      isLast,
      responses,
      currentPartner,
      syncMode,
      syncCode,
      sync,
      savePartnerResponses,
      getResponses,
      scoreAndFinish,
    ],
  );

  const handleContinueAsOther = useCallback(() => {
    setCurrentPartner((p) => (p === "A" ? "B" : "A"));
    setQuestionIndex(0);
    setResponses({});
    setPhase("answering");
  }, []);

  // Poll function for sync waiting room
  const pollForPartner = useCallback(async (): Promise<boolean> => {
    if (!syncCode) return false;
    const session = await sync.getSession(syncCode);
    if (!session) return false;
    if (session.partnerA && session.partnerB) {
      const respA = session.partnerA.responses as CompatResponses;
      const respB = session.partnerB.responses as CompatResponses;
      scoreAndFinish(respA, respB);
      return true;
    }
    return false;
  }, [syncCode, sync, scoreAndFinish]);

  if (!mounted) {
    return (
      <main className="min-h-dvh bg-[#0A0A0A] flex items-center justify-center">
        <div className="h-6 w-40 animate-pulse rounded-lg bg-white/5" />
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-[#0A0A0A] pb-24">
      <div className="mx-auto w-full max-w-xl px-5 pt-8">
        {/* ── Mode selection (Together / Apart / Join) ── */}
        {phase === "mode-select" && (
          <ModeSelect
            title="Compatibility Assessment"
            icon="🔮"
            accentClass="border-purple-500/20 bg-purple-500/10"
            onSelectTogether={handleTogether}
            onSelectApart={handleApart}
            onJoin={handleJoinScreen}
            loading={sync.loading}
            error={sync.error}
          />
        )}

        {/* ── Join with code ── */}
        {phase === "join" && (
          <JoinPartner
            accentBg="bg-purple-600"
            accentText="text-white"
            onJoin={handleJoinCode}
            onBack={() => setPhase("mode-select")}
            loading={sync.loading}
            error={sync.error}
          />
        )}

        {/* ── Partner selection (together mode) ── */}
        {phase === "pick-partner" && (
          <motion.div
            className="flex flex-col items-center gap-8 pt-16"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-purple-500/20 bg-purple-500/10">
              <span className="text-3xl">🔮</span>
            </div>
            <h1 className="text-xl font-semibold text-zinc-50">
              Compatibility Assessment
            </h1>
            <p className="max-w-xs text-center text-sm text-white/50 leading-relaxed">
              {questions.length} questions across {DIMENSIONS.length} dimensions.
              Each partner answers independently — no peeking.
              Takes about 12 minutes per person.
            </p>

            <div className="flex w-full flex-col gap-3">
              <button
                onClick={() => handleSelectPartner("A")}
                disabled={aCompleted}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:bg-white/[0.07] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div>
                  <p className="text-sm font-semibold text-zinc-50">Partner A</p>
                  <p className="text-xs text-white/40">
                    {aCompleted ? "Completed ✓" : "Tap to start"}
                  </p>
                </div>
                <span className="text-lg">{aCompleted ? "✅" : "→"}</span>
              </button>

              <button
                onClick={() => handleSelectPartner("B")}
                disabled={bCompleted}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:bg-white/[0.07] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div>
                  <p className="text-sm font-semibold text-zinc-50">Partner B</p>
                  <p className="text-xs text-white/40">
                    {bCompleted ? "Completed ✓" : "Tap to start"}
                  </p>
                </div>
                <span className="text-lg">{bCompleted ? "✅" : "→"}</span>
              </button>
            </div>

            {(aCompleted || bCompleted) && !(aCompleted && bCompleted) && (
              <p className="text-xs text-purple-300/70 text-center">
                One partner has completed. Hand the phone to the other to unlock
                results.
              </p>
            )}
          </motion.div>
        )}

        {/* ── Answering ── */}
        {phase === "answering" && currentQ && (
          <motion.div
            className="flex flex-col gap-5 pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Progress bar */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (questionIndex > 0) setQuestionIndex((i) => i - 1);
                  else setPhase(syncMode ? "mode-select" : "pick-partner");
                }}
                className="text-sm text-white/40 hover:text-white/60 transition"
              >
                ←
              </button>
              <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="text-xs text-white/40 tabular-nums">
                {questionIndex + 1}/{questions.length}
              </span>
            </div>

            {/* Partner + dimension indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                <span className="text-xs text-white/50">
                  Partner {currentPartner}
                  {syncMode && " (remote)"}
                </span>
              </div>
              {dimMeta && (
                <span
                  className="text-xs font-medium"
                  style={{ color: dimMeta.color }}
                >
                  {dimMeta.icon} {currentDim}
                </span>
              )}
            </div>

            {/* Dimension transition card */}
            <AnimatePresence mode="wait">
              {isDimChange && dimMeta && (
                <motion.div
                  key={`dim-${currentDim}`}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-2xl">{dimMeta.icon}</span>
                  <p className="mt-1 text-sm font-semibold text-zinc-50">
                    {currentDim}
                  </p>
                  <p className="text-xs text-white/40">{dimMeta.description}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Question card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
                initial={{ opacity: 0, x: reduceMotion ? 0 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: reduceMotion ? 0 : -30 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-base leading-relaxed text-zinc-100">
                  {currentQ.text}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Options */}
            <div className="flex flex-col gap-2">
              {currentQ.options.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => handleAnswer(opt.label)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-left text-sm text-zinc-200 transition hover:bg-white/[0.08] hover:border-purple-500/30 active:scale-[0.99]"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Waiting (together mode) ── */}
        {phase === "waiting" && (
          <motion.div
            className="flex flex-col items-center gap-6 pt-20"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-purple-500/20 bg-purple-500/10">
              <span className="text-4xl">🤝</span>
            </div>
            <h2 className="text-lg font-semibold text-zinc-50">
              Partner {currentPartner} is done!
            </h2>
            <p className="max-w-xs text-center text-sm text-white/50 leading-relaxed">
              Hand the phone to your partner. Once both complete the assessment,
              your compatibility map will be revealed.
            </p>
            <button
              onClick={handleContinueAsOther}
              className="rounded-full bg-purple-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-400"
            >
              Continue as Partner {currentPartner === "A" ? "B" : "A"}
            </button>
          </motion.div>
        )}

        {/* ── Waiting for remote partner (sync mode) ── */}
        {phase === "sync-waiting" && syncCode && (
          <WaitingRoom
            code={syncCode}
            partnerLabel={currentPartner}
            accentClass="border-purple-500/20 bg-purple-500/10"
            onPartnerDone={() => {
              /* scoring handled inside pollForPartner */
            }}
            pollFn={pollForPartner}
          />
        )}

        {/* ── Done ── */}
        {phase === "done" && (
          <motion.div
            className="flex flex-col items-center gap-4 pt-24"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-5xl">✨</span>
            <p className="text-lg font-semibold text-zinc-50">
              Assessment complete!
            </p>
            <p className="text-sm text-white/50">
              Loading your compatibility map…
            </p>
          </motion.div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}

export default function CompatAssessmentPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-dvh bg-[#0A0A0A] flex items-center justify-center">
          <div className="h-6 w-40 animate-pulse rounded-lg bg-white/5" />
        </main>
      }
    >
      <CompatAssessmentContent />
    </Suspense>
  );
}
