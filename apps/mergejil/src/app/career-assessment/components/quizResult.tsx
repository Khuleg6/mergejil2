'use client';

import React from 'react';
import Link from 'next/link';
import { MBTI_TYPES, FUNCTION_LABELS, type CognitiveFunction } from '@/lib/mbti';
import { COGNITIVE_FUNCTIONS, type MbtiResult } from '@/lib/mbtiScoring';

interface QuizResultProps {
  result: MbtiResult;
  xpEarned?: number;
  onRestart?: () => void;
}

export const QuizResult: React.FC<QuizResultProps> = ({
  result,
  xpEarned = 120,
  onRestart,
}) => {
  const info = MBTI_TYPES[result.type];
  const alternative = result.alternativeType
    ? MBTI_TYPES[result.alternativeType]
    : null;

  // Strongest first — the stack order is what the type is derived from.
  const rankedFunctions = [...COGNITIVE_FUNCTIONS].sort(
    (a, b) => result.scores[b] - result.scores[a],
  );

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 px-4 py-12 text-[#152238]">
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-3xl bg-[#f2eefd] shadow-sm">
          <span className="text-5xl">🧠</span>
        </div>

        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[#fef7e7] px-4 py-1.5 text-sm font-semibold text-[#f5a623]">
          <span>⭐</span>
          <span>+{xpEarned} XP олгогдлоо</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
          MBTI Тест дууслаа!
        </h1>
        <p className="mt-2 text-sm text-[#6b7280]">
          Хувийн шинжийн үнэлгээ амжилттай дууслаа
        </p>

        {/* Үндсэн үр дүн */}
        <div className="mt-8 w-full overflow-hidden rounded-2xl bg-gradient-to-t from-blue-600 to-indigo-600 p-6 text-left text-white shadow-md">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex flex-col">
              <h2 className="text-3xl font-extrabold">{result.type}</h2>
              <span className="text-sm font-medium text-blue-100">
                {info.name}
              </span>
            </div>
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-md">
              {info.tag}
            </span>
          </div>

          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-blue-200">
            байх нь {result.confidence}
          </p>

          <p className="mb-6 text-sm leading-relaxed text-blue-100">
            {info.description}
          </p>

          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-200">
            Дөрвөн хэмжүүр — {result.dichotomyType}
          </p>
          <div className="space-y-4">
            {result.dichotomies.map((pair) => (
              <div key={pair.first}>
                <div className="mb-1 flex justify-between text-xs">
                  <span>
                    {pair.firstLabel} {pair.firstPercent}%
                  </span>
                  <span>
                    {pair.secondLabel} {pair.secondPercent}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-blue-900/40">
                  <div
                    className="h-2 rounded-full bg-white transition-all"
                    style={{ width: `${pair.firstPercent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Хоёр аргачлал зөрвөл шууд хэлж өгнө — карт өөрөө өөрийгөө
            үгүйсгэж байгаа мэт харагдахаас сэргийлнэ. */}
        {result.dichotomyType !== result.type && (
          <div className="mt-3 w-full rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left">
            <p className="text-xs font-semibold text-amber-900">
              Хоёр аргачлал зөрж байна
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-amber-800">
              Энэ тест сэтгэхүйн функцээр тооцож <b>{result.type}</b> гэж
              үзлээ. Харин дээрх дөрвөн хэмжүүрийг шууд уншвал{' '}
              <b>{result.dichotomyType}</b> болно — 16personalities мэтийн
              тестүүд ийм аргаар тооцдог. Хэмжүүрүүд тань 50%-д ойрхон байвал
              ийм зөрүү гарах нь элбэг.
            </p>
          </div>
        )}

        {/* Хоёр дахь боломжит төрөл */}
        {alternative && result.alternativeType && (
          <div className="mt-3 flex w-full items-center justify-between rounded-2xl border border-[#f0f2f5] bg-white p-4 text-left shadow-sm">
            <div>
              <p className="text-xs text-[#6b7280]">Эсвэл та байж магадгүй</p>
              <p className="text-lg font-bold text-[#111827]">
                {result.alternativeType}{' '}
                <span className="text-sm font-medium text-[#6b7280]">
                  {alternative.name}
                </span>
              </p>
            </div>
            <span className="rounded-lg bg-[#f1f5f9] px-2 py-1 text-xs font-semibold text-[#64748b]">
              2-р магадлал
            </span>
          </div>
        )}

        {/* Cognitive function-ууд */}
        <div className="mt-3 w-full rounded-2xl border border-[#f0f2f5] bg-white p-4 text-left shadow-sm">
          <p className="mb-3 text-xs font-semibold text-[#6b7280]">
            Сэтгэхүйн функцүүд
          </p>
          <div className="space-y-2.5">
            {rankedFunctions.map((fn) => (
              <div key={fn}>
                <div className="mb-1 flex justify-between text-xs text-[#475569]">
                  <span>{FUNCTION_LABELS[fn as CognitiveFunction]}</span>
                  <span className="font-semibold">
                    {result.functionPercents[fn as CognitiveFunction]}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#f1f5f9]">
                  <div
                    className="h-2 rounded-full bg-[#285397]"
                    style={{
                      width: `${result.functionPercents[fn as CognitiveFunction]}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Давуу тал ба тохирох мэргэжил */}
        <div className="mt-3 grid w-full grid-cols-1 gap-3 text-left sm:grid-cols-2">
          <div className="rounded-2xl border border-[#f0f2f5] bg-white p-4 shadow-sm">
            <p className="mb-2 text-xs font-semibold text-[#6b7280]">
              Давуу тал
            </p>
            <div className="flex flex-wrap gap-1.5">
              {info.strengths.map((strength) => (
                <span
                  className="rounded-lg bg-[#eef2ff] px-2 py-1 text-xs font-medium text-[#3730a3]"
                  key={strength}
                >
                  {strength}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#f0f2f5] bg-white p-4 shadow-sm">
            <p className="mb-2 text-xs font-semibold text-[#6b7280]">
              Тохирох мэргэжил
            </p>
            <div className="flex flex-wrap gap-1.5">
              {info.careers.map((career) => (
                <span
                  className="rounded-lg bg-[#ecfdf5] px-2 py-1 text-xs font-medium text-[#047857]"
                  key={career}
                >
                  {career}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Бүх 16 төрлийн тохирол */}
        <details className="mt-3 w-full rounded-2xl border border-[#f0f2f5] bg-white p-4 text-left shadow-sm">
          <summary className="cursor-pointer text-xs font-semibold text-[#6b7280]">
            16 төрлийн тохирлыг харах
          </summary>
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
            {result.ranking.map((entry, index) => (
              <div
                className={`flex justify-between text-xs ${
                  index === 0
                    ? 'font-bold text-[#111827]'
                    : 'text-[#64748b]'
                }`}
                key={entry.type}
              >
                <span>
                  {index + 1}. {entry.type}
                </span>
                <span>{entry.percent}%</span>
              </div>
            ))}
          </div>
        </details>

        {/* Статистик */}
        <div className="mt-3 grid w-full grid-cols-3 gap-3">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#f0f2f5] bg-white p-4 shadow-sm">
            <span className="text-lg font-bold text-[#111827]">
              {result.answeredCount}/{result.totalQuestions}
            </span>
            <span className="mt-1 text-xs text-[#6b7280]">
              Хариулсан асуулт
            </span>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#f0f2f5] bg-white p-4 shadow-sm">
            <span className="text-lg font-bold text-[#111827]">
              +{xpEarned} XP
            </span>
            <span className="mt-1 text-xs text-[#6b7280]">Олгосон XP</span>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#f0f2f5] bg-white p-4 shadow-sm">
            <span className="text-lg font-bold text-[#111827]">IQ Тест</span>
            <span className="mt-1 text-xs text-[#6b7280]">
              Дараагийн модуль
            </span>
          </div>
        </div>

        <Link
          href="/iq-test"
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#285397] py-4 text-base font-semibold text-white transition-all hover:bg-[#1e4177] active:scale-[0.99]"
        >
          <span>IQ Тест эхлэх</span>
          <span>→</span>
        </Link>

        {onRestart && (
          <button
            className="mt-4 text-sm font-medium text-[#7285a0] underline underline-offset-4 transition-colors hover:text-[#23477e]"
            onClick={onRestart}
            type="button"
          >
            Тестийг дахин өгөх
          </button>
        )}
      </div>
    </div>
  );
};
