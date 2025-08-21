'use client'

import { Link } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/shadcn/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/shadcn/sheet'
import { NAV_LINKS } from '../../data'

const MobileMenu = () => {
  return (
    <Sheet>
      <SheetTrigger asChild className='lg:hidden'>
        <Button variant='ghost' size='icon' className='lg:hidden'>
          <Menu className='h-6 w-6' />
        </Button>
      </SheetTrigger>
      <SheetContent side='right' className='w-full sm:w-[300px] pt-12'>
        <SheetHeader className='mb-8'>
          <SheetTitle className='text-left'>Menu</SheetTitle>
        </SheetHeader>
        <nav className='flex flex-col space-y-4'>
          {NAV_LINKS.map((link, index) => (
            <Link
              key={index}
              to={link.href}
              className='text-base font-medium transition-colors hover:text-primary'
            >
              {link.name}
            </Link>
          ))}
          <div className='pt-4 mt-4 border-t border-border'>
            <Link to='/sign-in' className='w-full'>
              <Button className='w-full' variant='default'>
                Sign In
              </Button>
            </Link>
            <Link to='/sign-up' className='w-full'>
              <Button className='w-full' variant='outline'>
                Sign Up
              </Button>
            </Link>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

export default MobileMenu
