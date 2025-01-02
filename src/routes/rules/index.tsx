import { Helmet } from 'react-helmet-async';
import { useRules } from './hooks/useRule';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';

const Rules = () => {
  const navigate = useNavigate();

  const { data, isLoading, error } = useRules();

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-500">Error loading rules. Please try again later.</div>
      </div>
    );
  }
  return (
    <div>
      {' '}
      <Helmet>
        <title>Rules - GRVL</title>
      </Helmet>
      <div className="max-w-screen-2xl w-full pb-10">
        <Card className="border-none drop-shadow-sm">
          <CardHeader className="gap-y-2">
            <div className="flex items-center justify-between w-full">
              <CardTitle className="text-xl text-[#1a3733] line-clamp-1">
                Rules Management
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={() => navigate('/admin/rules/add-rule')}
                  className="bg-[#27534c] text-primary-foreground shadow hover:bg-[#1a3733]"
                >
                  <Plus className="size-4 mr-2" />
                  Add New Rule
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={data || []} filterKey="title" isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Rules;
