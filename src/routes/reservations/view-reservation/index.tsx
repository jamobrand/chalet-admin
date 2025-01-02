import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet-async';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, Calendar, Users, Home, CreditCard, Clock, Coffee } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';
import { useReservationDetails } from './hooks/useReservationDetails';
import { Booking } from './types';

// Define the allowed status transitions
const allowedStatusTransitions: Record<Booking['status'], Booking['status'][]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['CHECKED_IN', 'CANCELLED'],
  CHECKED_IN: ['CHECKED_OUT'],
  CHECKED_OUT: ['COMPLETED'],
  CANCELLED: [],
  COMPLETED: []
};

const getStatusBadgeColor = (status: Booking['status']): string => {
  const colors: Record<Booking['status'], string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-green-100 text-green-800",
    CHECKED_IN: "bg-blue-100 text-blue-800",
    CHECKED_OUT: "bg-purple-100 text-purple-800",
    CANCELLED: "bg-red-100 text-red-800",
    COMPLETED: "bg-gray-100 text-gray-800"
  };
  return colors[status];
};

const ReservationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
//   const { toast } = useToast();
  const { data: booking, isLoading, error } = useReservationDetails(id);
//   const updateStatusMutation = useUpdateBookingStatus();



if (isLoading) {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="animate-pulse text-gray-500">Loading reservation details...</div>
    </div>
  );
}

  if (error || !booking) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-500">Error loading reservation details.</div>
      </div>
    );
  }

  const getTotalAddOnsCost = (): number => {
    return booking.bookingAddOn.reduce((total, addon) => {
      return total + parseInt(addon.addOn.price);
    }, 0);
  };

//   const handleStatusChange = async (newStatus: string) => {
//     try {
//       await updateStatusMutation.mutateAsync({
//         bookingId: booking.id,
//         status: newStatus
//       });
//       toast({
//         title: "Status Updated",
//         description: `Booking status has been updated to ${newStatus.replace('_', ' ').toLowerCase()}`,
//       });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to update booking status",
//         variant: "destructive",
//       });
//     }
//   };



  return (
    <div className="max-w-7xl mx-auto p-6">
      <Helmet>
        <title>Reservation Details - GRVL</title>
      </Helmet>

      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/reservations')}
          className="mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Reservations
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Booking Information */}
        <Card className="md:col-span-2 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-2xl font-medium">
                  Booking #{booking.id.slice(0, 8)}
                </CardTitle>
                <CardDescription className="mt-1">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Created on {format(new Date(booking.createdAt), 'PPP')}
                </CardDescription>
              </div>
              <div className="flex flex-col items-end gap-2">
              <Badge className={`${getStatusBadgeColor(booking.status)} px-3 py-1`}>
                  {booking.status}
                </Badge>
                <Select
                  defaultValue={booking.status}
                //   onValueChange={handleStatusChange}
                disabled={!allowedStatusTransitions[booking.status]?.length}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Change status" />
                  </SelectTrigger>
                  <SelectContent>
                    {allowedStatusTransitions[booking.status as keyof typeof allowedStatusTransitions]?.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-4">
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium">Stay Duration</div>
                  <div className="text-gray-600">
                    {format(new Date(booking.checkIn), 'PPP')} - {format(new Date(booking.checkOut), 'PPP')}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Users className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium">Guests</div>
                  <div className="text-gray-600">
                    {booking.numberOfAdults} Adults, {booking.numberOfChildren} Children
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Home className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium">Chalet</div>
                  <div className="text-gray-600">
                    {booking.chalet.name} - {booking.chalet.locationName}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

         {/* Customer Information */}
         <Card className="shadow-sm hover:shadow-md transition-shadow">
         <CardHeader>
            <CardTitle className="text-xl">Customer Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-700">Name</div>
              <div className="mt-1">{booking.customer.firstName} {booking.customer.lastName}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-700">Contact</div>
              <div className="mt-1">{booking.customer.email}</div>
              <div>{booking.customer.phone}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-700">Address</div>
              <div className="mt-1">{booking.customer.addresss}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-700">Nationality</div>
              <div className="mt-1">{booking.customer.nationality}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-700">Passport Number</div>
              <div className="mt-1">{booking.customer.passportNumber}</div>
            </div>
          </CardContent>
        </Card>

         {/* Add-ons */}
         <Card className="md:col-span-2 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl">
              <Coffee className="h-5 w-5 inline mr-2" />
              Add-ons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 text-gray-600">Name</th>
                    <th className="text-left p-2 text-gray-600">Description</th>
                    <th className="text-right p-2 text-gray-600">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {booking.bookingAddOn.map((addon) => (
                    <tr key={addon.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{addon.addOn.name}</td>
                      <td className="p-2 text-gray-600">{addon.addOn.description}</td>
                      <td className="p-2 text-right">
                        KES {parseInt(addon.addOn.price).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-medium">
                    <td colSpan={2} className="p-2 text-right">Total Add-ons:</td>
                    <td className="p-2 text-right">
                      KES {getTotalAddOnsCost().toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

         {/* Payment Information */}
         <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl">
              <CreditCard className="h-5 w-5 inline mr-2" />
              Payment Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between p-2">
                <span className="text-gray-600">Base Cost:</span>
                <span>KES {parseInt(booking.totalCost).toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-2">
                <span className="text-gray-600">Add-ons:</span>
                <span>KES {getTotalAddOnsCost().toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-2 font-medium border-t">
                <span>Total Cost:</span>
                <span>KES {(parseInt(booking.totalCost) + getTotalAddOnsCost()).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card className="md:col-span-3 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl">Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Transaction ID</th>
                    <th className="text-left p-2">Method</th>
                    <th className="text-left p-2">Amount</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {booking.payments.map((payment) => (
                    <tr key={payment.id} className="border-b">
                      <td className="p-2">{payment.transactionId}</td>
                      <td className="p-2">{payment.method.replace('_', ' ')}</td>
                      <td className="p-2">KES {parseInt(payment.amount).toLocaleString()}</td>
                      <td className="p-2">
                        <Badge variant="outline">
                          {payment.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="p-2">{format(new Date(payment.createdAt), 'PP')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReservationDetails;