"use client";

import { useState, useEffect, Suspense, type BaseSyntheticEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordContent() {
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) router.replace("/forgot-password");
  }, [token, router]);

  if (!token) return null;

  const handleSubmit = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
      } else {
        setDone(true);
        setTimeout(() => router.replace("/dashboard"), 2000);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-dvh bg-[#0A0A0A] px-6">
      <motion.div
        className="mx-auto flex min-h-dvh w-full max-w-sm flex-col items-center justify-center py-10"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
          Set new password
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Choose a strong password for your account.
        </p>

        {done ? (
          <div className="mt-8 w-full rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-4 text-center text-sm text-emerald-400">
            Password updated! Redirecting you to your Sanctuary…
          </div>
        ) : (
          <>
            {error && (
              <div className="mt-4 w-full rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-center text-sm text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 w-full space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-zinc-400"
                >
                  New password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-50 placeholder-zinc-600 outline-none transition focus:border-rose-500/40 focus:ring-1 focus:ring-rose-500/20"
                  placeholder="At least 8 characters"
                />
              </div>

              <div>
                <label
                  htmlFor="confirm"
                  className="block text-xs font-medium text-zinc-400"
                >
                  Confirm password
                </label>
                <input
                  id="confirm"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-50 placeholder-zinc-600 outline-none transition focus:border-rose-500/40 focus:ring-1 focus:ring-rose-500/20"
                  placeholder="Repeat your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-linear-to-r from-rose-500 to-[#B11226] py-3 text-sm font-semibold text-white shadow-lg shadow-rose-900/25 transition hover:from-rose-400 hover:to-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 disabled:opacity-50"
              >
                {loading ? "Updating…" : "Update Password"}
              </button>
            </form>
          </>
        )}

        <p className="mt-6 text-center text-sm text-zinc-500">
          <Link
            href="/login"
            className="text-rose-400 transition hover:text-rose-300"
          >
            Back to sign in
          </Link>
        </p>
      </motion.div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}
