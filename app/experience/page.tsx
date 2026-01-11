// app/experience/page.tsx
import Link from "next/link";

export default function ExperiencePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md w-full space-y-6 text-center">
        <h2 className="text-3xl font-serif">Choose Your Experience</h2>

        <div className="space-y-4">
          <Link
            href="/experience/play?mode=shuffle"
            className="block w-full rounded-xl border border-neutral-700 py-4 hover:border-amber-400 transition"
          >
            Shuffle Mode
          </Link>

          <Link
            href="/experience/play?mode=sanctuary"
            className="block w-full rounded-xl border border-neutral-700 py-4 hover:border-amber-400 transition"
          >
            Sanctuary Flow (Guided)
          </Link>

          <Link
            href="/experience/play?mode=category"
            className="block w-full rounded-xl border border-neutral-700 py-4 hover:border-amber-400 transition"
          >
            Choose a Category
          </Link>
        </div>

        <p className="text-xs text-neutral-500">
          You can pause or stop at any time.
        </p>
      </div>
    </main>
  );
}
