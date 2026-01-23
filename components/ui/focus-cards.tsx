"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

type FocusCard = {
  title: string;
  src: string;
  link: string;
  description?: string;
  meta?: string; // e.g. "10–15 min" or "Best for first time"
  featured?: boolean;
};

export const Card = React.memo(function Card({
  card,
  index,
  hovered,
  setHovered,
}: {
  card: FocusCard;
  index: number;
  hovered: number | null;
  setHovered: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  const isDimmed = hovered !== null && hovered !== index;

  return (
    <Link
      href={card.link}
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      onFocus={() => setHovered(index)}
      onBlur={() => setHovered(null)}
      aria-label={`Start: ${card.title}`}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl border bg-white/5",
        "aspect-[4/5] md:aspect-[3/4]",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40",
        "active:scale-[0.99]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        card.featured
          ? "border-[#B11226]/35"
          : "border-white/10 hover:border-white/15",
        isDimmed && "opacity-80",
      )}
    >
      <Image
        src={card.src}
        alt={card.title}
        fill
        priority={index === 0}
        sizes="(min-width: 768px) 33vw, 100vw"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
      />

      {/* Readability overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/20 to-black/85" />
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 shadow-[inset_0_0_140px_rgba(0,0,0,0.65)]" />

      {/* Featured badge */}
      {card.featured && (
        <div className="absolute left-4 top-4 rounded-full border border-[#B11226]/35 bg-[#B11226]/15 px-3 py-1 text-xs font-semibold text-zinc-50 backdrop-blur-md">
          Recommended
        </div>
      )}

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="space-y-3">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-black/35 px-4 py-2 backdrop-blur-md">
            <span className="text-sm font-semibold tracking-tight text-zinc-50 md:text-base">
              {card.title}
            </span>
          </div>

          {card.description && (
            <p className="text-sm leading-relaxed text-white/80">
              {card.description}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-white/60">
            <span>{card.meta ?? "Tap to begin"}</span>
            <span className="opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
});

Card.displayName = "Card";

export function FocusCards({ cards }: { cards: FocusCard[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-5 md:grid-cols-3 md:gap-7">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}
