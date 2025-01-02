import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email().min(1, {
    message: "Email is required",
  }),
  password: z.string().trim().min(1, {
    message: "Password is required",
  }),
});
