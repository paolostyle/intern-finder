import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useOrderedData } from './useOrderedData';
import { HospitalData, HospitalsTableProps } from './types';
import { storeOrder } from '@/actions/storeOrder';

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
  columnHelper.accessor('drivingDistance.value', {
    id: 'drivingDistance',
    header: 'Odległość',
    cell: ({ row }) => row.original.drivingDistance?.text,
    sortDescFirst: false,
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor('drivingDuration.value', {
    id: 'drivingTime',
    header: 'Czas dojazdu (samochodem)',
    cell: ({ row }) => row.original.drivingDuration?.text,
    sortDescFirst: false,
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor('transitDuration.value', {
    id: 'transitTime',
    header: 'Czas dojazdu (komunikacją)',
    cell: ({ row }) => row.original.transitDuration?.text,
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
    const newOrderedData = table.getRowModel().rows.map((row) => row.original);

    setOrderedData(newOrderedData);
    storeOrder(newOrderedData);

    table.resetSorting();
  };

  return { table, reorderRow, applySorting };
};
