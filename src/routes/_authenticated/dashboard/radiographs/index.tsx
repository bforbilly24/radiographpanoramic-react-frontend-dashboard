// src/routes/_authenticated/dashboard/radiographs/index.tsx
import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

const Radiographs = lazy(() => import('@/features/radiographs'))

export const Route = createFileRoute('/_authenticated/dashboard/radiographs/')({
  component: () => <Radiographs />,
  context: () => ({
    breadcrumb: 'Radiographs',
  }),
})
