import { RowData, Table, flexRender } from '@tanstack/react-table';
import clsx from 'clsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DraggableRow } from './DraggableRow';
import { SortingIcons } from './SortingIcon';

type Props<T extends RowData> = {
  table: Table<T>;
  reorderRow: (draggedRowIndex: number, targetRowIndex: number) => void;
};

export const DnDTable = <T extends RowData>({ table, reorderRow }: Props<T>) => (
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
          <DraggableRow
            key={row.id}
            row={row}
            reorderRow={reorderRow}
            isDraggingDisabled={table.getState().sorting.length !== 0}
          />
        ))}
      </tbody>
    </table>
  </DndProvider>
);
