'use client';

import { ProfessionSelector } from './ProfessionSelector';

import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  Flag,
  LockKeyhole,
  PlayCircle,
  Rocket,
  Target,
  Trophy,
  X,
} from 'lucide-react';

type Profession = {
  id: string;
  name: string;
  matchPct: number;
};

type RoadmapPhase = {
  id: string;
  phase: number;
  title: string;
  status: 'current' | 'upcoming' | 'planned';
  color: string;
  items: string[];
  xp: number;
  goal?: string;
  challenge?: string;
  duration?: string;
};

type CareerRoadmap = {
  summary: string;
  phases: Array<
    Pick<RoadmapPhase, 'title' | 'goal' | 'challenge' | 'duration' | 'items'>
  >;
};

const CAREER_ROADMAPS: Record<string, CareerRoadmap> = {
  'prof-software': {
    summary:
      'Кодын суурь ойлголтоос эхлээд өөрийн анхны аппыг хийх хүртэлх 4 алхам.',
    phases: [
      {
        title: 'Анхан шат: Кодтой танилцах',
        duration: '1–2 долоо хоног',
        goal: 'Компьютерт заавар өгч, код хэрхэн ажилладгийг ойлгох.',
        items: [
          'Алгоритм — ажлыг дарааллаар хийх заавар',
          'Scratch эсвэл Python-ы анхны команд',
          'Алдаа олж засах энгийн арга',
        ],
        challenge: 'Нэрийг чинь асуугаад мэндчилдэг жижиг програм бүтээгээрэй.',
      },
      {
        title: 'Үндсэн шат: Вэб бүтээх',
        duration: '4–6 долоо хоног',
        goal: 'Харагддаг, товч дарж болдог энгийн вэб хуудас хийх.',
        items: [
          'HTML — хуудасны араг яс',
          'CSS — өнгө, хэлбэр, байрлал',
          'JavaScript — товчийг ажиллуулах хөдөлгүүр',
        ],
        challenge: 'Өөрийн хоббиг танилцуулсан нэг хуудаст сайт хийгээрэй.',
      },
      {
        title: 'Дадлага шат: Аппын төсөл',
        duration: '6–8 долоо хоног',
        goal: 'Сурсан зүйлсээ нийлүүлж бодит асуудал шийдэх апп хийх.',
        items: [
          'Төслөө жижиг ажлуудад хуваах',
          'Git — хийсэн ажлын хувилбарыг хадгалах дэвтэр',
          'Хэрэглэгчээр туршуулж сайжруулах',
        ],
        challenge: 'Хичээлийн даалгавар тэмдэглэдэг апп бүтээгээрэй.',
      },
      {
        title: 'Мэргэших шат: Бүтээлээ хөгжүүлэх',
        duration: '2–3 сар',
        goal: 'Багаар ажиллаж, илүү найдвартай програм бүтээж сурах.',
        items: [
          'Өгөгдлийн сан — мэдээлэл хадгалдаг цахим шүүгээ',
          'API — хоёр програмыг ярилцуулдаг гүүр',
          'Бүтээлийн танилцуулга бэлдэх',
        ],
        challenge:
          'Найзуудтайгаа сургуулийн нэг асуудлыг шийдэх апп бүтээгээрэй.',
      },
    ],
  },
  'prof-data': {
    summary:
      'Тоон мэдээллээс сонирхолтой нууцыг олж, зөв шийдвэр гаргахад туслах 4 алхам.',
    phases: [
      {
        title: 'Анхан шат: Мэдээллийг ажиглах',
        duration: '1–2 долоо хоног',
        goal: 'Хүснэгт доторх тоог уншиж, энгийн дүгнэлт хийх.',
        items: [
          'Өгөгдөл — цуглуулсан мэдээлэл',
          'Дундаж ба хувь тооцох',
          'Google Sheets хүснэгт ашиглах',
        ],
        challenge: 'Ангийнхаа дуртай хичээлийн жижиг судалгаа аваарай.',
      },
      {
        title: 'Үндсэн шат: Тоогоор түүх ярих',
        duration: '3–5 долоо хоног',
        goal: 'Мэдээллээ цэвэрлэж, ойлгомжтой график болгох.',
        items: [
          'Алдаатай мэдээллийг цэгцлэх',
          'Баганан ба шугаман график',
          'Python-оор энгийн тооцоо хийх',
        ],
        challenge: 'Судалгааныхаа үр дүнг 2 графикаар тайлбарлаарай.',
      },
      {
        title: 'Дадлага шат: Таамаг гаргах',
        duration: '5–7 долоо хоног',
        goal: 'Өмнөх мэдээллийг ашиглан дараа юу болохыг таамаглах.',
        items: [
          'Хамаарал — хоёр зүйл хамт өөрчлөгдөх эсэх',
          'AI загвар — жишээнээс суралцдаг туслах',
          'Үр дүнгээ шалгах',
        ],
        challenge: 'Нэг сарын цаг агаараас маргаашийн хэмийг таамаглаарай.',
      },
      {
        title: 'Мэргэших шат: AI төсөл',
        duration: '2–3 сар',
        goal: 'Бодит мэдээлэл ашигласан хариуцлагатай AI төсөл хийх.',
        items: [
          'SQL — мэдээллийн шүүгээнээс зүйл хайх хэл',
          'Мэдээллийн нууцлал',
          'Төслөө тайлбарлан танилцуулах',
        ],
        challenge:
          'Сургуулийн номын сангийн хэрэглээг харуулах самбар бүтээгээрэй.',
      },
    ],
  },
  'prof-architect': {
    summary:
      'Олон програм хамтдаа хурдан, найдвартай ажиллах том системийг төлөвлөх 4 алхам.',
    phases: [
      {
        title: 'Анхан шат: Системийг ойлгох',
        duration: '2–3 долоо хоног',
        goal: 'Том ажлыг холбоотой жижиг хэсгүүд болгон харах.',
        items: [
          'Систем — хамт ажилладаг олон хэсэг',
          'Урсгал зураг зурж сурах',
          'Интернэт хэрхэн ажилладгийг ойлгох',
        ],
        challenge: 'Сургуулийн ном авах үйл явцыг зургаар үзүүлээрэй.',
      },
      {
        title: 'Үндсэн шат: Зөв бүтэц сонгох',
        duration: '4–6 долоо хоног',
        goal: 'Аппын хэсгүүдийг эмх цэгцтэй холбож төлөвлөх.',
        items: [
          'Сервер — хүсэлтэд хариулдаг компьютер',
          'Өгөгдлийн сан — мэдээллийн цахим шүүгээ',
          'Аюулгүй байдлын суурь',
        ],
        challenge: 'Онлайн дэлгүүрийн хэсгүүдийн зураглал гаргаарай.',
      },
      {
        title: 'Дадлага шат: Систем турших',
        duration: '6–8 долоо хоног',
        goal: 'Олон хүн ашиглахад систем хэрхэн ажиллахыг турших.',
        items: [
          'Ачаалал — нэг дор ирэх олон хүсэлт',
          'Нөөц хуулбар хийх',
          'Алдаа гарвал сэргээх төлөвлөгөө',
        ],
        challenge: '1000 сурагч ашиглах сургуулийн аппын төлөвлөгөө гаргаарай.',
      },
      {
        title: 'Мэргэших шат: Том шийдэл зохиох',
        duration: '3–4 сар',
        goal: 'Найдвартай, өсөж болох системийн бүрэн зураг төсөл хийх.',
        items: [
          'Cloud — интернэтээр түрээсэлдэг компьютер',
          'Системийн зардал тооцох',
          'Багт шийдлээ ойлгомжтой тайлбарлах',
        ],
        challenge:
          'Аймгийн бүх сургууль ашиглах системийн загвар танилцуулаарай.',
      },
    ],
  },
  'prof-pm': {
    summary:
      'Хүмүүст хэрэгтэй технологийн бүтээгдэхүүнийг санаанаас бодит ажил болгох 4 алхам.',
    phases: [
      {
        title: 'Анхан шат: Асуудлыг олох',
        duration: '1–2 долоо хоног',
        goal: 'Хүмүүсийн бодит хэрэгцээг асуулт тавьж олж мэдэх.',
        items: [
          'Сайн асуулт асуух',
          'Хэрэглэгч — бүтээгдэхүүнийг ашиглах хүн',
          'Асуудлаа нэг өгүүлбэрээр бичих',
        ],
        challenge:
          '5 сурагчаас сургуульд тулгардаг нэг бэрхшээлийг асуугаарай.',
      },
      {
        title: 'Үндсэн шат: Шийдлээ төлөвлөх',
        duration: '3–5 долоо хоног',
        goal: 'Хамгийн чухал санаагаа сонгож, хийх ажлын дараалал гаргах.',
        items: [
          'Roadmap — хийх ажлын замын зураг',
          'Prototype — туршилтын энгийн загвар',
          'Багтай ойлгомжтой харилцах',
        ],
        challenge: 'Сонгосон асуудлынхаа аппыг цаасан дээр зураарай.',
      },
      {
        title: 'Дадлага шат: Туршиж сайжруулах',
        duration: '4–6 долоо хоног',
        goal: 'Загвараа хүмүүст ашиглуулж, саналын дагуу сайжруулах.',
        items: [
          'Хэрэглэгчийн туршилт',
          'Санал хүсэлтийг ангилах',
          'Чухал ажлаа түрүүлж хийх',
        ],
        challenge: 'Загвараа 3 хүнд туршуулаад 3 сайжруулалт хийгээрэй.',
      },
      {
        title: 'Мэргэших шат: Бүтээгдэхүүн удирдах',
        duration: '2–3 сар',
        goal: 'Зорилго, баг, хугацааг нэг чигт удирдаж сурах.',
        items: [
          'Амжилтыг хэмжих тоо сонгох',
          'Танилцуулга хийх',
          'Шийдвэрийн шалтгаанаа тайлбарлах',
        ],
        challenge: 'Аппын санаагаа 3 минутын танилцуулгаар хамгаалаарай.',
      },
    ],
  },
  'prof-researcher': {
    summary:
      'Сонирхолтой асуултад баримтаар хариулж, шинэ мэдлэг бүтээх 4 алхам.',
    phases: [
      {
        title: 'Анхан шат: Зөв асуулт тавих',
        duration: '1–2 долоо хоног',
        goal: 'Шалгаж болох тодорхой судалгааны асуулт зохиох.',
        items: [
          'Ажиглалт хийх',
          'Таамаг — боломжит хариулт',
          'Найдвартай эх сурвалж таних',
        ],
        challenge: 'Өдөр тутмын амьдралаас шалгаж болох 3 асуулт бичээрэй.',
      },
      {
        title: 'Үндсэн шат: Туршилт төлөвлөх',
        duration: '3–5 долоо хоног',
        goal: 'Шударга харьцуулалттай жижиг туршилт хийх.',
        items: [
          'Хувьсагч — өөрчилж эсвэл хэмжиж буй зүйл',
          'Мэдээлэл тэмдэглэх хүснэгт',
          'Аюулгүй туршилтын дүрэм',
        ],
        challenge:
          'Гэрлийн хэмжээ ургамлын өсөлтөд нөлөөлөх эсэхийг туршаарай.',
      },
      {
        title: 'Дадлага шат: Баримтаа тайлбарлах',
        duration: '4–6 долоо хоног',
        goal: 'Цуглуулсан мэдээллээс үндэслэлтэй дүгнэлт гаргах.',
        items: [
          'График байгуулах',
          'Алдааны боломжийг бодох',
          'Дүгнэлтээ баримтаар хамгаалах',
        ],
        challenge: 'Туршилтынхаа үр дүнг нэг зурагт хуудсаар танилцуулаарай.',
      },
      {
        title: 'Мэргэших шат: Судалгаагаа хуваалцах',
        duration: '2–3 сар',
        goal: 'Бүрэн судалгаа хийж, бусдад ойлгомжтой танилцуулах.',
        items: [
          'Судалгааны тайлан бичих',
          'Эх сурвалжаа зөв дурдах',
          'Асуултад тайван хариулах',
        ],
        challenge:
          'Сургуулийн шинжлэх ухааны үзэсгэлэнд жижиг судалгаагаа танилцуулаарай.',
      },
    ],
  },
};

const PHASE_STYLE = {
  current: {
    label: 'Одоо сурах',
    dot: 'bg-emerald-500',
    soft: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    ring: 'ring-emerald-200 border-emerald-400',
  },
  upcoming: {
    label: 'Дараагийн шат',
    dot: 'bg-blue-500',
    soft: 'bg-blue-50 text-blue-700 border-blue-200',
    ring: 'ring-blue-200 border-blue-400',
  },
  planned: {
    label: 'Удахгүй нээгдэнэ',
    dot: 'bg-slate-400',
    soft: 'bg-slate-50 text-slate-600 border-slate-200',
    ring: 'ring-slate-200 border-slate-300',
  },
} as const;

export const RoadmapSection = ({
  roadmap,
  totalXP,
  professions,
  selectedProfessionId,
  onProfessionChange,
  learningPath,
}: {
  roadmap: RoadmapPhase[];
  totalXP: number;
  professions: Profession[];
  selectedProfessionId: string;
  onProfessionChange: (professionId: string) => void;
  /** Сонгосон мэргэжлийн суралцах зам — AI профайлаас ирнэ. */
  learningPath?: CareerRoadmap;
}) => {
  const suggestedProfessions = professions.slice(0, 5);
  const [activePhase, setActivePhase] = useState(roadmap[0]?.id ?? '');
  const [trainingPhaseId, setTrainingPhaseId] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const selectedProfession =
    suggestedProfessions.find(
      (profession) => profession.id === selectedProfessionId,
    ) ?? suggestedProfessions[0];
  // AI профайл суралцах зам дамжуулсан бол түүнийг, эс бөгөөс дотоод жишээг.
  const careerContent =
    learningPath ??
    CAREER_ROADMAPS[selectedProfessionId] ??
    CAREER_ROADMAPS['prof-software'];
  const careerRoadmap = roadmap.map((phase, index) => ({
    ...phase,
    ...(careerContent.phases[index] ?? {}),
  }));
  const active =
    careerRoadmap.find((phase) => phase.id === activePhase) ?? careerRoadmap[0];
  const trainingPhase = careerRoadmap.find(
    (phase) => phase.id === trainingPhaseId,
  );
  const maxXP = roadmap.reduce((sum, phase) => sum + phase.xp, 0);
  const progress = maxXP
    ? Math.min(Math.round((totalXP / maxXP) * 100), 100)
    : 0;

  if (!active) return null;
  const activeStyle = PHASE_STYLE[active.status];

  return (
    <section className="space-y-4">
      <ProfessionSelector
        professions={professions}
        selectedProfessionId={selectedProfessionId}
        onProfessionChange={(professionId) => {
          onProfessionChange(professionId);
          setActivePhase(roadmap[0]?.id ?? '');
          setTrainingPhaseId(null);
        }}
        description="Сонгоход доорх суралцах зам шууд шинэчлэгдэнэ."
      />
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_-35px_rgba(15,35,70,0.35)]">
        <div className="relative overflow-hidden bg-[#102d57] px-5 py-7 text-white sm:px-8 sm:py-8">
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-blue-400/20 blur-2xl" />
          <div className="absolute -bottom-20 left-1/3 h-44 w-44 rounded-full bg-amber-300/15 blur-2xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="whitespace-nowrap text-[clamp(1rem,3.5vw,2rem)] font-black tracking-tight">
                {selectedProfession?.name ?? 'Мэргэжил'} болох зам
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-5 text-blue-100/80 sm:text-sm">
                {careerContent.summary} Нэг шатыг дуусгаад дараагийнхаа түгжээг
                тайлаарай.
              </p>
            </div>
            <div className="min-w-[260px] rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-blue-100">
                  Нийт ахиц
                </span>
                <span className="text-lg font-black">{progress}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-300 to-orange-400 transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-blue-100/75">
                <span>{totalXP.toLocaleString()} XP цуглуулсан</span>
                <span>{maxXP.toLocaleString()} XP</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
          <nav
            className="border-b border-slate-200 bg-slate-50/80 p-4 sm:p-6 lg:border-b-0 lg:border-r"
            aria-label="Суралцах замын шатууд"
          >
            <div className="relative space-y-3">
              <div
                className="absolute bottom-8 left-[25px] top-8 w-0.5 bg-slate-200"
                aria-hidden="true"
              />
              {careerRoadmap.map((phase) => {
                const style = PHASE_STYLE[phase.status];
                const isActive = phase.id === active.id;
                return (
                  <button
                    key={phase.id}
                    type="button"
                    onClick={() => setActivePhase(phase.id)}
                    aria-current={isActive ? 'step' : undefined}
                    className={`relative z-10 flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-200 sm:p-4 ${isActive ? `bg-white shadow-md ring-4 ${style.ring}` : 'border-transparent bg-transparent hover:border-slate-200 hover:bg-white'}`}
                  >
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white shadow-sm ${style.dot}`}
                    >
                      {phase.status === 'planned' ? (
                        <LockKeyhole size={17} />
                      ) : (
                        phase.phase
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold uppercase tracking-wider text-slate-500">
                        Level {phase.phase}
                      </span>
                      <span className="mt-0.5 block text-sm font-bold leading-snug text-slate-900">
                        {phase.title.split(':')[1]?.trim() || phase.title}
                      </span>
                    </span>
                    <ChevronRight
                      size={18}
                      className={isActive ? 'text-blue-600' : 'text-slate-300'}
                    />
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="p-5 sm:p-6">
            <div key={active.id} className="animate-fade-in">
              <div className="pb-4">
                <div className="mb-1 flex flex-nowrap items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-black uppercase tracking-[0.16em] text-blue-600">
                    Level {active.phase}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-sm font-bold ${activeStyle.soft}`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${activeStyle.dot}`}
                    />
                    {activeStyle.label}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-600">
                    <Clock3 size={13} /> {active.duration ?? '2–4 долоо хоног'}
                  </span>
                  <span className="ml-auto inline-flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-amber-700">
                    <Trophy size={18} />
                    <span className="font-black">+{active.xp} XP</span>
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-950 sm:text-2xl">
                  {active.title.split(':')[1]?.trim() || active.title}
                </h3>
              </div>

              <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                    <Target size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-black uppercase tracking-wider text-blue-700">
                      Энэ шатны зорилго
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">
                      {active.goal ??
                        'Шаардлагатай ойлголтуудыг энгийн жишээгээр сурч, өөрөө туршиж үзэх.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  {active.items.map((item, index) => (
                    <div
                      key={`${active.id}-${item}`}
                      className="group flex items-start gap-2.5 rounded-xl border border-slate-200 p-3 transition-colors hover:border-blue-200 hover:bg-blue-50/30"
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-sm font-black ${active.status === 'planned' ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-700'}`}
                      >
                        {active.status === 'current' ? (
                          <Check size={13} strokeWidth={3} />
                        ) : (
                          index + 1
                        )}
                      </span>
                      <p className="text-[13px] font-semibold leading-[18px] text-slate-700">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-amber-950">
                    <Flag size={19} />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-black uppercase tracking-wider text-amber-700">
                      Жижиг сорилт
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-6 text-slate-800">
                      {active.challenge ??
                        'Сурсан зүйлээрээ нэг жижиг бүтээл хийж, найздаа тайлбарлаж үзээрэй.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2 text-sm text-slate-500">
                  <Rocket size={15} /> Өдөрт 20–30 минут байхад хангалттай.
                </p>
                <button
                  type="button"
                  disabled={active.status === 'planned'}
                  onClick={() => setTrainingPhaseId(active.id)}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#173f75] px-5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#0f315f] hover:shadow-md disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
                >
                  {active.status === 'planned'
                    ? 'Өмнөх шатаа дуусгаарай'
                    : 'Энэ шатыг эхлэх'}
                  {active.status === 'planned' ? (
                    <LockKeyhole size={16} />
                  ) : (
                    <ArrowRight size={17} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {trainingPhase && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="training-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setTrainingPhaseId(null);
          }}
        >
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="bg-[#123563] p-5 text-white sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-200">
                    {selectedProfession?.name} · Level {trainingPhase.phase}
                  </p>
                  <h3 id="training-title" className="mt-1 text-xl font-black">
                    {trainingPhase.title.split(':')[1]?.trim() ||
                      trainingPhase.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setTrainingPhaseId(null)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 transition-colors hover:bg-white/20"
                  aria-label="Сургалтын цонх хаах"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all"
                  style={{
                    width: `${Math.round(
                      (trainingPhase.items.filter((_, index) =>
                        completedLessons.includes(
                          `${selectedProfessionId}-${trainingPhase.id}-${index}`,
                        ),
                      ).length /
                        trainingPhase.items.length) *
                        100,
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <p className="mb-4 text-sm leading-6 text-slate-600">
                Хичээл бүрийг үзээд дууссан гэж тэмдэглээрэй. Бүгдийг дуусгасны
                дараа Level-ийн сорилтоо хийгээрэй.
              </p>
              <div className="space-y-3">
                {trainingPhase.items.map((item, index) => {
                  const lessonKey = `${selectedProfessionId}-${trainingPhase.id}-${index}`;
                  const isDone = completedLessons.includes(lessonKey);
                  return (
                    <button
                      key={lessonKey}
                      type="button"
                      onClick={() =>
                        setCompletedLessons((current) =>
                          isDone
                            ? current.filter((key) => key !== lessonKey)
                            : [...current, lessonKey],
                        )
                      }
                      className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-all ${
                        isDone
                          ? 'border-emerald-200 bg-emerald-50'
                          : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/40'
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${isDone ? 'bg-emerald-500 text-white' : 'bg-blue-50 text-blue-700'}`}
                      >
                        {isDone ? (
                          <Check size={18} strokeWidth={3} />
                        ) : (
                          <PlayCircle size={19} />
                        )}
                      </span>
                      <span className="flex-1 text-sm font-bold text-slate-800">
                        {item}
                      </span>
                      <span
                        className={`text-sm font-bold ${isDone ? 'text-emerald-700' : 'text-slate-400'}`}
                      >
                        {isDone ? 'Дууссан' : `${index + 1}-р хичээл`}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-black uppercase tracking-wider text-amber-700">
                  Level-ийн сорилт
                </p>
                <p className="mt-1 text-sm font-semibold leading-5 text-slate-800">
                  {trainingPhase.challenge}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
