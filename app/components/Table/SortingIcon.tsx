import { SortDirection } from '@tanstack/react-table';
import clsx from 'clsx';
import {
  ArrowDown01Icon,
  ArrowDownAZIcon,
  ArrowUp10Icon,
  ArrowUpDownIcon,
  ArrowUpZAIcon,
} from 'lucide-react';

type SortedState = SortDirection | false;

type Props = {
  sortedState: SortedState;
  sortType: 'numeric' | 'text';
};

export const SortingIcons = ({ sortedState, sortType }: Props) => {
  const getClasses = (desiredState: SortedState) =>
    clsx('h-4 w-4', sortedState === desiredState ? 'swap-on' : 'swap-off');

  const AscIcon = sortType === 'numeric' ? ArrowDown01Icon : ArrowDownAZIcon;
  const DescIcon = sortType === 'numeric' ? ArrowUp10Icon : ArrowUpZAIcon;

  return (
    <div className="swap swap-active">
      <AscIcon className={getClasses('asc')} />
      <DescIcon className={getClasses('desc')} />
      <ArrowUpDownIcon className={getClasses(false)} />
    </div>
  );
};
