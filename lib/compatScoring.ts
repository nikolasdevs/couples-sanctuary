import {
  compatQuestions,
  type CompatQuestion,
  type Dimension,
  DIMENSIONS,
  DIMENSION_META,
} from "@/data/compatQuestions";

export type CompatResponses = Record<string, string>; // questionId → selected option label

export interface DimensionScore {
  dimension: Dimension;
  alignment: number; // 0-100
  tagA: string; // dominant tag for partner A
  tagB: string; // dominant tag for partner B
  matched: boolean; // dominant tags match
}

export interface CompatResult {
  dimensions: DimensionScore[];
  overallAlignment: number; // 0-100
  strengths: DimensionScore[]; // top 2
  growthAreas: DimensionScore[]; // bottom 2
  completedAt: string;
}

/**
 * Compatibility scoring works per-dimension:
 * 1. For each question, find which tag each partner picked
 * 2. If same tag → 100 points
 * 3. If different tag → scored by a compatibility matrix (some combos are more compatible)
 * 4. Average across all questions in that dimension
 */
export function scoreCompatibility(
  responsesA: CompatResponses,
  responsesB: CompatResponses,
): CompatResult {
  const dimensionScores: DimensionScore[] = [];

  for (const dim of DIMENSIONS) {
    const qs = compatQuestions.filter((q) => q.dimension === dim);
    if (qs.length === 0) continue;

    let totalScore = 0;
    const tagCountA: Record<string, number> = {};
    const tagCountB: Record<string, number> = {};

    for (const q of qs) {
      const ansA = responsesA[q.id];
      const ansB = responsesB[q.id];

      const tagA = q.options.find((o) => o.label === ansA)?.tag ?? "";
      const tagB = q.options.find((o) => o.label === ansB)?.tag ?? "";

      tagCountA[tagA] = (tagCountA[tagA] || 0) + 1;
      tagCountB[tagB] = (tagCountB[tagB] || 0) + 1;

      if (tagA === tagB) {
        totalScore += 100;
      } else {
        // Partial credit: check shared general category
        totalScore += getPartialScore(tagA, tagB);
      }
    }

    const alignment = Math.round(totalScore / qs.length);
    const dominantA = getDominantTag(tagCountA);
    const dominantB = getDominantTag(tagCountB);

    dimensionScores.push({
      dimension: dim,
      alignment,
      tagA: dominantA,
      tagB: dominantB,
      matched: dominantA === dominantB,
    });
  }

  const overallAlignment = Math.round(
    dimensionScores.reduce((s, d) => s + d.alignment, 0) /
      dimensionScores.length,
  );

  const sorted = [...dimensionScores].sort((a, b) => b.alignment - a.alignment);
  const strengths = sorted.slice(0, 2);
  const growthAreas = sorted.slice(-2).reverse();

  return {
    dimensions: dimensionScores,
    overallAlignment,
    strengths,
    growthAreas,
    completedAt: new Date().toISOString(),
  };
}

// ── Helpers ──────────────────────────────────────────────────────

/** Partial compatibility scoring for different but adjacent/compatible tags */
function getPartialScore(tagA: string, tagB: string): number {
  // Define some compatible pairings (symmetric)
  const compatPairs: Record<string, string[]> = {
    // Love Language
    touch: ["time"],
    words: ["time", "gifts"],
    service: ["gifts"],
    // Conflict
    confront: ["clarify"],
    withdraw: ["clarify"],
    avoid: ["clarify"],
    // Life Vision
    career: ["balanced", "creative"],
    family: ["suburb", "extended"],
    adventure: ["nomad", "flexible"],
    security: ["balanced"],
    "children-yes": ["children-open"],
    "children-open": ["children-yes", "children-unsure"],
    "children-no": ["children-never"],
    // Intimacy
    high: ["important"],
    important: ["high", "moderate"],
    moderate: ["important", "low"],
    "physical-first": ["balanced"],
    "emotional-first": ["balanced"],
    open: ["needs-safety", "balanced", "proactive"],
    // Financial
    saver: ["investor", "balanced"],
    investor: ["saver", "balanced"],
    balanced: ["saver", "investor", "collaborative", "moderate"],
    collaborative: ["balanced"],
    joint: ["mostly-joint"],
    "mostly-joint": ["joint", "proportional"],
    // Social
    extrovert: ["ambivert"],
    ambivert: ["extrovert", "introvert"],
    introvert: ["ambivert", "deep-introvert"],
    trusting: ["boundaried"],
    // Independence
    together: ["balanced", "parallel"],
    independent: ["balanced", "flexible"],
    flexible: ["balanced", "independent", "together"],
    // Growth
    proactive: ["open"],
    organic: ["moderate", "content"],
  };

  if (compatPairs[tagA]?.includes(tagB) || compatPairs[tagB]?.includes(tagA)) {
    return 65; // Compatible but not identical
  }

  return 30; // Different approaches
}

function getDominantTag(counts: Record<string, number>): string {
  let max = 0;
  let tag = "";
  for (const [t, c] of Object.entries(counts)) {
    if (c > max) {
      max = c;
      tag = t;
    }
  }
  return tag;
}

/** Label + conversation starter for growth areas */
export function getConversationStarter(dimension: Dimension, scoreData: DimensionScore): string {
  const starters: Record<string, string> = {
    "Love Language": `You show love as "${scoreData.tagA}" while your partner leans toward "${scoreData.tagB}". Try asking: "What makes you feel most loved right now?"`,
    "Conflict Style": `You handle conflict differently. Try: "What do you need from me when we disagree?"`,
    "Life Vision": `Your long-term visions have some differences. Ask: "What does our ideal life look like in 5 years?"`,
    Intimacy: `Your intimacy needs aren't fully aligned. A gentle start: "What makes you feel closest to me?"`,
    "Financial Values": `Money conversations matter. Try: "What does financial security mean to you?"`,
    "Social Energy": `You have different social needs. Ask: "What's your ideal weekend balance?"`,
    Independence: `You need different amounts of space. Try: "What does healthy alone time look like for you?"`,
    "Growth Mindset": `You approach growth differently. Ask: "How can we help each other grow?"`,
  };
  return starters[dimension] ?? "Take time to explore this area together.";
}
