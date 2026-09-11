'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SignIn from './SignIn/page';
import SignUp from './SignUp/page';
import Onboard from './Onboard/page';
import { safeNext } from '@/lib/navigation';

const LoginForm = () => {
  const searchParams = useSearchParams();
  const oauthError = searchParams.get('error');
  const next = safeNext(searchParams.get('next'));
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(
    searchParams.get('tab') === 'login' ? 'login' : 'register',
  );

  return (
    <div className="w-full max-w-[440px] flex flex-col gap-4">
      {oauthError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
          {oauthError}
        </p>
      )}

      <div className="bg-[#f1f5f9] p-1.5 rounded-2xl flex items-center">
        <button
          type="button"
          onClick={() => setActiveTab('login')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'login'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Нэвтрэх
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('register')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'register'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Бүртгүүлэх
        </button>
      </div>

      {activeTab === 'register' ? (
        <SignUp next={next} onSwitchToLogin={() => setActiveTab('login')} />
      ) : (
        <SignIn next={next} onSwitchToRegister={() => setActiveTab('register')} />
      )}
    </div>
  );
};

export const Page = () => {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white">
      <div className="w-full lg:w-1/2">
        <Onboard />
      </div>

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-12">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
