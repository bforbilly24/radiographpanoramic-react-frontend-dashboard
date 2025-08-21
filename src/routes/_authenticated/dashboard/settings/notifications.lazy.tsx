import { createLazyFileRoute } from '@tanstack/react-router'
import SettingsNotifications from '@/features/settings/notifications'

export const Route = createLazyFileRoute(
  '/_authenticated/dashboard/settings/notifications'
)({
  component: SettingsNotifications,
})
