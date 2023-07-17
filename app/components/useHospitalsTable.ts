import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useOrderedData } from './useOrderedData';
import { HospitalData, HospitalsTableProps } from './types';

const columnHelper = createColumnHelper<HospitalData>();

const columns = [
  columnHelper.accessor((_, a) => a + 1, {
    id: 'position',
    header: '#',
  }),
  columnHelper.accessor('name', {
    header: 'Nazwa',
  }),
  columnHelper.accessor('address', {
    header: 'Adres',
  }),
  columnHelper.accessor('driveData.distance.value', {
    id: 'drivingDistance',
    header: 'Odległość',
    cell: ({ row }) => row.original.driveData?.distance.text,
    sortDescFirst: false,
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor('driveData.duration.value', {
    id: 'drivingTime',
    header: 'Czas dojazdu (samochodem)',
    cell: ({ row }) => row.original.driveData?.duration.text,
    sortDescFirst: false,
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor('transitData.duration.value', {
    id: 'transitTime',
    header: 'Czas dojazdu (komunikacją)',
    cell: ({ row }) => row.original.transitData?.duration.text,
    sortDescFirst: false,
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor('gpa', {
    header: 'Próg',
    sortDescFirst: false,
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor('seats', {
    header: 'Miejsc',
    meta: {
      isNumeric: true,
    },
  }),
];

export const useHospitalsTable = (props: HospitalsTableProps) => {
  const { orderedData, reorderRow, setOrderedData } = useOrderedData(props);

  const table = useReactTable({
    data: orderedData,
    columns,
    getRowId: (row) => String(row.id),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const applySorting = () => {
    setOrderedData(table.getRowModel().rows.map((row) => row.original));
    table.resetSorting();
  };

  return { table, reorderRow, applySorting };
};
