"use client";

import * as React from "react";
import { PaginatedRadiographResponse } from "@/types/radiograph";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/shadcn/chart";
import { DetectionStatus } from "@/features/radiographs/data/enum-data";

interface DetectionStatusChartProps {
  data?: PaginatedRadiographResponse;
  isLoading: boolean;
}

function DetectionStatusChart({ data, isLoading }: DetectionStatusChartProps) {
  // Detection Status Chart Data
  const detectionStatusData = React.useMemo(() => {
    if (!data?.data) {
      return [
        { status: "Sukses", count: 0, fill: "var(--color-sukses)" },
        { status: "Gagal", count: 0, fill: "var(--color-gagal)" },
        { status: "Proses", count: 0, fill: "var(--color-proses)" },
      ];
    }

    const sukses = data.data.filter(
      (radiograph) => radiograph.status_detection === DetectionStatus.SUCCESS
    ).length;
    const gagal = data.data.filter(
      (radiograph) => radiograph.status_detection === DetectionStatus.FAILED
    ).length;
    const proses = data.data.filter(
      (radiograph) =>
        radiograph.status_detection === DetectionStatus.IN_PROGRESS
    ).length;

    return [
      { status: "Sukses", count: sukses, fill: "var(--color-sukses)" },
      { status: "Gagal", count: gagal, fill: "var(--color-gagal)" },
      {
        status: "Proses",
        count: proses,
        fill: "var(--color-proses)",
      },
    ];
  }, [data]);

  // Calculate trend: Last 30 days vs. previous 30 days
  const trendPercentage = React.useMemo(() => {
    if (!data?.data) return 0;

    const now = new Date(); // May 19, 2025
    const last30Days = new Date(now);
    last30Days.setDate(now.getDate() - 30);
    const prev30Days = new Date(last30Days);
    prev30Days.setDate(last30Days.getDate() - 30);

    const recentCounts = data.data.filter(
      (radiograph) => new Date(radiograph.created_at) >= last30Days
    ).length;
    const prevCounts = data.data.filter(
      (radiograph) =>
        new Date(radiograph.created_at) >= prev30Days &&
        new Date(radiograph.created_at) < last30Days
    ).length;

    if (prevCounts === 0) return recentCounts > 0 ? 100 : 0;
    return (((recentCounts - prevCounts) / prevCounts) * 100).toFixed(1);
  }, [data]);

  const chartConfig: ChartConfig = {
    count: {
      label: "Jumlah",
    },
    sukses: {
      label: "Sukses",
      color: "#10b981", // Green
    },
    gagal: {
      label: "Gagal",
      color: "#ef4444", // Red
    },
    proses: {
      label: "Proses",
      color: "#f59e0b", // Yellow
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col w-full lg:col-span-1 md:cols-span-2">
      <CardHeader>
        <CardTitle>Status Deteksi</CardTitle>
        <CardDescription>
          {isLoading
            ? "Memuat data deteksi..."
            : `Menampilkan distribusi status deteksi.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4">
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Memuat...</div>
        ) : (
          <ChartContainer config={chartConfig} className="w-full h-[250px]">
            <BarChart
              accessibilityLayer
              data={detectionStatusData}
              layout="vertical"
              margin={{
                left: 80,
                right: 10,
                top: 10,
                bottom: 10,
              }}
            >
              <YAxis
                dataKey="status"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) =>
                  chartConfig[value.toLowerCase() as keyof typeof chartConfig]
                    ?.label || value
                }
                width={80}
                fontSize={12}
              />
              <XAxis dataKey="count" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="count" layout="vertical" radius={5} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {Number(trendPercentage) >= 0
            ? `Trending up by ${trendPercentage}% this month`
            : `Trending down by ${Math.abs(Number(trendPercentage))}% this month`}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing detection status distribution
        </div>
      </CardFooter>
    </Card>
  );
}

export { DetectionStatusChart };