'use client';

import { DistanceData, getDistanceData } from '@/actions/getDistanceData';
import { StaticHospitalData } from '@/actions/getHospitalData';
import { useState } from 'react';
import { Settings } from './Settings';
import { Table } from './Table/Table';

interface Props {
  hospitalsData: StaticHospitalData[];
}

export const PageContent = ({ hospitalsData }: Props) => {
  const [distanceData, setDistanceData] = useState<Record<number, DistanceData>>();

  return (
    <>
      <Settings
        onSubmit={async (formData) => {
          const distanceDataList = await getDistanceData(formData, hospitalsData);
          const normalizedDistanceData = distanceDataList.reduce<Record<number, DistanceData>>(
            (acc, item) => {
              acc[item.hospitalId] = item;
              return acc;
            },
            {},
          );
          setDistanceData(normalizedDistanceData);
        }}
      />
      <Table hospitalsData={hospitalsData} distanceData={distanceData} />
    </>
  );
};
