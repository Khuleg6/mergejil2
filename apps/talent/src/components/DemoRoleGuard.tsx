'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DemoRole, getDemoRole } from '@/lib/demo-mode';

export const DemoRoleGuard = ({
  role,
  children,
}: {
  role: DemoRole;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const selected = getDemoRole();
    if (!selected) router.replace('/login');
    else if (selected !== role)
      router.replace(selected === 'teacher' ? '/teacher' : '/student');
    else setAllowed(true);
  }, [role, router]);
  if (!allowed)
    return (
      <main className="app-page flex min-h-screen items-center justify-center">
        <p className="animate-pulse text-slate-500">Demo орчныг нээж байна…</p>
      </main>
    );
  return children;
};
