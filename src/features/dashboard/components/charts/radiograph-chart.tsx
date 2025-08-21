"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { PaginatedRadiographResponse } from '@/types/radiograph'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/shadcn/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select"

interface RadiographChartProps {
  data?: PaginatedRadiographResponse
  isLoading: boolean
}

const chartConfig = {
  conditions: {
    label: "Kondisi Terdeteksi",
  },
  karies: {
    label: "Karies",
    color: "#DDFF33", // Yellow-green
  },
  impaksi: {
    label: "Impaksi",
    color: "#B83DF5", // Purple
  },
  lesi_periapikal: {
    label: "Lesi Periapikal",
    color: "#2A7DD1", // Blue
  },
  resorpsi: {
    label: "Resorpsi",
    color: "#FA3253", // Red
  },
} satisfies ChartConfig

export function RadiographChart({ data, isLoading }: RadiographChartProps) {
  const [timeRange, setTimeRange] = React.useState("30d")

  const chartData = React.useMemo(() => {
    if (!data?.data || data.data.length === 0) {
      // Fallback data jika tidak ada data dari API
      return [
        { date: "2025-08-01", karies: 3, impaksi: 2, lesi_periapikal: 1, resorpsi: 1 },
        { date: "2025-08-02", karies: 5, impaksi: 3, lesi_periapikal: 2, resorpsi: 1 },
        { date: "2025-08-03", karies: 7, impaksi: 4, lesi_periapikal: 3, resorpsi: 2 },
        { date: "2025-08-04", karies: 9, impaksi: 5, lesi_periapikal: 4, resorpsi: 3 },
        { date: "2025-08-05", karies: 12, impaksi: 7, lesi_periapikal: 5, resorpsi: 4 },
        { date: "2025-08-06", karies: 15, impaksi: 8, lesi_periapikal: 6, resorpsi: 5 },
        { date: "2025-08-07", karies: 18, impaksi: 10, lesi_periapikal: 8, resorpsi: 6 },
      ]
    }

    // Proses data dari API untuk kondisi spesifik
    const processedData = data.data.reduce((acc: Record<string, { 
      date: string; 
      karies: number; 
      impaksi: number; 
      lesi_periapikal: number; 
      resorpsi: number; 
    }>, radiograph) => {
      const date = new Date(radiograph.created_at).toISOString().split('T')[0]
      
      if (!acc[date]) {
        acc[date] = { date, karies: 0, impaksi: 0, lesi_periapikal: 0, resorpsi: 0 }
      }
      
      // Hitung kondisi yang terdeteksi
      if (radiograph.detected_conditions.has_karies) {
        acc[date].karies++
      }
      if (radiograph.detected_conditions.has_impaksi) {
        acc[date].impaksi++
      }
      if (radiograph.detected_conditions.has_lesi_periapikal) {
        acc[date].lesi_periapikal++
      }
      if (radiograph.detected_conditions.has_resorpsi) {
        acc[date].resorpsi++
      }
      
      return acc
    }, {})

    return Object.values(processedData).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  }, [data])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date()
    let daysToSubtract = 30
    if (timeRange === "90d") {
      daysToSubtract = 90
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Kondisi Dental Terdeteksi</CardTitle>
          <CardDescription>Memuat data kondisi dental...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[250px] text-muted-foreground">
            Loading...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Kondisi Dental Terdeteksi</CardTitle>
          <CardDescription>
            Menampilkan jumlah karies, impaksi, lesi periapikal, dan resorpsi per hari
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 30 days" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              3 bulan terakhir
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              30 hari terakhir
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              7 hari terakhir
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillKaries" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#DDFF33"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#DDFF33"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillImpaksi" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#B83DF5"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#B83DF5"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillLesiPeriapikal" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#2A7DD1"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#2A7DD1"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillResorpsi" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#FA3253"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#FA3253"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("id-ID", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("id-ID", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="karies"
              type="natural"
              fill="url(#fillKaries)"
              stroke="#DDFF33"
              stackId="a"
            />
            <Area
              dataKey="impaksi"
              type="natural"
              fill="url(#fillImpaksi)"
              stroke="#B83DF5"
              stackId="a"
            />
            <Area
              dataKey="lesi_periapikal"
              type="natural"
              fill="url(#fillLesiPeriapikal)"
              stroke="#2A7DD1"
              stackId="a"
            />
            <Area
              dataKey="resorpsi"
              type="natural"
              fill="url(#fillResorpsi)"
              stroke="#FA3253"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
