"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PairPage() {
  const { user, couple, loading, createInvite, joinCouple } = useAuth();
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [mode, setMode] = useState<"choose" | "invite" | "join">("choose");
  const [inviteCode, setInviteCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#0A0A0A]">
        <p className="text-sm text-zinc-500">Loading…</p>
      </main>
    );
  }

  if (!user) {
    router.replace("/login");
    return null;
  }

  if (couple?.status === "active") {
    router.replace("/dashboard");
    return null;
  }

  const handleCreateInvite = async () => {
    setBusy(true);
    setError("");
    const result = await createInvite();
    if (result.error) {
      setError(result.error);
    } else if (result.inviteCode) {
      setInviteCode(result.inviteCode);
      setMode("invite");
    }
    setBusy(false);
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const result = await joinCouple(joinCode);
    if (result.error) {
      setError(result.error);
      setBusy(false);
    } else {
      router.push("/dashboard");
    }
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const anim = {
    initial: { opacity: 0, y: reduceMotion ? 0 : 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  };

  // If user already has a pending invite, show it
  useEffect(() => {
    if (couple?.status === "pending" && couple.inviteCode && mode === "choose") {
      setInviteCode(couple.inviteCode);
      setMode("invite");
    }
  }, [couple, mode]);

  return (
    <main className="relative min-h-dvh bg-[#0A0A0A] px-6">
      <motion.div
        className="mx-auto flex min-h-dvh w-full max-w-sm flex-col items-center justify-center py-10"
        {...anim}
      >
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
          Connect with your partner
        </h1>
        <p className="mt-2 text-center text-sm text-zinc-400">
          The Sanctuary is built for two. Pair up to begin.
        </p>

        {error && (
          <div className="mt-4 w-full rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-center text-sm text-red-400">
            {error}
          </div>
        )}

        {/* ─── CHOOSE MODE ─── */}
        {mode === "choose" && (
          <div className="mt-8 w-full space-y-3">
            <button
              onClick={handleCreateInvite}
              disabled={busy}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-5 text-left transition hover:border-rose-500/30 hover:bg-white/[0.08] disabled:opacity-50"
            >
              <p className="text-base font-semibold text-zinc-50">
                Invite my partner
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                Generate a code and share it with them
              </p>
            </button>

            <button
              onClick={() => setMode("join")}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-5 text-left transition hover:border-violet-500/30 hover:bg-white/[0.08]"
            >
              <p className="text-base font-semibold text-zinc-50">
                I have a code
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                My partner already sent me an invite code
              </p>
            </button>

            <Link
              href="/dashboard"
              className="mt-4 block text-center text-sm text-zinc-500 transition hover:text-zinc-300"
            >
              Skip for now →
            </Link>
          </div>
        )}

        {/* ─── INVITE: SHOW CODE ─── */}
        {mode === "invite" && (
          <div className="mt-8 w-full">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                Share this code with your partner
              </p>
              <p className="mt-3 font-mono text-3xl font-bold tracking-[0.3em] text-zinc-50">
                {inviteCode}
              </p>
              <button
                onClick={copyCode}
                className="mt-4 rounded-full border border-white/10 px-5 py-2 text-sm text-zinc-300 transition hover:border-white/20 hover:text-zinc-50"
              >
                {copied ? "Copied!" : "Copy code"}
              </button>
            </div>
            <p className="mt-4 text-center text-sm text-zinc-500">
              Once your partner enters this code, you&apos;ll be connected
              automatically.
            </p>
            <Link
              href="/dashboard"
              className="mt-6 block text-center text-sm text-zinc-500 transition hover:text-zinc-300"
            >
              Continue to Dashboard →
            </Link>
          </div>
        )}

        {/* ─── JOIN: ENTER CODE ─── */}
        {mode === "join" && (
          <form onSubmit={handleJoin} className="mt-8 w-full">
            <label
              htmlFor="code"
              className="block text-xs font-medium text-zinc-400"
            >
              Invite code
            </label>
            <input
              id="code"
              type="text"
              required
              maxLength={6}
              value={joinCode}
              onChange={(e) =>
                setJoinCode(
                  e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, "")
                    .slice(0, 6),
                )
              }
              className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-center font-mono text-xl tracking-[0.3em] text-zinc-50 placeholder-zinc-600 outline-none transition focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20"
              placeholder="ABC123"
            />
            <button
              type="submit"
              disabled={busy || joinCode.length < 6}
              className="mt-4 w-full rounded-full bg-linear-to-r from-violet-500 to-violet-700 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/25 transition hover:from-violet-400 hover:to-violet-600 disabled:opacity-50"
            >
              {busy ? "Joining…" : "Join Partner"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("choose");
                setError("");
              }}
              className="mt-3 block w-full text-center text-sm text-zinc-500 transition hover:text-zinc-300"
            >
              ← Back
            </button>
          </form>
        )}
      </motion.div>
    </main>
  );
}
