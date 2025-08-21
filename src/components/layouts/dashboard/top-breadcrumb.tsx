import { Link, useMatches } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  title: string
  href: string
}

function TopBreadcrumb({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const matches = useMatches()

  // Build breadcrumb items from route matches
  const breadcrumbs: BreadcrumbItem[] = matches
    .filter((match) => match.__routeContext?.breadcrumb)
    .map((match) => ({
      title: match.__routeContext.breadcrumb as string,
      href: match.pathname,
    }))

  return (
    <nav
      className={cn('flex items-center space-x-2 text-sm', className)}
      {...props}
    >
      {breadcrumbs.map((item, index) => (
        <div key={item.href} className='flex items-center'>
          {index > 0 && (
            <ChevronRight className='mx-1 h-4 w-4 text-muted-foreground' />
          )}
          {index === breadcrumbs.length - 1 ? (
            <span className='font-medium text-foreground'>{item.title}</span>
          ) : (
            <Link
              to={item.href}
              className='text-muted-foreground hover:text-primary transition-colors'
            >
              {item.title}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}

export { TopBreadcrumb }
