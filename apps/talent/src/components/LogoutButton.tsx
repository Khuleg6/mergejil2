'use client';
import { useRouter } from 'next/navigation';
export const LogoutButton = () => { const router = useRouter(); return <button type="button" onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/login'); router.refresh(); }} className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm hover:scale-[1.02] hover:border-slate-300 hover:bg-slate-50">Гарах</button>; };
