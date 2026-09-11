'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { LogoutButton } from './LogoutButton';
import { MaterialManager } from './MaterialManager';
import { AssignmentManager } from './AssignmentManager';
import { DemoRoleSwitcher } from './DemoRoleSwitcher';
import { demoApi } from '@/lib/demo-api';
import { isDemoMode } from '@/lib/demo-mode';

type ClassSummary = {
  id: string;
  name: string;
  studentCount: number;
  createdAt: string;
};
type Student = {
  id: string;
  name: string;
  phoneNumber: string;
  readingLevel: number;
  joinedAt: string;
};
type ClassDetails = { id: string; name: string; students: Student[] };
type ApiResponse<T> = { ok: boolean; data?: T; error?: { message?: string } };

const request = async <T,>(url: string, options?: RequestInit): Promise<T> => {
  if (isDemoMode()) return demoApi<T>(url, options);
  const response = await fetch(url, options);
  const result = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !result.data)
    throw new Error(result.error?.message || 'Request failed.');
  return result.data;
};

export const TeacherDashboard = ({ teacherName }: { teacherName: string }) => {
  const [classes, setClasses] = useState<ClassSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [details, setDetails] = useState<ClassDetails | null>(null);
  const [newName, setNewName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadClasses = useCallback(async () => {
    try {
      const data = await request<{ classes: ClassSummary[] }>('/api/classes');
      setClasses(data.classes);
      setSelectedId((current) =>
        current && data.classes.some((item) => item.id === current)
          ? current
          : data.classes[0]?.id || null,
      );
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'Ангиудыг ачаалж чадсангүй.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDetails = useCallback(async (classId: string) => {
    try {
      const data = await request<{ class: ClassDetails }>(
        `/api/classes/${classId}`,
      );
      setDetails(data.class);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Ангийн мэдээллийг ачаалж чадсангүй.',
      );
    }
  }, []);

  useEffect(() => {
    void loadClasses();
  }, [loadClasses]);
  useEffect(() => {
    if (selectedId) void loadDetails(selectedId);
    else setDetails(null);
  }, [selectedId, loadDetails]);

  const run = async (action: () => Promise<void>, success: string) => {
    setError('');
    setMessage('');
    try {
      await action();
      setMessage(success);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Алдаа гарлаа.');
    }
  };

  const createClass = (event: FormEvent) => {
    event.preventDefault();
    void run(async () => {
      const data = await request<{ class: ClassSummary }>('/api/classes', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      setNewName('');
      await loadClasses();
      setSelectedId(data.class.id);
    }, 'Анги үүслээ.');
  };

  const renameClass = () => {
    if (!details) return;
    const name = window.prompt('Ангийн шинэ нэр', details.name);
    if (name === null) return;
    void run(async () => {
      await request(`/api/classes/${details.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      await loadClasses();
      await loadDetails(details.id);
    }, 'Ангийн нэр шинэчлэгдлээ.');
  };

  const deleteClass = () => {
    if (!details || !window.confirm(`“${details.name}” ангийг устгах уу?`))
      return;
    void run(async () => {
      await request(`/api/classes/${details.id}`, { method: 'DELETE' });
      setSelectedId(null);
      setDetails(null);
      await loadClasses();
    }, 'Анги устгагдлаа.');
  };

  const addStudent = (event: FormEvent) => {
    event.preventDefault();
    if (!details) return;
    void run(async () => {
      await request(`/api/classes/${details.id}/students`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });
      setPhoneNumber('');
      await loadDetails(details.id);
      await loadClasses();
    }, 'Сурагч ангид нэмэгдлээ.');
  };

  const removeStudent = (student: Student) => {
    if (
      !details ||
      !window.confirm(
        `${student.phoneNumber} дугаартай сурагчийг ангиас хасах уу?`,
      )
    )
      return;
    void run(async () => {
      await request(`/api/classes/${details.id}/students/${student.id}`, {
        method: 'DELETE',
      });
      await loadDetails(details.id);
      await loadClasses();
    }, 'Сурагч ангиас хасагдлаа.');
  };

  return (
    <main className="app-page p-4 sm:p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="enter flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
              Багшийн орчин
            </span>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Сайн байна уу, {teacherName}
            </h1>
            <p className="mt-2 text-slate-500">
              Анги, сурагч болон унших материалаа нэг дор удирдана уу.
            </p>
          </div>
          {isDemoMode() ? (
            <DemoRoleSwitcher role="teacher" />
          ) : (
            <LogoutButton />
          )}
        </div>
        {error && (
          <p
            role="alert"
            className="notice-enter mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-red-700"
          >
            {error}
          </p>
        )}
        {message && (
          <p
            role="status"
            className="notice-enter mt-6 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-700"
          >
            ✓ {message}
          </p>
        )}
        <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="surface enter-delay rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Ангиуд</h2>
              <span
                aria-hidden="true"
                className="flex size-9 items-center justify-center rounded-xl bg-indigo-50"
              >
                ♧
              </span>
            </div>
            <form onSubmit={createClass} className="mt-5 flex gap-2">
              <label className="sr-only" htmlFor="new-class-name">
                Шинэ ангийн нэр
              </label>
              <input
                id="new-class-name"
                required
                maxLength={80}
                value={newName}
                onChange={(event) => setNewName(event.target.value)}
                placeholder="Жишээ: 8A"
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-indigo-500"
              />
              <button className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white shadow-sm hover:scale-[1.02] hover:bg-indigo-700">
                Нэмэх
              </button>
            </form>
            <div className="mt-5 space-y-2">
              {loading ? (
                <p
                  role="status"
                  className="animate-pulse rounded-xl bg-slate-100 p-4 text-sm text-slate-500"
                >
                  Ангиудыг ачаалж байна…
                </p>
              ) : classes.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
                  <p className="font-medium text-slate-700">
                    Одоогоор анги алга
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Шинэ анги үүсгээд эхлээрэй.
                  </p>
                </div>
              ) : (
                classes.map((item) => (
                  <button
                    key={item.id}
                    aria-pressed={selectedId === item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`interactive-card list-enter w-full rounded-xl border p-4 text-left ${selectedId === item.id ? 'border-indigo-200 bg-indigo-50 ring-2 ring-indigo-100' : 'border-transparent bg-slate-50 hover:bg-white'}`}
                  >
                    <span className="font-semibold text-slate-900">
                      {item.name}
                    </span>
                    <span className="mt-1 block text-sm text-slate-500">
                      {item.studentCount} сурагч
                    </span>
                  </button>
                ))
              )}
            </div>
          </aside>
          <section className="surface enter-delay rounded-2xl p-5 sm:p-6 md:p-8">
            {!details ? (
              <div className="py-16 text-center">
                <div
                  aria-hidden="true"
                  className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-xl"
                >
                  →
                </div>
                <p className="mt-4 font-medium text-slate-700">
                  Удирдах ангиа сонгоно уу
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Сонгосон ангийн сурагч, материал энд харагдана.
                </p>
              </div>
            ) : (
              <div key={details.id} className="enter">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-indigo-600">
                      Сонгосон анги
                    </p>
                    <h2 className="mt-1 text-2xl font-bold text-slate-900">
                      {details.name}
                    </h2>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={renameClass}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:scale-[1.02] hover:bg-slate-50"
                    >
                      Нэр солих
                    </button>
                    <button
                      onClick={deleteClass}
                      className="rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:scale-[1.02] hover:bg-red-100"
                    >
                      Устгах
                    </button>
                  </div>
                </div>
                <form
                  onSubmit={addStudent}
                  className="mt-7 flex flex-col gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 sm:flex-row"
                >
                  <label className="sr-only" htmlFor="student-phone">
                    Сурагчийн утасны дугаар
                  </label>
                  <input
                    id="student-phone"
                    required
                    value={phoneNumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                    placeholder="99112233 эсвэл +97699112233"
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
                  />
                  <button className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm hover:scale-[1.01] hover:bg-indigo-700">
                    Сурагч нэмэх
                  </button>
                </form>
                <div className="mt-6">
                  <h3 className="font-semibold text-slate-900">
                    Сурагчид{' '}
                    <span className="ml-1 rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                      {details.students.length}
                    </span>
                  </h3>
                  {details.students.length === 0 ? (
                    <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                      <p className="font-medium text-slate-700">
                        Сурагч хараахан нэмээгүй байна
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Дээрх талбарт утасны дугаарыг оруулна уу.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {details.students.map((student) => (
                        <div
                          key={student.id}
                          className="interactive-card list-enter flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <span
                              aria-hidden="true"
                              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-700"
                            >
                              {(student.name === student.phoneNumber
                                ? 'С'
                                : student.name
                              ).slice(0, 1)}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-slate-900">
                                {student.name === student.phoneNumber
                                  ? 'Шинэ сурагч'
                                  : student.name}
                              </p>
                              <p className="mt-1 text-sm text-slate-500">
                                {student.phoneNumber} · Унших түвшин{' '}
                                {student.readingLevel}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeStudent(student)}
                            aria-label={`${student.name} сурагчийг ангиас хасах`}
                            className="rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                          >
                            Хасах
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <MaterialManager classId={details.id} />
                <AssignmentManager classId={details.id} />
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};
