// src/features/radiographs/index.tsx
import { Header } from '@/components/layouts/dashboard/header'
import { Main } from '@/components/layouts/dashboard/main'
import { TopBreadcrumb } from '@/components/layouts/dashboard/top-breadcrumb'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import RadiographsProvider, {
} from './context/radiographs-context'

function RadiographsContent() {

  return (
    <>
      <Header fixed>
        <TopBreadcrumb />
      </Header>

      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Radiograf</h2>
            <p className='text-muted-foreground'>
              Berikut daftar radiograf Anda untuk bulan ini!
            </p>
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
