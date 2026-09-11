'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleLoginButton } from '@/components/Google';
import { LogIn, Eye } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { login } from '@/lib/authApi';
import { ASSESSMENT_PATH } from '@/lib/navigation';

export const AuthForm = ({
  onSwitchToRegister,
  next = ASSESSMENT_PATH,
}: {
  onSwitchToRegister: () => void;
  next?: string;
}) => {
  const router = useRouter();
  const { setSession } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token, user } = await login(email, password);
      setSession(token, user);
      router.push(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Тодорхойгүй алдаа гарлаа.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex items-center justify-center bg-white p-4">
      <div className="w-full  flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Сайн уу 👋
          </h1>
          <p className="text-sm text-slate-500">
            Бүртгэлтэй и-мэйлээрээ нэвтрэнэ үү
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <GoogleLoginButton next={next} />

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-slate-200" />
            <span className="absolute bg-white px-3 text-xs text-slate-400">
              эсвэл
            </span>
          </div>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </p>
          )}

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

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-900">
                Нууц үг
              </label>
              <button
                type="button"
                onClick={() => router.push('/Login/ForgotPassword')}
                className="text-xs text-blue-600 hover:underline"
              >
                Нууц үгээ мартсан уу?
              </button>
            </div>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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

          <label className="flex items-center gap-2 cursor-pointer select-none mt-1">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
            />
            <span className="text-sm text-slate-600">Намайг сана</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2b569a] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#22447a] active:scale-[0.99] mt-2 shadow-sm disabled:opacity-60"
          >
            <LogIn className="h-4 w-4" />
            <span>{loading ? 'Нэвтэрч байна...' : 'Нэвтрэх'}</span>
          </button>
        </form>

        <div className="flex flex-col items-center gap-3 text-sm">
          <button className="text-blue-600 hover:underline font-medium text-xs">
            Demo account
          </button>

          <p className="text-slate-500 text-xs">
            Бүртгэл байхгүй юу?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="font-bold text-slate-900 hover:underline"
            >
              Бүртгүүлэх
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
