'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card'
import { JSX } from 'react'

interface StatCard {
  title: string
  value: string | number
  icon: JSX.Element
  description: string
}

interface StatsCardsProps {
  isLoading: boolean
  cards: StatCard[]
}

export function StatsCards({ isLoading, cards }: StatsCardsProps) {
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{card.title}</CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {isLoading ? '...' : card.value}
            </div>
            <p className='text-xs text-muted-foreground'>
              {isLoading ? '' : card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}