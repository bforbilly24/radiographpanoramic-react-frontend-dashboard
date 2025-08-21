import { useQuery } from '@tanstack/react-query'
import { getDataRadiograph } from '@/actions/radiograph/get-data-radiograph'
import { PaginatedRadiographResponse } from '@/types/radiograph'
import { toast } from '@/hooks/use-toast'
import { Header } from '@/components/layouts/dashboard/header'
import { Main } from '@/components/layouts/dashboard/main'
import { TopBreadcrumb } from '@/components/layouts/dashboard/top-breadcrumb'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/shadcn/tabs'
import { AnalyticsTab } from './components/analytics-tab'
import { OverviewTab } from './components/overview-tab'

export default function Dashboard() {
  const { data, isLoading, error } = useQuery<PaginatedRadiographResponse>({
    queryKey: ['radiographs'],
    queryFn: () => getDataRadiograph(1, 7),
  })

  if (error) {
    toast({
      variant: 'destructive',
      title: 'Gagal memuat data',
      description:
        error.message || 'Terjadi kesalahan saat memuat data dashboard.',
    })
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header fixed>
        <TopBreadcrumb />
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Ringkasan</TabsTrigger>
              <TabsTrigger value='analytics'>Analitik</TabsTrigger>
              {/* <TabsTrigger value='reports' disabled>
                Laporan
              </TabsTrigger>
              <TabsTrigger value='notifications' disabled>
                Notifikasi
              </TabsTrigger> */}
            </TabsList>
          </div>
          <TabsContent value='overview'>
            <OverviewTab data={data} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value='analytics'>
            <AnalyticsTab data={data} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
