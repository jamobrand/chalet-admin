import { ColumnDef } from "@tanstack/react-table";
import { AddOn } from "./types";
//import { AddonActions } from "./addon-action";

export const columns: ColumnDef<AddOn>[] = [
  {
    accessorKey: 'name',
    header: 'Addon Name',
    cell: ({ row }) => {
      return (
        <div>
          <div className="font-medium">{`${row.original.name}`}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'price',
    header: 'Addon Price',
    cell: ({ row }) => {
      return (
        <div>
          <div className="font-medium">{row.original.price}</div>
        </div>
      );
    },
  },
  // {
  //   id: 'actions',
  //   cell: ({ row }) => <AddonActions addon={row.original} />,
  // },
];