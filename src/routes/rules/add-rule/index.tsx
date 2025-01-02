import { useForm } from 'react-hook-form';
import { RuleFormData, RuleSchema } from '../schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { API_URL } from '@/config';

interface ErrorResponse {
  message?: string; // Define the structure of the error response
}
const AddRule = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<RuleFormData>({
    resolver: zodResolver(RuleSchema),
    defaultValues: {
      description: '',
      title: '',
    },
  });

  const onSubmit = async (data: RuleFormData) => {
    try {
      setLoading(true);
      // Submit data to the API
      const response = await axios.post(`${API_URL}/v1/rules/create-rule`, data);

      // Show success toast
      toast({
        variant: 'success',
        title: 'Rule created successfully',
        description: `${response.data.message}`,
      });
      navigate('/admin/rules');
    } catch (error) {
      const errorResponse = error as AxiosError<ErrorResponse>;
      toast({
        title: 'Error',
        description: errorResponse.response?.data?.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-full gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rule Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter rule title" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-full gap-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rule Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your rule"
                      disabled={loading}
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end mt-4">
            <Button
              type="submit"
              disabled={loading}
              className="h-10 w-28 bg-[#27534c] hover:bg-[#1a3733]"
            >
              Add Rule
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddRule;
