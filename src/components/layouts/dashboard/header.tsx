import React from 'react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/shadcn/separator'
import { SidebarTrigger } from '@/components/ui/shadcn/sidebar'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSelector } from '@/components/theme-selector'
import { ThemeSwitch } from '@/components/theme-switch'

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export const Header = ({
  className,
  fixed,
  children,
  ...props
}: HeaderProps) => {
  const [offset, setOffset] = React.useState(0)

  React.useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }

    // Add scroll listener to the body
    document.addEventListener('scroll', onScroll, { passive: true })

    // Clean up the event listener on unmount
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'flex items-center gap-3 sm:gap-4 bg-background p-4 h-16 w-full justify-between',
        fixed && 'header-fixed peer/header w-[inherit] fixed z-50 rounded-md',
        offset > 10 && fixed
          ? 'shadow bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 supports-[backdrop-filter]:backdrop-blur-md'
          : 'shadow-none',
        className
      )}
      {...props}
    >
      <div className='flex items-center justify-start space-x-2'>
        <SidebarTrigger variant='outline' className='scale-125 sm:scale-100' />
        <Separator orientation='vertical' className='h-6' />
        {children}
      </div>

      <div className='flex items-center justify-end space-x-4'>
        <Search />

        <ThemeSwitch />

        <ThemeSelector />
        <ProfileDropdown />
      </div>
    </header>
  )
}

Header.displayName = 'Header'
