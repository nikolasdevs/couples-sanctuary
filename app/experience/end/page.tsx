import InstallPwaButton from "@/components/InstallPwaButton";
import Link from "next/link";

const buttonBase =
  "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold " +
  "transition-all duration-200 ease-out " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black " +
  "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]";

export default function EndPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 text-center flex-col space-y-12">
      {/* Background */}
      <div className="absolute inset-0 -z-20 pointer-events-none select-none">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/dpnzmcban/image/upload/v1768177737/IMG_7222_aiwfpo.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/80 to-black/90" />
        <div className="absolute inset-0 shadow-[inset_0_0_160px_rgba(0,0,0,0.85)]" />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md md:p-8">
        <div className="mx-auto mb-4 inline-flex items-center rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-semibold tracking-widest text-white/75 backdrop-blur-md">
          SESSION COMPLETE
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
          Closing the Sanctuary
        </h1>

        <p className="mx-auto mt-4 max-w-prose text-sm leading-relaxed text-zinc-200 md:text-base">
          Look at your partner. Say one promise you want to keep for us.
        </p>

        <p className="mt-6 text-xs text-white/55">
          Thank you for choosing presence.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Link
          href="/"
          className={[
            buttonBase,
            "border border-white/10 bg-white/5 text-zinc-50 backdrop-blur-md",
            "hover:bg-white/10 hover:shadow-xl hover:shadow-black/30",
          ].join(" ")}
        >
          Return to Home
        </Link>

        <InstallPwaButton
          className={[
            buttonBase,
            "border border-[#B11226]/60 text-[#B11226]",
            "hover:bg-[#B11226] hover:text-red-50 hover:shadow-xl hover:shadow-[#B11226]/20",
          ].join(" ")}
        />
      </div>
    </main>
  );
}
