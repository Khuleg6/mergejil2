'use client';

import { useState } from 'react';
import Link from 'next/link';
import { skillsQuestions } from './skillsTestData';
import {
  SKILL_CATEGORIES,
  calculateSkillsResult,
  type SkillsResult,
} from '@/lib/skillsScoring';
import { saveSkillsResult } from '@/lib/assessmentApi';

// Асуултын `category` талбартай ижил түлхүүрүүд — оноо тооцох сангаас авна.
const categories = SKILL_CATEGORIES;

const steps = [
  { title: 'MBTI', duration: '10 мин' },
  { title: 'IQ', duration: '15 мин' },
  { title: 'Ур чадвар', duration: '8–10 мин' },
];

export const SkillsModule = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<SkillsResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const question = skillsQuestions[currentIndex];
  const selectedAnswer = answers[question.id];
  const answeredCount = Object.keys(answers).length;
  const categoryAnswered = (category: string) =>
    skillsQuestions.filter(
      (item) => item.category === category && answers[item.id] !== undefined,
    ).length;
  const categoryTotal = (category: string) =>
    skillsQuestions.filter((item) => item.category === category).length;

  const nextQuestion = () => {
    if (currentIndex < skillsQuestions.length - 1) {
      setCurrentIndex((index) => index + 1);
    }
  };

  // Тестийг дуусгаж, 6 чиглэлийн оноог тооцоод хадгална. Хадгалалт бүтэхгүй
  // байсан ч үр дүнг үзүүлэхэд саад болохгүй.
  const saveResult = async (skillsResult: SkillsResult) => {
    setIsSaving(true);
    setSaveFailed(false);
    const saved = await saveSkillsResult(skillsResult);
    setIsSaving(false);
    setSaveFailed(!saved);
  };

  const finish = () => {
    const skillsResult = calculateSkillsResult(skillsQuestions, answers);
    setResult(skillsResult);
    void saveResult(skillsResult);
  };

  if (result) {
    return (
      <main className="min-h-screen bg-[#f8fafc] px-4 py-10 text-[#152238]">
        <section className="mx-auto flex max-w-lg flex-col items-center text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#fff1bd] text-4xl">
            🎯
          </span>
          <span className="mt-5 rounded-full bg-[#fff8e9] px-3 py-1.5 text-xs font-bold text-[#d98b00]">
            ☆ +100 XP олгогдлоо
          </span>
          <h1 className="mt-4 text-2xl font-bold">Ур чадварын тест дууслаа!</h1>
          <p className="mt-2 text-sm text-[#7386a1]">
            {result.answeredCount}/{result.totalQuestions} асуултад хариулсан ·
            ерөнхий үнэлгээ {result.overallPercent}%
          </p>

          <div className="mt-7 w-full space-y-3">
            {result.categories.map((category) => (
              <div
                className="rounded-2xl border border-[#e7ecf2] bg-white p-4 text-left shadow-sm"
                key={category.key}
              >
                <div className="flex items-center justify-between text-sm font-bold">
                  <span>{category.label}</span>
                  <span className="text-[#23477e]">{category.percent}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#edf2f7]">
                  <div
                    className="h-full rounded-full bg-[#23477e]"
                    style={{ width: `${category.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 w-full rounded-2xl bg-white p-4 text-left text-sm shadow-sm">
            <p className="font-bold">Хүчтэй тал</p>
            <p className="mt-1 text-[#53657d]">
              {result.strengths.join(', ')}
            </p>
            <p className="mt-3 font-bold">Хөгжүүлэх тал</p>
            <p className="mt-1 text-[#53657d]">{result.gaps.join(', ')}</p>
          </div>

          {isSaving && (
            <p className="mt-6 text-sm font-medium text-[#53657d]">
              Үр дүнг хадгалж байна…
            </p>
          )}
          {saveFailed && (
            <div className="mt-6 w-full rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <p>Үр дүн хадгалагдсангүй. Нэвтрэлт болон сүлжээгээ шалгаад дахин оролдоно уу.</p>
              <button
                className="mt-3 rounded-lg bg-[#23477e] px-3 py-2 text-xs font-bold text-white"
                onClick={() => void saveResult(result)}
                type="button"
              >
                Дахин хадгалах
              </button>
            </div>
          )}
          {!isSaving && !saveFailed && (
            <Link
              className="mt-6 w-full rounded-xl bg-[#23477e] px-4 py-3 text-sm font-bold text-white"
              href="/roadmap"
            >
              AI карьерийн профайлаа харах →
            </Link>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#152238]">
      <header className="border-y border-[#e5eaf1] bg-white px-3 py-2 sm:px-6">
        <div className="mx-auto flex max-w-[104rem] items-center justify-center">
          <div className="hidden items-center gap-2 text-[#23477e] md:absolute md:left-6 md:flex">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#23477e] text-xl text-[#ffb31a]"></span>
            <span className="font-bold">Мэргэжил.мн</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {steps.map((step, index) => (
              <div className="flex items-center gap-2" key={step.title}>
                {index > 0 && (
                  <span className="hidden h-0.5 w-8 bg-[#20ad55] sm:block" />
                )}
                <div
                  className={`flex items-center gap-2 rounded-xl px-2.5 py-1.5 ${index === 2 ? 'bg-[#23477e] text-white' : 'bg-[#e8f7ed] text-[#24944b]'}`}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${index === 2 ? 'bg-white/20' : 'bg-[#bceecb] text-[#16893f]'}`}
                  >
                    {index === 2 ? 3 : '✓'}
                  </span>
                  <span className="leading-tight">
                    <span className="block text-xs font-bold sm:text-sm">
                      {step.title}
                    </span>
                    <span className="block text-xs font-medium opacity-80 sm:text-xs">
                      {step.duration}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-[40rem] px-4 pb-5 pt-4 sm:px-5 sm:pt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff1bd] text-base">
              🎯
            </span>
            <div>
              <h1 className="text-lg font-bold">Ур чадварын тест</h1>
              <p className="text-xs text-[#7386a1]">
                24 нөхцөлт асуултаар ур чадвараа танина
              </p>
            </div>
          </div>
          <span className="text-right text-xs font-bold text-[#23477e]">
            {currentIndex + 1} / {skillsQuestions.length}
            <small className="block font-normal text-[#7386a1]">асуулт</small>
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {categories.map((category) => {
            const isActive = question.category === category.key;
            return (
              <div
                className={`rounded-xl border bg-white p-3 ${isActive ? 'border-[#6d88b4] bg-[#f3f6fc]' : 'border-[#e6ebf2]'}`}
                key={category.key}
              >
                <p className="text-xs font-bold">
                  {category.icon} {category.label}
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#edf2f7]">
                  <div
                    className="h-full rounded-full bg-[#23477e]"
                    style={{
                      width: `${(categoryAnswered(category.key) / categoryTotal(category.key)) * 100}%`,
                    }}
                  />
                </div>
                <p className="mt-1.5 text-xs text-[#71839d]">
                  {categoryAnswered(category.key)}/{categoryTotal(category.key)}
                </p>
              </div>
            );
          })}
        </div>

        <article className="mt-4 rounded-2xl border border-[#e7ecf2] bg-white p-4 shadow-[0_10px_22px_rgba(31,56,91,0.1)] sm:p-5">
          <div className="flex items-center justify-between border-b border-[#e9eef4] pb-3">
            <span className="rounded-full bg-[#e8f0ff] px-2.5 py-1 text-xs font-bold text-[#2860c1]">
              {
                categories.find(
                  (category) => category.key === question.category,
                )?.icon
              }{' '}
              {
                categories.find(
                  (category) => category.key === question.category,
                )?.label
              }
            </span>
            <span className="text-sm font-bold text-[#23477e]">
              {currentIndex + 1}/{skillsQuestions.length}
            </span>
          </div>
          <h2 className="mt-4 text-lg font-bold leading-snug sm:text-xl">
            {question.text}
          </h2>
          <div className="mt-5 space-y-2.5">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === option.value;
              return (
                <button
                  aria-pressed={isSelected}
                    className={`w-full rounded-xl border px-4 py-3 text-left transition ${isSelected ? 'border-[#23477e] bg-[#f2f6ff] ring-1 ring-[#23477e]' : 'border-[#e1e7ef] hover:border-[#9bb2d4]'}`}
                  key={option.id}
                  onClick={() =>
                    {
                      setAnswers((previous) => ({
                        ...previous,
                        [question.id]: option.value ?? 0,
                      }));
                      if (currentIndex < skillsQuestions.length - 1) {
                        setCurrentIndex((previous) => previous + 1);
                      }
                    }
                  }
                  type="button"
                >
                  <span className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f0f4f8] text-xs font-bold text-[#71839d]">
                      {index + 1}
                    </span>
                    <span className="block text-xs font-medium sm:text-sm">
                      {option.text}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </article>

        <div className="mt-4 flex items-center justify-between">
          <button
            className="rounded-lg px-3 py-2 text-sm font-semibold text-[#7386a1] disabled:opacity-40"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
            type="button"
          >
            ← Буцах
          </button>
          <span className="text-xs text-[#7386a1]">
            {answeredCount} / {skillsQuestions.length} хариулсан
          </span>
          {currentIndex === skillsQuestions.length - 1 ? (
            <button
              className="rounded-lg bg-[#1cab55] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
              disabled={answeredCount < skillsQuestions.length}
              onClick={finish}
              type="button"
            >
              Дуусгах ✓
            </button>
          ) : (
            <button
              className="rounded-lg bg-[#23477e] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
              disabled={selectedAnswer === undefined}
              onClick={nextQuestion}
              type="button"
            >
              Дараагийн →
            </button>
          )}
        </div>
      </section>
    </main>
  );
};
