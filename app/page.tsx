import { getCompleteData } from './getCompleteData';
import { DayOfTheWeek, getNextDayOfTheWeek } from './utils/getNextDayOfTheWeek';
import { FC, ReactNode } from 'react';

const Tr: FC<{ children: ReactNode }> = ({ children }) => (
  <tr className="table-row border border-slate-500">{children}</tr>
);
const Th: FC<{ children: ReactNode }> = ({ children }) => (
  <th className="border border-slate-500 p-2">{children}</th>
);
const Td: FC<{ children: ReactNode }> = ({ children }) => (
  <td className="border border-slate-500 p-2">{children}</td>
);

export default async function Home() {
  const data = await getCompleteData();

  const kek = getNextDayOfTheWeek({ weekday: DayOfTheWeek.Sunday });

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      {kek.toISOString()} {kek.unix()}
      <table className="table border-collapse border border-slate-500">
        <tbody>
          <Tr>
            {[
              'Nazwa szpitala',
              'Adres',
              'Odległość (samochodem)',
              'Czas dojazdu (samochodem)',
              'Odległość (komunikacją)',
              'Czas dojazdu (komunikacją)',
              'Próg',
            ].map((headName) => (
              <Th key={headName}>{headName}</Th>
            ))}
          </Tr>
          {data.map((row) => (
            <Tr key={row.name}>
              <Td>{row.name}</Td>
              <Td>{row.address}</Td>
              <Td>{row.driveData?.distance.text}</Td>
              <Td>{row.driveData?.duration.text}</Td>
              <Td>{row.transitData?.distance.text}</Td>
              <Td>{row.transitData?.duration.text}</Td>
              <Td>{row.gpa}</Td>
            </Tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
