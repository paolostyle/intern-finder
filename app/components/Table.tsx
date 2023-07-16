'use client';

import { HospitalData } from '@/getCompleteData';
import {
  SortDirection,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { useState } from 'react';
import { ArrowSmallDownIcon, ArrowSmallUpIcon, ArrowsUpDownIcon } from '@heroicons/react/20/solid';

const columnHelper = createColumnHelper<HospitalData>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Nazwa',
  }),
  columnHelper.accessor('address', {
    header: 'Adres',
  }),
  columnHelper.accessor('driveData.distance.value', {
    id: 'drivingDistance',
    header: 'Odległość (samochodem)',
    cell: ({ row }) => row.original.driveData?.distance.text,
  }),
  columnHelper.accessor('driveData.duration.value', {
    id: 'drivingTime',
    header: 'Czas dojazdu (samochodem)',
    cell: ({ row }) => row.original.driveData?.duration.text,
  }),
  columnHelper.accessor('transitData.duration.value', {
    id: 'transitTime',
    header: 'Czas dojazdu (komunikacją)',
    cell: ({ row }) => row.original.transitData?.duration.text,
  }),
  columnHelper.accessor('gpa', {
    header: 'Próg',
  }),
  columnHelper.accessor('seats', {
    header: 'Miejsc',
  }),
];

const SortingIcons = ({ sortedState }: { sortedState: SortDirection | false }) => {
  const getClasses = (desiredState: SortDirection | false) =>
    clsx('h-4 w-4', sortedState === desiredState ? 'swap-on' : 'swap-off');

  return (
    <div className="swap swap-active">
      <ArrowSmallDownIcon className={getClasses('asc')} />
      <ArrowSmallUpIcon className={getClasses('desc')} />
      <ArrowsUpDownIcon className={getClasses(false)} />
    </div>
  );
};

interface Props {
  data: HospitalData[];
}

export const Table = ({ data }: Props) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  return (
    <table className="table table-zebra">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                <div
                  className={clsx(
                    header.column.getCanSort() && 'cursor-pointer select-none',
                    'flex gap-2',
                  )}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  <SortingIcons sortedState={header.column.getIsSorted()} />
                </div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
