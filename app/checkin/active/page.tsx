"use client";

import { BottomNav } from "@/components/dashboard/BottomNav";
import { JoinPartner } from "@/components/sync/JoinPartner";
import { ModeSelect } from "@/components/sync/ModeSelect";
import { WaitingRoom } from "@/components/sync/WaitingRoom";
import {
  currentWeekKey,
  currentWeekSeed,
  getWeeklyQuestions,
  type CheckInQuestion,
} from "@/data/checkinQuestions";
import { scoreCheckIn } from "@/lib/checkinScoring";
import type { Responses } from "@/lib/checkinScoring";
import { useDashboard } from "@/lib/useDashboard";
import { useCheckinStorage } from "@/lib/useCheckinStorage";
import { useSync, type SyncSession } from "@/lib/useSync";
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

function CheckInActiveContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();
  const { savePartnerResponses, getWeekResponses, saveResult } =
    useCheckinStorage();
  const { update: updateDashboard } = useDashboard();
  const sync = useSync();

  const weekKey = useMemo(() => currentWeekKey(), []);
  const weekSeed = useMemo(() => currentWeekSeed(), []);
  const questions = useMemo(() => getWeeklyQuestions(weekSeed), [weekSeed]);

  // Sync state
  const [syncCode, setSyncCode] = useState<string | null>(null);
  const [syncMode, setSyncMode] = useState(false);

  // Check URL params for incoming sync join
  const urlSyncCode = searchParams.get("sync");
  const urlPartner = searchParams.get("partner") as "A" | "B" | null;

  const [phase, setPhase] = useState<Phase>("mode-select");
  const [currentPartner, setCurrentPartner] = useState<"A" | "B">("A");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Responses>({});
  const [mounted, setMounted] = useState(false);

  // Check if partner A already completed
  const [aCompleted, setACompleted] = useState(false);
  const [bCompleted, setBCompleted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const weekData = getWeekResponses(weekKey);
    if (weekData.partnerA) setACompleted(true);
    if (weekData.partnerB) setBCompleted(true);

    // If joined via URL, go straight to answering as Partner B
    if (urlSyncCode && urlPartner) {
      setSyncCode(urlSyncCode);
      setSyncMode(true);
      setCurrentPartner(urlPartner);
      setPhase("answering");
    }
  }, [weekKey, getWeekResponses, urlSyncCode, urlPartner]);

  const currentQ = questions[questionIndex];
  const isLast = questionIndex === questions.length - 1;
  const progress = ((questionIndex + 1) / questions.length) * 100;

  // ── Mode selection handlers ──
  const handleTogether = useCallback(() => {
    setPhase("pick-partner");
  }, []);

  const handleApart = useCallback(async () => {
    const code = await sync.createSession("checkin", weekKey);
    if (code) {
      setSyncCode(code);
      setSyncMode(true);
      setCurrentPartner("A");
      setPhase("answering");
    }
  }, [sync, weekKey]);

  const handleJoinScreen = useCallback(() => {
    setPhase("join");
  }, []);

  const handleJoinCode = useCallback(
    async (code: string) => {
      const session = await sync.getSession(code);
      if (!session) return;
      setSyncCode(code);
      setSyncMode(true);
      // Joiner is Partner B (or A if B already exists)
      const partner = session.partnerA ? "B" : "A";
      setCurrentPartner(partner);
      setPhase("answering");
    },
    [sync],
  );

  const handleSelectPartner = useCallback(
    (partner: "A" | "B") => {
      const weekData = getWeekResponses(weekKey);
      if (partner === "A" && weekData.partnerA) {
        setCurrentPartner("B");
        setPhase("answering");
        return;
      }
      if (partner === "B" && weekData.partnerB) {
        setCurrentPartner("A");
        setPhase("answering");
        return;
      }
      setCurrentPartner(partner);
      setPhase("answering");
    },
    [weekKey, getWeekResponses],
  );

  // Score and save results (shared between together and sync modes)
  const scoreAndFinish = useCallback(
    (responsesA: Responses, responsesB: Responses) => {
      const result = scoreCheckIn(questions, responsesA, responsesB, weekKey);
      saveResult(result);
      updateDashboard({
        healthScore: result.overallScore,
        latestInsight: result.insight,
        checkinsDone: 1,
      });
      setPhase("done");
      setTimeout(() => router.push("/checkin/results"), 800);
    },
    [questions, weekKey, saveResult, updateDashboard, router],
  );

  const handleAnswer = useCallback(
    async (value: number | string) => {
      if (!currentQ) return;
      const next = { ...responses, [currentQ.id]: value };
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

          // Also save locally in case this person wants to see results
          savePartnerResponses(weekKey, currentPartner, next);

          if (result.complete) {
            // Both done — fetch other partner's responses and score
            const session = await sync.getSession(syncCode);
            if (session?.partnerA && session?.partnerB) {
              const respA = (currentPartner === "A" ? next : session.partnerA.responses) as Responses;
              const respB = (currentPartner === "B" ? next : session.partnerB.responses) as Responses;
              scoreAndFinish(respA, respB);
            }
          } else {
            // Waiting for remote partner
            setPhase("sync-waiting");
          }
        } else {
          // ── Together mode: same as before ──
          savePartnerResponses(weekKey, currentPartner, next);
          const weekData = getWeekResponses(weekKey);
          const otherDone =
            currentPartner === "A"
              ? weekData.partnerB !== null
              : weekData.partnerA !== null;

          if (otherDone) {
            const responsesA =
              currentPartner === "A" ? next : weekData.partnerA!;
            const responsesB =
              currentPartner === "B" ? next : weekData.partnerB!;
            scoreAndFinish(responsesA, responsesB);
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
      weekKey,
      questions,
      syncMode,
      syncCode,
      sync,
      savePartnerResponses,
      getWeekResponses,
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
      // Both done — score it
      const respA = session.partnerA.responses as Responses;
      const respB = session.partnerB.responses as Responses;
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
            title="Weekly Check-In"
            icon="💬"
            accentClass="border-amber-500/20 bg-amber-500/10"
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
            accentBg="bg-amber-500"
            accentText="text-black"
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
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10">
              <span className="text-3xl">💬</span>
            </div>
            <h1 className="text-xl font-semibold text-zinc-50">
              Weekly Check-In
            </h1>
            <p className="max-w-xs text-center text-sm text-white/50 leading-relaxed">
              Each partner answers independently. Hand the phone to your partner
              when it&apos;s their turn — no peeking.
            </p>

            <div className="flex w-full flex-col gap-3">
              <button
                onClick={() => handleSelectPartner("A")}
                disabled={aCompleted}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:bg-white/[0.07] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div>
                  <p className="text-sm font-semibold text-zinc-50">
                    Partner A
                  </p>
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
                  <p className="text-sm font-semibold text-zinc-50">
                    Partner B
                  </p>
                  <p className="text-xs text-white/40">
                    {bCompleted ? "Completed ✓" : "Tap to start"}
                  </p>
                </div>
                <span className="text-lg">{bCompleted ? "✅" : "→"}</span>
              </button>
            </div>

            {(aCompleted || bCompleted) && !(aCompleted && bCompleted) && (
              <p className="text-xs text-amber-400/70 text-center">
                One partner has completed. Hand the phone to the other to unlock results.
              </p>
            )}
          </motion.div>
        )}

        {/* ── Answering questions ── */}
        {phase === "answering" && currentQ && (
          <motion.div
            className="flex flex-col gap-6 pt-8"
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
                  className="h-full rounded-full bg-amber-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="text-xs text-white/40 tabular-nums">
                {questionIndex + 1}/{questions.length}
              </span>
            </div>

            {/* Partner indicator */}
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-xs text-white/50">
                Partner {currentPartner} answering
                {syncMode && " (remote)"}
              </span>
            </div>

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
                <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-amber-500/60">
                  {currentQ.pillar}
                </p>
                <p className="text-base leading-relaxed text-zinc-100">
                  {currentQ.text}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Answer input */}
            <QuestionInput
              question={currentQ}
              onAnswer={handleAnswer}
              key={`input-${currentQ.id}`}
            />
          </motion.div>
        )}

        {/* ── Waiting for other partner (together mode) ── */}
        {phase === "waiting" && (
          <motion.div
            className="flex flex-col items-center gap-6 pt-20"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10">
              <span className="text-4xl">🤝</span>
            </div>
            <h2 className="text-lg font-semibold text-zinc-50">
              Partner {currentPartner} is done!
            </h2>
            <p className="max-w-xs text-center text-sm text-white/50 leading-relaxed">
              Hand the phone to your partner. Once both of you complete the
              check-in, your results will be revealed.
            </p>
            <button
              onClick={handleContinueAsOther}
              className="rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-amber-400"
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
            accentClass="border-amber-500/20 bg-amber-500/10"
            onPartnerDone={() => {
              /* scoring handled inside pollForPartner */
            }}
            pollFn={pollForPartner}
          />
        )}

        {/* ── Done — redirecting to results ── */}
        {phase === "done" && (
          <motion.div
            className="flex flex-col items-center gap-4 pt-24"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-5xl">✨</span>
            <p className="text-lg font-semibold text-zinc-50">
              Check-in complete!
            </p>
            <p className="text-sm text-white/50">Loading your results…</p>
          </motion.div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}

export default function CheckInActivePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-dvh bg-[#0A0A0A] flex items-center justify-center">
          <div className="h-6 w-40 animate-pulse rounded-lg bg-white/5" />
        </main>
      }
    >
      <CheckInActiveContent />
    </Suspense>
  );
}

// ── Answer input components ─────────────────────────────────────

function QuestionInput({
  question,
  onAnswer,
}: {
  question: CheckInQuestion;
  onAnswer: (value: number | string) => void;
}) {
  if (question.type === "scale") {
    return <ScaleInput onAnswer={onAnswer} />;
  }
  if (question.type === "yesno") {
    return <YesNoInput onAnswer={onAnswer} />;
  }
  return <TextInput onAnswer={onAnswer} />;
}

function ScaleInput({ onAnswer }: { onAnswer: (v: number) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const labels = ["Strongly\nDisagree", "Disagree", "Neutral", "Agree", "Strongly\nAgree"];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-2">
        {[1, 2, 3, 4, 5].map((val) => (
          <button
            key={val}
            onClick={() => setSelected(val)}
            className={`flex-1 flex flex-col items-center gap-2 rounded-xl border p-3 transition ${
              selected === val
                ? "border-amber-500/50 bg-amber-500/10 text-amber-300"
                : "border-white/10 bg-white/5 text-white/40 hover:bg-white/[0.07]"
            }`}
          >
            <span className="text-lg font-semibold">{val}</span>
            <span className="text-[9px] leading-tight text-center whitespace-pre-line">
              {labels[val - 1]}
            </span>
          </button>
        ))}
      </div>
      {selected !== null && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => onAnswer(selected)}
          className="self-end rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-400"
        >
          Next →
        </motion.button>
      )}
    </div>
  );
}

function YesNoInput({ onAnswer }: { onAnswer: (v: number) => void }) {
  return (
    <div className="flex gap-3">
      <button
        onClick={() => onAnswer(1)}
        className="flex-1 rounded-xl border border-white/10 bg-white/5 py-4 text-sm font-semibold text-zinc-50 transition hover:bg-white/[0.07]"
      >
        Yes
      </button>
      <button
        onClick={() => onAnswer(5)}
        className="flex-1 rounded-xl border border-white/10 bg-white/5 py-4 text-sm font-semibold text-zinc-50 transition hover:bg-white/[0.07]"
      >
        No
      </button>
    </div>
  );
}

function TextInput({ onAnswer }: { onAnswer: (v: string) => void }) {
  const [text, setText] = useState("");

  return (
    <div className="flex flex-col gap-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, 500))}
        placeholder="Share your thoughts…"
        rows={3}
        className="w-full resize-none rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-100 placeholder-white/30 focus:border-amber-500/30 focus:outline-none"
      />
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-white/30">{text.length}/500</span>
        <button
          onClick={() => onAnswer(text || "(no response)")}
          className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-400"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
