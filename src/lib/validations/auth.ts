import { z } from "zod";

const requiredString = z.string().trim().min(1, "required");

export const signUpSchema = z.object({
  email: requiredString.email("Invalid email address").toLowerCase(),
  username: requiredString.regex(
    /^[a-zA-z0-9_-]+$/,
    "Only letters, numbers, _ and - are allowed",
  ),
  password: requiredString.min(
    8,
    "Password must be at least 8 characters long",
  ),
});
export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
});
export type LoginValues = z.infer<typeof loginSchema>;
