import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ChevronRight } from 'lucide-react';
import { useChaletContext } from '@/context/use-chalet';
import { ChaletDetailsData } from '@/context/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChaletDetailsSchema } from '../../types/chalet-schema';

interface ChaletDetailsStepProps {
  setCurrentStep: (step: number) => void;
  setTotalRooms: (rooms: number) => void;
}

export const ChaletDetailsStep: React.FC<ChaletDetailsStepProps> = ({
  setCurrentStep,
  setTotalRooms,
}) => {
  const { updateChaletData, chaletData } = useChaletContext();

  const form = useForm<ChaletDetailsData>({
    resolver: zodResolver(ChaletDetailsSchema),
    defaultValues: {
      name: chaletData.chaletDetails?.name || '',
      type: chaletData.chaletDetails?.type || '',
      description: chaletData.chaletDetails?.description || '',
      basePrice: chaletData.chaletDetails?.basePrice || 0,
      roomCount: chaletData.chaletDetails?.roomCount || 1,
      isEnsuite: chaletData.chaletDetails?.isEnsuite || false,
    },
  });

  const onSubmit = (data: ChaletDetailsData) => {
    // Update context with form data
    updateChaletData('chaletDetails', data);

    // Set total rooms for subsequent steps
    setTotalRooms(data.roomCount);

    // Move to next step
    setCurrentStep(2);
  };

  const chaletTypes = ['Duplex Lower', 'Stand Alone Unit', 'Duplex Upper'];

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <CardTitle>Chalet Details</CardTitle>
        <CardDescription>Provide basic information about your chalet</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chalet Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter chalet name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chalet Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select chalet type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {chaletTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="roomCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Rooms</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Total Rooms"
                        {...field}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="basePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Rate per night"
                        {...field}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

<FormField
              control={form.control}
              name="isEnsuite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chalet En-Suite</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === 'true')}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="En-Suite" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">True</SelectItem>
                      <SelectItem value="false">False</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your chalet" {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end mt-4">
              <Button type="submit" className="h-10 bg-[#27534c] hover:bg-[#1a3733]">
                Next <ChevronRight className="ml-2" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
