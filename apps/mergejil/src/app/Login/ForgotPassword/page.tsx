'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound, Eye } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { requestPasswordReset, confirmPasswordReset } from '@/lib/authApi';

type Step = 'email' | 'reset';

export const ForgotPassword = () => {
  const router = useRouter();
  const { setSession } = useAuth();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setInfo('И-мэйл рүү сэргээх код илгээгдлээ. Ирсэн кодоо доор оруулна уу.');
      setStep('reset');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Тодорхойгүй алдаа гарлаа.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token, user } = await confirmPasswordReset(email, code, newPassword);
      setSession(token, user);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Тодорхойгүй алдаа гарлаа.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-[440px] flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-900">Нууц үг сэргээх</h1>
          <p className="text-sm text-slate-500">
            {step === 'email'
              ? 'Бүртгэлтэй и-мэйл хаягаа оруулна уу'
              : 'И-мэйл хаягтаа ирсэн кодоо оруулна уу'}
          </p>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </p>
        )}
        {info && !error && (
          <p className="rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
            {info}
          </p>
        )}

        {step === 'email' ? (
          <form className="flex flex-col gap-4" onSubmit={handleRequestCode}>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-900">
                И-мэйл хаяг
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="demo@mergejil.mn"
                className="w-full rounded-xl bg-[#eef2ff]/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2b569a] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#22447a] active:scale-[0.99] mt-2 shadow-sm disabled:opacity-60"
            >
              <span>{loading ? 'Илгээж байна...' : 'Код илгээх'}</span>
            </button>
          </form>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleReset}>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-900">
                Сэргээх код
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                placeholder="000000"
                className="w-full rounded-xl bg-[#eef2ff]/60 px-4 py-3 text-sm tracking-[0.3em] text-slate-800 outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-900">
                Шинэ нууц үг
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-[#eef2ff]/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2b569a] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#22447a] active:scale-[0.99] mt-2 shadow-sm disabled:opacity-60"
            >
              <KeyRound className="h-4 w-4" />
              <span>{loading ? 'Шинэчилж байна...' : 'Нууц үг шинэчлэх'}</span>
            </button>

            <button
              type="button"
              onClick={() => setStep('email')}
              className="text-xs text-slate-500 hover:underline"
            >
              И-мэйл хаяг буруу байна уу? Дахин оруулах
            </button>
          </form>
        )}

        <button
          type="button"
          onClick={() => router.push('/Login')}
          className="text-center text-xs font-bold text-slate-900 hover:underline"
        >
          Нэвтрэх хуудас руу буцах
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
