'use client'

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getDataRadiograph } from '@/actions/radiograph/get-data-radiograph'
import { toast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback } from '@/components/ui/shadcn/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/shadcn/tooltip'
import { diseaseLabels } from '@/features/radiographs/constant/disease-labels'
import { formatDate } from '@/features/radiographs/utils/format-date'

export function RecentPatients() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['recent-patients'],
    queryFn: () => getDataRadiograph(1, 7),
  })

  if (error) {
    toast({
      variant: 'destructive',
      title: 'Gagal memuat pasien',
      description:
        error.message || 'Terjadi kesalahan saat memuat data pasien.',
    })
  }

  const patients = React.useMemo(() => {
    return (
      data?.data
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .map((radiograph) => {
          const conditions = diseaseLabels
            .filter((label) => {
              const conditionKey =
                `has_${label.backendName.toLowerCase().replace('lesi_periapikal', 'lesi_periapikal')}` as keyof typeof radiograph.detected_conditions
              return radiograph.detected_conditions[conditionKey]
            })
            .map((label) => label.name)

          // Compute initials for avatar
          const nameParts = radiograph.patient_name.trim().split(/\s+/)
          const initials =
            nameParts.length > 1
              ? `${nameParts[0][0] || ''}${nameParts[1][0] || ''}`
              : nameParts[0]?.[0] || '?'

          // Format created_at
          const formattedCreatedAt = !isNaN(
            new Date(radiograph.created_at).getTime()
          )
            ? formatDate(radiograph.created_at)
            : 'Tanggal tidak valid'

          return {
            id: radiograph.id,
            name: radiograph.patient_name,
            task_id: radiograph.task_id || 'N/A',
            conditions,
            initials: initials.toUpperCase(),
            createdAt: formattedCreatedAt,
          }
        }) || []
    )
  }, [data])

  if (isLoading) {
    return <div className='text-sm text-muted-foreground'>Memuat...</div>
  }

  if (patients.length === 0) {
    return (
      <div className='text-sm text-muted-foreground'>
        Tidak ada pasien terbaru.
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className='space-y-8'>
        {patients.map((patient) => (
          <div
            key={patient.id}
            className='flex items-center gap-4'
            aria-label={`Pasien ${patient.name}`}
          >
            <Avatar className='h-9 w-9'>
              <AvatarFallback>{patient.initials}</AvatarFallback>
            </Avatar>
            <div className='flex flex-1 items-center justify-between'>
              <div className='space-y-1 w-[200px]'>
                <p className='text-sm font-medium leading-none line-clamp-1'>
                  {patient.name}
                </p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className='text-sm text-muted-foreground line-clamp-1 uppercase'>
                      Task ID: {patient.task_id}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent side='left'>
                    <span className='text-xs'>{patient.task_id}</span>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className='flex flex-col w-[200px] space-y-1'>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className='text-sm text-muted-foreground line-clamp-1 w-full'>
                      Dibuat: {patient.createdAt}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent side='left'>
                    <span className='text-xs'>{patient.createdAt}</span>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className='text-sm text-muted-foreground line-clamp-1 w-full'>
                      {patient.conditions.length > 0
                        ? patient.conditions.join(', ')
                        : 'Tidak ada kondisi'}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent side='left'>
                    <span className='text-xs'>
                      {patient.conditions.length > 0
                        ? patient.conditions.join(', ')
                        : 'Tidak ada kondisi'}
                    </span>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        ))}
      </div>
    </TooltipProvider>
  )
}
