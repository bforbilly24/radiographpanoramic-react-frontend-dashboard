// src/routes/(auth)/sign-in.tsx
import { createFileRoute, redirect } from '@tanstack/react-router';
import SignIn from '@/features/auth/sign-in';
import { z } from 'zod';
import Cookies from 'js-cookie';

// Definisikan skema untuk parameter pencarian
const searchSchema = z.object({
  redirect: z.string().optional(), // redirect adalah string opsional
});

export const Route = createFileRoute('/(auth)/sign-in')({
  beforeLoad: () => {
    // Cek apakah user sudah login
    const accessToken = Cookies.get('accessToken');
    
    if (accessToken) {
      // Jika sudah login, redirect ke dashboard
      throw redirect({
        to: '/dashboard',
      });
    }
  },
  component: SignIn,
  validateSearch: searchSchema, // Validasi parameter pencarian
});