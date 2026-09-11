'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type Profession = {
  id: string;
  rank: number;
  name: string;
  englishName: string;
  matchPct: number;
  salaryMin: number;
  salaryMax: number;
  demandLevel: string;
  trend: string;
  description?: string;
  subjects?: string[];
};

const DEMAND_RANK: Record<string, number> = {
  'very-high': 4,
  high: 3,
  medium: 2,
  low: 1,
};

const MATCH_COLORS = (pct: number) => {
  if (pct >= 90) return 'text-emerald-600';
  if (pct >= 80) return 'text-blue-600';
  if (pct >= 70) return 'text-amber-600';
  return 'text-slate-500';
};

function formatMNT(value: number) {
  return (value / 1000000).toFixed(1) + 'сая₮';
}

function trendStrength(trend: string) {
  return (trend.match(/↑/g) || []).length;
}

type SubTab = 'current' | 'future';

export const CompactProfessionsList = ({
  professions,
}: {
  professions: Profession[];
}) => {
  const [subTab, setSubTab] = useState<SubTab>('current');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const currentList = [...professions].sort(
    (a, b) =>
      (DEMAND_RANK[b.demandLevel] || 0) - (DEMAND_RANK[a.demandLevel] || 0) ||
      b.matchPct - a.matchPct,
  );

  const futureList = professions
    .filter((p) => trendStrength(p.trend) > 0)
    .sort(
      (a, b) =>
        trendStrength(b.trend) - trendStrength(a.trend) ||
        b.matchPct - a.matchPct,
    );

  const list = subTab === 'current' ? currentList : futureList;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-1">
        Санал болгож байгаа мэргэжлүүд
      </h2>
      <p className="text-sm text-slate-500 mb-4">
        Таны тестийн үр дүнд тулгуурлан AI тодорхойлсон, хамгийн тохирох мэргэжлүүд
      </p>

      {/* Sub tabs */}
      <div className="flex gap-1.5 mb-4">
        <button
          onClick={() => setSubTab('current')}
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
            subTab === 'current'
              ? 'bg-[#1b3a6b] text-white'
              : 'bg-slate-100 text-slate-500 hover:text-slate-900'
          }`}
        >
          Одоо эрэлттэй
        </button>
        <button
          onClick={() => setSubTab('future')}
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
            subTab === 'future'
              ? 'bg-[#1b3a6b] text-white'
              : 'bg-slate-100 text-slate-500 hover:text-slate-900'
          }`}
        >
          Ирээдүйд эрэлттэй
        </button>
      </div>

      <ul className="space-y-2.5">
        {list.map((prof) => {
          const isExpanded = expandedId === prof.id;
          return (
            <li key={prof.id} className="rounded-xl">
              <button
                type="button"
                onClick={() =>
                  setExpandedId((current) =>
                    current === prof.id ? null : prof.id,
                  )
                }
                aria-expanded={isExpanded}
                className="w-full flex items-center gap-3 text-sm text-left py-1 -my-1 px-1.5 -mx-1.5 rounded-lg hover:bg-slate-100/60 transition-colors duration-150"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#1b3a6b] flex-shrink-0" />
                <span className="font-medium text-slate-900 flex-1 min-w-0 truncate">
                  {prof.name}
                  <span className="text-slate-500 font-normal">
                    {' '}
                    · {prof.englishName}
                  </span>
                </span>
                <span className="text-sm text-slate-500 flex-shrink-0 hidden sm:inline">
                  {formatMNT(prof.salaryMin)}–{formatMNT(prof.salaryMax)}
                </span>
                {subTab === 'future' && (
                  <span className="text-sm text-green-600 font-semibold flex-shrink-0">
                    {prof.trend}
                  </span>
                )}
                <span
                  className={`text-sm font-bold tabular-nums flex-shrink-0 ${MATCH_COLORS(prof.matchPct)}`}
                >
                  {prof.matchPct}%
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-500 flex-shrink-0 transition-transform duration-150 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isExpanded && (prof.description || prof.subjects) && (
                <div className="mt-2 mb-1 ml-4 pl-3 border-l-2 border-[#1b3a6b]/30 text-sm space-y-2">
                  {prof.description && (
                    <div>
                      <p className="font-semibold text-slate-900 mb-0.5">
                        Яагаад танд санал болгож байна вэ?
                      </p>
                      <p className="text-slate-500 leading-relaxed">
                        {prof.description}
                      </p>
                    </div>
                  )}
                  {prof.subjects && prof.subjects.length > 0 && (
                    <div>
                      <p className="font-semibold text-slate-900 mb-1">
                        10 жилийн хугацаанд сайн үзэх ёстой хичээлүүд
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {prof.subjects.map((subject) => (
                          <span
                            key={subject}
                            className="px-2 py-0.5 rounded-full bg-[#1b3a6b]/10 text-[#1b3a6b] font-medium"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
