import { ClassroomDemo } from '@/components/classroom-demo/ClassroomDemo';
import { redirect } from 'next/navigation';
import { TeacherDashboard } from '@/components/TeacherDashboard';
import { DemoRoleGuard } from '@/components/DemoRoleGuard';

export default async function TeacherPage() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true')
    return (
      <DemoRoleGuard role="teacher">
        <ClassroomDemo role="teacher" />
      </DemoRoleGuard>
    );
  const { getCurrentUser } = await import('@/lib/session');
  const user = await getCurrentUser();
  if (!user || user.role !== 'TEACHER') redirect('/login');
  return <TeacherDashboard teacherName={user.name} />;
}
