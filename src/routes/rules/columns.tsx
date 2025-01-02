import { ColumnDef } from "@tanstack/react-table";
import { Rule } from "./types";

export const columns: ColumnDef<Rule>[] = [
  {
    accessorKey: 'title',
    header: 'Rule Title',
    cell: ({ row }) => {
      return (
        <div>
          <div className="font-medium">{`${row.original.title}`}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Rule Description',
    cell: ({ row }) => {
      return (
        <div>
          <div className="font-medium">{row.original.description}</div>
        </div>
      );
    },
  },
  // {
  //   id: 'actions',
  //   cell: ({ row }) => <AddonActions addon={row.original} />,
  // },
];