// src/features/auth/sign-in/index.tsx
import { BrandIcon } from '@/components/svgs/brand-icon'
import { UserAuthForm } from './components/user-auth-form'

export default function SignIn() {
  return (
    <div className='container relative grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex'>
        <div className='absolute inset-0 bg-zinc-900' />
        <div className='relative z-20 flex flex-col items-center justify-center h-full'>
          <div className='flex space-x-1 items-center justify-start w-full'>
            <BrandIcon className='size-6 text-white' />

            <p className='text-lg font-medium'>DentAl</p>
          </div>
          <div className='w-full h-full flex items-center justify-center'>
            <BrandIcon className='size-52 text-white' />
          </div>
        </div>

        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-lg'>
              &ldquo;Sistem deteksi kelainan penyakit gigi berbasis kecerdasan
              buatan untuk diagnosis yang lebih cepat dan efisien.&rdquo;
            </p>
            <footer className='text-sm'>Author</footer>
          </blockquote>
        </div>
      </div>
      <div className='lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-left'>
            <h1 className='text-2xl font-semibold tracking-tight'>Sign In</h1>
            <p className='text-sm text-muted-foreground'>
              Masukkan email dan kata sandi Anda di bawah ini untuk masuk ke
              akun Anda
            </p>
          </div>
          <UserAuthForm />
          <p className='px-8 text-center text-sm text-muted-foreground'>
            Dengan mengklik sign in, Anda menyetujui{' '}
            <a
              href='/terms'
              className='underline underline-offset-4 hover:text-primary'
            >
              Syarat dan Ketentuan
            </a>{' '}
            dan{' '}
            <a
              href='/privacy'
              className='underline underline-offset-4 hover:text-primary'
            >
              Kebijakan Privasi
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
