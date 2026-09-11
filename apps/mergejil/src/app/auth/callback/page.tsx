'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Spinner } from '@/components/Spinner';
import { NEXT_KEY, safeNext } from '@/lib/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = new URLSearchParams(window.location.hash.slice(1)).get('token');
    if (!token) {
      setError('Нэвтрэх токен олдсонгүй.');
      return;
    }

    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('failed'))))
      .then((user) => {
        setSession(token, user);
        let next: string | null = null;
        try {
          next = sessionStorage.getItem(NEXT_KEY);
          sessionStorage.removeItem(NEXT_KEY);
        } catch {
          // Хадгалалт боломжгүй бол үндсэн зам руу.
        }
        router.replace(safeNext(next));
      })
      .catch(() => setError('Нэвтрэлт амжилтгүй боллоо. Дахин оролдоно уу.'));
  }, [router, setSession]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-black text-white">
      {error ? (
        <>
          <p className="text-sm text-red-400">{error}</p>
          <button
            type="button"
            onClick={() => router.replace('/Login')}
            className="text-sm text-blue-400 hover:underline"
          >
            Нэвтрэх хуудас руу буцах
          </button>
        </>
      ) : (
        <>
          <Spinner />
          <p className="text-sm text-slate-400">Нэвтэрч байна...</p>
        </>
      )}
    </div>
  );
}
