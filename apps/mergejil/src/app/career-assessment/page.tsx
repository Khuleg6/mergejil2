import { RequireAuth } from '@/components/RequireAuth';
import AssessmentPage from './components/AssessmentPage';

export default function CareerAssessmentPage() {
  return (
    <RequireAuth>
      <AssessmentPage />
    </RequireAuth>
  );
}
