import { DistanceMatrixResponseData, TravelMode } from '@googlemaps/google-maps-services-js';
import type { Dayjs } from 'dayjs';

interface DistanceMatrixParams {
  origins: string | string[];
  destinations: string | string[];
  arrivalTime?: Dayjs;
  mode?: TravelMode;
}

const concatLocations = (locations: string | string[]) =>
  Array.isArray(locations) ? locations.join('|') : locations;

export const getDistances = async ({
  origins,
  destinations,
  arrivalTime,
  mode = TravelMode.driving,
}: DistanceMatrixParams): Promise<DistanceMatrixResponseData> => {
  const queryParams = {
    origins: concatLocations(origins),
    destinations: concatLocations(destinations),
    arrival_time: String(arrivalTime?.unix() ?? ''),
    mode,
    language: 'pl',
    key: process.env.GOOGLE_MAPS_API_KEY!,
  };

  console.log(queryParams.arrival_time);

  const searchParams = new URLSearchParams(queryParams);
  const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
  url.search = searchParams.toString();

  const response = await fetch(url);
  return response.json();
};
