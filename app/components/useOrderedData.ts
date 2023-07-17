import { useCallback, useEffect, useState } from 'react';
import { HospitalData, HospitalsTableProps } from './types';

export const useOrderedData = ({ hospitalsData, distanceData }: HospitalsTableProps) => {
  const updateHospitalsData = useCallback(
    (currentHospitalData: HospitalData[]) =>
      distanceData
        ? currentHospitalData.map((hospital) => ({
            ...hospital,
            ...distanceData[hospital.id],
          }))
        : currentHospitalData,
    [distanceData],
  );

  const [orderedData, setOrderedData] = useState<HospitalData[]>(
    updateHospitalsData(hospitalsData),
  );

  useEffect(() => {
    setOrderedData((currentData) => updateHospitalsData(currentData));
  }, [distanceData, updateHospitalsData]);

  const reorderRow = (draggedRowIndex: number, targetRowIndex: number) => {
    orderedData.splice(targetRowIndex, 0, orderedData.splice(draggedRowIndex, 1)[0]);
    setOrderedData([...orderedData]);
  };

  return { orderedData, setOrderedData, reorderRow };
};
