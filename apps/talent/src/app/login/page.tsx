'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DemoRoleSwitcher } from '@/components/DemoRoleSwitcher';
type Mode = 'teacher-login' | 'teacher-register' | 'student';
const getError = async (response: Response) =>
  ((await response.json()) as { error?: { message?: string } }).error
    ?.message || 'Алдаа гарлаа.';
export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    const isStudent = mode === 'student';
    const endpoint = isStudent
      ? '/api/auth/student/request-otp'
      : `/api/auth/teacher/${mode === 'teacher-register' ? 'register' : 'login'}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(
        isStudent ? { phoneNumber } : { name, email, password },
      ),
    });
    setBusy(false);
    if (!response.ok) {
      setError(await getError(response));
      return;
    }
    if (isStudent) {
      const result = (await response.json()) as {
        data?: { developmentOtp?: string };
      };
      sessionStorage.setItem('talent_phone_number', phoneNumber);
      if (result.data?.developmentOtp)
        sessionStorage.setItem(
          'talent_development_otp',
          result.data.developmentOtp,
        );
      router.push('/verify');
    } else {
      router.push('/teacher');
      router.refresh();
    }
  };
  const inputClass =
    'mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500';
  return (
    <main className="app-page relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10">
      <div
        aria-hidden="true"
        className="soft-float absolute -left-20 -top-20 h-72 w-72 rounded-full bg-indigo-100/70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="soft-float-delayed absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-emerald-100/60 blur-3xl"
      />
      <div className="surface enter relative w-full max-w-lg rounded-3xl p-6 md:p-10">
        <div
          aria-hidden="true"
          className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-indigo-100 font-bold text-indigo-700"
        >
          Ү
        </div>
        <p className="mt-4 text-center text-sm font-semibold tracking-widest text-indigo-600">
          ҮГНЭМ
        </p>
        <h1 className="mt-2 text-center text-3xl font-bold text-slate-900">
          Тавтай морил
        </h1>
        <p className="mt-2 text-center text-sm text-slate-500">
          Өөрийн хэсэгтээ аюулгүй нэвтэрнэ үү.
        </p>
        <div className="absolute right-5 top-5">
          <DemoRoleSwitcher />
        </div>
        <div className="mt-8 grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
          <button
            type="button"
            aria-pressed={mode === 'student'}
            onClick={() => setMode('student')}
            className={`rounded-xl px-4 py-3 font-medium ${mode === 'student' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:bg-white/60'}`}
          >
            Сурагч
          </button>
          <button
            type="button"
            aria-pressed={mode !== 'student'}
            onClick={() => setMode('teacher-login')}
            className={`rounded-xl px-4 py-3 font-medium ${mode !== 'student' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:bg-white/60'}`}
          >
            Багш
          </button>
        </div>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === 'student' ? (
            <label className="block text-sm font-medium text-slate-700">
              Утасны дугаар
              <input
                required
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                placeholder="+97699112233"
                className={inputClass}
              />
            </label>
          ) : (
            <>
              {mode === 'teacher-register' && (
                <label className="block text-sm font-medium text-slate-700">
                  Нэр
                  <input
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className={inputClass}
                  />
                </label>
              )}
              <label className="block text-sm font-medium text-slate-700">
                Имэйл
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Нууц үг
                <input
                  required
                  minLength={8}
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={inputClass}
                />
              </label>
            </>
          )}
          {error && (
            <p
              role="alert"
              className="notice-enter rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}
          <button
            disabled={busy}
            className="w-full rounded-xl bg-indigo-600 px-6 py-4 font-semibold text-white shadow-sm hover:scale-[1.01] hover:bg-indigo-700 hover:shadow-md disabled:bg-slate-300"
          >
            {busy
              ? 'Түр хүлээнэ үү…'
              : mode === 'student'
                ? 'Код авах'
                : mode === 'teacher-register'
                  ? 'Бүртгүүлэх'
                  : 'Нэвтрэх'}
          </button>
        </form>
        {mode !== 'student' && (
          <button
            type="button"
            onClick={() =>
              setMode(
                mode === 'teacher-login' ? 'teacher-register' : 'teacher-login',
              )
            }
            className="mt-5 w-full rounded-lg py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
          >
            {mode === 'teacher-login'
              ? 'Шинэ багшийн бүртгэл үүсгэх'
              : 'Бүртгэлтэй бол нэвтрэх'}
          </button>
        )}
      </div>
    </main>
  );
}
