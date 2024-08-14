import { z } from "zod";

export const signInSchema = z.object({
  identifiier: z.string(),
  password: z.string(),
});
