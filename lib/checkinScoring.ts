import {
  type CheckInQuestion,
  type Pillar,
  PILLARS,
} from "@/data/checkinQuestions";

export type Responses = Record<string, number | string>;

export interface PillarScore {
  pillar: Pillar;
  scoreA: number; // partner A's avg (0-100)
  scoreB: number; // partner B's avg (0-100)
  combined: number; // avg of both (0-100)
  gap: number; // absolute avg gap per question
}

export interface PerceptionGap {
  pillar: string;
  question: string;
  valueA: number;
  valueB: number;
  gap: number;
  severity: "perception-gap" | "blind-spot"; // ≥2 vs ≥3
}

export interface CheckInResult {
  weekKey: string;
  overallScore: number; // 0-100
  pillarScores: PillarScore[];
  gaps: PerceptionGap[];
  insight: string;
  completedAt: string;
}

/**
 * Score a completed check-in where both partners have responded.
 */
export function scoreCheckIn(
  questions: CheckInQuestion[],
  responsesA: Responses,
  responsesB: Responses,
  weekKey: string,
): CheckInResult {
  const pillarScores: PillarScore[] = [];

  for (const pillar of PILLARS) {
    const qs = questions.filter((q) => q.pillar === pillar);
    const scaleQs = qs.filter((q) => q.type === "scale");

    if (scaleQs.length === 0) {
      pillarScores.push({ pillar, scoreA: 75, scoreB: 75, combined: 75, gap: 0 });
      continue;
    }

    let sumA = 0, sumB = 0, gapSum = 0;
    let count = 0;

    for (const q of scaleQs) {
      let a = Number(responsesA[q.id]) || 3;
      let b = Number(responsesB[q.id]) || 3;

      // Reverse-scored items: flip 1↔5, 2↔4
      if (q.reverse) {
        a = 6 - a;
        b = 6 - b;
      }

      sumA += a;
      sumB += b;
      gapSum += Math.abs(a - b);
      count++;
    }

    const avgA = sumA / count;
    const avgB = sumB / count;
    // Normalize 1-5 scale to 0-100
    const scoreA = Math.round(((avgA - 1) / 4) * 100);
    const scoreB = Math.round(((avgB - 1) / 4) * 100);
    const combined = Math.round((scoreA + scoreB) / 2);
    const gap = Math.round(gapSum / count);

    pillarScores.push({ pillar, scoreA, scoreB, combined, gap });
  }

  // Detect perception gaps (scale questions where gap ≥ 2)
  const gaps: PerceptionGap[] = [];
  for (const q of questions) {
    if (q.type !== "scale") continue;
    let a = Number(responsesA[q.id]) || 3;
    let b = Number(responsesB[q.id]) || 3;
    if (q.reverse) { a = 6 - a; b = 6 - b; }

    const gapVal = Math.abs(a - b);
    if (gapVal >= 2) {
      gaps.push({
        pillar: q.pillar,
        question: q.text,
        valueA: Number(responsesA[q.id]) || 3,
        valueB: Number(responsesB[q.id]) || 3,
        gap: gapVal,
        severity: gapVal >= 3 ? "blind-spot" : "perception-gap",
      });
    }
  }

  // Sort gaps by severity desc
  gaps.sort((a, b) => b.gap - a.gap);

  // Overall score: average of all pillar combined scores
  const overallScore = Math.round(
    pillarScores.reduce((sum, p) => sum + p.combined, 0) / pillarScores.length,
  );

  const insight = generateInsight(overallScore, pillarScores, gaps);

  return {
    weekKey,
    overallScore,
    pillarScores,
    gaps,
    insight,
    completedAt: new Date().toISOString(),
  };
}

// ── Template-based insights (no AI API needed) ────────────────

function generateInsight(
  overall: number,
  pillars: PillarScore[],
  gaps: PerceptionGap[],
): string {
  const sorted = [...pillars].sort((a, b) => b.combined - a.combined);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  const parts: string[] = [];

  // Overall
  if (overall >= 85) {
    parts.push(`Your relationship health this week is strong at ${overall}/100.`);
  } else if (overall >= 65) {
    parts.push(`Your relationship health is at ${overall}/100 — solid, with room to grow.`);
  } else {
    parts.push(`Your relationship health scored ${overall}/100 this week. This deserves some attention.`);
  }

  // Strongest pillar
  if (strongest && strongest.combined >= 70) {
    parts.push(`Your strongest area is ${strongest.pillar} (${strongest.combined}/100) — keep nurturing this.`);
  }

  // Weakest pillar
  if (weakest && weakest.combined < 65) {
    parts.push(`${weakest.pillar} (${weakest.combined}/100) could use focus. Consider having a gentle conversation about what you each need here.`);
  }

  // Gaps
  if (gaps.length > 0) {
    const blindSpots = gaps.filter((g) => g.severity === "blind-spot");
    if (blindSpots.length > 0) {
      parts.push(`You have ${blindSpots.length} blind spot${blindSpots.length > 1 ? "s" : ""} — areas where your experiences of the relationship differ significantly. These aren't problems to fix, but conversations waiting to happen.`);
    } else {
      parts.push(`You have ${gaps.length} perception gap${gaps.length > 1 ? "s" : ""} this week. Small differences in how you each experienced things. Worth exploring together.`);
    }
  } else {
    parts.push("You both experienced the week very similarly — that's a sign of strong connection.");
  }

  return parts.join(" ");
}
