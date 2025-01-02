import { useNavigate, useParams } from 'react-router-dom';
import { useCustomerDetails } from './hooks/useCustomerDetails';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CustomerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: customer, isLoading, error } = useCustomerDetails(id);

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  if (error || !customer) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-500">Error loading customer details.</div>
      </div>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Helmet>
        <title>Customer Details - GRVL</title>
      </Helmet>

      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/admin/customers')} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Customers
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Customer Information */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <div className="font-medium">Name</div>
              <div>
                {customer.firstName} {customer.lastName}
              </div>
            </div>
            <div>
              <div className="font-medium">Contact</div>
              <div>{customer.email}</div>
              <div>{customer.phone}</div>
            </div>
            <div>
              <div className="font-medium">Address</div>
              <div>{customer.addresss}</div>
            </div>
            <div>
              <div className="font-medium">Nationality</div>
              <div>{customer.nationality}</div>
            </div>
            <div>
              <div className="font-medium">Passport Number</div>
              <div>{customer.passportNumber}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Customer Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Chalet</th>
                    <th className="text-left p-2">Check In</th>
                    <th className="text-left p-2">Check Out</th>
                    <th className="text-left p-2">Guests</th>
                    <th className="text-left p-2">Total Cost</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.bookings.map((booking) => (
                    <tr key={booking.id} className="border-b">
                      <td className="p-2">{booking.chalet.name}</td>
                      <td className="p-2">{booking.checkIn}</td>
                      <td className="p-2">{booking.checkOut}</td>
                      <td className="p-2">
                        <div className="text-center">
                          {booking.numberOfAdults + booking.numberOfChildren}
                          <div className="text-xs text-gray-500">
                            {`(${booking.numberOfAdults} adults, ${booking.numberOfChildren} children)`}
                          </div>
                        </div>
                      </td>
                      <td className="p-2">KES {parseInt(booking.totalCost).toLocaleString()}</td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${getStatusStyle(booking.status)}`}
                        >
                          {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
                        </span>
                      </td>
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

export default CustomerDetails;
