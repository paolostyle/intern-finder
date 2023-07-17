import { DistanceData } from '@/actions/getDistanceData';
import { StaticHospitalData } from '@/actions/getHospitalData';

export type HospitalData = StaticHospitalData & DistanceData;

export type HospitalsTableProps = {
  hospitalsData: StaticHospitalData[];
  distanceData?: Record<number, DistanceData>;
};
