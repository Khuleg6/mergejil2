'use client';

import { useState } from 'react';
import { mbtiQuestions } from './mbtiQuestions';
import type { Answers } from '@/lib/mbtiScoring';

const assessmentSteps = [
  { number: 1, title: 'MBTI', duration: '10 мин' },
  { number: 2, title: 'IQ', duration: '15 мин' },
  { number: 3, title: 'Ур чадвар', duration: '8 мин' },
];

/** Agreement scale — index matches LIKERT_WEIGHTS in lib/mbtiScoring. */
const likertLabels = [
  'Огт үгүй',
  'Үгүй',
  'Дунд',
  'Тийм',
  'Яг тийм',
] as const;

interface QuizCardProps {
  onComplete: (answers: Answers) => void;
}

export const QuizCard = ({ onComplete }: QuizCardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const currentQuestion = mbtiQuestions[currentIndex];
  const totalQuestions = mbtiQuestions.length;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;
  const isCase = currentQuestion.kind === 'case';

  const handleSelect = (choice: number) => {
    const nextAnswers = { ...answers, [currentQuestion.id]: choice };
    setAnswers(nextAnswers);

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((previousIndex) => previousIndex + 1);
      return;
    }

    onComplete(nextAnswers);
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentIndex(0);
  };

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-[#152238]">
      <div className="border-b border-[#e5ebf3] bg-white px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-xl items-center justify-center gap-3 sm:gap-6">
          {assessmentSteps.map((step, index) => (
            <div className="flex items-center gap-3" key={step.title}>
              {index > 0 && (
                <span className="hidden h-0.5 w-10 bg-[#dfe6ef] sm:block" />
              )}
              <div
                className={`flex items-center gap-2 rounded-xl px-3 py-2 ${
                  index === 0
                    ? 'bg-[#23477e] text-white shadow-sm'
                    : 'bg-[#f1f5f9] text-[#7c8ea8]'
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    index === 0 ? 'bg-white/20' : 'bg-[#dfe7f1]'
                  }`}
                >
                  {step.number}
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

      <section className="mx-auto flex w-full max-w-[44rem] flex-col px-5 pb-10 pt-10 sm:px-6 sm:pt-12">
        <div className="mb-8">
          <div className="mb-5 flex items-center justify-between text-sm font-semibold text-[#7386a1]">
            <button
              type="button"
              onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 transition-colors hover:text-[#23477e] disabled:cursor-not-allowed disabled:opacity-0"
            >
              <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16">
                <path
                  d="m10 3-5 5 5 5"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              Буцах
            </button>
            <span>
              {currentIndex + 1} / {totalQuestions}
            </span>
          </div>

          <div
            aria-label={`${currentIndex + 1}-р асуулт, нийт ${totalQuestions}`}
            aria-valuemax={totalQuestions}
            aria-valuemin={1}
            aria-valuenow={currentIndex + 1}
            className="h-3 overflow-hidden rounded-full bg-[#edf2f7]"
            role="progressbar"
          >
            <div
              className="h-full rounded-full bg-[#23477e] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <article className="rounded-[1.75rem] border border-[#e4eaf2] bg-white px-6 py-7 shadow-[0_14px_30px_rgba(31,56,91,0.11)] sm:px-8 sm:py-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#edf3ff] px-3 py-1.5 text-sm font-bold text-[#23477e]">
            <span className="h-2 w-2 rounded-full bg-[#23477e]" />
            Асуулт {currentIndex + 1}
          </span>
          <h1 className="mt-6 text-xl font-bold leading-snug tracking-tight text-[#152238] sm:text-2xl">
            {currentQuestion.text}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#7588a2] sm:text-base">
            {isCase
              ? 'Аль тал тань илүү ойр вэ?'
              : 'Энэ өгүүлбэр тантай хэр таарч байна вэ?'}
          </p>
        </article>

        {isCase ? (
          <div className="mt-6 space-y-3">
            {[0, 1, 2, 3, 4].map((choice) => {
              const isSelected = answers[currentQuestion.id] === choice;
              const label =
                choice === 0
                  ? currentQuestion.optionA
                  : choice === 4
                    ? currentQuestion.optionB
                    : choice === 2
                      ? 'Хоёулаа адилхан'
                      : choice === 1
                        ? `Илүүтэй: ${currentQuestion.optionA}`
                        : `Илүүтэй: ${currentQuestion.optionB}`;

              return (
                <button
                  aria-pressed={isSelected}
                  className={`flex w-full items-center gap-4 rounded-[1.2rem] border bg-white px-5 py-3 text-left text-sm font-medium text-[#1c2940] shadow-[0_4px_12px_rgba(31,56,91,0.07)] transition-all hover:-translate-y-0.5 hover:border-[#a8bfdf] hover:shadow-[0_10px_20px_rgba(31,56,91,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#23477e] sm:text-base ${
                    isSelected
                      ? 'border-[#23477e] ring-1 ring-[#23477e]'
                      : 'border-[#e3e9f1]'
                  }`}
                  key={choice}
                  onClick={() => handleSelect(choice)}
                  type="button"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0f4f8] text-sm font-bold text-[#71839d]">
                    {String.fromCharCode(65 + choice)}
                  </span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-6">
            <div className="flex items-center justify-between px-1 text-xs font-semibold text-[#7588a2] sm:text-sm">
              <span>Үгүй</span>
              <span>Тийм</span>
            </div>
            <div className="mt-2 grid grid-cols-5 gap-2 sm:gap-3">
              {likertLabels.map((label, choice) => {
                const isSelected = answers[currentQuestion.id] === choice;
                // Ends are boldest, the middle option the most neutral.
                const emphasis = [0, 1, 2, 1, 0][choice];

                return (
                  <button
                    aria-pressed={isSelected}
                    className={`flex flex-col items-center gap-2 rounded-2xl border px-1 py-4 text-xs font-semibold transition-all hover:-translate-y-0.5 hover:border-[#a8bfdf] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#23477e] sm:text-xs ${
                      isSelected
                        ? 'border-[#23477e] bg-[#edf3ff] text-[#23477e] ring-1 ring-[#23477e]'
                        : 'border-[#e3e9f1] bg-white text-[#71839d]'
                    }`}
                    key={label}
                    onClick={() => handleSelect(choice)}
                    type="button"
                  >
                    <span
                      className={`rounded-full border-2 ${
                        emphasis === 0
                          ? 'h-7 w-7'
                          : emphasis === 1
                            ? 'h-6 w-6'
                            : 'h-5 w-5'
                      } ${
                        isSelected
                          ? 'border-[#23477e] bg-[#23477e]'
                          : 'border-[#c8d5e6]'
                      }`}
                    />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <button
          className="mx-auto mt-7 w-fit text-sm font-medium text-[#7285a0] underline underline-offset-4 transition-colors hover:text-[#23477e]"
          onClick={handleRestart}
          type="button"
        >
          Тестийг дахин эхлүүлэх
        </button>
      </section>
    </main>
  );
};
