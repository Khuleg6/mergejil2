'use client';

export interface SkillProgress {
  label: string;
  percentage: number;
  color: string;
}
export interface CareerStat {
  value: string;
  title: string;
  subtitle: string;
}
export interface CareerProfileProps {
  mbtiType?: string;
  mbtiRole?: string;
  totalXp?: number;
  skills?: SkillProgress[];
  recommendedCareers?: string[];
  stats?: CareerStat[];
  onStarAssessment?: () => void;
}

const DEFAULT_SKILLS: SkillProgress[] = [
  { label: 'Аналитик сэтгэлгээ', percentage: 88, color: '#6ee7a8' },
  { label: 'Бүтээлч чадвар', percentage: 74, color: '#8b7ff0' },
  { label: 'Удирдах чадвар', percentage: 91, color: '#f5b544' },
];

const DEFAULT_TAGS: string[] = [
  'Програм хангамж',
  'Дата шинжилгээ',
  'Бизнес стратеги',
  'Судалгаа',
];

const DEFAULT_STATS: CareerStat[] = [
  { value: '94%', title: 'Мэргэжлийн тохирол', subtitle: 'Нарийвчлал' },
  { value: '12+', title: 'Санал болгох мэргэжил', subtitle: 'Чиглэл' },
  { value: '30+', title: 'Их сургуулийн зөвлөмж', subtitle: 'Байгууллага' },
  { value: '5+', title: 'Карьерийн зам', subtitle: 'Хувилбар' },
];

const SkillItem = ({ label, percentage, color }: SkillProgress) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between text-[12px]">
      <span className="text-[#e2e8f0b3]">{label}</span>
      <span className="font-semibold" style={{ color }}>
        {percentage}%
      </span>
    </div>
    <div className="h-[3px] w-full rounded-full bg-white/10">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${percentage}%`, backgroundColor: color }}
      />
    </div>
  </div>
);

const StatCard = ({ value, title, subtitle }: CareerStat) => (
  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
    <p className="text-[22px] font-bold text-amber-400">{value}</p>
    <p className="mt-2 text-[13px] font-semibold text-white">{title}</p>
    <p className="text-[12px] text-[#e2e8f073]">{subtitle}</p>
  </div>
);

export const CareerProfile = ({
  mbtiType = 'INTJ',
  mbtiRole = 'Стратегич',
  totalXp = 370,
  skills = DEFAULT_SKILLS,
  recommendedCareers = DEFAULT_TAGS,
  stats = DEFAULT_STATS,
  onStarAssessment,
}: CareerProfileProps) => {
  return (
    <section className="w-full bg-[#0a0d14] py-40 md:px-28 ">
      <div className="mx-auto grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div className="space-y-8 rounded-2xl border border-white/10 bg-[#0d1117] p-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-bold text-[#e2e8f073]">
                Таны MBTI төрөл
              </p>
              <p className="text-[34px] font-bold leading-tight text-amber-400">
                {mbtiType}
              </p>
              <p className="text-[12px] text-[#e2e8f0b3]">{mbtiRole}</p>
            </div>
            <div className="text-right">
              <p className="text-[12px] font-bold text-[#e2e8f073]">
                Нийт оноо
              </p>
              <p className="text-[22px] font-bold text-emerald-400">
                {totalXp} XP
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {skills.map((skill) => (
              <SkillItem key={skill.label} {...skill} />
            ))}
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <p className="text-[12px] text-[#e2e8f073]">
              Санал болгох мэргэжлүүд
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {recommendedCareers.map((career) => (
                <span
                  key={career}
                  className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[12px] text-amber-300"
                >
                  {career}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-[12px] font-semibold tracking-[0.2em] text-amber-400">
            ҮР ДҮН
          </p>
          <h2 className="text-[44px] font-bold leading-[1.15] text-white">
            Нэг тест биш —{' '}
            <span className="text-[#e2e8f04d]">бүрэн карьерийн зураглал</span>
          </h2>
          <p className="max-w-md text-[14px] leading-relaxed text-[#e2e8f073]">
            Гурван модулийн үр дүнг нэгтгэн таны хувийн шинж, оюуны чадвар, ур
            чадварт тулгуурласан нарийвчилсан карьерийн профайл бэлтгэнэ.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
