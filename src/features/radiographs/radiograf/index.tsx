// src/features/radiographs/index.tsx
import { IconUpload } from '@tabler/icons-react'
import { Header } from '@/components/layouts/dashboard/header'
import { Main } from '@/components/layouts/dashboard/main'
import { Button } from '@/components/ui/shadcn/button'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import RadiographsProvider, { useRadiographs } from '../context/radiographs-context'
import { UploadButton } from '../components/upload-button'
import { DataTable } from '../components/data-table'
import { columns } from '../components/columns'

function RadiographsContent() {
  const { setOpen } = useRadiographs()

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Radiograf</h2>
            <p className='text-muted-foreground'>
              Berikut daftar radiograf Anda untuk bulan ini!
            </p>
          </div>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              className='space-x-1'
              onClick={() => setOpen('import')}
            >
              <span>Unggah Radiograf</span> <IconUpload size={18} />
            </Button>
            <UploadButton />

            {/* <Button className='space-x-1' onClick={() => setOpen('create')}>
              <span>Create</span> <IconPlus size={18} />
            </Button> */}
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable columns={columns} />
        </div>
      </Main>
    </>
  )
}

export default function Radiographs() {
  return (
    <RadiographsProvider>
      <RadiographsContent />
    </RadiographsProvider>
  )
}
