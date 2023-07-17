'use client';

import { DistanceData, getDistanceData } from '@/actions/getDistanceData';
import { StaticHospitalData } from '@/actions/getHospitalData';
import { useState } from 'react';
import { Settings } from './Settings';
import { DnDTable } from './Table/DnDTable';
import { useHospitalsTable } from './useHospitalsTable';

interface Props {
  hospitalsData: StaticHospitalData[];
}

export const PageContent = ({ hospitalsData }: Props) => {
  const [distanceData, setDistanceData] = useState<Record<number, DistanceData>>();
  const { applySorting, reorderRow, table } = useHospitalsTable({ hospitalsData, distanceData });

  return (
    <>
      <div className="flex items-start">
        <Settings
          onSubmit={async (formData) =>
            setDistanceData(await getDistanceData(formData, hospitalsData))
          }
          applySorting={applySorting}
        />
      </div>
      <DnDTable table={table} reorderRow={reorderRow} />
    </>
  );
};
