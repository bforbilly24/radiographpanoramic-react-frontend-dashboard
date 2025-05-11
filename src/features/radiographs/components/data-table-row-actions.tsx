import * as React from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useQueryClient } from '@tanstack/react-query'
import { Row } from '@tanstack/react-table'
import { IconTrash } from '@tabler/icons-react'
import { deleteIdRadiograph } from '@/actions/radiograph/delete-id-radiograph'
import { RadiographResponse } from '@/types/radiograph'
import { toast } from '@/hooks/use-toast'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DataTableRowActionsProps {
  row: Row<RadiographResponse>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const queryClient = useQueryClient()
  const radiograph = row.original
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await deleteIdRadiograph(radiograph.id)
      toast({
        title: response.message,
      })
      queryClient.invalidateQueries({ queryKey: ['radiographs'] })
      setOpen(false)
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
            disabled={isDeleting}
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Buka menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
          <DialogTrigger asChild>
            <DropdownMenuItem className='!text-red-500'>
              Hapus
              <DropdownMenuShortcut>
                <IconTrash size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Konfirmasi Hapus</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus radiograf untuk pasien{' '}
            {radiograph.patient_name}? Tindakan ini tidak dapat dibatalkan.
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
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Menghapus...' : 'Hapus'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
