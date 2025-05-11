import * as React from 'react'
import { Table } from '@tanstack/react-table'
import { IconRotateClockwise, IconTrash } from '@tabler/icons-react'
import { RadiographResponse } from '@/types/radiograph'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { conditionOptions, statuses } from '../data/filter'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableViewOptions } from './data-table-view-options'

interface DataTableToolbarProps {
  table: Table<RadiographResponse>
  onBulkDelete: () => Promise<void>
  isDeleting: boolean
  resetColumnVisibility: () => void
}

export function DataTableToolbar({
  table,
  onBulkDelete,
  isDeleting,
  resetColumnVisibility,
}: DataTableToolbarProps) {
  const [open, setOpen] = React.useState(false)

  const statusOptions = statuses.map((status) => ({
    value: status.value,
    label: status.label,
    icon: status.icon,
  }))

  const resetFiltersAndSorting = () => {
    table.resetColumnFilters()
    table.resetSorting()
    resetColumnVisibility()
  }

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2'>
        <Input
          placeholder='Cari Nama Pasien...'
          value={
            (table.getColumn('patient_name')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('patient_name')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <DataTableFacetedFilter
          column={table.getColumn('status_detection')}
          title='Status'
          options={statusOptions}
          multiple={true}
        />
        <DataTableFacetedFilter
          column={table.getColumn('detected_conditions')}
          title='Kondisi'
          options={conditionOptions}
          multiple={true}
        />
        {(table.getState().columnFilters.length > 0 ||
          table.getState().sorting.length > 0 ||
          Object.keys(table.getState().columnVisibility).length > 0) && (
          <Button
            variant='ghost'
            size='sm'
            onClick={resetFiltersAndSorting}
            className='h-8 px-2'
          >
            <IconRotateClockwise className='mr-2 h-4 w-4' />
            Reset
          </Button>
        )}
      </div>
      <div className='flex items-center space-x-2'>
        {table.getSelectedRowModel().rows.length > 0 && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant='destructive' size='sm' disabled={isDeleting}>
                <IconTrash className='mr-2 h-4 w-4' />
                {isDeleting ? 'Menghapus...' : 'Hapus Terpilih'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Konfirmasi Hapus</DialogTitle>
                <DialogDescription>
                  Apakah Anda yakin ingin menghapus{' '}
                  {table.getSelectedRowModel().rows.length} radiograf? Tindakan
                  ini tidak dapat dibatalkan.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant='outline'
                  onClick={() => setOpen(false)}
                  disabled={isDeleting}
                >
                  Batal
                </Button>
                <Button
                  variant='destructive'
                  onClick={async () => {
                    await onBulkDelete()
                    setOpen(false)
                  }}
                  disabled={isDeleting}
                >
                  Hapus
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
