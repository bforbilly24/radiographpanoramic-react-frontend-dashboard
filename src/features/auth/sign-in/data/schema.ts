import { z } from "zod";

// src/features/auth/sign-in/data/schema.ts
const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, { message: 'Please enter your password' })
    .min(4, { message: 'Password must be at least 4 characters long' }),
});

export { formSchema };