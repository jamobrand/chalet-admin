import { Helmet } from 'react-helmet-async';
import { useTransactions } from './hooks/useTransactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';

const Transactions = () => {
  const { data, isLoading, error } = useTransactions();

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
        <title>Transactions - GRVL</title>
      </Helmet>

      <div className="max-w-screen-2xl w-full pb-10">
        <Card className="border-none drop-shadow-sm">
          <CardHeader className="gap-y-2">
            <div className="flex items-center justify-between w-full">
              <CardTitle className="text-xl text-[#1a3733] line-clamp-1">
                Transaction Management
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={data || []}
              filterKey="status"
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Transactions;
