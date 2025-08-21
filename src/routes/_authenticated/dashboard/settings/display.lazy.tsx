import { createLazyFileRoute } from '@tanstack/react-router'
import SettingsDisplay from '@/features/settings/display'

export const Route = createLazyFileRoute('/_authenticated/dashboard/settings/display')({
  component: SettingsDisplay,
})
