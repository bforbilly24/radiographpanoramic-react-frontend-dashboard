import { createFileRoute, redirect } from '@tanstack/react-router'
import SignUp from '@/features/auth/sign-up'
import Cookies from 'js-cookie'

export const Route = createFileRoute('/(auth)/sign-up')({
  beforeLoad: () => {
    const accessToken = Cookies.get('accessToken')
    
    if (accessToken) {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
  component: SignUp,
})