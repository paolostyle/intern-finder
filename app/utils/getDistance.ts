import { DistanceMatrixResponseData, TravelMode } from '@googlemaps/google-maps-services-js';
import type { Dayjs } from 'dayjs';

interface DistanceMatrixParams {
  origins: string | string[];
  destinations: string | string[];
  arrivalTime?: Dayjs;
  departureTime?: Dayjs;
  mode?: TravelMode;
}

const concatLocations = (locations: string | string[]) =>
  Array.isArray(locations) ? locations.join('|') : locations;

export const getDistances = async ({
  origins,
  destinations,
  arrivalTime,
  departureTime,
  mode = TravelMode.driving,
}: DistanceMatrixParams): Promise<DistanceMatrixResponseData> => {
  const queryParams: Record<string, string> = {
    origins: concatLocations(origins),
    destinations: concatLocations(destinations),
    mode,
    language: 'pl',
    key: process.env.GOOGLE_MAPS_API_KEY!,
  };

  if (mode === TravelMode.transit && arrivalTime) {
    queryParams.arrival_time = String(arrivalTime.unix());
  }

  if (mode === TravelMode.driving && departureTime) {
    queryParams.departure_time = String(departureTime.unix());
  }

  const searchParams = new URLSearchParams(queryParams);
  const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
  url.search = searchParams.toString();

  const response = await fetch(url);
  return response.json();
};
