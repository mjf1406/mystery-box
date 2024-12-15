// src/schemas/gameSchema.ts
import { z } from "zod";

export const gameSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z.string().optional(),
});

export type GameInput = z.infer<typeof gameSchema>;
