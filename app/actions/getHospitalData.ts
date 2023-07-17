'use server';

import fs from 'node:fs/promises';
import readCsv from 'neat-csv';
import path from 'path';

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
  return readCsv<StaticHospitalData>(hospitalsFile, {
    separator: ';',
    mapValues: ({ header, value }) =>
      ['id', 'gpa', 'seats'].includes(header) ? Number(value) : value,
  });
};
