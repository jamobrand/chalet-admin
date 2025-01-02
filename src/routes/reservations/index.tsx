import { Helmet } from 'react-helmet-async';
import { useReservations } from './hooks/useReservations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';

const Reservations = () => {
  const { data, isLoading, error } = useReservations();

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-500">Error loading reservations. Please try again later.</div>
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>Reservations - GRVL</title>
      </Helmet>

      <div className="max-w-screen-2xl w-full pb-10">
        <Card className="border-none drop-shadow-sm">
          <CardHeader className="gap-y-2">
            <div className="flex items-center justify-between w-full">
              <CardTitle className="text-xl text-[#1a3733] line-clamp-1">
                Reservations Management
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-sm">
                  Total Reservations: {data?.length || 0}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={data || []}
              filterKey="customer.fullName"
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reservations;
