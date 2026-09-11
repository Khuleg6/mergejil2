'use client';
import { FcGoogle } from 'react-icons/fc';
import { ASSESSMENT_PATH, NEXT_KEY } from '@/lib/navigation';

export const GoogleLoginButton = ({
  next = ASSESSMENT_PATH,
}: {
  next?: string;
}) => {
  const handleGoogleLogin = () => {
    // Google руу бүтэн хуудсаар шилждэг тул хаашаа буцахаа хадгална.
    try {
      sessionStorage.setItem(NEXT_KEY, next);
    } catch {
      // sessionStorage байхгүй үед үндсэн зам руу буцна.
    }
    // Google-ийн зөвшөөрлийн дэлгэц рүү бүтэн хуудсаар шилждэг тул
    // fetch биш шууд navigation ашиглана.
    window.location.href = '/api/auth/google/start';
  };

  return (
    <button
      onClick={handleGoogleLogin}
      type="button"
      className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-base font-medium text-slate-800 transition-colors hover:bg-slate-100 active:bg-slate-200"
    >
      <FcGoogle className="h-6 w-6" />
      <span>Google-ээр нэвтрэх</span>
    </button>
  );
};
