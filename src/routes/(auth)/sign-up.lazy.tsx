import { createLazyFileRoute, redirect } from '@tanstack/react-router'
import SignUp from '@/features/auth/sign-up'
import Cookies from 'js-cookie'

export const Route = createLazyFileRoute('/(auth)/sign-up')({
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
  component: SignUp,
})
