export type QuestionType = "scale" | "yesno" | "text";

export interface CheckInQuestion {
  id: string;
  pillar: string;
  text: string;
  type: QuestionType;
  reverse?: boolean; // true = high score means negative (e.g., "I felt judged")
}

export const PILLARS = [
  "Emotional Safety",
  "Communication",
  "Intimacy & Affection",
  "Quality Time",
  "Trust & Respect",
  "Growth & Gratitude",
] as const;

export type Pillar = (typeof PILLARS)[number];

// 60+ question pool — each week 12 are selected (2 per pillar)
export const questionPool: CheckInQuestion[] = [
  // ── Emotional Safety ──────────────────────────────────────
  { id: "es1", pillar: "Emotional Safety", type: "scale", text: "This week, I felt emotionally safe with my partner." },
  { id: "es2", pillar: "Emotional Safety", type: "scale", text: "I felt comfortable expressing my needs this week." },
  { id: "es3", pillar: "Emotional Safety", type: "scale", text: "When I was upset, I felt my partner was available." },
  { id: "es4", pillar: "Emotional Safety", type: "scale", text: "I felt judged at some point this week.", reverse: true },
  { id: "es5", pillar: "Emotional Safety", type: "scale", text: "My partner made me feel accepted for who I am." },
  { id: "es6", pillar: "Emotional Safety", type: "scale", text: "I felt free to be myself without fear of criticism." },
  { id: "es7", pillar: "Emotional Safety", type: "scale", text: "I felt my partner was patient with me this week." },
  { id: "es8", pillar: "Emotional Safety", type: "scale", text: "I could share a difficult feeling without it turning into a fight." },
  { id: "es9", pillar: "Emotional Safety", type: "scale", text: "My partner created space for me to be vulnerable." },
  { id: "es10", pillar: "Emotional Safety", type: "scale", text: "I felt emotionally supported during a hard moment." },

  // ── Communication ─────────────────────────────────────────
  { id: "co1", pillar: "Communication", type: "scale", text: "We had at least one meaningful conversation this week." },
  { id: "co2", pillar: "Communication", type: "scale", text: "I felt heard when I shared something important." },
  { id: "co3", pillar: "Communication", type: "yesno", text: "There was something I wanted to say but held back." },
  { id: "co4", pillar: "Communication", type: "scale", text: "We resolved disagreements respectfully." },
  { id: "co5", pillar: "Communication", type: "scale", text: "I understand what my partner needed from me this week." },
  { id: "co6", pillar: "Communication", type: "scale", text: "I felt we communicated openly and honestly." },
  { id: "co7", pillar: "Communication", type: "scale", text: "I felt my partner understood my point of view." },
  { id: "co8", pillar: "Communication", type: "scale", text: "We talked about something deeper than logistics this week." },
  { id: "co9", pillar: "Communication", type: "scale", text: "I felt my partner checked in on how I was doing." },
  { id: "co10", pillar: "Communication", type: "scale", text: "I was able to express frustration without being dismissed." },

  // ── Intimacy & Affection ──────────────────────────────────
  { id: "ia1", pillar: "Intimacy & Affection", type: "scale", text: "I felt physically connected to my partner this week." },
  { id: "ia2", pillar: "Intimacy & Affection", type: "scale", text: "I felt desired by my partner." },
  { id: "ia3", pillar: "Intimacy & Affection", type: "scale", text: "We had moments of non-sexual physical affection." },
  { id: "ia4", pillar: "Intimacy & Affection", type: "scale", text: "I initiated affection this week." },
  { id: "ia5", pillar: "Intimacy & Affection", type: "scale", text: "Our intimate life felt fulfilling." },
  { id: "ia6", pillar: "Intimacy & Affection", type: "scale", text: "I felt romantically close to my partner." },
  { id: "ia7", pillar: "Intimacy & Affection", type: "scale", text: "We shared a tender or affectionate moment." },
  { id: "ia8", pillar: "Intimacy & Affection", type: "scale", text: "I felt comfortable initiating closeness." },
  { id: "ia9", pillar: "Intimacy & Affection", type: "scale", text: "Physical touch between us felt natural this week." },
  { id: "ia10", pillar: "Intimacy & Affection", type: "scale", text: "I felt my partner was attentive to my physical needs." },

  // ── Quality Time ──────────────────────────────────────────
  { id: "qt1", pillar: "Quality Time", type: "scale", text: "We spent meaningful time together this week." },
  { id: "qt2", pillar: "Quality Time", type: "scale", text: "I felt like a priority in my partner's life." },
  { id: "qt3", pillar: "Quality Time", type: "scale", text: "We did something fun or new together." },
  { id: "qt4", pillar: "Quality Time", type: "scale", text: "I felt present (not distracted) during our time together." },
  { id: "qt5", pillar: "Quality Time", type: "scale", text: "We had moments of genuine laughter." },
  { id: "qt6", pillar: "Quality Time", type: "scale", text: "We enjoyed a shared activity or hobby." },
  { id: "qt7", pillar: "Quality Time", type: "scale", text: "I felt my partner gave me their undivided attention." },
  { id: "qt8", pillar: "Quality Time", type: "scale", text: "We made time for each other despite being busy." },
  { id: "qt9", pillar: "Quality Time", type: "scale", text: "I felt energized after spending time together." },
  { id: "qt10", pillar: "Quality Time", type: "scale", text: "Our time together felt intentional, not just routine." },

  // ── Trust & Respect ───────────────────────────────────────
  { id: "tr1", pillar: "Trust & Respect", type: "scale", text: "I trusted my partner fully this week." },
  { id: "tr2", pillar: "Trust & Respect", type: "scale", text: "I felt respected in my opinions and decisions." },
  { id: "tr3", pillar: "Trust & Respect", type: "scale", text: "My partner followed through on their commitments." },
  { id: "tr4", pillar: "Trust & Respect", type: "scale", text: "I felt like we are a team." },
  { id: "tr5", pillar: "Trust & Respect", type: "scale", text: "I was able to be vulnerable without fear." },
  { id: "tr6", pillar: "Trust & Respect", type: "scale", text: "My partner respected my boundaries." },
  { id: "tr7", pillar: "Trust & Respect", type: "scale", text: "I felt my partner was honest with me." },
  { id: "tr8", pillar: "Trust & Respect", type: "scale", text: "I felt valued for my contributions to our relationship." },
  { id: "tr9", pillar: "Trust & Respect", type: "scale", text: "My partner treated me with kindness." },
  { id: "tr10", pillar: "Trust & Respect", type: "scale", text: "I felt my partner had my best interests at heart." },

  // ── Growth & Gratitude ────────────────────────────────────
  { id: "gg1", pillar: "Growth & Gratitude", type: "scale", text: "I feel our relationship is growing." },
  { id: "gg2", pillar: "Growth & Gratitude", type: "text", text: "What is one thing your partner did this week that you're grateful for?" },
  { id: "gg3", pillar: "Growth & Gratitude", type: "text", text: "One thing I could have done better this week:" },
  { id: "gg4", pillar: "Growth & Gratitude", type: "scale", text: "I'm optimistic about our future together." },
  { id: "gg5", pillar: "Growth & Gratitude", type: "scale", text: "I feel we are learning and improving as a couple." },
  { id: "gg6", pillar: "Growth & Gratitude", type: "scale", text: "I appreciated something my partner did this week." },
  { id: "gg7", pillar: "Growth & Gratitude", type: "scale", text: "I feel closer to my partner than I did last week." },
  { id: "gg8", pillar: "Growth & Gratitude", type: "scale", text: "I expressed gratitude toward my partner this week." },
  { id: "gg9", pillar: "Growth & Gratitude", type: "text", text: "What is one thing you'd love to do together next week?" },
  { id: "gg10", pillar: "Growth & Gratitude", type: "scale", text: "Overall, how would you rate your relationship this week?" },
];

/**
 * Select 12 questions (2 per pillar) for a given week.
 * Uses week number as seed for deterministic but rotating selection.
 */
export function getWeeklyQuestions(weekSeed: number): CheckInQuestion[] {
  const selected: CheckInQuestion[] = [];

  for (const pillar of PILLARS) {
    const pool = questionPool.filter((q) => q.pillar === pillar);
    // Simple seeded pick: use weekSeed to offset into pool
    const offset = ((weekSeed * 7 + PILLARS.indexOf(pillar) * 3) % pool.length + pool.length) % pool.length;
    selected.push(pool[offset % pool.length]);
    selected.push(pool[(offset + 1) % pool.length]);
  }

  return selected;
}

/** Returns a numeric week identifier for the current ISO week */
export function currentWeekSeed(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const weekNum = Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
  return now.getFullYear() * 100 + weekNum;
}

/** Returns the Monday of the current ISO week as YYYY-MM-DD */
export function currentWeekKey(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.getFullYear(), now.getMonth(), diff);
  return monday.toISOString().slice(0, 10);
}
