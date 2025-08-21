import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { RadiographResponse } from '@/types/radiograph'
import { Button } from '@/components/ui/shadcn/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/shadcn/select'

interface DataTablePaginationProps {
  table: Table<RadiographResponse>
  pagination?: {
    total: number
    page: number
    limit: number
    total_pages: number
  }
}

export function DataTablePagination({
  table,
  pagination,
}: DataTablePaginationProps) {
  return (
    <div className='flex flex-col items-center justify-between gap-y-4 px-4 py-2 sm:flex-row sm:gap-y-0 sm:px-6 md:px-8'>
      <div className='text-sm text-muted-foreground sm:flex-1'>
        {table.getFilteredSelectedRowModel().rows.length} dari{' '}
        {pagination?.total ?? table.getFilteredRowModel().rows.length} baris
        dipilih.
      </div>
      <div className='flex w-full flex-col items-center gap-y-4 sm:w-auto sm:flex-row sm:gap-x-6 sm:gap-y-0 md:gap-x-8'>
        <div className='flex items-center space-x-2'>
          <p className='text-xs font-medium sm:text-sm'>Baris per halaman</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger
              className='h-9 w-[60px] sm:h-10 sm:w-[70px]'
              aria-label='Pilih jumlah baris per halaman'
            >
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex items-center space-x-2'>
          <p className='text-xs font-medium sm:text-sm'>
            Halaman{' '}
            {pagination?.page ?? table.getState().pagination.pageIndex + 1} dari{' '}
            {pagination?.total_pages ?? table.getPageCount()}
          </p>
          <Button
            variant='outline'
            className='h-9 w-9 p-0 sm:h-10 sm:w-10 md:flex'
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className='sr-only'>Ke halaman pertama</span>
            <DoubleArrowLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-9 w-9 p-0 sm:h-10 sm:w-10'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className='sr-only'>Ke halaman sebelumnya</span>
            <ChevronLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-9 w-9 p-0 sm:h-10 sm:w-10'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className='sr-only'>Ke halaman berikutnya</span>
            <ChevronRightIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-9 w-9 p-0 sm:h-10 sm:w-10 md:flex'
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className='sr-only'>Ke halaman terakhir</span>
            <DoubleArrowRightIcon className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
