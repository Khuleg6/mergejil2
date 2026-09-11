'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ProfessionSelector } from './ProfessionSelector';

type University = {
  id: string;
  name: string;
  fullName: string;
  programs: string[];
  matchScore: number;
  location: string;
  country: string;
  tuition?: string;
  highlight?: string;
  scholarship?: string;
};

type SubTab = 'mongolia' | 'abroad';

export const CompactEducationList = ({
  universities,
  professionName,
  professions,
  selectedProfessionId,
  onProfessionChange,
}: {
  universities: University[];
  professionName?: string;
  professions: { id: string; name: string; matchPct: number }[];
  selectedProfessionId: string;
  onProfessionChange: (professionId: string) => void;
}) => {
  const [subTab, setSubTab] = useState<SubTab>('mongolia');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const list = universities
    .filter((u) =>
      subTab === 'mongolia' ? u.country === 'Монгол' : u.country !== 'Монгол',
    )
    .sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-1">
        Боловсролын байгууллага
      </h2>
      <p className="text-sm text-slate-500 mb-4">
        {professionName
          ? `${professionName} чиглэлд нийцсэн их сургуулиуд`
          : 'Таны мэргэжлийн зорилгод нийцсэн их сургуулиуд'}
      </p>

      {/* Sub tabs */}
      <ProfessionSelector
        compact
        professions={professions}
        selectedProfessionId={selectedProfessionId}
        onProfessionChange={onProfessionChange}
        description="Сонгосон мэргэжилд тохирох сургуулиуд"
      />
      <div className="flex gap-1.5 mb-4">
        <button
          onClick={() => setSubTab('mongolia')}
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
            subTab === 'mongolia'
              ? 'bg-[#1b3a6b] text-white'
              : 'bg-slate-100 text-slate-500 hover:text-slate-900'
          }`}
        >
          Монголд
        </button>
        <button
          onClick={() => setSubTab('abroad')}
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
            subTab === 'abroad'
              ? 'bg-[#1b3a6b] text-white'
              : 'bg-slate-100 text-slate-500 hover:text-slate-900'
          }`}
        >
          Гадаадад
        </button>
      </div>

      {list.length === 0 && (
        <p className="text-sm text-slate-500">
          Энэ чиглэлд тохирох сургуулийн мэдээлэл одоогоор алга.
        </p>
      )}
      <ul className="space-y-2.5">
        {list.map((uni) => {
          const isExpanded = expandedId === uni.id;
          return (
            <li key={uni.id} className="rounded-xl">
              <button
                type="button"
                onClick={() =>
                  setExpandedId((current) =>
                    current === uni.id ? null : uni.id,
                  )
                }
                aria-expanded={isExpanded}
                className="w-full flex items-center gap-3 text-sm text-left py-1 -my-1 px-1.5 -mx-1.5 rounded-lg hover:bg-slate-100/60 transition-colors duration-150"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#1b3a6b] flex-shrink-0" />
                <span className="font-medium text-slate-900 flex-1 min-w-0 truncate">
                  {uni.name}
                  <span className="text-slate-500 font-normal">
                    {' '}
                    · {uni.programs.join(', ')}
                  </span>
                </span>
                <span className="text-sm text-slate-500 flex-shrink-0 hidden sm:inline">
                  {uni.location}
                </span>
                <span className="text-sm font-bold text-[#1b3a6b] tabular-nums flex-shrink-0">
                  {uni.matchScore}%
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-500 flex-shrink-0 transition-transform duration-150 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isExpanded && (uni.highlight || uni.scholarship) && (
                <div className="mt-2 mb-1 ml-4 pl-3 border-l-2 border-[#1b3a6b]/30 text-sm space-y-2">
                  {uni.highlight && (
                    <div>
                      <p className="font-semibold text-slate-900 mb-0.5">
                        Яагаад танд санал болгож байна вэ?
                      </p>
                      <p className="text-slate-500 leading-relaxed">
                        {uni.highlight}
                      </p>
                    </div>
                  )}
                  {uni.scholarship && (
                    <div>
                      <p className="font-semibold text-slate-900 mb-0.5">
                        Тэтгэлэгийн мэдээлэл
                      </p>
                      {uni.tuition && (
                        <p className="text-slate-900 font-medium mb-0.5">
                          Сургалтын төлбөр: {uni.tuition}
                        </p>
                      )}
                      <p className="text-slate-500 leading-relaxed">
                        {uni.scholarship}
                      </p>
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
