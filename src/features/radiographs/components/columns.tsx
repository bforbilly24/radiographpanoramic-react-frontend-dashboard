import { ColumnDef } from '@tanstack/react-table'
import { RadiographResponse } from '@/types/radiograph'
import { Badge } from '@/components/ui/shadcn/badge'
import { Checkbox } from '@/components/ui/shadcn/checkbox'
import { Label } from '@/components/ui/shadcn/label'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/shadcn/tooltip'
import { DataTableColumnHeader } from '@/features/radiographs/components/data-table-column-header'
import { DataTableRowActions } from '@/features/radiographs/components/data-table-row-actions'
import { statuses } from '@/features/radiographs/data/filter'
import { formatDate } from '../utils/format-date'
import { ImageCell } from './image-cell'

export const columns: ColumnDef<RadiographResponse>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'task_id',
    accessorKey: 'task_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Task' />
    ),
    cell: ({ row }) => {
      const taskId = row.getValue('task_id') as string
      return taskId.toUpperCase()
    },
    filterFn: (row, id, value: string) =>
      (row.getValue(id) as string).toLowerCase().includes(value.toLowerCase()),
  },
  {
    id: 'patient_name',
    accessorKey: 'patient_name',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Nama Pasien'
        className='max-w-[300px] truncate'
      />
    ),
    cell: ({ row }) => {
      const patientName = row.getValue('patient_name') as string
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className='block truncate line-clamp-1 max-w-[300px]'
              title={patientName}
            >
              {patientName}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{patientName}</p>
          </TooltipContent>
        </Tooltip>
      )
    },
    filterFn: (row, id, value: string) =>
      (row.getValue(id) as string).toLowerCase().includes(value.toLowerCase()),
  },
  {
    id: 'status_detection',
    accessorKey: 'status_detection',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue('status_detection')
      )

      if (!status) {
        return null
      }

      return (
        <Badge
          variant='outline'
          className='flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3'
        >
          {status.icon && (
            <status.icon
              className={
                status.value === 'success'
                  ? 'text-green-500 dark:text-green-400'
                  : status.value === 'process'
                    ? 'text-yellow-500 dark:text-yellow-400'
                    : 'text-red-500 dark:text-red-400'
              }
            />
          )}
          {status.label}
        </Badge>
      )
    },
    filterFn: (row, id, value: string[]) =>
      value.includes(row.getValue(id) as string),
  },
  {
    id: 'original_file',
    accessorKey: 'original_file',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Gambar Asli' />
    ),
    cell: ({ row }) => (
      <ImageCell
        path={row.getValue('original_file') as string}
        alt='Gambar Asli'
        radiograph={row.original as RadiographResponse}
      />
    ),
  },
  {
    id: 'mask_file',
    accessorKey: 'mask_file',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Mask File' />
    ),
    cell: ({ row }) => {
      const maskPath = row.getValue('mask_file') as string | undefined
      return maskPath ? (
        <ImageCell
          path={maskPath}
          alt='Mask File'
          radiograph={row.original as RadiographResponse}
        />
      ) : (
        <span>Tidak Ada Mask</span>
      )
    },
  },
  {
    id: 'overlay_file',
    accessorKey: 'overlay_file',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Gambar Overlay' />
    ),
    cell: ({ row }) => {
      const overlayPath = row.getValue('overlay_file') as string
      return (
        <ImageCell
          path={overlayPath}
          alt='Gambar Overlay'
          radiograph={row.original as RadiographResponse}
        />
      )
    },
  },
  {
    id: 'detected_conditions',
    accessorKey: 'detected_conditions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kondisi Terdeteksi' />
    ),
    cell: ({ row }) => {
      const conditions = row.getValue(
        'detected_conditions'
      ) as RadiographResponse['detected_conditions']
      return (
        <div className='flex flex-wrap gap-1 max-w-[200px]'>
          {conditions.has_karies && (
            <Label className='text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded'>
              Karies
            </Label>
          )}
          {conditions.has_lesi_periapikal && (
            <Label className='text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded'>
              Lesi Periapikal
            </Label>
          )}
          {conditions.has_resorpsi && (
            <Label className='text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded'>
              Resorpsi
            </Label>
          )}
          {conditions.has_impaksi && (
            <Label className='text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded'>
              Impaksi
            </Label>
          )}
          {!conditions.has_karies &&
            !conditions.has_lesi_periapikal &&
            !conditions.has_resorpsi &&
            !conditions.has_impaksi && (
              <span className='text-xs text-muted-foreground'>Tidak ada</span>
            )}
        </div>
      )
    },
    filterFn: (row, id, value: string[]) => {
      const conditions = row.getValue(
        id
      ) as RadiographResponse['detected_conditions']
      return value.some((val) => conditions[val as keyof typeof conditions])
    },
  },
  {
    id: 'created_at',
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Tanggal Dibuat'
        className='max-w-[200px] truncate'
      />
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue('created_at') as string
      const formattedDate = formatDate(createdAt)
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className='block truncate line-clamp-1 max-w-[200px]'
              title={formattedDate}
            >
              {formattedDate}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{formattedDate}</p>
          </TooltipContent>
        </Tooltip>
      )
    },
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }) => <DataTableRowActions row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
]
