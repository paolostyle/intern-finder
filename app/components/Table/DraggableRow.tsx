import { Row, RowData, flexRender } from '@tanstack/react-table';
import clsx from 'clsx';
import { GripIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { HospitalData } from '../types';

type Props<T extends RowData> = {
  row: Row<T>;
  reorderRow: (draggedRowIndex: number, targetRowIndex: number) => void;
  isDraggingDisabled: boolean;
};

export const DraggableRow = <T extends RowData>({
  row,
  reorderRow,
  isDraggingDisabled,
}: Props<T>) => {
  const [hasDropped, setHasDropped] = useState(false);

  const [{ dropStyles }, dropRef] = useDrop({
    accept: 'row',
    collect: (monitor) => {
      let dropStyles = null;

      if (monitor.isOver()) {
        const yOffset = monitor.getDifferenceFromInitialOffset()?.y;
        if (yOffset && yOffset > 0) {
          dropStyles = 'border-b-4 border-b-primary';
        }
        if (yOffset && yOffset < 0) {
          dropStyles = 'border-t-4 border-t-primary';
        }
      }

      return { dropStyles };
    },
    drop: (draggedRow: Row<HospitalData>) => reorderRow(draggedRow.index, row.index),
  });

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    canDrag: !isDraggingDisabled,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => row,
    type: 'row',
    end: (_, monitor) => {
      if (monitor.didDrop()) {
        setHasDropped(true);
      }
    },
  });

  useEffect(() => {
    if (hasDropped) {
      setTimeout(() => setHasDropped(false), 1000);
    }
  }, [hasDropped]);

  return (
    <tr
      ref={(ref) => {
        previewRef(ref);
        dropRef(ref);
      }}
      className={clsx(
        isDragging ? 'opacity-50' : 'opacity-100',
        dropStyles,
        'transition-bg duration-1000',
        hasDropped && '!bg-primary',
      )}
    >
      <td>
        <div
          className="tooltip tooltip-right"
          data-tip={
            isDraggingDisabled
              ? 'Układanie listy jest wyłączone gdy sortowanie jest włączone'
              : undefined
          }
        >
          <button
            type="button"
            ref={dragRef}
            className={clsx(
              'align-text-top',
              isDraggingDisabled ? 'pointer-events-none opacity-20' : 'cursor-grab',
            )}
          >
            <GripIcon className="h-4 w-4" />
          </button>
        </div>
      </td>
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
      ))}
    </tr>
  );
};
