'use client';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { demoApi } from '@/lib/demo-api';
import { isDemoMode } from '@/lib/demo-mode';

type Summary = {
  id: string;
  materialTitle: string;
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED';
  wordCount: number;
  responseCount: number;
  phase1Unlocked: boolean;
  phase2Unlocked: boolean;
  phase3Unlocked: boolean;
};
type Material = {
  id: string;
  title: string;
  vocabWords: { id: string; word: string; position: number }[];
};
type Detail = Summary & {
  vocabulary: { vocabWord: { id: string; word: string } }[];
  class: {
    students: {
      student: {
        id: string;
        user: { name: string };
        responses: {
          id: string;
          vocabWordId: string;
          phase: string;
          text: string;
          grade: number | null;
          feedback: string | null;
          submittedAt: string;
        }[];
      };
    }[];
  };
};
type Envelope<T> = { data?: T; error?: { message?: string } };
const api = async <T,>(url: string, options?: RequestInit) => {
  if (isDemoMode()) return demoApi<T>(url, options);
  const response = await fetch(url, options);
  const body = (await response.json()) as Envelope<T>;
  if (!response.ok || !body.data)
    throw new Error(body.error?.message || 'Алдаа гарлаа.');
  return body.data;
};

export const AssignmentManager = ({ classId }: { classId: string }) => {
  const [items, setItems] = useState<Summary[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [materialId, setMaterialId] = useState('');
  const [wordIds, setWordIds] = useState<string[]>([]);
  const [dueAt, setDueAt] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const load = useCallback(async () => {
    try {
      const [{ assignments }, { materials: summaries }] = await Promise.all([
        api<{ assignments: Summary[] }>(`/api/classes/${classId}/assignments`),
        api<{ materials: { id: string; title: string }[] }>(
          `/api/classes/${classId}/materials`,
        ),
      ]);
      setItems(assignments);
      const loaded = await Promise.all(
        summaries.map(
          async (item) =>
            (await api<{ material: Material }>(`/api/materials/${item.id}`))
              .material,
        ),
      );
      setMaterials(loaded);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ачаалж чадсангүй.');
    }
  }, [classId]);
  useEffect(() => {
    setDetail(null);
    void load();
  }, [load]);
  const open = async (id: string) => {
    try {
      setDetail(
        (await api<{ assignment: Detail }>(`/api/assignments/${id}`))
          .assignment,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Нээж чадсангүй.');
    }
  };
  const act = async (action: () => Promise<void>, success: string) => {
    setError('');
    setMessage('');
    try {
      await action();
      setMessage(success);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Алдаа гарлаа.');
    }
  };
  const create = (event: FormEvent) => {
    event.preventDefault();
    void act(async () => {
      await api(`/api/classes/${classId}/assignments`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ materialId, wordIds, dueAt: dueAt || null }),
      });
      setMaterialId('');
      setWordIds([]);
      setDueAt('');
      await load();
    }, 'Даалгавар ноорог төлөвөөр үүслээ.');
  };
  const updateStatus = (status: Summary['status']) =>
    detail &&
    void act(async () => {
      await api(`/api/assignments/${detail.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      await load();
      await open(detail.id);
    }, 'Төлөв шинэчлэгдлээ.');
  const phase = (key: 'PREDICT' | 'CONFIRM' | 'APPLY', unlocked: boolean) =>
    detail &&
    void act(async () => {
      await api(`/api/assignments/${detail.id}/phases`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ phase: key, unlocked }),
      });
      await load();
      await open(detail.id);
    }, 'Үе шат шинэчлэгдлээ.');
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const gradeResponse = (event: FormEvent, responseId: string) => {
    event.preventDefault();
    if (!detail) return;
    void act(async () => {
      await api(`/api/assignments/${detail.id}/responses`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          responseId,
          grade: Number(grades[responseId]),
          feedback: feedback[responseId] || '',
        }),
      });
      await open(detail.id);
    }, 'Grade and feedback saved.');
  };
  const chosen = materials.find((item) => item.id === materialId);
  return (
    <div className="mt-8 border-t border-slate-200 pt-7">
      <h3 className="text-lg font-bold text-slate-900">Даалгавар</h3>
      <p className="mt-1 text-sm text-slate-500">
        Материалын сонгосон үгсээр гурван үе шаттай ажил үүсгэнэ.
      </p>
      {error && (
        <p
          role="alert"
          className="notice-enter mt-4 rounded-xl bg-red-50 p-3 text-red-700"
        >
          {error}
        </p>
      )}
      {message && (
        <p
          role="status"
          className="notice-enter mt-4 rounded-xl bg-emerald-50 p-3 text-emerald-700"
        >
          ✓ {message}
        </p>
      )}
      <form
        onSubmit={create}
        className="mt-5 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2"
      >
        <label className="text-sm font-semibold text-slate-700">
          Материал
          <select
            required
            value={materialId}
            onChange={(e) => {
              setMaterialId(e.target.value);
              setWordIds([]);
            }}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3"
          >
            <option value="">Сонгох</option>
            {materials.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Дуусах хугацаа (заавал биш)
          <input
            type="datetime-local"
            value={dueAt}
            onChange={(e) => setDueAt(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3"
          />
        </label>
        <fieldset className="sm:col-span-2">
          <legend className="text-sm font-semibold text-slate-700">
            Зорилтот үгс
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {!chosen ? (
              <span className="text-sm text-slate-500">
                Эхлээд материал сонгоно уу.
              </span>
            ) : chosen.vocabWords.length === 0 ? (
              <span className="text-sm text-amber-700">
                Энэ материалд сонгосон үг алга.
              </span>
            ) : (
              chosen.vocabWords.map((word) => (
                <label
                  key={word.id}
                  className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={wordIds.includes(word.id)}
                    onChange={() =>
                      setWordIds((ids) =>
                        ids.includes(word.id)
                          ? ids.filter((id) => id !== word.id)
                          : [...ids, word.id],
                      )
                    }
                  />
                  {word.word}
                </label>
              ))
            )}
          </div>
        </fieldset>
        <button
          disabled={!materialId || !wordIds.length}
          className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white disabled:bg-slate-300 sm:col-span-2"
        >
          Ноорог даалгавар үүсгэх
        </button>
      </form>
      <div className="mt-5 flex flex-wrap gap-2">
        {items.length === 0 ? (
          <p className="text-sm text-slate-500">Даалгавар алга.</p>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              onClick={() => void open(item.id)}
              className={`interactive-card rounded-xl border px-4 py-3 text-left ${detail?.id === item.id ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200'}`}
            >
              <strong>{item.materialTitle}</strong>
              <span className="ml-2 text-xs text-slate-500">
                {item.status} · {item.wordCount} үг
              </span>
            </button>
          ))
        )}
      </div>
      {detail && (
        <div className="enter mt-5 rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h4 className="font-bold text-slate-900">{detail.materialTitle}</h4>
            <select
              aria-label="Даалгаврын төлөв"
              value={detail.status}
              onChange={(e) =>
                updateStatus(e.target.value as Summary['status'])
              }
              className="rounded-xl border border-slate-200 bg-white px-3 py-2"
            >
              <option value="DRAFT">Ноорог</option>
              <option value="ACTIVE">Идэвхтэй</option>
              <option value="CLOSED">Хаалттай</option>
            </select>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {(
              [
                ['PREDICT', 'Таамаглах', 'phase1Unlocked'],
                ['CONFIRM', 'Бататгах', 'phase2Unlocked'],
                ['APPLY', 'Хэрэглэх', 'phase3Unlocked'],
              ] as const
            ).map(([code, label, field]) => (
              <button
                key={code}
                onClick={() => phase(code, !detail[field])}
                className={`rounded-xl border p-3 text-sm font-semibold ${detail[field] ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-white text-slate-600'}`}
              >
                {label}: {detail[field] ? 'Нээлттэй' : 'Түгжээтэй'}
              </button>
            ))}
          </div>
          <div className="mt-5 space-y-4">
            {detail.class.students.map(({ student }) => (
              <div key={student.id} className="rounded-xl bg-white p-4">
                <h5 className="font-semibold text-slate-900">
                  {student.user.name}
                </h5>
                <div className="mt-3 space-y-3">
                  {detail.vocabulary.map(({ vocabWord }) => (
                    <section
                      key={vocabWord.id}
                      className="rounded-xl border border-slate-100 p-3"
                    >
                      <p className="font-semibold text-indigo-700">
                        {vocabWord.word}
                      </p>
                      <div className="mt-2 grid gap-3 md:grid-cols-3">
                        {['PREDICT', 'CONFIRM', 'APPLY'].map((p) => {
                          const response = student.responses.find(
                            (r) =>
                              r.phase === p && r.vocabWordId === vocabWord.id,
                          );
                          return (
                            <div key={p} className="rounded-xl bg-slate-50 p-3">
                              <p className="text-xs font-bold text-slate-500">
                                {p}
                              </p>
                              {response ? (
                                <>
                                  <p className="mt-2 text-sm text-slate-700">
                                    {response.text}
                                    <span className="mt-1 block text-xs text-slate-400">
                                      {new Date(
                                        response.submittedAt,
                                      ).toLocaleString('mn-MN')}
                                    </span>
                                  </p>
                                  {p !== 'PREDICT' && (
                                    <form
                                      onSubmit={(event) =>
                                        gradeResponse(event, response.id)
                                      }
                                      className="mt-3 space-y-2 border-t border-slate-200 pt-3"
                                    >
                                      <label className="block text-xs font-semibold text-slate-600">
                                        Grade (0–{p === 'CONFIRM' ? 4 : 5})
                                        <input
                                          type="number"
                                          required
                                          min={0}
                                          max={p === 'CONFIRM' ? 4 : 5}
                                          step={1}
                                          value={
                                            grades[response.id] ??
                                            response.grade ??
                                            ''
                                          }
                                          onChange={(event) =>
                                            setGrades((current) => ({
                                              ...current,
                                              [response.id]: event.target.value,
                                            }))
                                          }
                                          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2"
                                        />
                                      </label>
                                      <label className="block text-xs font-semibold text-slate-600">
                                        Feedback
                                        <textarea
                                          required
                                          maxLength={2000}
                                          rows={3}
                                          value={
                                            feedback[response.id] ??
                                            response.feedback ??
                                            ''
                                          }
                                          onChange={(event) =>
                                            setFeedback((current) => ({
                                              ...current,
                                              [response.id]: event.target.value,
                                            }))
                                          }
                                          className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2"
                                        />
                                      </label>
                                      <button className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white">
                                        Save grade
                                      </button>
                                    </form>
                                  )}
                                </>
                              ) : (
                                <p className="mt-2 text-sm text-slate-400">
                                  Илгээгээгүй
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
