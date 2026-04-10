"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import Link from "next/link";

interface PillarCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  accent: string; // tailwind border-color class on hover
  status?: string; // e.g., "5 min", "Done ✓", "Due Sun"
  locked?: boolean;
  index?: number;
}

export function PillarCard({
  href,
  icon,
  title,
  subtitle,
  accent,
  status,
  locked,
  index = 0,
}: PillarCardProps) {
  const reduceMotion = useReducedMotion();

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.08,
      },
    },
  };

  const content = (
    <motion.div
      className={cn(
        "relative flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-colors",
        !locked && "hover:border-white/20 hover:bg-white/[0.07] cursor-pointer",
        locked && "opacity-50 cursor-not-allowed",
      )}
      variants={fadeUp}
      initial="hidden"
      animate="show"
      whileHover={!locked && !reduceMotion ? { y: -3 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      {/* Accent top border */}
      <div
        className={cn("absolute inset-x-0 top-0 h-[2px] rounded-t-2xl opacity-60", accent)}
      />

      <div className="text-3xl">{icon}</div>
      <p className="text-sm font-semibold text-zinc-50">{title}</p>
      <p className="text-xs text-white/50 text-center leading-relaxed">{subtitle}</p>

      {status && (
        <span className="mt-1 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] font-medium text-white/60">
          {status}
        </span>
      )}

      {locked && (
        <span className="mt-1 text-[11px] text-white/40">Coming soon</span>
      )}
    </motion.div>
  );

  if (locked) return content;

  return (
    <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-2xl">
      {content}
    </Link>
  );
}
