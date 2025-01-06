import { ColumnDef } from "@tanstack/react-table";
import { Transaction } from "./types";
import { TransactionActions } from "./transaction-action";

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'status',
    header: 'Payment Status',
    cell: ({ row }) => {
      return (
        <div>
          <div className="font-medium">{`${row.original.status}`}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'method',
    header: 'Payment Method',
    cell: ({ row }) => {
      return (
        <div>
          <div className="font-medium">{row.original.method}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'transactionId',
    header: 'Transaction Reference/ID',
    cell: ({ row }) => {
      return (
        <div>
          <div className="font-medium">{row.original.transactionId}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: 'Total Amount',
    cell: ({ row }) => {
      return (
        <div>
          <div className="font-medium"> {Number(row.original.amount)
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </div>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <TransactionActions transaction={row.original} />,
  },
];