// src/routes/(auth)/sign-in.tsx
import { createFileRoute } from '@tanstack/react-router';
import SignIn from '@/features/auth/sign-in';
import { z } from 'zod';

// Definisikan skema untuk parameter pencarian
const searchSchema = z.object({
  redirect: z.string().optional(), // redirect adalah string opsional
});

export const Route = createFileRoute('/(auth)/sign-in')({
  component: SignIn,
  validateSearch: searchSchema, // Validasi parameter pencarian
});