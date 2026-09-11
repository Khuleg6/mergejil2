'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Download,
  RotateCcw,
  Share2,
  Signpost,
  Sparkles,
  UserRound,
} from 'lucide-react';

type RoadmapHeaderProps = {
  isProfileActive: boolean;
  onProfileClick: () => void;
  totalXP?: number;
  /** Профайлыг Gemini-ээр дахин үүсгэх. */
  onRegenerate?: () => void;
};

export const RoadmapHeader = ({
  isProfileActive,
  onProfileClick,
  totalXP,
  onRegenerate,
}: RoadmapHeaderProps) => {
  const [message, setMessage] = useState('');
  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setMessage('Холбоос хуулагдлаа!');
    } catch {
      setMessage('Холбоос хуулж чадсангүй. Хаягийн мөрөөс хуулна уу.');
    }
  };

  return (
    <header className="relative z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-[56px] max-w-screen-2xl flex-wrap items-center justify-between gap-2 px-4 py-2 lg:px-8 xl:px-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-bold text-[#1b3a6b]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#1b3a6b] to-[#2d5aa0]">
            <Signpost size={19} className="text-amber-500" />
          </span>
          Мэргэжил.мн
        </Link>
        <div className="flex items-center gap-1 text-sm sm:gap-2">
          {typeof totalXP === 'number' && (
            <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700">
              ☆ {totalXP} XP
            </span>
          )}
          {onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              aria-label="AI профайлыг шинэчлэх"
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-slate-500 hover:bg-slate-100"
            >
              <Sparkles size={16} aria-hidden="true" />
              <span className="hidden sm:inline">AI дахин шинжлэх</span>
            </button>
          )}
          <button
            type="button"
            onClick={share}
            aria-label="Хуваалцах"
            className="group relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b3a6b]"
          >
            <Share2 size={16} aria-hidden="true" />
            <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              Хуваалцах
            </span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            aria-label="Татах"
            className="group relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b3a6b]"
          >
            <Download size={16} aria-hidden="true" />
            <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              Татах
            </span>
          </button>
          <Link
            href="/career-assessment"
            aria-label="Дахин өгөх"
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-slate-500 hover:bg-slate-100"
          >
            <RotateCcw size={16} />
            <span className="hidden sm:inline">Дахин өгөх</span>
          </Link>
          <button
            type="button"
            onClick={onProfileClick}
            aria-label="Профайл"
            title="Профайл"
            aria-pressed={isProfileActive}
            aria-controls="panel-profile"
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b3a6b] ${isProfileActive ? 'bg-[#1b3a6b] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-[#1b3a6b]'}`}
          >
            <UserRound size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
      <p role="status" className="text-center text-sm text-slate-500">
        {message}
      </p>
    </header>
  );
};
