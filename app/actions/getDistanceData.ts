'use server';

import {
  Distance,
  DistanceMatrixResponseData,
  Duration,
  Status,
  TravelMode,
} from '@googlemaps/google-maps-services-js';
import { getDistances } from '../utils/getDistance';
import { getTimestampForNextWeekday } from '../utils/dateUtils';
import { StaticHospitalData } from './getHospitalData';
import { isNot } from 'remeda';

const isHospitalInWarsaw = (hospital: StaticHospitalData) => hospital.address.includes('Warszawa');
const isNotHospitalInWarsaw = isNot(isHospitalInWarsaw);

const mapToDistanceAndDuration = (apiResponseData: DistanceMatrixResponseData[]) =>
  apiResponseData.flatMap(({ rows }) =>
    rows[0].elements.map(({ status, distance, duration, duration_in_traffic }) =>
      status === Status.OK ? { distance, duration: duration_in_traffic ?? duration } : null,
    ),
  );

export interface DistanceData {
  driveData?: {
    distance: Distance;
    duration: Duration;
  } | null;
  transitData?: {
    distance: Distance;
    duration: Duration;
  } | null;
}

export interface DistanceDataResponse extends DistanceData {
  hospitalId: number;
}

export const getDistanceData = async (
  formData: FormData,
  hospitals: StaticHospitalData[],
): Promise<DistanceDataResponse[]> => {
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
