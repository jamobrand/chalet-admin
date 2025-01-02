import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "./types";
import { CustomerActions } from "./customer-action";

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: 'customer',
    header: 'Customer',
    cell: ({ row }) => {
      return (
        <div>
          <div className="font-medium">{`${row.original.firstName} ${row.original.lastName}`}</div>
          <div className="text-sm text-gray-500">{row.original.email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'nationality',
    header: 'Nationality',
    cell: ({ row }) => {
      return (
        <div>
          <div className="font-medium">{row.original.nationality}</div>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <CustomerActions customer={row.original} />,
  },
];