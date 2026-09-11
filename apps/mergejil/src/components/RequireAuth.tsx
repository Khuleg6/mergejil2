'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Spinner } from './Spinner';
import { buildLoginHref } from '@/lib/navigation';

/**
 * Зөвхөн нэвтэрсэн хэрэглэгчид агуулгыг үзүүлнэ. Нэвтрээгүй бол бүртгүүлэх
 * хуудас руу шилжүүлж, бүртгүүлсний дараа энэ хуудас руу буцаана.
 */
export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { user, ready } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (ready && !user) router.replace(buildLoginHref(pathname));
  }, [ready, user, router, pathname]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#EFF4FF]">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
};
