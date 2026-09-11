import { RequireAuth } from '@/components/RequireAuth';
import { ResultsPageClient } from './components/ResultsPageClient';

export const metadata = { title: 'Карьерийн профайл | Мэргэжил.мн' };

const RoadmapPage = () => (
  <RequireAuth>
    <ResultsPageClient />
  </RequireAuth>
);

export default RoadmapPage;
