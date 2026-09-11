'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const SkillsRadarChart = dynamic(
  () => import('./SkillsRadarChart').then((module) => module.SkillsRadarChart),
  {
    ssr: false,
  },
);

type SkillsData = {
  radarData: { subject: string; value: number; fullMark: number }[];
  summary: string;
  strengths: string[];
  gaps: string[];
};

export const SkillsRadarSection = ({ skills }: { skills: SkillsData }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Ур чадварын радар
          </h3>
          <p className="text-sm text-slate-500">
            4 чиглэлийн хүч чадлын харьцаа
          </p>
        </div>
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl">
          🎯
        </div>
      </div>

      {/* Radar chart */}
      <div className="h-56">
        <SkillsRadarChart data={skills.radarData} />
      </div>

      <p className="text-sm text-slate-500 mt-4 mb-5 leading-relaxed">
        {skills.summary}
      </p>

      {/* Strengths & Gaps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-2 flex items-center gap-1">
            <span>✓</span> Хүч чадал
          </h4>
          <div className="space-y-1.5">
            {skills.strengths.map((s) => (
              <div key={`strength-${s}`} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600 flex-shrink-0" />
                <span className="text-sm text-slate-900">{s}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-amber-600 uppercase tracking-wider mb-2 flex items-center gap-1">
            <span>↑</span> Хөгжүүлэх
          </h4>
          <div className="space-y-1.5">
            {skills.gaps.map((g) => (
              <div key={`gap-${g}`} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-600 flex-shrink-0" />
                <span className="text-sm text-slate-900">{g}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Score bars */}
      <div className="grid grid-cols-1 gap-3 mt-5 pt-5 border-t border-slate-100 sm:grid-cols-2">
        {skills.radarData.map((item) => (
          <div
            key={`radar-bar-${item.subject}`}
            className="rounded-xl bg-slate-50 p-3"
          >
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-slate-500 font-medium">{item.subject}</span>
              <span className="font-bold text-slate-900 tabular-nums">
                {item.value}%
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-br from-amber-500 to-amber-300 rounded-full transition-all duration-700"
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
