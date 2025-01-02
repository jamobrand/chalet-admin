import { ColumnDef } from '@tanstack/react-table';
import { Chalet } from './types/types';

export const columns: ColumnDef<Chalet>[] = [
  {
    accessorKey: 'images',
    header: 'Image',
    cell: ({ row }) => {
      const mainImage = row.original.images.find((img) => img.isMain);
      return mainImage ? (
        <img
          src={mainImage.url}
          alt={mainImage.label || row.original.name}
          className="h-16 w-16 object-cover rounded-md"
        />
      ) : null;
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'basePrice',
    header: 'Base Price',
    cell: ({ row }) => `KES ${parseInt(row.original.basePrice).toLocaleString()}`,
  },
  {
    accessorKey: 'locationName',
    header: 'Location',
  },
  {
    accessorKey: 'roomCount',
    header: 'Rooms',
  },
  {
    accessorKey: '_count.amenities',
    header: 'Amenities',
    cell: ({ row }) => {
      const amenityNames = row.original.amenities.map((a) => a.name).join(', ');
      return <div title={amenityNames}>{row.original._count.amenities}</div>;
    },
  },
  {
    accessorKey: 'isUnderMaintenance',
    header: 'Status',
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded-full text-sm ${
          row.original.isUnderMaintenance
            ? 'bg-red-100 text-red-800'
            : 'bg-green-100 text-green-800'
        }`}
      >
        {row.original.isUnderMaintenance ? 'Under Maintenance' : 'Available'}
      </span>
    ),
  },
];
