'use client';
import { usePathname } from 'next/navigation';
import { DemoRoleSwitcher } from '../DemoRoleSwitcher';

export const SessionBar = ({ whoLabel }: { whoLabel: string }) => {
  const pathname = usePathname();
  return (
    <div className="sessionbar">
      <span>
        Туршилтын горим · <span className="who">{whoLabel}</span>
      </span>
      <DemoRoleSwitcher
        role={pathname === '/teacher' ? 'teacher' : 'student'}
      />
    </div>
  );
};
