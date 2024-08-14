import { z } from "zod";

export const messagesSchema = z.object({
  content: z
    .string()
    .min(5, "content must be 5 characters")
    .max(80, "content must not be more than 80 characters"),
});
