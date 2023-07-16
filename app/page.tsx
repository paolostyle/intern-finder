import { getHospitalData } from './actions/getHospitalData';
import { PageContent } from './components/PageContent';

export default async function Home() {
  const hospitalsData = await getHospitalData();

  return (
    <main className="flex min-h-screen flex-col p-8 gap-6">
      <PageContent hospitalsData={hospitalsData} />
    </main>
  );
}
