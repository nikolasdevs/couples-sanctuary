"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Feedback = {
  id: number;
  rating: number;
  feeling: string;
  closer: string;
  message: string | null;
  source: string;
  created_at: string;
};

type FeedbackData = {
  feedbacks: Feedback[];
  stats: {
    total: number;
    avgRating: number;
  };
};

const pillBase =
  "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold " +
  "transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black " +
  "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]";

const selectBase =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black appearance-none pr-10";

export default function FeedbackAdminPage() {
  const [data, setData] = useState<FeedbackData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<string>("all");
  const [selectedFeeling, setSelectedFeeling] = useState<string>("all");
  const [selectedCloser, setSelectedCloser] = useState<string>("all");

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (selectedRating !== "all") {
          params.append("rating", selectedRating);
        }

        if (selectedFeeling !== "all") {
          params.append("feeling", selectedFeeling);
        }

        if (selectedCloser !== "all") {
          params.append("closer", selectedCloser);
        }

        const res = await fetch(`/api/feedback/list?${params}`);
        if (!res.ok) {
          const errorData = (await res.json().catch(() => null)) as {
            error?: string;
          } | null;
          throw new Error(errorData?.error ?? "Unable to fetch feedback.");
        }

        const json = (await res.json()) as FeedbackData;
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [selectedRating, selectedFeeling, selectedCloser]);

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-6 py-12">
      <div className="absolute inset-0 -z-20 pointer-events-none select-none">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/dpnzmcban/image/upload/v1768124994/ba8728b6-a5a4-4659-b3d5-3b2946b04fcb_qtq1yh.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/65 via-black/80 to-black/90" />
        <div className="absolute inset-0 shadow-[inset_0_0_160px_rgba(0,0,0,0.85)]" />
      </div>

      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="mb-2 inline-flex items-center rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-semibold tracking-widest text-white/75 backdrop-blur-md">
              FEEDBACK DASHBOARD
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">
              Tester Feedback
            </h1>
          </div>

          <Link
            href="/"
            className={[
              pillBase,
              "border border-white/10 bg-white/5 text-zinc-50 backdrop-blur-md",
              "hover:bg-white/10 hover:shadow-xl hover:shadow-black/30",
            ].join(" ")}
          >
            Back Home
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md text-center">
            <p className="text-white/70">Loading feedback...</p>
          </div>
        ) : data ? (
          <>
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <p className="text-xs font-semibold tracking-widest text-white/60 uppercase">
                  Total Feedback
                </p>
                <p className="mt-2 text-4xl font-bold text-zinc-50">
                  {data.stats.total}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <p className="text-xs font-semibold tracking-widest text-white/60 uppercase">
                  Average Rating
                </p>
                <p className="mt-2 text-4xl font-bold text-zinc-50">
                  {data.stats.avgRating.toFixed(1)}/5
                </p>
              </div>
            </div>

            <div className="mb-6 grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-xs font-semibold tracking-widest text-white/60 uppercase">
                  Filter by rating
                </label>
                <select
                  className={selectBase}
                  value={selectedRating}
                  onChange={(event) => setSelectedRating(event.target.value)}
                >
                  <option value="all">All ratings</option>
                  {["1", "2", "3", "4", "5"].map((r) => (
                    <option key={r} value={r}>
                      {r} ⭐
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold tracking-widest text-white/60 uppercase">
                  Filter by feeling
                </label>
                <select
                  className={selectBase}
                  value={selectedFeeling}
                  onChange={(event) => setSelectedFeeling(event.target.value)}
                >
                  <option value="all">All feelings</option>
                  {[
                    "Calm",
                    "Connecting",
                    "Thought-provoking",
                    "Emotional",
                    "Challenging",
                    "Not for us",
                  ].map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold tracking-widest text-white/60 uppercase">
                  Filter by experience
                </label>
                <select
                  className={selectBase}
                  value={selectedCloser}
                  onChange={(event) => setSelectedCloser(event.target.value)}
                >
                  <option value="all">All experiences</option>
                  {[
                    "Yes, Deeply",
                    "Yes, Better",
                    "Yes, A little",
                    "Not Really",
                    "Unsure",
                  ].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {data.feedbacks.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-md text-center">
                  <p className="text-white/70">No feedback yet.</p>
                </div>
              ) : (
                data.feedbacks.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex flex-col items-start gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center rounded-full border border-white/10 bg-black/30 px-3 py-1 text-sm font-semibold text-blue-200">
                            {feedback.rating} ⭐
                          </span>
                          <span className="inline-flex items-center rounded-full border border-white/10 bg-black/30 px-3 py-1 text-sm font-semibold text-amber-200">
                            {feedback.feeling}
                          </span>
                          <span className="inline-flex items-center rounded-full border border-white/10 bg-black/30 px-3 py-1 text-sm font-semibold text-emerald-200">
                            {feedback.closer}
                          </span>
                        </div>
                        <span className="text-xs text-white/50">
                          {new Date(feedback.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>
                    </div>

                    {feedback.message && (
                      <p className="text-sm leading-relaxed text-zinc-200">
                        {feedback.message}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}
