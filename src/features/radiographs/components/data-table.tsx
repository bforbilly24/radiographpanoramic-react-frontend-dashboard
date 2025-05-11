import * as React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { deleteBulkRadiograph } from '@/actions/radiograph/delete-bulk-radiograph'
import { getDataRadiograph } from '@/actions/radiograph/get-data-radiograph'
import {
  PaginatedRadiographResponse,
  RadiographResponse,
} from '@/types/radiograph'
import { useAuthStore } from '@/stores/authStore'
import { toast } from '@/hooks/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from './data-table-pagination'
import { DataTableToolbar } from './data-table-toolbar'

interface DataTableProps {
  columns: ColumnDef<RadiographResponse>[]
}

const STORAGE_KEY = 'radiograph-table-column-visibility'

export function DataTable({ columns }: DataTableProps) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(() => {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : {}
    })
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const { auth } = useAuthStore()
  const queryClient = useQueryClient()

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(columnVisibility))
  }, [columnVisibility])

  const { data, isLoading, error } = useQuery<PaginatedRadiographResponse>({
    queryKey: ['radiographs', page, limit],
    queryFn: () => getDataRadiograph(page, limit),
    enabled: !!auth.accessToken,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  })

  React.useEffect(() => {
    if (error) {
      const message =
        error instanceof Error ? error.message : 'Gagal memuat radiograf'
      toast({
        variant: 'destructive',
        title: 'Kesalahan',
        description: message,
      })
      if (message.includes('Could not validate credentials')) {
        useAuthStore.getState().auth.reset()
        toast({
          variant: 'destructive',
          title: 'Sesi Berakhir',
          description: 'Silakan masuk kembali.',
        })
      }
    }
  }, [error])

  const handleBulkDelete = async () => {
    const selectedIds = Object.keys(rowSelection)
      .map((index) => data?.data[Number(index)]?.id)
      .filter((id): id is number => id !== undefined)

    if (!selectedIds.length) {
      toast({ variant: 'destructive', title: 'Tidak ada baris yang dipilih' })
      return
    }

    setIsDeleting(true)
    try {
      const response = await deleteBulkRadiograph({ ids: selectedIds })
      toast({
        title: `Berhasil menghapus ${response.deleted_count} radiograf`,
      })
      if (response.non_existent_ids) {
        toast({
          variant: 'destructive',
          title: `Beberapa ID tidak ditemukan: ${response.non_existent_ids.join(', ')}`,
        })
      }
      queryClient.invalidateQueries({ queryKey: ['radiographs'] })
      setRowSelection({})
    } catch (error) {
      toast({
        variant: 'destructive',
        title:
          error instanceof Error ? error.message : 'Gagal menghapus radiograf',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const resetColumnVisibility = () => {
    setColumnVisibility({})
    localStorage.removeItem(STORAGE_KEY)
  }

  const table = useReactTable({
    data: data?.data || [],
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    pageCount: data?.pagination.total_pages || -1,
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === 'function'
          ? updater({ pageIndex: page - 1, pageSize: limit })
          : updater
      setPage(newState.pageIndex + 1)
      setLimit(newState.pageSize)
    },
  })

  return (
    <div className='space-y-4'>
      <DataTableToolbar
        table={table}
        onBulkDelete={handleBulkDelete}
        isDeleting={isDeleting}
        resetColumnVisibility={resetColumnVisibility}
      />
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  Memuat...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  Tidak ada hasil.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} pagination={data?.pagination} />
    </div>
  )
}
