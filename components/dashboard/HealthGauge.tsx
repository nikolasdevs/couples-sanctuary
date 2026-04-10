"use client";

import { motion, useReducedMotion } from "framer-motion";

interface HealthGaugeProps {
  score: number | null; // 0-100 or null if no check-in yet
  size?: number;
}

function getLabel(score: number): { text: string; color: string } {
  if (score >= 90) return { text: "Thriving", color: "#22c55e" };
  if (score >= 75) return { text: "Healthy", color: "#22c55e" };
  if (score >= 60) return { text: "Needs Attention", color: "#eab308" };
  if (score >= 40) return { text: "Strained", color: "#f97316" };
  return { text: "Critical", color: "#ef4444" };
}

export function HealthGauge({ score, size = 160 }: HealthGaugeProps) {
  const reduceMotion = useReducedMotion();
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Arc = 270 degrees (3/4 of circle), starting from bottom-left
  const arcLength = circumference * 0.75;
  const dashOffset = score !== null ? arcLength * (1 - score / 100) : arcLength;

  const label = score !== null ? getLabel(score) : null;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="rotate-[135deg]"
        >
          {/* Background track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Score arc */}
          {score !== null && (
            <motion.circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={label!.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeLinecap="round"
              initial={{ strokeDashoffset: arcLength }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{
                duration: reduceMotion ? 0 : 1.2,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.3,
              }}
            />
          )}
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {score !== null ? (
            <>
              <motion.span
                className="text-3xl font-semibold text-zinc-50"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.5, delay: 0.6 }}
              >
                {score}
              </motion.span>
              <span className="text-xs text-white/50">out of 100</span>
            </>
          ) : (
            <span className="text-sm text-white/40 text-center px-4">
              Complete your first check-in
            </span>
          )}
        </div>
      </div>

      {label && (
        <motion.p
          className="text-sm font-medium"
          style={{ color: label.color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {label.text}
        </motion.p>
      )}
    </div>
  );
}
