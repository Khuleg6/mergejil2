'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const IQBarChart = dynamic(
  () => import('./IQBarChart').then((module) => module.IQBarChart),
  { ssr: false },
);

type IQData = {
  totalScore: number;
  label: string;
  percentile: number;
  description: string;
  subScores: {
    id: string;
    category: string;
    score: number;
    max: number;
    color: string;
  }[];
};

const IQ_LABEL_COLORS: Record<string, string> = {
  'Маш өндөр': 'bg-violet-100 text-violet-700 border-violet-200',
  Өндөр: 'bg-blue-100 text-blue-700 border-blue-200',
  Дундаж: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Доод дундаж': 'bg-amber-100 text-amber-700 border-amber-200',
};

export const IQSection = ({ iq }: { iq: IQData }) => {
  const labelColor =
    IQ_LABEL_COLORS[iq.label] || 'bg-slate-100 text-slate-500 border-slate-200';

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            IQ Танин мэдэхүйн оноо
          </h3>
          <p className="text-sm text-slate-500">Стандартчилсан хэмжүүрээр</p>
        </div>
        <div className="rounded-2xl bg-blue-50 px-5 py-3 text-center">
          <div className="text-4xl font-black text-[#1b3a6b] tabular-nums">
            {iq.totalScore}
          </div>
          <span
            className={`inline-block text-sm font-semibold px-2.5 py-1 rounded-full border mt-1 ${labelColor}`}
          >
            {iq.label}
          </span>
        </div>
      </div>

      {/* Percentile bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-1.5">
          <span className="text-slate-500">Байр суурь</span>
          <span className="font-semibold text-slate-900 tabular-nums">
            Дээрээс {100 - iq.percentile}%
          </span>
        </div>
        <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-br from-[#1b3a6b] to-[#2d5aa0] rounded-full transition-all duration-700"
            style={{ width: `${iq.percentile}%` }}
          />
          <div
            className="absolute top-0 h-full w-0.5 bg-white/80"
            style={{ left: `${iq.percentile}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-slate-500 mt-1">
          <span>0%</span>
          <span className="text-[#1b3a6b] font-semibold">
            Байр суурь: {iq.percentile}%
          </span>
          <span>100%</span>
        </div>
      </div>

      <p className="text-sm text-slate-500 mb-6 leading-relaxed">
        {iq.description}
      </p>

      {/* Sub-scores chart */}
      <div className="h-44">
        <IQBarChart subScores={iq.subScores} />
      </div>

      {/* Sub-score detail */}
      <div className="grid grid-cols-1 gap-3 mt-5 sm:grid-cols-2">
        {iq.subScores.map((sub) => (
          <div
            key={sub.id}
            className="rounded-xl border border-slate-100 bg-slate-50 p-3"
          >
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-slate-500 font-medium">{sub.category}</span>
              <span className="font-bold text-slate-900 tabular-nums">
                {sub.score}/{sub.max}
              </span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${sub.score}%`, backgroundColor: sub.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
