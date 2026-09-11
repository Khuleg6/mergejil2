'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  calculateFinalIQResult,
  categoryLabels,
  getNextQuestionDifficulty,
  type IQTestQuestion,
  miniIQTestQuestions,
  type TestAnswer,
  type FinalIQResult,
} from './iqTestMockData';
import { iqSubScores } from '@/lib/iqBreakdown';
import { saveIqResult } from '@/lib/assessmentApi';

interface IqModuleProps { onComplete?: (score: number) => void; }
type AnswerRecord = TestAnswer & { optionIndex: number };

const difficultyLabel = { easy: 'Хөнгөн', medium: 'Дунд', hard: 'Хүнд' };

const getNextQuestion = (shown: IQTestQuestion[], last: AnswerRecord) => {
  const remaining = miniIQTestQuestions.filter((q) => !shown.some((item) => item.id === q.id));
  const counts = shown.reduce<Record<string, number>>((all, q) => ({ ...all, [q.category]: (all[q.category] ?? 0) + 1 }), {});
  const minimum = Math.min(...Object.keys(categoryLabels).map((category) => counts[category] ?? 0));
  const categories = Object.keys(categoryLabels).filter((category) => (counts[category] ?? 0) === minimum);
  const preferred = getNextQuestionDifficulty(last);
  const candidates = remaining.filter((q) => categories.includes(q.category));
  return candidates.find((q) => q.difficulty === preferred) ?? candidates[0] ?? remaining[0];
};

const ResultCard = ({ detail, label, value }: { detail: string; label: string; value: string }) => (
  <div className="rounded-2xl border border-[#e7ecf2] bg-white px-3 py-4 shadow-sm">
    <p className="text-base font-bold">{value}</p><p className="mt-1 text-xs text-[#7386a1]">{label}</p><p className="mt-1 text-xs font-medium text-[#24944b]">{detail}</p>
  </div>
);

export const IqModule = ({ onComplete }: IqModuleProps) => {
  const [shownQuestions, setShownQuestions] = useState<IQTestQuestion[]>(() => [miniIQTestQuestions.find((q) => q.difficulty === 'medium') ?? miniIQTestQuestions[0]]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerRecord>>({});
  const [questionStartedAt, setQuestionStartedAt] = useState(() => Date.now());
  const [result, setResult] = useState<FinalIQResult>();
  const question = shownQuestions[currentIndex];
  const answer = answers[question.id];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / miniIQTestQuestions.length) * 100;
  const categories = useMemo(() => Object.entries(categoryLabels), []);

  useEffect(() => { setQuestionStartedAt(Date.now()); }, [question.id]);

  const chooseAnswer = (optionIndex: number) => {
    const timeSpentSeconds = Math.max(1, Math.round((Date.now() - questionStartedAt) / 1000));
    setAnswers((previous) => ({ ...previous, [question.id]: {
      questionId: question.id, optionIndex,
      isCorrect: optionIndex === question.correctAnswerIndex,
      timeSpentSeconds, difficulty: question.difficulty,
      timeLimitSeconds: question.timeLimitSeconds,
    } }));
  };

  // Тестийг дуусгаж, оноог категориар задалж, нэвтэрсэн хэрэглэгчийн үр дүнг
  // хадгална. Хадгалалт бүтэхгүй байсан ч үр дүнг үзүүлэхэд саад болохгүй.
  const finish = () => {
    const answerList = Object.values(answers);
    const finalResult = calculateFinalIQResult(answerList);
    const subScores = iqSubScores(miniIQTestQuestions, answerList, categoryLabels);
    const averageSeconds = Math.round(
      answerList.reduce((total, item) => total + item.timeSpentSeconds, 0) /
        (answerList.length || 1),
    );
    setResult(finalResult);
    void saveIqResult({ ...finalResult, averageSeconds, subScores });
  };

  const nextQuestion = () => {
    if (!answer) return;
    if (currentIndex < shownQuestions.length - 1) { setCurrentIndex((index) => index + 1); return; }
    if (shownQuestions.length === miniIQTestQuestions.length) { finish(); return; }
    const next = getNextQuestion(shownQuestions, answer);
    if (next) { setShownQuestions((previous) => [...previous, next]); setCurrentIndex((index) => index + 1); }
  };

  if (result) {
    const correct = Math.round((result.accuracyRate * miniIQTestQuestions.length) / 100);
    const interpretation = result.iqScore >= 115 ? 'Дунджаас дээгүүр' : result.iqScore >= 90 ? 'Дундаж' : 'Сайжруулах боломжтой';
    const averageTime = Math.round(Object.values(answers).reduce((total, item) => total + item.timeSpentSeconds, 0) / miniIQTestQuestions.length);
    return <main className="min-h-screen bg-[#f8fafc] px-4 py-8 text-[#152238]"><section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col items-center justify-center text-center"><span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#eaf3ff] text-4xl">⚡</span><span className="mt-5 rounded-full bg-[#fff8e9] px-3 py-1.5 text-xs font-bold text-[#d98b00]">☆ +150 XP олгогдлоо</span><h1 className="mt-4 text-2xl font-bold">IQ мини-тест дууслаа!</h1><p className="mt-2 text-sm text-[#7386a1]">Танин мэдэхүйн чадварын үнэлгээ</p><div className="mt-7 grid w-full grid-cols-2 gap-3"><ResultCard label="Таны IQ оноо" value={`IQ ${result.iqScore}`} detail={interpretation} /><ResultCard label="Нарийвчлал" value={`${correct}/20 зөв`} detail={`${result.accuracyRate}%`} /><ResultCard label="Сэтгэн бодох хурд" value={result.cognitiveSpeedCategory} detail={`Дунджаар ${averageTime} сек`} /><ResultCard label="Хүрсэн түвшин" value={difficultyLabel[result.difficultyLevelReached]} detail="Хурд IQ-д нөлөөлөхгүй" /></div><p className="mt-6 rounded-xl bg-white p-4 text-left text-sm leading-6 text-[#53657d] shadow-sm">IQ үнэлгээг зөв хариулт болон асуултын хүндрэлийн жингээр тооцсон. Хариулах хугацааг зөвхөн сэтгэн бодох хэв маягийг тодорхойлоход ашигласан.</p><button className="mt-6 w-full rounded-xl bg-[#23477e] px-4 py-3 text-sm font-bold text-white" onClick={() => onComplete?.(result.iqScore)} type="button">Ур чадварын тест эхлэх →</button></section></main>;
  }

  return <main className="min-h-screen bg-[#f7f9fc] text-[#152238]"><header className="border-b border-[#e5ebf3] bg-white px-3 py-2 sm:px-5"><div className="mx-auto flex max-w-3xl items-center justify-center gap-2 sm:gap-4"><div className="rounded-xl bg-[#e8f7ed] px-2.5 py-1.5 text-xs font-bold text-[#24944b]">✓ MBTI</div><div className="rounded-xl bg-[#23477e] px-2.5 py-1.5 text-xs font-bold text-white">2 IQ · 15–20 мин</div><div className="rounded-xl bg-[#f1f5f9] px-2.5 py-1.5 text-xs font-bold text-[#7c8ea8]">3 Ур чадвар</div></div></header><section className="mx-auto w-full max-w-[40rem] px-4 pb-5 pt-4 sm:px-5 sm:pt-8"><div className="mb-4 flex items-center justify-between"><div><h1 className="text-lg font-bold">⚡ IQ мини-тест</h1><p className="text-xs text-[#7386a1]">Хариултаас тань шалтгаалж дараагийн асуултын түвшин тохирно.</p></div><span className="font-bold text-[#24944b]">{answeredCount}/20</span></div><div aria-label={`${answeredCount} асуултад хариулсан`} aria-valuemax={20} aria-valuemin={0} aria-valuenow={answeredCount} className="h-2 overflow-hidden rounded-full bg-[#e8edf3]" role="progressbar"><div className="h-full rounded-full bg-[#1cab55] transition-all" style={{ width: `${progress}%` }} /></div><div className="mt-3 flex flex-wrap gap-1.5">{categories.map(([key, label]) => { const count = shownQuestions.filter((item) => item.category === key && answers[item.id]).length; return <span className={`rounded-lg px-2.5 py-1.5 text-xs font-bold ${question.category === key ? 'bg-[#23477e] text-white' : 'bg-[#eef2f7] text-[#71839d]'}`} key={key}>{label} {count}/4</span>; })}</div><article className="mt-4 rounded-2xl border border-[#e4eaf2] bg-white p-4 shadow-[0_10px_22px_rgba(31,56,91,0.1)] sm:p-5"><div className="flex items-center justify-between text-xs font-bold text-[#7386a1]"><span>{categoryLabels[question.category]} · {difficultyLabel[question.difficulty]}</span><span>{shownQuestions.length}/20</span></div><h2 className="mt-4 text-lg font-bold leading-snug sm:text-xl">{question.questionText}</h2><div className="mt-5 space-y-2.5">{question.options.map((option, index) => { const selected = answer?.optionIndex === index; return <button aria-pressed={selected} className={`flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-left transition-colors ${selected ? 'border-[#23477e] bg-[#edf3ff] ring-1 ring-[#23477e]' : 'border-[#e3e9f1] bg-white hover:border-[#a8bfdf]'}`} key={option} onClick={() => chooseAnswer(index)} type="button"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-xs">{String.fromCharCode(65 + index)}</span><span className="text-xs font-medium sm:text-sm">{option}</span></button>; })}</div></article><div className="mt-4 flex items-center justify-between"><button className="rounded-lg px-3 py-2 text-sm font-semibold text-[#7386a1] disabled:opacity-40" disabled={currentIndex === 0} onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))} type="button">← Буцах</button><span className="text-xs text-[#7386a1]">{answer ? 'Хариулт сонгосон' : 'Хариултаа сонгоно уу'}</span><button className="rounded-lg bg-[#23477e] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40" disabled={!answer} onClick={nextQuestion} type="button">{shownQuestions.length === 20 && currentIndex === 19 ? 'Дуусгах' : 'Дараах'} →</button></div></section></main>;
};
