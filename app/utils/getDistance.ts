import {
  Distance,
  DistanceMatrixResponseData,
  Duration,
  Status,
  TravelMode,
} from '@googlemaps/google-maps-services-js';

interface DistanceMatrixParams {
  origins: string | string[];
  destinations: Array<[number, string]>;
  arrivalTimestamp?: number;
  departureTimestamp?: number;
  mode?: TravelMode;
}

const concatLocations = (locations: string | string[]) =>
  Array.isArray(locations) ? locations.join('|') : locations;

export interface DistanceMatrixData {
  hospitalId: number;
  mode: TravelMode;
  distance: Distance | null;
  duration: Duration | null;
}

export const getDistances = async ({
  origins,
  destinations,
  arrivalTimestamp,
  departureTimestamp,
  mode = TravelMode.driving,
}: DistanceMatrixParams): Promise<DistanceMatrixData[]> => {
  const queryParams: Record<string, string> = {
    origins: concatLocations(origins),
    destinations: concatLocations(destinations.map(([, address]) => address)),
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
  const responseData: DistanceMatrixResponseData = await response.json();

  return responseData.rows[0].elements.map(
    ({ status, distance, duration, duration_in_traffic }, index) => {
      const hospitalId = destinations[index][0];
      return status === Status.OK
        ? {
            hospitalId,
            mode,
            distance,
            duration: duration_in_traffic ?? duration,
          }
        : { hospitalId, mode, distance: null, duration: null };
    },
  );
};
