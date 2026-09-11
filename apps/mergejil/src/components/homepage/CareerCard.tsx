
type Variant = 'green' | 'amber' | 'purple' | 'yellow';
type CardProps = {
  variant: Variant;
  career: string;
  per: string;
};
const VARIANT_STYLES: Record<
  Variant,
  {
    icon: string;
    per: string;
    scale: string;
  }
> = {
  green: {
    icon: '💻',
    per: 'text-[#6ee7b7]',
    scale: 'bg-[#6ee7b7]',
  },
  amber: {
    icon: '🎯',
    per: 'text-[#f5a623]',
    scale: 'bg-[#f5a623]',
  },
  purple: {
    icon: '🎨',
    per: 'text-[#a78bfa]',
    scale: 'bg-[#a78bfa]',
  },
  yellow: {
    icon: '📊',
    per: 'text-[#fbbf24]',
    scale: 'bg-[#fbbf24]',
  },
};

export const CareerCard = ({ career, variant, per }: CardProps) => {
  const s = VARIANT_STYLES[variant];
  return (
    <div className="p-6 rounded-2xl border border-white/[0.07] bg-[#ffffff08] space-y-5">
      <div className="text-[24px]">{s.icon}</div>
      <div className="text-white font-semibold text-[16px]">{career}</div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-[#e2e8f066] text-[12px]">Тохирол</p>
          <p className={`${s.per} font-semibold text-[12px] `}>{per}%</p>
        </div>
        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className={` ${s.scale} h-full rounded-full`}
            style={{ width: `${per}%` }}
          />
        </div>
      </div>
    </div>
  );
};
