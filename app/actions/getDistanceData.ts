'use server';

import { Distance, Duration, TravelMode } from '@googlemaps/google-maps-services-js';
import { isNot } from 'remeda';
import { getTimestampForNextWeekday } from '../utils/dateUtils';
import { getDistances } from '../utils/getDistance';
import { StaticHospitalData } from './getHospitalData';

const isHospitalInWarsaw = (hospital: StaticHospitalData) => hospital.address.includes('Warszawa');
const isNotHospitalInWarsaw = isNot(isHospitalInWarsaw);

export interface DistanceData {
  drivingDistance?: Distance | null;
  drivingDuration?: Duration | null;
  transitDuration?: Duration | null;
}

export const getDistanceData = async (
  formData: FormData,
  hospitals: StaticHospitalData[],
): Promise<Record<number, DistanceData>> => {
  const origin = formData.get('origin') as string;
  const dayOfTheWeek = Number(formData.get('dayOfTheWeek') as string);
  const arrivalTime = formData.get('arrivalTime') as string;
  const departureTime = formData.get('departureTime') as string;

  const arrivalTimestamp = getTimestampForNextWeekday(dayOfTheWeek, arrivalTime);
  const departureTimestamp = getTimestampForNextWeekday(dayOfTheWeek, departureTime);

  const predicates = [isHospitalInWarsaw, isNotHospitalInWarsaw];
  const modes = [TravelMode.driving, TravelMode.transit];
  const requests = modes.flatMap((mode) =>
    predicates.map((predicate) =>
      getDistances({
        destinations: hospitals
          .filter(predicate)
          .map((hospital) => [hospital.id, hospital.address]),
        origins: origin,
        arrivalTimestamp,
        departureTimestamp,
        mode,
      }),
    ),
  );

  const distanceData = await Promise.all(requests);

  return distanceData.flat().reduce<Record<number, DistanceData>>((acc, item) => {
    acc[item.hospitalId] ??= {};

    if (item.mode === TravelMode.driving) {
      acc[item.hospitalId].drivingDistance = item.distance;
      acc[item.hospitalId].drivingDuration = item.duration;
    }
    if (item.mode === TravelMode.transit) {
      acc[item.hospitalId].transitDuration = item.duration;
    }

    return acc;
  }, {});
};
