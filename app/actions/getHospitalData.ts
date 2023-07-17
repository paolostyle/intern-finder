'use server';

import fs from 'node:fs/promises';
import readCsv from 'neat-csv';
import path from 'path';
import { cookies } from 'next/headers';
import { mapToObj } from 'remeda';

export interface StaticHospitalData {
  id: number;
  name: string;
  address: string;
  gpa: number;
  seats: number;
}

export const getHospitalData = async () => {
  const filePath = path.join(process.cwd(), 'public/hospitals.csv');
  const hospitalsFile = await fs.readFile(filePath);

  const parsedData = await readCsv<StaticHospitalData>(hospitalsFile, {
    separator: ';',
    mapValues: ({ header, value }) =>
      ['id', 'gpa', 'seats'].includes(header) ? Number(value) : value,
  });

  const ordering = cookies().get('ordering');
  if (ordering) {
    const parsedOrdering: number[] = JSON.parse(ordering.value);
    const hospitalsDict = mapToObj(parsedData, (hospital) => [hospital.id, hospital]);

    return parsedOrdering.map((hospitalId) => hospitalsDict[hospitalId]);
  }

  return parsedData;
};
