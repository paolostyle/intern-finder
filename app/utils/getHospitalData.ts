import readCsv from 'neat-csv';
import fs from 'fs-extra';
import path from 'path';

export interface StaticHospitalData {
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
    mapValues: ({ header, value }) => (['gpa', 'seats'].includes(header) ? Number(value) : value),
  });
};
