"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/shadcn/chart';
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/shadcn/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/shadcn/tabs';
import { diseaseLabels } from '@/features/radiographs/constant/disease-labels';
import { PaginatedRadiographResponse } from '@/types/radiograph';
import { DetectionStatus } from '@/features/radiographs/data/enum-data';

interface OverviewChartProps {
  data?: PaginatedRadiographResponse;
  isLoading: boolean;
}

function OverviewChart({ data, isLoading }: OverviewChartProps) {
  const [timeRange, setTimeRange] = React.useState<"90d" | "30d" | "7d">("30d");

  // Conditions Over Time Chart Data
  const conditionsOverTimeData = React.useMemo(() => {
    if (!data?.data) return {};

    return data.data.reduce(
      (
        acc: Record<string, { date: string; impaksi: number; karies: number; lesi_periapikal: number; resorpsi: number }>,
        radiograph
      ) => {
        const date = new Date(radiograph.created_at);
        const key = timeRange === "90d"
          ? date.toLocaleString('id-ID', { month: 'short', year: 'numeric' })
          : date.toISOString().split('T')[0];
        const conditions = Object.entries(radiograph.detected_conditions)
          .filter(([, value]) => value)
          .map(([key]) => key.replace('has_', '')) as ('impaksi' | 'karies' | 'lesi_periapikal' | 'resorpsi')[];

        if (!acc[key]) {
          acc[key] = {
            date: key,
            impaksi: 0,
            karies: 0,
            lesi_periapikal: 0,
            resorpsi: 0,
          };
        }

        conditions.forEach((condition) => {
          acc[key][condition]++;
        });

        return acc;
      },
      {}
    );
  }, [data, timeRange]);

  const conditionsTimeChartData = Object.values(conditionsOverTimeData).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Filter data by time range
  const filteredChartData = conditionsTimeChartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date(); // Today: May 19, 2025
    let daysToSubtract = 30;
    if (timeRange === "90d") daysToSubtract = 90;
    else if (timeRange === "7d") daysToSubtract = 7;
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate && date <= referenceDate;
  });

  // Calculate total counts for each condition
  const totalConditionsCount = React.useMemo(
    () => ({
      impaksi: conditionsTimeChartData.reduce((acc, curr) => acc + curr.impaksi, 0),
      karies: conditionsTimeChartData.reduce((acc, curr) => acc + curr.karies, 0),
      lesi_periapikal: conditionsTimeChartData.reduce((acc, curr) => acc + curr.lesi_periapikal, 0),
      resorpsi: conditionsTimeChartData.reduce((acc, curr) => acc + curr.resorpsi, 0),
    }),
    [conditionsTimeChartData]
  );

  // Detection Status Chart Data
  const detectionStatusOverTimeData = React.useMemo(() => {
    if (!data?.data) return {};

    return data.data.reduce(
      (
        acc: Record<string, { date: string; sukses: number; gagal: number; dalam_proses: number }>,
        radiograph
      ) => {
        const date = new Date(radiograph.created_at);
        const key = timeRange === "90d"
          ? date.toLocaleString('id-ID', { month: 'short', year: 'numeric' })
          : date.toISOString().split('T')[0];
        const status = radiograph.status_detection;

        if (!acc[key]) {
          acc[key] = {
            date: key,
            sukses: 0,
            gagal: 0,
            dalam_proses: 0,
          };
        }

        if (status === DetectionStatus.SUCCESS) {
          acc[key].sukses++;
        } else if (status === DetectionStatus.FAILED) {
          acc[key].gagal++;
        } else if (status === DetectionStatus.IN_PROGRESS) {
          acc[key].dalam_proses++;
        }

        return acc;
      },
      {}
    );
  }, [data, timeRange]);

  const detectionStatusTimeChartData = Object.values(detectionStatusOverTimeData).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const filteredStatusChartData = detectionStatusTimeChartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date();
    let daysToSubtract = 30;
    if (timeRange === "90d") daysToSubtract = 90;
    else if (timeRange === "7d") daysToSubtract = 7;
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate && date <= referenceDate;
  });

  // Calculate total counts for each status
  const totalStatusCount = React.useMemo(
    () => ({
      sukses: detectionStatusTimeChartData.reduce((acc, curr) => acc + curr.sukses, 0),
      gagal: detectionStatusTimeChartData.reduce((acc, curr) => acc + curr.gagal, 0),
      dalam_proses: detectionStatusTimeChartData.reduce((acc, curr) => acc + curr.dalam_proses, 0),
    }),
    [detectionStatusTimeChartData]
  );

  // Total Patients Chart Data
  const patientsOverTimeData = React.useMemo(() => {
    if (!data?.data) return {};

    return data.data.reduce(
      (
        acc: Record<string, { date: string; total_pasien: number }>,
        radiograph
      ) => {
        const date = new Date(radiograph.created_at);
        const key = timeRange === "90d"
          ? date.toLocaleString('id-ID', { month: 'short', year: 'numeric' })
          : date.toISOString().split('T')[0];

        if (!acc[key]) {
          acc[key] = {
            date: key,
            total_pasien: 0,
          };
        }

        acc[key].total_pasien++;

        return acc;
      },
      {}
    );
  }, [data, timeRange]);

  const patientsTimeChartData = Object.values(patientsOverTimeData).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const filteredPatientsChartData = patientsTimeChartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date();
    let daysToSubtract = 30;
    if (timeRange === "90d") daysToSubtract = 90;
    else if (timeRange === "7d") daysToSubtract = 7;
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate && date <= referenceDate;
  });

  // Calculate total patients
  const totalPatientsCount = React.useMemo(
    () => patientsTimeChartData.reduce((acc, curr) => acc + curr.total_pasien, 0),
    [patientsTimeChartData]
  );

  const conditionsChartConfig: ChartConfig = {
    ...Object.fromEntries(
      diseaseLabels.map((label) => [
        label.backendName.toLowerCase(),
        { label: label.name, color: label.color },
      ])
    ),
  };

  const statusChartConfig: ChartConfig = {
    sukses: {
      label: "Sukses",
      color: "#10b981", // Green
    },
    gagal: {
      label: "Gagal",
      color: "#ef4444", // Red
    },
    dalam_proses: {
      label: "Dalam Proses",
      color: "#f59e0b", // Yellow
    },
  };

  const patientsChartConfig: ChartConfig = {
    total_pasien: {
      label: "Total Pasien",
      color: "#2563eb", // Blue
    },
  };

  return (
    <Card className="col-span-1 lg:col-span-7">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Kondisi, Status Deteksi, dan Total Pasien per Periode</CardTitle>
          <CardDescription>
            {isLoading
              ? 'Memuat data...'
              : `Menampilkan data untuk ${timeRange === '90d' ? '3 bulan terakhir' : timeRange === '30d' ? '30 hari terakhir' : '7 hari terakhir'}.`}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2 px-6 py-5 sm:py-6">
          <Select
            value={timeRange}
            onValueChange={(value) => setTimeRange(value as "90d" | "30d" | "7d")}
          >
            <SelectTrigger
              className="w-[160px] rounded-lg"
              aria-label="Pilih rentang waktu"
            >
              <SelectValue placeholder="30 hari terakhir" />
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
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Memuat...</div>
        ) : !data?.data || data.data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[250px] text-muted-foreground">
            <p className="text-lg font-medium">Tidak ada data untuk ditampilkan</p>
            <p className="text-sm">Data radiograph tidak tersedia untuk periode ini</p>
          </div>
        ) : (
          <Tabs defaultValue="conditions" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="conditions">Semua Penyakit</TabsTrigger>
              <TabsTrigger value="status">Status Deteksi</TabsTrigger>
              <TabsTrigger value="patients">Total Pasien</TabsTrigger>
            </TabsList>
            <TabsContent value="conditions">
              <div className="flex flex-wrap gap-4 mb-4">
                {diseaseLabels.map((label) => (
                  <div
                    key={label.backendName.toLowerCase()}
                    className="flex flex-1 flex-col justify-center gap-1 p-4 text-left border rounded-lg"
                  >
                    <span className="text-xs text-muted-foreground">
                      {label.name}
                    </span>
                    <span className="text-lg font-bold leading-none sm:text-2xl">
                      {totalConditionsCount[label.backendName.toLowerCase() as keyof typeof totalConditionsCount].toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <ChartContainer
                config={conditionsChartConfig}
                className="aspect-auto h-[250px] w-full"
              >
                <AreaChart
                  accessibilityLayer
                  data={filteredChartData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <defs>
                    {diseaseLabels.map((label) => (
                      <linearGradient
                        key={label.backendName.toLowerCase()}
                        id={`fill${label.backendName.toLowerCase()}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={label.color}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor={label.color}
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return timeRange === "90d"
                        ? date.toLocaleString("id-ID", { month: "short", year: "numeric" })
                        : date.toLocaleString("id-ID", { month: "short", day: "numeric" });
                    }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        className="w-[150px]"
                        labelFormatter={(value) => {
                          const date = new Date(value);
                          return date.toLocaleString("id-ID", {
                            month: "short",
                            day: timeRange !== "90d" ? "numeric" : undefined,
                            year: "numeric",
                          });
                        }}
                        indicator="dot"
                      />
                    }
                  />
                  {diseaseLabels.map((label) => (
                    <Area
                      key={label.backendName.toLowerCase()}
                      dataKey={label.backendName.toLowerCase()}
                      type="natural"
                      fill={`url(#fill${label.backendName.toLowerCase()})`}
                      stroke={label.color}
                      stackId="a"
                    />
                  ))}
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            </TabsContent>
            <TabsContent value="status">
              <div className="flex flex-wrap gap-4 mb-4">
                {Object.entries(totalStatusCount).map(([key, count]) => (
                  <div
                    key={key}
                    className="flex flex-1 flex-col justify-center gap-1 p-4 text-left border rounded-lg"
                  >
                    <span className="text-xs text-muted-foreground">
                      {statusChartConfig[key as keyof typeof statusChartConfig].label}
                    </span>
                    <span className="text-lg font-bold leading-none sm:text-2xl">
                      {count.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <ChartContainer
                config={statusChartConfig}
                className="aspect-auto h-[250px] w-full"
              >
                <AreaChart
                  accessibilityLayer
                  data={filteredStatusChartData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <defs>
                    {Object.keys(statusChartConfig).map((key) => (
                      <linearGradient
                        key={key}
                        id={`fill${key}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={statusChartConfig[key as keyof typeof statusChartConfig].color}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor={statusChartConfig[key as keyof typeof statusChartConfig].color}
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return timeRange === "90d"
                        ? date.toLocaleString("id-ID", { month: "short", year: "numeric" })
                        : date.toLocaleString("id-ID", { month: "short", day: "numeric" });
                    }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        className="w-[150px]"
                        labelFormatter={(value) => {
                          const date = new Date(value);
                          return date.toLocaleString("id-ID", {
                            month: "short",
                            day: timeRange !== "90d" ? "numeric" : undefined,
                            year: "numeric",
                          });
                        }}
                        indicator="dot"
                      />
                    }
                  />
                  <Area
                    dataKey="sukses"
                    type="natural"
                    fill="url(#fillsukses)"
                    stroke="#10b981"
                    stackId="a"
                  />
                  <Area
                    dataKey="gagal"
                    type="natural"
                    fill="url(#fillgagal)"
                    stroke="#ef4444"
                    stackId="a"
                  />
                  <Area
                    dataKey="dalam_proses"
                    type="natural"
                    fill="url(#filldalam_proses)"
                    stroke="#f59e0b"
                    stackId="a"
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            </TabsContent>
            <TabsContent value="patients">
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex flex-1 flex-col justify-center gap-1 p-4 text-left border rounded-lg">
                  <span className="text-xs text-muted-foreground">Total Pasien</span>
                  <span className="text-lg font-bold leading-none sm:text-2xl">
                    {totalPatientsCount.toLocaleString()}
                  </span>
                </div>
              </div>
              <ChartContainer
                config={patientsChartConfig}
                className="aspect-auto h-[250px] w-full"
              >
                <AreaChart
                  accessibilityLayer
                  data={filteredPatientsChartData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <defs>
                    <linearGradient id="filltotal_pasien" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1} />
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
                      const date = new Date(value);
                      return timeRange === "90d"
                        ? date.toLocaleString("id-ID", { month: "short", year: "numeric" })
                        : date.toLocaleString("id-ID", { month: "short", day: "numeric" });
                    }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        className="w-[150px]"
                        labelFormatter={(value) => {
                          const date = new Date(value);
                          return date.toLocaleString("id-ID", {
                            month: "short",
                            day: timeRange !== "90d" ? "numeric" : undefined,
                            year: "numeric",
                          });
                        }}
                        indicator="dot"
                      />
                    }
                  />
                  <Area
                    dataKey="total_pasien"
                    type="natural"
                    fill="url(#filltotal_pasien)"
                    stroke="#2563eb"
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}

export { OverviewChart };