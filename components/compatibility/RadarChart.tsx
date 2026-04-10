"use client";

import { DIMENSION_META, type Dimension } from "@/data/compatQuestions";
import type { DimensionScore } from "@/lib/compatScoring";
import { motion, useReducedMotion } from "framer-motion";

interface RadarChartProps {
  scores: DimensionScore[];
  size?: number;
}

export function RadarChart({ scores, size = 280 }: RadarChartProps) {
  const reduceMotion = useReducedMotion();
  const center = size / 2;
  const radius = size / 2 - 40; // padding for labels
  const n = scores.length;

  function polarToCart(angle: number, r: number): [number, number] {
    // Start from top (−90°)
    const rad = ((angle - 90) * Math.PI) / 180;
    return [center + r * Math.cos(rad), center + r * Math.sin(rad)];
  }

  const angleStep = 360 / n;

  // Grid rings at 25%, 50%, 75%, 100%
  const rings = [0.25, 0.5, 0.75, 1];

  // Build polygon path from scores
  const points = scores.map((s, i) => {
    const pct = s.alignment / 100;
    return polarToCart(i * angleStep, radius * pct);
  });
  const polygonPath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ") + "Z";

  return (
    <div className="flex justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid rings */}
        {rings.map((r) => (
          <polygon
            key={r}
            points={Array.from({ length: n })
              .map((_, i) => polarToCart(i * angleStep, radius * r).join(","))
              .join(" ")}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
          />
        ))}

        {/* Axis lines */}
        {scores.map((_, i) => {
          const [x, y] = polarToCart(i * angleStep, radius);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
          );
        })}

        {/* Score polygon */}
        <motion.path
          d={polygonPath}
          fill="rgba(139, 92, 246, 0.15)"
          stroke="#8b5cf6"
          strokeWidth={2}
          strokeLinejoin="round"
          initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          style={{ transformOrigin: `${center}px ${center}px` }}
        />

        {/* Score dots */}
        {points.map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={4}
            fill={DIMENSION_META[scores[i].dimension as Dimension]?.color ?? "#8b5cf6"}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.05 }}
          />
        ))}

        {/* Labels */}
        {scores.map((s, i) => {
          const labelRadius = radius + 24;
          const [x, y] = polarToCart(i * angleStep, labelRadius);
          const meta = DIMENSION_META[s.dimension as Dimension];
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[9px] fill-white/50"
            >
              {meta?.icon ?? ""} {s.alignment}%
            </text>
          );
        })}
      </svg>
    </div>
  );
}
