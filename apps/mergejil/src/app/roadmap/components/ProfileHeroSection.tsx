'use client';

import React from 'react';

type MBTIDimension = {
  id: string;
  left: string;
  right: string;
  value: number;
  side: 'left' | 'right';
  label: string;
};

type MBTIData = {
  type: string;
  mongolianName: string;
  tagline: string;
  description: string;
  dimensions: MBTIDimension[];
  compatibleTypes: string[];
  workStyle: string;
  strengths?: string[];
};

const TYPE_COLORS: Record<string, string> = {
  INTJ: 'from-violet-600 to-violet-800',
  INFJ: 'from-teal-600 to-teal-800',
  ISTJ: 'from-blue-600 to-blue-800',
  ISTP: 'from-slate-600 to-slate-800',
  INTP: 'from-indigo-600 to-indigo-800',
  INFP: 'from-pink-500 to-pink-700',
  ISFJ: 'from-green-600 to-green-800',
  ISFP: 'from-emerald-500 to-emerald-700',
  ENTJ: 'from-red-600 to-red-800',
  ENFJ: 'from-orange-500 to-orange-700',
  ESTJ: 'from-blue-700 to-blue-900',
  ESTP: 'from-yellow-500 to-yellow-700',
  ENTP: 'from-amber-500 to-amber-700',
  ENFP: 'from-fuchsia-500 to-fuchsia-700',
  ESFJ: 'from-rose-500 to-rose-700',
  ESFP: 'from-orange-400 to-orange-600',
};

export const ProfileHeroSection = ({ mbti }: { mbti: MBTIData }) => {
  const gradient = TYPE_COLORS[mbti.type] || 'from-[#1b3a6b] to-blue-800';

  return (
    <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.8fr)_minmax(280px,1fr)]">
      {/* Main MBTI card */}
      <div
        className={`rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-sm relative overflow-hidden`}
      >
        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, white 0%, transparent 70%)',
            transform: 'translate(30%, -30%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-56 h-56 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, white 0%, transparent 70%)',
            transform: 'translate(-35%, 40%)',
          }}
        />

        <div className="relative z-10">
          <div
            className={`flex items-start justify-between gap-4 bg-gradient-to-br ${gradient} p-6 text-white sm:p-8`}
          >
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="text-4xl sm:text-5xl font-black tracking-tight">
                  {mbti.type}
                </span>
                <div className="px-2.5 py-1 bg-white/20 rounded-lg">
                  <span className="text-white font-bold text-sm">
                    {mbti.mongolianName}
                  </span>
                </div>
              </div>
              <p className="text-white/90 text-sm leading-6">{mbti.tagline}</p>
            </div>
            <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl">
              🧠
            </div>
          </div>

          <p className="px-6 pt-6 text-sm leading-7 text-slate-600 sm:px-8">
            {mbti.description}
          </p>

          {/* Dimension bars */}
          <div className="grid grid-cols-1 gap-3 p-6 sm:grid-cols-2 sm:p-8">
            {mbti.dimensions.map((dim) => {
              const leftPct = dim.side === 'left' ? dim.value : 100 - dim.value;
              const rightPct = 100 - leftPct;
              return (
                <div
                  key={dim.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-sm font-bold text-violet-700">
                      {dim.label}
                    </span>
                    <span className="text-2xl font-bold tabular-nums">
                      {dim.value}
                      <span className="ml-0.5 text-sm font-medium text-slate-400">
                        %
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-sm text-slate-500 mb-2">
                    <span
                      className={`tabular-nums ${dim.side === 'left' ? 'font-semibold text-violet-700' : ''}`}
                    >
                      {dim.left} {leftPct}%
                    </span>
                    <span
                      className={`tabular-nums ${dim.side === 'right' ? 'font-semibold text-violet-700' : ''}`}
                    >
                      {rightPct}% {dim.right}
                    </span>
                  </div>
                  <div className="flex h-2 rounded-full overflow-hidden bg-violet-100">
                    <div
                      className="h-full bg-violet-600 rounded-l-full transition-all duration-700"
                      style={{ width: `${leftPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-100 bg-slate-50/70 p-6 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:px-8">
            <div>
              <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">
                Ажлын хэв маяг
              </p>
              <p className="text-slate-600 text-sm leading-6">
                {mbti.workStyle}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">
                Нийцтэй төрлүүд
              </p>
              <div className="flex flex-wrap gap-1.5">
                {mbti.compatibleTypes.map((t) => (
                  <span
                    key={`compat-${t}`}
                    className="px-3 py-1 bg-white border border-violet-100 rounded-lg text-violet-700 text-sm font-semibold"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side stats */}
      <div className="grid gap-4">
        {/* Profile completeness */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            Профайлын бүрэн байдал
          </h3>
          <div className="space-y-4">
            {[
              {
                id: 'pc-mbti',
                label: 'MBTI Тест',
                pct: 100,
                color: 'bg-violet-500',
              },
              { id: 'pc-iq', label: 'IQ Тест', pct: 100, color: 'bg-blue-500' },
              {
                id: 'pc-skills',
                label: 'Ур чадвар',
                pct: 100,
                color: 'bg-amber-500',
              },
              {
                id: 'pc-learning',
                label: 'Суралцах зам',
                pct: 0,
                color: 'bg-emerald-500',
              },
            ].map((item) => (
              <div key={item.id}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-500 font-medium">
                    {item.label}
                  </span>
                  <span
                    className={`font-semibold tabular-nums ${item.pct === 100 ? 'text-green-600' : 'text-slate-500'}`}
                  >
                    {item.pct}%
                  </span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-700`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* XP card */}
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-xl">⭐</span>
            <div>
              <div className="text-3xl font-bold text-amber-600 tabular-nums">
                370 XP
              </div>
              <div className="text-sm text-slate-500">Нийт олгосон оноо</div>
            </div>
          </div>
          <div className="space-y-1">
            {[
              { id: 'xp-mbti', label: 'MBTI Тест', xp: '+120' },
              { id: 'xp-iq', label: 'IQ Тест', xp: '+150' },
              { id: 'xp-skills', label: 'Ур чадвар', xp: '+100' },
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-slate-500">{item.label}</span>
                <span className="font-semibold text-amber-500 tabular-nums">
                  {item.xp} XP
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick insight */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            Гол давуу тал
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {(mbti.strengths ?? []).map((s) => (
              <div key={`strength-${s}`} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1b3a6b] flex-shrink-0" />
                <span className="text-sm text-slate-900">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
