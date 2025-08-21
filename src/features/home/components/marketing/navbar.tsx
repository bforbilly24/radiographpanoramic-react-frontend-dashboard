import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/shadcn/button'
import { BrandIcon } from '@/components/svgs/brand-icon'
import { NAV_LINKS } from '../../data'
import Wrapper from '../global/wrapper'
import MobileMenu from './mobile-menu'

const Navbar = () => {
  return (
    <header className='sticky top-0 w-full h-16 bg-background/80 backdrop-blur-sm z-50'>
      <Wrapper className='h-full'>
        <div className='flex items-center justify-between h-full'>
          <div className='flex items-center'>
            <Link to='/' className='flex items-center gap-2'>
              <BrandIcon className='size-6 text-foreground' />
              <span className='text-xl font-semibold hidden lg:block'>
                DentAl
              </span>
            </Link>
          </div>

          <div className='hidden lg:flex items-center gap-4'>
            <ul className='flex items-center gap-8'>
              {NAV_LINKS.map((link, index) => (
                <li key={index} className='text-sm font-medium -1 link'>
                  {link.href.startsWith('#') || link.href === '#' ? (
                    <a href={link.href}>{link.name}</a>
                  ) : (
                    <Link to={link.href}>{link.name}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className='flex items-center gap-4'>
            <Link to='/sign-in' className='hidden lg:block'>
              <Button variant='default'>Sign In</Button>
            </Link>
            <MobileMenu />
          </div>
        </div>
      </Wrapper>
    </header>
  )
}

export default Navbar
