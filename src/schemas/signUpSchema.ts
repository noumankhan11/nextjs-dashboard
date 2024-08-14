import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "usename must be atleast 2 characters")
  .max(20, "username must be atmost 20 characters");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email("invalid email"),
  password: z
    .string()
    .min(4, "password must be atleast 4 characters"),
});
