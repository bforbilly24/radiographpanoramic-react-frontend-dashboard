'use client'

import * as React from 'react'
import { PaginatedRadiographResponse } from '@/types/radiograph'
import { TrendingUp } from 'lucide-react'
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card'
import { ChartConfig, ChartContainer } from '@/components/ui/shadcn/chart'

interface TotalPatientsChartProps {
  data?: PaginatedRadiographResponse
  isLoading: boolean
}

function TotalPatientsChart({ data, isLoading }: TotalPatientsChartProps) {
  const totalPatients = data?.pagination.total || 0

  // Calculate trend: Last 30 days vs. previous 30 days
  const trendPercentage = React.useMemo(() => {
    if (!data?.data) return 0

    const now = new Date() // May 19, 2025
    const last30Days = new Date(now)
    last30Days.setDate(now.getDate() - 30)
    const prev30Days = new Date(last30Days)
    prev30Days.setDate(last30Days.getDate() - 30)

    const recentCounts = data.data.filter(
      (radiograph) => new Date(radiograph.created_at) >= last30Days
    ).length
    const prevCounts = data.data.filter(
      (radiograph) =>
        new Date(radiograph.created_at) >= prev30Days &&
        new Date(radiograph.created_at) < last30Days
    ).length

    if (prevCounts === 0) return recentCounts > 0 ? 100 : 0
    return (((recentCounts - prevCounts) / prevCounts) * 100).toFixed(1)
  }, [data])

  const chartData = [
    {
      category: 'total_pasien',
      count: totalPatients,
      fill: 'var(--color-total_pasien)',
    },
  ]

  const chartConfig: ChartConfig = {
    count: {
      label: 'Total Pasien',
    },
    total_pasien: {
      label: 'Total Pasien',
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig

  return (
    <Card className='flex flex-col w-full lg:col-span-1 md:cols-span-4'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Total Pasien</CardTitle>
        <CardDescription>Januari - Mei 2025</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0 px-4'>
        {isLoading ? (
          <div className='text-sm text-muted-foreground text-center mt-10'>
            Memuat...
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className='mx-auto aspect-square max-h-[250px] w-full'
          >
            <RadialBarChart
              data={chartData}
              startAngle={0}
              endAngle={250}
              innerRadius={80}
              outerRadius={110}
            >
              <PolarGrid
                gridType='circle'
                radialLines={false}
                stroke='none'
                className='first:fill-muted last:fill-background'
                polarRadius={[86, 74]}
              />
              <RadialBar dataKey='count' background cornerRadius={10} />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor='middle'
                          dominantBaseline='middle'
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className='fill-foreground text-3xl font-bold'
                          >
                            {totalPatients.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className='fill-muted-foreground text-sm'
                          >
                            Total Pasien
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 font-medium leading-none'>
          {Number(trendPercentage) >= 0
            ? `Trending up by ${trendPercentage}% this month`
            : `Trending down by ${Math.abs(Number(trendPercentage))}% this month`}
          <TrendingUp className='h-4 w-4' />
        </div>
        <div className='leading-none text-muted-foreground'>
          Showing total patients for the last 5 months
        </div>
      </CardFooter>
    </Card>
  )
}

export { TotalPatientsChart }
