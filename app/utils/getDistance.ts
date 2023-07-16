import { DistanceMatrixResponseData, TravelMode } from '@googlemaps/google-maps-services-js';

interface DistanceMatrixParams {
  origins: string | string[];
  destinations: string | string[];
  arrivalTimestamp?: number;
  departureTimestamp?: number;
  mode?: TravelMode;
}

const concatLocations = (locations: string | string[]) =>
  Array.isArray(locations) ? locations.join('|') : locations;

export const getDistances = async ({
  origins,
  destinations,
  arrivalTimestamp,
  departureTimestamp,
  mode = TravelMode.driving,
}: DistanceMatrixParams): Promise<DistanceMatrixResponseData> => {
  const queryParams: Record<string, string> = {
    origins: concatLocations(origins),
    destinations: concatLocations(destinations),
    mode,
    language: 'pl',
    key: process.env.GOOGLE_MAPS_API_KEY!,
  };

  if (mode === TravelMode.transit && arrivalTimestamp) {
    queryParams.arrival_time = String(arrivalTimestamp);
  }

  if (mode === TravelMode.driving && departureTimestamp) {
    queryParams.departure_time = String(departureTimestamp);
  }

  const searchParams = new URLSearchParams(queryParams);
  const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
  url.search = searchParams.toString();

  const response = await fetch(url);
  return response.json();
};
