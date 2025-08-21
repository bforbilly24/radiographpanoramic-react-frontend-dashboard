'use client'

import { format } from 'date-fns'
import { PaginatedRadiographResponse } from '@/types/radiograph'
import { id } from 'date-fns/locale'
import { Pie, PieChart } from 'recharts'
import { toast } from '@/hooks/use-toast'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/shadcn/chart'
import { ToothIcon } from '@/components/svgs/tooth-icon'
import { diseaseLabels } from '@/features/radiographs/constant/disease-labels'
import React from 'react'

// Define chart configuration based on disease labels
const chartConfig = {
  conditions: {
    label: 'Kondisi',
  },
  ...Object.fromEntries(
    diseaseLabels.map((label) => [
      label.backendName.toLowerCase(),
      {
        label: label.name,
        color: label.color,
      },
    ])
  ),
} satisfies ChartConfig

interface ConditionsChartProps {
  data?: PaginatedRadiographResponse
  isLoading: boolean
}

export function ConditionsChart({ data, isLoading }: ConditionsChartProps) {
  // Show error toast if data is undefined and not loading
  React.useEffect(() => {
    if (!data && !isLoading) {
      toast({
        variant: 'destructive',
        title: 'Gagal memuat data',
        description: 'Terjadi kesalahan saat memuat data kondisi.',
      })
    }
  }, [data, isLoading])

  // Define valid condition keys
  type ConditionKey =
    | 'has_impaksi'
    | 'has_karies'
    | 'has_lesi_periapikal'
    | 'has_resorpsi'

  // Count conditions
  const conditionCounts = diseaseLabels
    .map((label) => {
      const conditionKey: ConditionKey =
        `has_${label.backendName.toLowerCase()}` as ConditionKey
      const count =
        data?.data.reduce((sum, radiograph) => {
          return sum + (radiograph.detected_conditions[conditionKey] ? 1 : 0)
        }, 0) || 0
      return {
        name: label.name,
        conditions: count,
        fill: label.color,
      }
    })
    .filter((item) => item.conditions > 0)

  // Get date range
  const dateRange = data?.data.length
    ? format(new Date(data.data[0].created_at), 'MMMM yyyy', { locale: id })
    : 'Mei 2025'

  if (isLoading) {
    return <div className='text-sm text-muted-foreground'>Memuat...</div>
  }

  return (
    <Card className='flex flex-col w-full'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Distribusi Kondisi</CardTitle>
        <CardDescription>{dateRange}</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0 px-4'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[250px] w-full'
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey='conditions' hideLabel />}
            />
            <Pie
              data={conditionCounts}
              dataKey='conditions'
              nameKey='name'
              cx='50%'
              cy='50%'
              outerRadius={80}
              labelLine={false}
              label={({ payload, ...props }) => {
                return (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill='hsla(var(--foreground))'
                    fontSize='12'
                  >
                    {payload.conditions}
                  </text>
                )
              }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 font-medium leading-none'>
          Total{' '}
          {conditionCounts.reduce((sum, item) => sum + item.conditions, 0)}{' '}
          kondisi terdeteksi
          <ToothIcon className='h-4 w-4' />
        </div>
        <div className='leading-none text-muted-foreground'>
          Menampilkan distribusi kondisi untuk {dateRange}
        </div>
      </CardFooter>
    </Card>
  )
}