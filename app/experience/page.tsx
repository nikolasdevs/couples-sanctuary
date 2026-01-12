// app/experience/page.tsx
import Link from "next/link";

export default function ExperiencePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="absolute inset-0 -z-30">
        <div
          className="w-full h-full bg-cover bg-center midnight"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/dpnzmcban/image/upload/v1768124994/ba8728b6-a5a4-4659-b3d5-3b2946b04fcb_qtq1yh.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/80 to-black/80 backdrop-blur-[2px]" />
      </div>
      <div className="max-w-md w-full space-y-6 text-center">
        <h2 className="text-2xl md:text-4xl font-semibold">
          Choose Your Experience
        </h2>

        <div className="space-y-4">
          <Link
            href="/experience/play?mode=shuffle"
            className="block w-full rounded-xl border border-neutral-700 py-4 hover:border-amber-400 transition font-medium"
          >
            Shuffle Mode
          </Link>

          <Link
            href="/experience/play?mode=sanctuary"
            className="block w-full rounded-xl border border-neutral-700 py-4 hover:border-amber-400 transition font-medium"
          >
            Sanctuary Flow (Guided)
          </Link>

          <Link
            href="/experience/play?mode=category"
            className="block w-full rounded-xl border border-neutral-700 py-4 hover:border-amber-400 transition font-medium"
          >
            Choose a Category
          </Link>
        </div>

        <p className="text-xs text-neutral-400">
          You can pause or stop at any time.
        </p>
      </div>
    </main>
  );
}
