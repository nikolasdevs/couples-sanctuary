// app/page.tsx
"use client";
import { useMidnight } from "@/context/MidnightContext";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  const { toggle } = useMidnight();
  return (
    <main className="min-h-screen flex-col flex items-center justify-center px-6">
      <div className="relative w-40 h-40">
        <Image
          src="https://res.cloudinary.com/dpnzmcban/image/upload/v1768054589/Group_2263-_riwvag.png"
          alt="Logo"
          width={240}
          height={240}
          className="object-cover block dark:hidden"
        />
        <Image
          src="https://res.cloudinary.com/dpnzmcban/image/upload/v1768054590/Group_2263_czknax.png"
          alt="Logo"
          width={240}
          height={240}
          className="object-cover hidden dark:block"
        />
      </div>

      <div className="max-w-md w-full text-center space-y-8 mt-24">
        {/* Title */}
        {/* <h1 className="text-3xl md:text-4xl font-montserrat tracking-wide font-bold">
          The Couples Sanctuary
        </h1> */}

        {/* Subtext */}
        <p className="text-neutral-300 text-lg leading-relaxed dark:text-neutral-400">
          This is not a game.
          <br />
          It is a conversation you’ve been postponing.
        </p>

        {/* Presence Prompt */}
        <div className="border border-neutral-700 rounded-xl p-5 text-sm text-neutral-400 dark:text-neutral-500 leading-relaxed">
          Sit close.
          <br />
          Silence notifications.
          <br />
          Be present with each other.
        </div>

        {/* Start Button */}
        <Link
          href="/experience"
          className="block w-full rounded-full bg-linear-to-r from-rose-700 to-red-800 py-4 text-lg font-medium tracking-wide text-white transition hover:opacity-90"
        >
          Start Together
        </Link>

        {/* Privacy */}
        <p className="text-xs text-neutral-500">
          Nothing is recorded. Nothing is saved.
          <br />
          This moment belongs only to the two of you.
        </p>

        {/* Footer */}
        <p className="text-[11px] text-neutral-600">
          The Couples Sanctuary · Feb 13–15
          <br />A Private Experience by Visit2Nigeria
        </p>
      </div>
      <button className="mt-16" onClick={toggle}>
        🌙
      </button>
    </main>
  );
}
