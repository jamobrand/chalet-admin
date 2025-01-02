import { Helmet } from 'react-helmet-async';
import { useAddons } from './hooks/useAddons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';

const Addons = () => {
  const navigate = useNavigate();

  const { data, isLoading, error } = useAddons();

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-500">Error loading addons. Please try again later.</div>
      </div>
    );
  }
  return (
    <div>
      {' '}
      <Helmet>
        <title>Addons - GRVL</title>
      </Helmet>
      <div className="max-w-screen-2xl w-full pb-10">
        <Card className="border-none drop-shadow-sm">
          <CardHeader className="gap-y-2">
            <div className="flex items-center justify-between w-full">
              <CardTitle className="text-xl text-[#1a3733] line-clamp-1">
                Addon Management
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={() => navigate('/admin/addons/add-addon')}
                  className="bg-[#27534c] text-primary-foreground shadow hover:bg-[#1a3733]"
                >
                  <Plus className="size-4 mr-2" />
                  Add New Addon
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={data || []} filterKey="name" isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Addons;
