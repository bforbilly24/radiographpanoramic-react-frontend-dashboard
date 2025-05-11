import { ColumnDef } from '@tanstack/react-table'
import { RadiographResponse } from '@/types/radiograph'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { statuses } from '../data/filter'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
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
    filterFn: (row, id, value: string) => {
      return (row.getValue(id) as string)
        .toLowerCase()
        .includes(value.toLowerCase())
    },
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
    filterFn: (row, id, value: string) => {
      return (row.getValue(id) as string)
        .toLowerCase()
        .includes(value.toLowerCase())
    },
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
        <div className='flex w-[100px] items-center'>
          {status.icon && (
            <status.icon className='mr-2 h-4 w-4 text-muted-foreground' />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id) as string)
    },
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
      />
    ),
  },
  {
    id: 'predicted_file',
    accessorKey: 'predicted_file',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Gambar Prediksi' />
    ),
    cell: ({ row }) => (
      <ImageCell
        path={row.getValue('predicted_file') as string}
        alt='Gambar Prediksi'
      />
    ),
  },
  {
    id: 'image',
    accessorKey: 'image',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Gambar Overlay' />
    ),
    cell: ({ row }) => {
      const imageBase64 = row.getValue('image') as string | null
      return imageBase64 ? (
        <img
          src={`data:image/jpeg;base64,${imageBase64}`}
          alt='Gambar Overlay'
          className='w-20 h-20 object-cover rounded'
          loading='lazy'
        />
      ) : (
        'Tidak Ada Gambar'
      )
    },
  },
  {
    id: 'detected_conditions',
    accessorKey: 'detected_conditions',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Kondisi Terdeteksi'
      />
    ),
    cell: ({ row }) => {
      const conditions = row.getValue(
        'detected_conditions'
      ) as RadiographResponse['detected_conditions']
      return (
        <div className='flex flex-wrap gap-1 max-w-[200px]'>
          {conditions.has_karies && (
            <Label className='text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded'>
              Karies
            </Label>
          )}
          {conditions.has_lesi_periapikal && (
            <Label className='text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded'>
              Lesi Periapikal
            </Label>
          )}
          {conditions.has_resorpsi && (
            <Label className='text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded'>
              Resorpsi
            </Label>
          )}
          {conditions.has_impaksi && (
            <Label className='text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded'>
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
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }) => <DataTableRowActions row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
]
