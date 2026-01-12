// app/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex-col flex items-center justify-center px-6 bg-cover overflow-hidden relative">
      <div className="absolute inset-0 -z-30">
        <div
          className="w-full h-full bg-cover bg-center midnight"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/dpnzmcban/image/upload/v1768124985/e1648837-0c91-43d7-9c03-a6e0273b7719_lxwa6o.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/80 to-black/80 backdrop-blur-[2px]" />
      </div>

      {/* Overlay: gradient from dark to transparent for text readability */}

      <div className="relative w-40 h-40">
        <Image
          src={
            "https://res.cloudinary.com/dpnzmcban/image/upload/v1768054589/Group_2263-_riwvag.png"
          }
          alt="Logo"
          width={240}
          height={240}
          className="object-cover"
          priority
        />
      </div>

      <div className="max-w-md w-full text-center space-y-4">
        {/* Title */}
        {/* <h1 className="text-3xl md:text-4xl font-montserrat tracking-wide font-bold">
          The Couples Sanctuary
        </h1> */}

        {/* Subtext */}
        <p className=" text leading">
          This is not a game.
          <br />
          It is a conversation you&apos;ve been postponing.
        </p>

        {/* Presence Prompt */}
        <div
          className="
    border border-rose-200/70
    dark:border-rose-400/20
    rounded-xl p-5 text-sm
    backdrop-blur-sm
  "
        >
          Sit close.
          <br />
          Silence notifications.
          <br />
          Be present with each other.
        </div>

        {/* Start Button */}
        <Link
          href="/experience"
          className="
    block w-full rounded-full 
    bg-linear-to-r from-rose-500 to-[#B11226]
    py-4 text-lg font-medium tracking-wide text-white
    shadow-lg shadow-rose-900/20
    transition hover:opacity-90
  "
        >
          Start Together
        </Link>
        {/* Privacy */}
        <p className="text-xs ">
          Nothing is recorded. Nothing is saved.
          <br />
          This moment belongs only to the two of you.
        </p>

        {/* Footer */}
        {/* <p className="text-[11px] text-neutral-500">
          The Couples Sanctuary · Feb 13–15
          <br />A Private Experience by Visit2Nigeria
        </p> */}
      </div>
    </main>
  );
}
