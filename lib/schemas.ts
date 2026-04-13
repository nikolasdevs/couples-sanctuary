import { z } from "zod";

// ── Auth ─────────────────────────────────────────────────────────────────────

export const LoginSchema = z.object({
  email: z.email("Invalid email address."),
  password: z.string().min(1, "Password is required."),
});

export const SignupSchema = z.object({
  email: z.email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  name: z.string().trim().min(1, "Name is required.").max(100),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type SignupInput = z.infer<typeof SignupSchema>;

// ── Couples ───────────────────────────────────────────────────────────────────

export const JoinCoupleSchema = z.object({
  code: z
    .string()
    .length(6, "Invite code must be exactly 6 characters.")
    .toUpperCase(),
});

export type JoinCoupleInput = z.infer<typeof JoinCoupleSchema>;

// ── Sync ──────────────────────────────────────────────────────────────────────

export const CreateSyncSchema = z.object({
  type: z.enum(["checkin", "compatibility"], {
    error: "type must be 'checkin' or 'compatibility'.",
  }),
  weekKey: z.string().max(20).optional(),
});

export const SyncRespondSchema = z.object({
  partner: z.enum(["A", "B"], {
    error: "partner must be 'A' or 'B'.",
  }),
  name: z.string().max(100).optional().default(""),
  responses: z.record(z.string(), z.unknown()),
});

export type CreateSyncInput = z.infer<typeof CreateSyncSchema>;
export type SyncRespondInput = z.infer<typeof SyncRespondSchema>;

// ── Feedback ──────────────────────────────────────────────────────────────────

export const FeedbackSchema = z.object({
  rating: z
    .number({ error: "rating must be a number." })
    .int()
    .min(1, "Please provide a rating between 1 and 5.")
    .max(5, "Please provide a rating between 1 and 5."),
  feeling: z.string().min(1, "Please select how the experience felt.").max(50),
  closer: z.string().min(1, "Please select if it brought you closer.").max(50),
  message: z.string().max(1000, "Message is too long.").optional().default(""),
  source: z.string().optional().default("unknown"),
});

export type FeedbackInput = z.infer<typeof FeedbackSchema>;
