import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ChaletBooking } from './types';
import { BookingActions } from './booking-action';

export const columns: ColumnDef<ChaletBooking>[] = [
  {
    accessorKey: 'customer',
    header: 'Customer',
    cell: ({ row }) => {
      const customer = row.original.customer;
      return (
        <div>
          <div className="font-medium">{`${customer.firstName} ${customer.lastName}`}</div>
          <div className="text-sm text-gray-500">{customer.email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'chalet',
    header: 'Chalet',
    cell: ({ row }) => {
      const chalet = row.original.chalet;
      return (
        <div>
          <div className="font-medium">{chalet.name}</div>
          <div className="text-sm text-gray-500">{chalet.locationName}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'checkIn',
    header: 'Check In',
    cell: ({ row }) => format(new Date(row.original.checkIn), 'MMM dd, yyyy'),
  },
  {
    accessorKey: 'checkOut',
    header: 'Check Out',
    cell: ({ row }) => format(new Date(row.original.checkOut), 'MMM dd, yyyy'),
  },
  {
    accessorKey: 'totalGuests',
    header: 'Guests',
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.numberOfAdults + row.original.numberOfChildren}
        <div className="text-xs text-gray-500">
          {`(${row.original.numberOfAdults} adults, ${row.original.numberOfChildren} children)`}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'totalCost',
    header: 'Total Cost',
    cell: ({ row }) =>
      `KES ${parseInt(row.original.totalCost)
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
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
        <span className={`px-2 py-1 rounded-full text-sm ${getStatusStyle(status)}`}>
          {status.charAt(0) + status.slice(1).toLowerCase()}
        </span>
      );
    },
  },
  {
    accessorKey: 'payments',
    header: 'Payment Status',
    cell: ({ row }) => {
      const payment = row.original.payments[0];
      const getPaymentStatusStyle = (status: string) => {
        switch (status) {
          case 'FULLY_PAID':
            return 'bg-green-100 text-green-800';
          case 'PARTIALLY_PAID':
            return 'bg-yellow-100 text-yellow-800';
          case 'UNPAID':
            return 'bg-red-100 text-red-800';
          default:
            return 'bg-gray-100 text-gray-800';
        }
      };

      return payment ? (
        <span className={`px-2 py-1 rounded-full text-sm ${getPaymentStatusStyle(payment.status)}`}>
          {payment.status
            .split('_')
            .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
            .join(' ')}
        </span>
      ) : (
        'No payment'
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <BookingActions booking={row.original} />,
  },
];
