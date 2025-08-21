'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/shadcn/chart'
import { Bar, BarChart, XAxis, YAxis } from 'recharts'

// Simple test data
const chartData = [
  { month: 'Januari', desktop: 186 },
  { month: 'Februari', desktop: 305 },
  { month: 'Maret', desktop: 237 },
  { month: 'April', desktop: 73 },
  { month: 'Mei', desktop: 209 },
  { month: 'Juni', desktop: 214 },
]

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

export function SimpleTestChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Simple Test Chart</CardTitle>
        <CardDescription>Testing chart rendering</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
