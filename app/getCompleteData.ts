'use server';

import {
  Distance,
  DistanceMatrixResponseData,
  Duration,
  Status,
  TravelMode,
} from '@googlemaps/google-maps-services-js';
import { getDistances } from './utils/getDistance';
import { StaticHospitalData, getHospitalData } from './utils/getHospitalData';
import { DayOfTheWeek, getNextDayOfTheWeek } from './utils/getNextDayOfTheWeek';

const negate =
  <A extends unknown[]>(fn: (...args: A) => boolean): ((...args: A) => boolean) =>
  (...args) =>
    !fn(...args);
const isHospitalInWarsaw = (hospital: StaticHospitalData) => hospital.address.includes('Warszawa');
const isNotHospitalInWarsaw = negate(isHospitalInWarsaw);

const mapToDistanceAndDuration = (apiResponseData: DistanceMatrixResponseData[]) =>
  apiResponseData.flatMap(({ rows }) =>
    rows[0].elements.map(({ status, distance, duration }) =>
      status === Status.OK ? { distance, duration } : null,
    ),
  );

interface HospitalData extends StaticHospitalData {
  driveData: {
    distance: Distance;
    duration: Duration;
  } | null;
  transitData: {
    distance: Distance;
    duration: Duration;
  } | null;
}

export const getCompleteData = async (): Promise<HospitalData[]> => {
  const origin = '';
  const arrivalTime = getNextDayOfTheWeek({
    weekday: DayOfTheWeek.Monday,
    hour: 3,
    gapTimeInMinutes: 15,
  });

  const hospitals = await getHospitalData();

  const predicates = [isHospitalInWarsaw, isNotHospitalInWarsaw];
  const modes = [TravelMode.driving, TravelMode.transit];
  const [drivingModeRequests, transitModeRequests] = modes.map((mode) =>
    predicates.map((predicate) =>
      getDistances({
        destinations: hospitals.filter(predicate).map((hospital) => hospital.address),
        origins: origin,
        arrivalTime,
        mode,
      }),
    ),
  );

  const drivingData = mapToDistanceAndDuration(await Promise.all(drivingModeRequests));
  const transitData = mapToDistanceAndDuration(await Promise.all(transitModeRequests));

  return hospitals.map((hospital, index) => ({
    ...hospital,
    driveData: drivingData[index],
    transitData: transitData[index],
  }));
};
