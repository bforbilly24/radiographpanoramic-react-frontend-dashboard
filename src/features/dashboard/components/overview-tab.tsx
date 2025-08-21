'use client'

import { PaginatedRadiographResponse } from '@/types/radiograph'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card'
import { StatsCards } from './cards/stats-card'
import { RadiographChart } from './charts/radiograph-chart'
import { RecentPatients } from './recent-patients'

interface OverviewTabProps {
  data?: PaginatedRadiographResponse
  isLoading: boolean
}

function OverviewTab({ data, isLoading }: OverviewTabProps) {
  const totalPatients = data?.pagination.total || 0
  const successfulDetections =
    data?.data.filter((radiograph) => radiograph.status_detection === 'success')
      .length || 0
  const totalConditions =
    data?.data.reduce(
      (sum: number, radiograph) =>
        sum +
        Object.values(radiograph.detected_conditions).filter(Boolean).length,
      0
    ) || 0
  const lastWeekPatients =
    data?.data.filter((radiograph) => {
      const createdAt = new Date(radiograph.created_at)
      const now = new Date()
      const oneWeekAgo = new Date(now.setDate(now.getDate() - 7))
      return createdAt >= oneWeekAgo
    }).length || 0
  const patientChange = totalPatients - lastWeekPatients
  const successRate = totalPatients
    ? ((successfulDetections / totalPatients) * 100).toFixed(0)
    : 0
  const avgConditions = totalPatients
    ? (totalConditions / totalPatients).toFixed(1)
    : 0

  const cards = [
    {
      title: 'Total Pasien',
      value: totalPatients,
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          className='h-4 w-4 text-muted-foreground'
        >
          <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
          <circle cx='9' cy='7' r='4' />
          <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
        </svg>
      ),
      description: `${patientChange >= 0 ? '+' : ''}${patientChange} dari minggu lalu`,
    },
    {
      title: 'Deteksi Sukses',
      value: successfulDetections,
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          className='h-4 w-4 text-muted-foreground'
        >
          <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' />
          <path d='M22 4L12 14.01l-3-3' />
        </svg>
      ),
      description: `${successRate}% tingkat keberhasilan`,
    },
    {
      title: 'Kondisi Terdeteksi',
      value: totalConditions,
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          className='h-4 w-4 text-muted-foreground'
        >
          <path d='M3 3v18h18' />
          <path d='M18.7 8l-5.1 5.2-2.8-2.7L7 14.3' />
        </svg>
      ),
      description: `Rata-rata ${avgConditions} per pasien`,
    },
    {
      title: 'Analisis Aktif',
      value: 0,
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          className='h-4 w-4 text-muted-foreground'
        >
          <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
        </svg>
      ),
      description: 'Tidak ada analisis berjalan',
    },
  ]

  return (
    <div className='space-y-4'>
      <StatsCards isLoading={isLoading} cards={cards} />
      
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-7 h-full'>
        <div className='col-span-1 lg:col-span-4'>
          <RadiographChart data={data} isLoading={isLoading} />
        </div>
        <Card className='col-span-1 lg:col-span-3'>
          <CardHeader>
            <CardTitle>Pasien Terbaru</CardTitle>
            <CardDescription>
              Anda telah menganalisis {totalPatients} pasien bulan ini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentPatients />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export { OverviewTab }