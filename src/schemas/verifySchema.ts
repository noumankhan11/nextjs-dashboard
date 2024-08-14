import { z } from "zod";

export const verfySchema = z.object({
  code: z
    .string()
    .length(6, "Verification code must be atleast 6 digits"),
});
