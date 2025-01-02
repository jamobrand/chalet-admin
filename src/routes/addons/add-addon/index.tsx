import { useForm } from 'react-hook-form';
import { AddonFormData, AddonSchema } from '../schema';
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
const AddAddon = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<AddonFormData>({
    resolver: zodResolver(AddonSchema),
    defaultValues: {
      description: '',
      name: '',
      price: '',
    },
  });

  const onSubmit = async (data: AddonFormData) => {
    try {
      setLoading(true);
      // Submit data to the API
      const response = await axios.post(`${API_URL}/v1/addons/create-addon`, data);

      // Show success toast
      toast({
        variant: 'success',
        title: 'Addon created successfully',
        description: `${response.data.message}`,
      });
      navigate('/admin/addons');
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Addon Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter addon name" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-full gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Addon Price</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Rate per night"
                      {...field}
                      disabled={loading}
                      onChange={(e) => {
                        // const value = parseFloat(e.target.value);
                        field.onChange(e.target.value);
                      }}
                    />
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
                  <FormLabel>Addon Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your chalet"
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
              Add Addon
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddAddon;
