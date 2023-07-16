'use client';

import { HospitalData } from '@/getCompleteData';
import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { SortingIcons } from './SortingIcon';
import { DraggableRow } from './DraggableRow';

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
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor('driveData.duration.value', {
    id: 'drivingTime',
    header: 'Czas dojazdu (samochodem)',
    cell: ({ row }) => row.original.driveData?.duration.text,
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor('transitData.duration.value', {
    id: 'transitTime',
    header: 'Czas dojazdu (komunikacją)',
    cell: ({ row }) => row.original.transitData?.duration.text,
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor('gpa', {
    header: 'Próg',
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

interface Props {
  data: HospitalData[];
}

export const Table = ({ data }: Props) => {
  const [orderedData, setOrderedData] = useState(data);
  const [sorting, setSorting] = useState<SortingState>([]);

  const reorderRow = (draggedRowIndex: number, targetRowIndex: number) => {
    orderedData.splice(targetRowIndex, 0, orderedData.splice(draggedRowIndex, 1)[0]);
    setOrderedData([...orderedData]);
  };

  const table = useReactTable({
    data: orderedData,
    columns,
    state: {
      sorting,
    },
    getRowId: (row) => String(row.id),
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <table className="table table-zebra">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              <th />
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
                    <SortingIcons
                      sortedState={header.column.getIsSorted()}
                      sortType={header.column.columnDef.meta?.isNumeric ? 'numeric' : 'text'}
                    />
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <DraggableRow key={row.id} row={row} reorderRow={reorderRow} />
          ))}
        </tbody>
      </table>
    </DndProvider>
  );
};
