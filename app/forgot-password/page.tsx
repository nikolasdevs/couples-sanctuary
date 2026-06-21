"use client";

import { useState, type BaseSyntheticEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const reduceMotion = useReducedMotion();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong.");
      } else {
        setSent(true);
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
        <Link
          href="/login"
          className="mb-8 text-xs uppercase tracking-[0.2em] text-zinc-500 transition hover:text-zinc-300"
        >
          ← Back
        </Link>

        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
          Forgot password?
        </h1>
        <p className="mt-2 text-center text-sm text-zinc-400">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        {sent ? (
          <div className="mt-8 w-full rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-4 text-center text-sm text-emerald-400">
            Check your inbox — if an account exists for that email, a reset link
            is on its way.
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
                  htmlFor="email"
                  className="block text-xs font-medium text-zinc-400"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-50 placeholder-zinc-600 outline-none transition focus:border-rose-500/40 focus:ring-1 focus:ring-rose-500/20"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-linear-to-r from-rose-500 to-[#B11226] py-3 text-sm font-semibold text-white shadow-lg shadow-rose-900/25 transition hover:from-rose-400 hover:to-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 disabled:opacity-50"
              >
                {loading ? "Sending…" : "Send Reset Link"}
              </button>
            </form>
          </>
        )}

        <p className="mt-6 text-center text-sm text-zinc-500">
          Remembered it?{" "}
          <Link
            href="/login"
            className="text-rose-400 transition hover:text-rose-300"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
