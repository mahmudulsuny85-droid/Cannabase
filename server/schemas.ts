import { z } from "zod";

export const chatRequestSchema = z.object({
  message: z.string().min(1).max(1000),
  history: z.array(z.object({
    role: z.enum(["user", "model"]),
    parts: z.array(z.object({ text: z.string() }))
  })).optional().default([]),
});

export const loginRequestSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(6).max(100)
});

export const registerRequestSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(6).max(100)
});
