'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GoogleLoginButton } from '@/components/Google';
import { UserPlus, Eye } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { signup } from '@/lib/authApi';
import { ASSESSMENT_PATH } from '@/lib/navigation';

export const SignUp = ({
  onSwitchToLogin,
  next = ASSESSMENT_PATH,
}: {
  onSwitchToLogin: () => void;
  next?: string;
}) => {
  const router = useRouter();
  const { setSession } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!agreed) {
      setError('Үйлчилгээний нөхцөл болон Нууцлалын бодлогыг зөвшөөрнө үү.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Нууц үг таарахгүй байна.');
      return;
    }

    setLoading(true);
    try {
      const fullName = [lastName, firstName].filter(Boolean).join(' ').trim();
      const { token, user } = await signup(fullName, email, password);
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
      <div className="w-full  flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-900">Бүртгүүлэх</h1>
          <p className="text-xs text-slate-500">
            33 минутын үнэлгээгээ эхлүүлэхэд бүртгэл шаардлагатай
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <GoogleLoginButton next={next} />

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-slate-200" />
            <span className="absolute bg-white px-3 text-[11px] text-slate-400">
              эсвэл
            </span>
          </div>
        </div>

        <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs font-bold text-slate-900">Овог</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Дорж"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs font-bold text-slate-900">Нэр</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="Батболд"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-900">
              И-мэйл хаяг
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="та@example.mn"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-900">
              Сурагч/Ажилтан
            </label>
            <span className="text-[11px] text-slate-400">
              Таны одоогийн байдал
            </span>
            <select
              defaultValue=""
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer"
            >
              <option value="" disabled hidden>
                — Сонгоно уу —
              </option>
              <option value="9">9-р анги</option>
              <option value="10">10-р анги</option>
              <option value="11">11-р анги</option>
              <option value="12">12-р анги</option>
              <option value="student">Их сургуулийн оюутан</option>
              <option value="worker">Ажилтан (карьер өөрчлөлт)</option>
              <option value="other">Бусад</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-900">Нууц үг</label>
            <span className="text-[11px] text-slate-400">
              Дор хаяж 8 тэмдэгт, том үсэг болон тоо агуулсан байх
            </span>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-blue-600 focus:ring-1 focus:ring-blue-600 pr-10"
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

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-900">
              Нууц үг давтах
            </label>
            <div className="relative flex items-center">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-blue-600 focus:ring-1 focus:ring-blue-600 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>

          <label className="flex items-start gap-2 cursor-pointer select-none mt-1">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
            />
            <span className="text-[11px] text-slate-500 leading-tight">
              <Link
                href="/Login/TermsOfService#terms"
                target="_blank"
                className="font-bold text-slate-900 hover:underline"
              >
                Үйлчилгээний нөхцөл
              </Link>{' '}
              болон{' '}
              <Link
                href="/Login/TermsOfService#privacy"
                target="_blank"
                className="font-bold text-slate-900 hover:underline"
              >
                Нууцлалын бодлого
              </Link>
              -г уншиж, зөвшөөрч байна
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2b569a] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#22447a] active:scale-[0.99] mt-2 shadow-sm disabled:opacity-60"
          >
            <UserPlus className="h-4 w-4" />
            <span>{loading ? 'Бүртгэж байна...' : 'Бүртгүүлж үнэлгээ эхлэх'}</span>
          </button>
        </form>

        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <span>Бүртгэлтэй юу?</span>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-bold text-slate-900 hover:underline"
          >
            Нэвтрэх
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
