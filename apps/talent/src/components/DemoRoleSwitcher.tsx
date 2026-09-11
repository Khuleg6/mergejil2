'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DemoRole, isDemoMode, setDemoRole } from '@/lib/demo-mode';

export const DemoRoleSwitcher = ({ role }: { role?: DemoRole }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  if (!isDemoMode()) return null;
  const choose = (next: DemoRole) => {
    setDemoRole(next);
    setOpen(false);
    router.push(next === 'teacher' ? '/teacher' : '/student');
  };
  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="rounded-lg px-2 py-1 text-xs text-slate-400 hover:bg-white hover:text-slate-600"
      >
        Турших{role ? ` · ${role === 'teacher' ? 'Багш' : 'Сурагч'}` : ''}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-1 min-w-28 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
          {(['teacher', 'student'] as DemoRole[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => choose(item)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${role === item ? 'bg-indigo-50 font-semibold text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              {item === 'teacher' ? 'Багш' : 'Сурагч'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
