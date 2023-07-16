import { DistanceData } from '@/actions/getDistanceData';
import { StaticHospitalData } from '@/actions/getHospitalData';

export type HospitalData = StaticHospitalData & Omit<DistanceData, 'hospitalId'>;
