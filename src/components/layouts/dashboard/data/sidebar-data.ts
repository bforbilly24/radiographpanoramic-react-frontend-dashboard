import {
  IconBarrierBlock,
  IconBrowserCheck,
  IconBug,
  IconChecklist,
  IconError404,
  IconHelp,
  IconLayoutDashboard,
  IconLock,
  IconLockAccess,
  IconNotification,
  IconPalette,
  IconServerOff,
  IconSettings,
  IconTool,
  IconUserCog,
  IconUserOff,
  IconUsers,
} from '@tabler/icons-react'
import { AudioWaveform, GalleryVerticalEnd } from 'lucide-react'
import { type SidebarData } from '../types'
import { BrandIcon } from '@/components/svgs/brand-icon'

export const sidebarData: SidebarData = {
  user: {
    name: 'halim putra',
    email: 'halimputra@icloud.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'DentAl',
      logo: BrandIcon,
      desc: 'Radiograph Panoramic',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      desc: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      desc: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: IconLayoutDashboard,
        },
        {
          title: 'Radiograf',
          url: '/dashboard/radiographs',
          icon: IconChecklist,
        },
        {
          title: 'Users',
          url: '/dashboard/users',
          icon: IconUsers,
        },
      ],
    },
    {
      title: 'Pages',
      items: [
        {
          title: 'Auth',
          icon: IconLockAccess,
          items: [
            {
              title: 'Sign In',
              url: '/sign-in',
            },
            {
              title: 'Sign In (2 Col)',
              url: '/sign-in-2',
            },
            {
              title: 'Sign Up',
              url: '/sign-up',
            },
            {
              title: 'Forgot Password',
              url: '/forgot-password',
            },
            {
              title: 'OTP',
              url: '/otp',
            },
          ],
        },
        {
          title: 'Errors',
          icon: IconBug,
          items: [
            {
              title: 'Unauthorized',
              url: '/401',
              icon: IconLock,
            },
            {
              title: 'Forbidden',
              url: '/403',
              icon: IconUserOff,
            },
            {
              title: 'Not Found',
              url: '/404',
              icon: IconError404,
            },
            {
              title: 'Internal Server Error',
              url: '/500',
              icon: IconServerOff,
            },
            {
              title: 'Maintenance Error',
              url: '/503',
              icon: IconBarrierBlock,
            },
          ],
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: IconSettings,
          items: [
            {
              title: 'Profile',
              url: '/dashboard/settings',
              icon: IconUserCog,
            },
            {
              title: 'Account',
              url: '/dashboard/settings/account',
              icon: IconTool,
            },
            {
              title: 'Appearance',
              url: '/dashboard/settings/appearance',
              icon: IconPalette,
            },
            {
              title: 'Notifications',
              url: '/dashboard/settings/notifications',
              icon: IconNotification,
            },
            {
              title: 'Display',
              url: '/dashboard/settings/display',
              icon: IconBrowserCheck,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/dashboard/help-center',
          icon: IconHelp,
        },
      ],
    },
  ],
}
