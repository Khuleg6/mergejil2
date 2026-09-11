'use client';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { demoApi } from '@/lib/demo-api';
import { isDemoMode } from '@/lib/demo-mode';
type Phase = 'PREDICT' | 'CONFIRM' | 'APPLY';
type Response = {
  id: string;
  vocabWordId: string;
  phase: Phase;
  text: string;
  grade: number | null;
  feedback: string | null;
  submittedAt: string;
};
type Assignment = {
  id: string;
  status: string;
  dueAt: string | null;
  phase1Unlocked: boolean;
  phase2Unlocked: boolean;
  phase3Unlocked: boolean;
  material: { title: string; bodyText: string };
  vocabulary: { vocabWord: { id: string; word: string } }[];
  responses: Response[];
};
type Envelope<T> = { data?: T; error?: { message?: string } };
const labels: Record<Phase, string> = {
  PREDICT: '1. Таамаглах',
  CONFIRM: '2. Бататгах',
  APPLY: '3. Хэрэглэх',
};
export const StudentAssignments = () => {
  const [items, setItems] = useState<Assignment[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const load = useCallback(async () => {
    try {
      if (isDemoMode()) {
        const body = await demoApi<{ assignments: Assignment[] }>(
          '/api/student/assignments',
        );
        setItems(body.assignments);
        return;
      }
      const response = await fetch('/api/student/assignments');
      const body = (await response.json()) as Envelope<{
        assignments: Assignment[];
      }>;
      if (!response.ok || !body.data)
        throw new Error(body.error?.message || 'Даалгавар ачаалж чадсангүй.');
      setItems(body.data.assignments);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Алдаа гарлаа.');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  const submit = (
    event: FormEvent,
    assignmentId: string,
    wordId: string,
    phase: Phase,
  ) => {
    event.preventDefault();
    const key = `${assignmentId}:${wordId}:${phase}`;
    void (async () => {
      setError('');
      setMessage('');
      if (isDemoMode()) {
        await demoApi(`/api/assignments/${assignmentId}/responses`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ wordId, phase, text: answers[key] || '' }),
        });
        setAnswers((current) => ({ ...current, [key]: '' }));
        setMessage('Хариулт хадгалагдлаа.');
        await load();
        return;
      }
      const response = await fetch(
        `/api/assignments/${assignmentId}/responses`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ wordId, phase, text: answers[key] || '' }),
        },
      );
      const body = (await response.json()) as Envelope<unknown>;
      if (!response.ok) {
        setError(body.error?.message || 'Хариулт илгээж чадсангүй.');
        return;
      }
      setAnswers((current) => ({ ...current, [key]: '' }));
      setMessage('Хариулт хадгалагдлаа.');
      await load();
    })();
  };
  if (loading)
    return (
      <section
        className="surface enter-delay mt-8 max-w-3xl animate-pulse rounded-2xl p-8 text-slate-500"
        role="status"
      >
        Даалгавар ачаалж байна…
      </section>
    );
  return (
    <div className="mt-8 max-w-4xl">
      {error && (
        <p
          role="alert"
          className="notice-enter mb-4 rounded-xl bg-red-50 p-4 text-red-700"
        >
          {error}
        </p>
      )}
      {message && (
        <p
          role="status"
          className="notice-enter mb-4 rounded-xl bg-emerald-50 p-4 text-emerald-700"
        >
          ✓ {message}
        </p>
      )}
      {items.length === 0 ? (
        <section className="surface enter-delay rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-slate-900">
            Идэвхтэй даалгавар алга
          </h2>
          <p className="mt-2 text-slate-500">
            Багш шинэ даалгавар идэвхжүүлэх үед энд харагдана.
          </p>
        </section>
      ) : (
        items.map((assignment) => (
          <article
            key={assignment.id}
            className="surface enter mb-6 rounded-2xl p-5 sm:p-7"
          >
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                  ИДЭВХТЭЙ
                </span>
                <h2 className="mt-3 text-xl font-bold text-slate-900">
                  {assignment.material.title}
                </h2>
              </div>
              {assignment.dueAt && (
                <p className="text-sm text-slate-500">
                  Дуусах: {new Date(assignment.dueAt).toLocaleString('mn-MN')}
                </p>
              )}
            </div>
            <p className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 leading-7 text-slate-700">
              {assignment.material.bodyText}
            </p>
            <div className="mt-6 space-y-5">
              {assignment.vocabulary.map(({ vocabWord }) => (
                <section
                  key={vocabWord.id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <h3 className="text-lg font-bold text-indigo-700">
                    {vocabWord.word}
                  </h3>
                  <div className="mt-4 grid gap-3 lg:grid-cols-3">
                    {(['PREDICT', 'CONFIRM', 'APPLY'] as Phase[]).map(
                      (phase, index) => {
                        const existing = assignment.responses.find(
                          (r) =>
                            r.vocabWordId === vocabWord.id && r.phase === phase,
                        );
                        const unlocked =
                          phase === 'PREDICT'
                            ? assignment.phase1Unlocked
                            : phase === 'CONFIRM'
                              ? assignment.phase2Unlocked
                              : assignment.phase3Unlocked;
                        const prerequisite =
                          index === 0 ||
                          assignment.responses.some(
                            (r) =>
                              r.vocabWordId === vocabWord.id &&
                              r.phase === (index === 1 ? 'PREDICT' : 'CONFIRM'),
                          );
                        const key = `${assignment.id}:${vocabWord.id}:${phase}`;
                        return (
                          <div
                            key={phase}
                            className={`rounded-xl border p-4 ${unlocked && prerequisite ? 'border-indigo-100 bg-indigo-50/50' : 'border-slate-200 bg-slate-50'}`}
                          >
                            <p className="text-sm font-bold text-slate-700">
                              {labels[phase]}
                            </p>
                            {existing ? (
                              <div className="mt-3">
                                <p className="text-sm leading-6 text-slate-700">
                                  {existing.text}
                                </p>
                                <p className="mt-2 text-xs text-slate-400">
                                  Илгээсэн · засах боломжгүй
                                </p>
                                {phase !== 'PREDICT' &&
                                  existing.grade !== null && (
                                    <div className="mt-3 rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                                      <p className="text-sm font-bold text-emerald-800">
                                        Grade: {existing.grade}/
                                        {phase === 'CONFIRM' ? 4 : 5}
                                      </p>
                                      <p className="mt-1 text-sm text-emerald-700">
                                        {existing.feedback}
                                      </p>
                                    </div>
                                  )}
                              </div>
                            ) : unlocked && prerequisite ? (
                              <form
                                onSubmit={(e) =>
                                  submit(e, assignment.id, vocabWord.id, phase)
                                }
                              >
                                <label className="sr-only" htmlFor={key}>
                                  {labels[phase]} хариулт
                                </label>
                                <textarea
                                  id={key}
                                  required
                                  maxLength={5000}
                                  rows={4}
                                  value={answers[key] || ''}
                                  onChange={(e) =>
                                    setAnswers((current) => ({
                                      ...current,
                                      [key]: e.target.value,
                                    }))
                                  }
                                  className="mt-3 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-indigo-500"
                                  placeholder={
                                    phase === 'APPLY'
                                      ? 'Энэ үгээр өгүүлбэр зохионо уу.'
                                      : 'Өөрийн үгээр бичнэ үү.'
                                  }
                                />
                                <button className="mt-2 w-full rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white">
                                  Хариулт илгээх
                                </button>
                              </form>
                            ) : (
                              <p className="mt-3 text-sm text-slate-500">
                                {!unlocked
                                  ? 'Түгжээтэй'
                                  : 'Өмнөх алхмыг дуусгана уу.'}
                              </p>
                            )}
                          </div>
                        );
                      },
                    )}
                  </div>
                </section>
              ))}
            </div>
          </article>
        ))
      )}
    </div>
  );
};
