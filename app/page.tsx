import { Table } from './components/Table/Table';
import { getCompleteData } from './getCompleteData';

export default async function Home() {
  const data = await getCompleteData();

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <Table data={data} />
    </main>
  );
}
