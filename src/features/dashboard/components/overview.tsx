// import { useQuery } from '@tanstack/react-query';
// import { format } from 'date-fns';
// import { id } from 'date-fns/locale';
// import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
// import { getDataRadiograph } from '@/actions/radiograph/get-data-radiograph';
// import { toast } from '@/hooks/use-toast';

// export function Overview() {
//   const { data, isLoading, error } = useQuery({
//     queryKey: ['radiographs-overview'],
//     queryFn: () => getDataRadiograph(1, 12), // Fetch up to 12 months
//   });

//   if (error) {
//     toast({
//       variant: 'destructive',
//       title: 'Gagal memuat data',
//       description: error.message || 'Terjadi kesalahan saat memuat data pasien.',
//     });
//   }

//   // Group patients by month
//   const chartData = Array.from({ length: 12 }, (_, i) => {
//     const date = new Date(2025, i, 1);
//     const monthName = format(date, 'MMM', { locale: id });
//     const total = data?.data.filter((radiograph) => {
//       const createdAt = new Date(radiograph.created_at);
//       return createdAt.getFullYear() === 2025 && createdAt.getMonth() === i;
//     }).length || 0;
//     return { name: monthName, total };
//   });

//   if (isLoading) {
//     return <div className="text-sm text-muted-foreground">Memuat...</div>;
//   }

//   return (
//     <ResponsiveContainer width="100%" height={350}>
//       <BarChart data={chartData}>
//         <XAxis
//           dataKey="name"
//           stroke="#888888"
//           fontSize={12}
//           tickLine={false}
//           axisLine={false}
//         />
//         <YAxis
//           stroke="#888888"
//           fontSize={12}
//           tickLine={false}
//           axisLine={false}
//           tickFormatter={(value) => `${value}`}
//         />
//         <Bar
//           dataKey="total"
//           fill="currentColor"
//           radius={[4, 4, 0, 0]}
//           className="fill-primary"
//         />
//       </BarChart>
//     </ResponsiveContainer>
//   );
// }