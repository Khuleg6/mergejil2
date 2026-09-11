'use client';

import { BriefcaseBusiness, Check } from 'lucide-react';

type ProfessionSelectorProps = {
  professions: { id: string; name: string; matchPct: number }[];
  selectedProfessionId: string;
  onProfessionChange: (professionId: string) => void;
  description: string;
  compact?: boolean;
};

export const ProfessionSelector = ({
  professions,
  selectedProfessionId,
  onProfessionChange,
  description,
  compact = false,
}: ProfessionSelectorProps) => (
  <div
    className={
      compact
        ? 'mb-4 min-w-0'
        : 'rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5'
    }
  >
    <div className={compact ? 'sr-only' : 'mb-3 flex items-center gap-2'}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
        <BriefcaseBusiness size={17} />
      </span>
      <div>
        <p className="text-sm font-black text-slate-900">
          Санал болгосон мэргэжлээс сонгоорой
        </p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
    <div
      className={`grid gap-2 overflow-x-auto pb-1 scrollbar-hide ${compact ? 'grid-cols-[repeat(5,minmax(100px,1fr))]' : 'grid-cols-[repeat(5,minmax(210px,1fr))]'}`}
      role="group"
      aria-label="Санал болгосон мэргэжлүүд"
    >
      {professions.slice(0, 5).map((profession, index) => {
        const isSelected = profession.id === selectedProfessionId;
        return (
          <button
            key={profession.id}
            type="button"
            onClick={() => onProfessionChange(profession.id)}
            aria-pressed={isSelected}
            className={`group flex min-w-0 items-center rounded-2xl border text-left transition-colors ${compact ? 'flex-col gap-1 px-2 py-2' : 'gap-3 px-3.5 py-3'} ${
              isSelected
                ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-900/15'
                : 'border-slate-200 bg-white text-slate-800 hover:border-blue-300 hover:bg-blue-50/50'
            }`}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black ${isSelected ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              {index + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-bold uppercase tracking-wide opacity-70">
                {profession.matchPct}% тохирно
              </span>
              <span className="mt-0.5 block text-sm font-bold leading-tight">
                {profession.name}
              </span>
            </span>
            <Check
              size={17}
              aria-hidden="true"
              className={`shrink-0 ${isSelected ? 'visible' : 'invisible'}`}
            />
          </button>
        );
      })}
    </div>
  </div>
);
