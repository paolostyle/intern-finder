'use server';

import {
  Distance,
  DistanceMatrixResponseData,
  Duration,
  Status,
  TravelMode,
} from '@googlemaps/google-maps-services-js';
import { getDistances } from '../utils/getDistance';
import { getTimestampForNextWeekday } from '../utils/getTimestampForNextWeekday';
import { StaticHospitalData } from './getHospitalData';

const negate =
  <A extends unknown[]>(fn: (...args: A) => boolean): ((...args: A) => boolean) =>
  (...args) =>
    !fn(...args);
const isHospitalInWarsaw = (hospital: StaticHospitalData) => hospital.address.includes('Warszawa');
const isNotHospitalInWarsaw = negate(isHospitalInWarsaw);

const mapToDistanceAndDuration = (apiResponseData: DistanceMatrixResponseData[]) =>
  apiResponseData.flatMap(({ rows }) =>
    rows[0].elements.map(({ status, distance, duration, duration_in_traffic }) =>
      status === Status.OK ? { distance, duration: duration_in_traffic ?? duration } : null,
    ),
  );

export interface DistanceData {
  hospitalId: number;
  driveData?: {
    distance: Distance;
    duration: Duration;
  } | null;
  transitData?: {
    distance: Distance;
    duration: Duration;
  } | null;
}

export const getDistanceData = async (
  formData: FormData,
  hospitals: StaticHospitalData[],
): Promise<DistanceData[]> => {
  const origin = formData.get('origin') as string;
  const dayOfTheWeek = Number(formData.get('dayOfTheWeek') as string);
  const arrivalTime = formData.get('arrivalTime') as string;
  const departureTime = formData.get('departureTime') as string;

  const arrivalTimestamp = getTimestampForNextWeekday(dayOfTheWeek, arrivalTime);
  const departureTimestamp = getTimestampForNextWeekday(dayOfTheWeek, departureTime);

  const predicates = [isHospitalInWarsaw, isNotHospitalInWarsaw];
  const modes = [TravelMode.driving, TravelMode.transit];
  const [drivingModeRequests, transitModeRequests] = modes.map((mode) =>
    predicates.map((predicate) =>
      getDistances({
        destinations: hospitals.filter(predicate).map((hospital) => hospital.address),
        origins: origin,
        arrivalTimestamp,
        departureTimestamp,
        mode,
      }),
    ),
  );

  const drivingData = mapToDistanceAndDuration(await Promise.all(drivingModeRequests));
  const transitData = mapToDistanceAndDuration(await Promise.all(transitModeRequests));

  return hospitals.map((hospital, index) => ({
    hospitalId: hospital.id,
    driveData: drivingData[index],
    transitData: transitData[index],
  }));
};
