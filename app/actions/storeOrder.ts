'use server';

import { HospitalData } from '@/components/types';
import { cookies } from 'next/headers';

export const storeOrder = (orderedData: HospitalData[]) => {
  const cookiesStore = cookies();

  cookiesStore.set({
    name: 'ordering',
    value: JSON.stringify(orderedData.map((hospital) => hospital.id)),
  });
};
