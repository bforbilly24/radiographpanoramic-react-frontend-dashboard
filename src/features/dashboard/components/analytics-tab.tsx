'use client'

import { PaginatedRadiographResponse } from '@/types/radiograph'
import { StatsCards } from './cards/stats-card'
import { ConditionsChart } from './charts/conditions-chart'
import { DetectionStatusChart } from './charts/detection-status-chart'
import { TotalPatientsChart } from './charts/total-patient-chart'
import { OverviewChart } from './charts/overview-chart'

interface AnalyticsTabProps {
  data?: PaginatedRadiographResponse
  isLoading: boolean
}

function AnalyticsTab({ data, isLoading }: AnalyticsTabProps) {
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
  const totalDetections = data?.data.length || 0
  const successRate = totalDetections
    ? ((successfulDetections / totalDetections) * 100).toFixed(0)
    : 0
  const avgConditions = totalDetections
    ? (totalConditions / totalDetections).toFixed(1)
    : 0

  const cards = [
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
  ]

  return (
    <div className='space-y-4'>
      <StatsCards isLoading={isLoading} cards={cards} />{' '}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <ConditionsChart data={data} isLoading={isLoading} />
        <DetectionStatusChart data={data} isLoading={isLoading} />
        <TotalPatientsChart data={data} isLoading={isLoading} />
      </div>
      <OverviewChart data={data} isLoading={isLoading} />
    </div>
  )
}

export { AnalyticsTab }
