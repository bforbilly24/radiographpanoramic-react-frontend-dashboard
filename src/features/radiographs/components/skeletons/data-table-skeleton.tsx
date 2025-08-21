// src/features/radiographs/components/data-table-skeleton.tsx
import { Skeleton } from '@/components/ui/shadcn/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/shadcn/table'

function DataTableSkeleton({ columnsLength }: { columnsLength: number }) {
  return (
    <div className='space-y-4'>
      {/* Skeleton for DataTableToolbar */}
      <div className='flex items-center justify-between space-x-2'>
        <Skeleton className='h-10 w-[250px]' />
        <div className='flex space-x-2'>
          <Skeleton className='h-10 w-[150px]' />
          <Skeleton className='h-10 w-[100px]' />
        </div>
      </div>

      {/* Skeleton for Table */}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columnsLength }).map((_, index) => (
                <TableHead key={index}>
                  <Skeleton className='h-6 w-full' />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: columnsLength }).map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton className='h-6 w-full' />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Skeleton for DataTablePagination */}
      <div className='flex items-center justify-between space-x-2'>
        <Skeleton className='h-8 w-[100px]' />
        <Skeleton className='h-8 w-[150px]' />
        <Skeleton className='h-8 w-[100px]' />
      </div>
    </div>
  )
}

export { DataTableSkeleton }
