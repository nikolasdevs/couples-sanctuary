"use client";

import { BottomNav } from "@/components/dashboard/BottomNav";
import { HealthGauge } from "@/components/dashboard/HealthGauge";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { PillarCard } from "@/components/dashboard/PillarCard";
import { StreakTracker } from "@/components/dashboard/StreakTracker";
import { useDashboard } from "@/lib/useDashboard";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getCheckinStatus(checkinDay: number, checkinsDone: number): string {
  if (checkinsDone === 0) return "Start first check-in";
  const today = new Date().getDay();
  if (today === checkinDay) return "Ready now";
  // days until next check-in
  const diff = (checkinDay - today + 7) % 7;
  return `Due ${DAYS[checkinDay].slice(0, 3)}`;
}

export default function DashboardPage() {
  const { data, ready } = useDashboard();
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };

  // Show a minimal skeleton until localStorage hydrates
  if (!mounted || !ready) {
    return (
      <main className="min-h-dvh bg-[#0A0A0A] px-5">
        <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col items-center justify-center">
          <div className="h-6 w-40 animate-pulse rounded-lg bg-white/5" />
        </div>
      </main>
    );
  }

  const names =
    data.partnerA && data.partnerB
      ? `${data.partnerA} & ${data.partnerB}`
      : null;

  const greeting = getGreeting();
  const checkinStatus = getCheckinStatus(data.checkinDay, data.checkinsDone);

  return (
    <main className="min-h-dvh bg-[#0A0A0A] pb-24">
      <div className="mx-auto w-full max-w-xl px-5 pt-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: reduceMotion ? 0 : 0.07,
                delayChildren: 0.05,
              },
            },
          }}
          className="flex flex-col gap-5"
        >
          {/* Header */}
          <motion.div
            className="flex items-center justify-between"
            variants={fadeUp}
          >
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10">
                <Image
                  src="https://res.cloudinary.com/dpnzmcban/image/upload/v1768054589/Group_2263-_riwvag.png"
                  alt="Sanctuary"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-50">
                  {greeting}{names ? "," : ""}
                </p>
                {names && (
                  <p className="text-xs text-white/50">{names}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Health Score */}
          <motion.div
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
            variants={fadeUp}
          >
            <p className="mb-4 text-center text-xs font-medium uppercase tracking-wider text-white/40">
              Relationship Health
            </p>
            <HealthGauge score={data.healthScore} />
          </motion.div>

          {/* Three Pillars */}
          <motion.div variants={fadeUp}>
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-white/40">
              Your Journey
            </p>
            <div className="grid grid-cols-3 gap-3">
              <PillarCard
                href="/experience"
                icon="🕯️"
                title="Bond"
                subtitle="Connect through shared moments"
                accent="bg-[#B11226]"
                status={`${data.streak > 0 ? data.streak + " done" : "Start"}`}
                index={0}
              />
              <PillarCard
                href="/compatibility"
                icon="🔮"
                title="Compatibility"
                subtitle="Understand your alignment"
                accent="bg-purple-600"
                status={data.compatibilityDone ? "Done ✓" : "New"}
                locked={false}
                index={1}
              />
              <PillarCard
                href="/checkin"
                icon="💬"
                title="Check-In"
                subtitle="Weekly reflection together"
                accent="bg-amber-500"
                status={checkinStatus}
                locked={false}
                index={2}
              />
            </div>
          </motion.div>

          {/* Streak */}
          <StreakTracker streak={data.streak} />

          {/* Insight */}
          <InsightCard insight={data.latestInsight} />

          {/* Empty state prompt if no names set */}
          {!names && (
            <motion.div
              className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-5 text-center"
              variants={fadeUp}
            >
              <p className="text-sm text-white/50 leading-relaxed">
                Welcome to Sanctuary. Start a{" "}
                <span className="text-zinc-50 font-medium">Bonding</span>{" "}
                session to begin your journey together.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      <BottomNav />
    </main>
  );
}
