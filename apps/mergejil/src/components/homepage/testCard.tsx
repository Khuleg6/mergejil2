import Link from 'next/link';
type Variant = 'green' | 'amber' | 'purple';
type Mode = 'stack' | 'grid';
type CardProps = {
  variant: Variant;
  /** Заасан бол картыг дарахад тухайн тест рүү аваачна. */
  href?: string;
  mode?: Mode;
  badge: string;
  title: string;
  description: string;
  time: string;
  xp: string;
  width?: string;
  px?: string;
  py?: string;
  size?: string;
};
const VARIANT_STYLES: Record<
  Variant,
  {
    cardBorder: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    xpBg: string;
    xpText: string;
    arrowBg: string;
    arrowText: string;
    gridBg: string;
    glow: string;
  }
> = {
  green: {
    cardBorder: 'border-emerald-500/40',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-400',
    badgeBorder: 'border-emerald-500/40',
    xpBg: 'bg-emerald-500/15',
    xpText: 'text-emerald-400',
    arrowBg: 'bg-white/5 hover:bg-white/10',
    arrowText: 'text-white',
    gridBg:
      'bg-gradient-to-br from-emerald-900/50 via-emerald-950/30 to-[#0a0d14]',
    glow: 'shadow-[0_0_36px_rgba(16,185,129,0.12)]',
  },
  amber: {
    cardBorder: 'border-amber-400/40',
    badgeBg: 'bg-amber-400/10',
    badgeText: 'text-amber-400',
    badgeBorder: 'border-amber-400/40',
    xpBg: 'bg-amber-400/15',
    xpText: 'text-amber-400',
    arrowBg: 'bg-white/5 hover:bg-white/10',
    arrowText: 'text-white',
    gridBg: 'bg-gradient-to-br from-amber-900/50 via-amber-950/30 to-[#0a0d14]',
    glow: 'shadow-[0_0_36px_rgba(251,191,36,0.12)]',
  },
  purple: {
    cardBorder: 'border-violet-500/40',
    badgeBg: 'bg-violet-500/10',
    badgeText: 'text-violet-400',
    badgeBorder: 'border-violet-500/40',
    xpBg: 'bg-violet-500/15',
    xpText: 'text-violet-400',
    arrowBg: 'bg-white/5 hover:bg-white/10',
    arrowText: 'text-white',
    gridBg: 'bg-[#0a0d14]',
    glow: 'shadow-[0_0_36px_rgba(139,92,246,0.12)]',
  },
};

const STACK_BG =
  'bg-gradient-to-b from-[#0b1018] via-[#090d15] to-[#070a10]/95';

export const TestCard = ({
  variant,
  href,
  mode = 'stack',
  badge,
  title,
  description,
  time,
  xp,
  width,
  px,
  py,
  size,
}: CardProps) => {
  const s = VARIANT_STYLES[variant];
  const bg = mode === 'grid' ? s.gridBg : STACK_BG;
  const className = `block w-full space-y-5 overflow-hidden rounded-2xl border ${href ? 'cursor-pointer transition-transform hover:scale-[1.01]' : ''} ${s.cardBorder} ${s.glow} ${bg} ${width} ${py} ${px}`;

  const content = (
    <>
      <div
        className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-sm font-medium ${s.badgeBg} ${s.badgeBorder} ${s.badgeText}`}
      >
        {badge}
      </div>
      <div className={`space-y-4 ${width}`}>
        <h1 className={`text-[18px] font-semibold text-white ${size}`}>
          {title}
        </h1>
        <p className="text-[#e2e8f073] text-[12px] whitespace-pre-line">
          {description}
        </p>
      </div>
      <div className="flex justify-between">
        <div className="flex justify-center items-center gap-2">
          <div className="text-[12px] text-[#e2e8f059] w-[60px]">
            ⏱ {time} мин
          </div>
          <div
            className={`${s.xpBg} ${s.xpText} rounded-full border px-2 font-semibold text-[12px] flex justify-center items-center`}
          >
            +{xp} XP
          </div>
        </div>
        <div
          className={` py-2 px-2 ${s.arrowBg} ${s.arrowText} rounded-full flex justify-center items-center`}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6H10M7 3L10 6L7 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </div>
      </div>
    </>
  );

  return href ? (
    <Link className={className} href={href}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
};
