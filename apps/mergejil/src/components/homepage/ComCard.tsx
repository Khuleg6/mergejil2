import React from 'react';
type Variant = 'green' | 'amber' | 'purple';
type CardProps = {
  variant: Variant;
  name: string;
  career: string;
  com: string;
  mbti: string;
  word: string;
};
const VARIANT_STYLES: Record<
  Variant,
  {
    cardBorder: string;
    proBorder: string;
    proBg: string;
    mbti: string;
    mbtiBg: string;
  }
> = {
  green: {
    cardBorder: 'border-emerald-500/40',
    proBg: 'bg-[#6ee7b718]',
    proBorder: 'border-emerald-500/40',
    mbti: 'text-[#6ee7b7]',
    mbtiBg: 'bg-[#6ee7b718]',
  },
  amber: {
    cardBorder: 'border-amber-400/40',
    proBg: 'bg-[#fbbf2418]',
    proBorder: 'border-amber-400/40',
    mbti: 'text-[#fbbf24]',
    mbtiBg: 'bg-[#fbbf2418]',
  },
  purple: {
    cardBorder: 'border-violet-500/40',
    proBg: 'bg-[#a78bfb18]',
    proBorder: 'border-violet-500/40',
    mbti: 'text-[#a78bfb]',
    mbtiBg: 'bg-[#a78bfb18]',
  },
};
export const ComCard = ({
  variant,
  name,
  career,
  com,
  mbti,
  word,
}: CardProps) => {
  const s = VARIANT_STYLES[variant];
  return (
    <div className={`p-5 ${s.cardBorder} rounded-2xl border space-y-6`}>
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          {' '}
          <div
            className={` ${s.proBg} ${s.proBorder} border rounded-full w-10 h-10 flex items-center justify-center ${s.mbti}`}
          >
            {word}
          </div>
          <div>
            <p className="text-white font-semibold text-[14px]">{name}</p>
            <p className="text-[#e2e8f066] text-[12px]">{career}</p>
          </div>
        </div>
        <p
          className={`${s.mbti} ${s.mbtiBg} rounded-2xl font-semibold py-1 px-2 text-[12px]`}
        >
          {mbti}
        </p>
      </div>
      <p className="text-[#e2e8f099] text-[14px]">{com}</p>
    </div>
  );
};
