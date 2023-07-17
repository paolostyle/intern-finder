'use client';

import { DistanceData, getDistanceData } from '@/actions/getDistanceData';
import { StaticHospitalData } from '@/actions/getHospitalData';
import { useState } from 'react';
import { Settings } from './Settings';
import { DnDTable } from './Table/DnDTable';
import { useHospitalsTable } from './useHospitalsTable';
import { mapToObj } from 'remeda';

interface Props {
  hospitalsData: StaticHospitalData[];
}

export const PageContent = ({ hospitalsData }: Props) => {
  const [distanceData, setDistanceData] = useState<Record<number, DistanceData>>();
  const { applySorting, reorderRow, table } = useHospitalsTable({ hospitalsData, distanceData });

  return (
    <>
      <Settings
        onSubmit={async (formData) => {
          const distanceDataList = await getDistanceData(formData, hospitalsData);
          setDistanceData(
            mapToObj(distanceDataList, ({ hospitalId, driveData, transitData }) => [
              hospitalId,
              { driveData, transitData },
            ]),
          );
        }}
      />
      <DnDTable table={table} reorderRow={reorderRow} />
    </>
  );
};
