"use client";

import { useState } from "react";

const inputBase =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white " +
  "placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

const selectBase = inputBase + " appearance-none pr-10";

const buttonBase =
  "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold " +
  "transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

type SubmitState = "idle" | "submitting" | "success" | "error";

const feelingOptions = [
  "Calm",
  "Connecting",
  "Thought-provoking",
  "Emotional",
  "Challenging",
  "Not for us",
];

const closerOptions = [
  "Yes, Deeply",
  "Yes, Better",
  "Yes, A little",
  "Not Really",
  "Unsure",
];

export default function FeedbackForm() {
  const [rating, setRating] = useState<number | null>(null);
  const [feeling, setFeeling] = useState<string | null>(null);
  const [closer, setCloser] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    rating !== null &&
    feeling !== null &&
    closer !== null &&
    state !== "submitting";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      rating === null ||
      feeling === null ||
      closer === null ||
      state === "submitting"
    )
      return;

    setState("submitting");
    setError(null);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          feeling,
          closer,
          message: message.trim(),
          source: "end-page",
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
          detail?: string;
        } | null;
        const errorMsg =
          data?.detail ?? data?.error ?? "Unable to send feedback.";
        throw new Error(errorMsg);
      }

      setState("success");
      setMessage("");
      setRating(null);
      setFeeling(null);
      setCloser(null);
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <section className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md md:p-8">
      <div className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-semibold tracking-widest text-white/75 backdrop-blur-md">
        ANONYMOUS FEEDBACK
      </div>

      <h2 className="text-xl font-semibold tracking-tight text-zinc-50 md:text-2xl">
        Help us refine the sanctuary
      </h2>

      <p className="mt-3 text-sm leading-relaxed text-white/70">
        Your feedback is anonymous. We do not ask for your name, email, or any
        identifying details.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-white/80">
            How would you rate this experience?
          </label>
          <select
            className={selectBase}
            value={rating?.toString() ?? ""}
            onChange={(event) => {
              const value = event.target.value;
              setRating(value ? Number(value) : null);
            }}
          >
            <option value="" disabled>
              Select a rating
            </option>
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-white/80">
            How did this experience feel?
          </label>
          <select
            className={selectBase}
            value={feeling ?? ""}
            onChange={(event) =>
              setFeeling(event.target.value ? event.target.value : null)
            }
          >
            <option value="" disabled>
              Select a feeling
            </option>
            {feelingOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-white/80">
            Did this bring you closer to your partner?
          </label>
          <select
            className={selectBase}
            value={closer ?? ""}
            onChange={(event) =>
              setCloser(event.target.value ? event.target.value : null)
            }
          >
            <option value="" disabled>
              Select an answer
            </option>
            {closerOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-white/80">
            Anything you’d like to share with us? (Optional)
          </label>
          <textarea
            className={inputBase}
            rows={4}
            maxLength={1000}
            placeholder="Share anything that felt meaningful, confusing, or missing."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <p className="mt-1 text-xs text-white/40">{message.length}/1000</p>
        </div>

        {state === "success" ? (
          <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            Thank you. Your feedback has been sent.
          </div>
        ) : (
          <button
            type="submit"
            disabled={!canSubmit}
            className={[
              buttonBase,
              "w-full",
              canSubmit
                ? "bg-linear-to-r from-rose-500 to-[#B11226] text-white"
                : "bg-white/10 text-white/40",
            ].join(" ")}
          >
            {state === "submitting" ? "Sending..." : "Send feedback"}
          </button>
        )}

        {state === "error" && error && (
          <p className="text-xs text-rose-200">{error}</p>
        )}
      </form>
    </section>
  );
}
