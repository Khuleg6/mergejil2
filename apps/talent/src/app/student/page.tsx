import { ClassroomDemo } from '@/components/classroom-demo/ClassroomDemo';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/LogoutButton';
import { StudentAssignments } from '@/components/StudentAssignments';
import { DemoRoleGuard } from '@/components/DemoRoleGuard';

export default async function StudentPage() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true')
    return (
      <DemoRoleGuard role="student">
        <ClassroomDemo role="student" />
      </DemoRoleGuard>
    );
  const { getCurrentUser } = await import('@/lib/session');
  const user = await getCurrentUser();
  if (!user || user.role !== 'STUDENT') redirect('/login');
  return (
    <main className="app-page p-4 sm:p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <header className="enter flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
              Сурагчийн орчин
            </span>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Сайн уу, {user.name} <span aria-hidden="true">👋</span>
            </h1>
            <p className="mt-2 text-slate-500">
              Өнөөдрийн хичээлээ тайван, өөрийн хурдаар эхлүүлээрэй.
            </p>
          </div>
          <LogoutButton />
        </header>
        <StudentAssignments />
      </div>
    </main>
  );
}
