'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { RoadmapHeader } from './RoadmapHeader';
import { ProfileHeroSection } from './ProfileHeroSection';
import { IQSection } from './IQSection';
import { SkillsRadarSection } from './SkillsRadarSection';
import { WorkEnvironmentSection } from './WorkEnvironmentSection';
import { CompactProfessionsList } from './CompactProfessionsList';
import { CompactEducationList } from './CompactEducationList';
import { EducationSection } from './EducationSection';
import { RoadmapSection } from './RoadmapSection';
import { Spinner } from '@/components/Spinner';
import {
  fetchProfileStatus,
  generateProfile,
} from '@/lib/assessmentApi';
import {
  MODULE_META,
  universitiesForProfession,
  type CareerProfile,
  type ModuleCode,
} from '@/lib/careerProfile';

const TABS = [
  { key: 'education', label: 'Боловсрол', icon: '🎓' },
  { key: 'roadmap', label: 'Roadmap', icon: '🗺️' },
] as const;

/**
 * Хоёр Gemini дуудалт (retry тохиолдоогүй үед) ихэвчлэн ~45–60 секундэд
 * багтдаг. `assessmentApi.ts` дахь client timeout 120 секундэд тавигдсан тул
 * түүнээс цааш энэ дэлгэц харагдахгүй — эсвэл алдаа, эсвэл үр дүн гарна.
 */
const ESTIMATED_SECONDS = 55;
const CLIENT_TIMEOUT_SECONDS = 120;

const GENERATING_STAGES = [
  { until: 20, text: 'Тестийн үр дүнг шинжилж байна…' },
  { until: 45, text: 'Тохирох мэргэжлүүдийг сонгож байна…' },
  { until: 70, text: 'Их сургууль, суралцах замыг гаргаж байна…' },
  { until: Number.POSITIVE_INFINITY, text: 'Профайлыг бүрдүүлж байна…' },
];

/** AI үүсгэх хугацааны ахиц — хэр удахыг хэрэглэгч харж байхын тулд. */
const GeneratingScreen = ({ seconds }: { seconds: number }) => {
  // Тооцоолсон хугацаанаас хэтэрвэл 99%-д хүрч хүлээнэ.
  const percent = Math.min(
    99,
    Math.round((seconds / ESTIMATED_SECONDS) * 100),
  );
  const remaining = Math.max(0, ESTIMATED_SECONDS - seconds);
  const isSlow = seconds > ESTIMATED_SECONDS + 20;
  const stage =
    GENERATING_STAGES.find((item) => percent < item.until) ??
    GENERATING_STAGES[GENERATING_STAGES.length - 1];

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-5xl font-extrabold tabular-nums text-[#1b3a6b]">
          {percent}%
        </p>
        <div
          aria-label="AI профайл үүсгэх ахиц"
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={percent}
          className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#1b3a6b] to-[#2d5aa0] transition-all duration-1000"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-5 text-base font-semibold text-slate-900">
          {stage.text}
        </p>
        <p className="mt-2 text-sm text-slate-500">
          {isSlow
            ? 'AI үйлчилгээ ердийнөөс удааширч байна'
            : remaining > 0
              ? `Ойролцоогоор ${remaining} секунд үлдлээ`
              : 'Хэдхэн секунд үлдлээ'}{' '}
          · {seconds} сек болсон
        </p>
        {isSlow ? (
          <p className="mt-4 text-sm text-amber-600">
            {CLIENT_TIMEOUT_SECONDS - seconds > 0
              ? `${CLIENT_TIMEOUT_SECONDS - seconds} секундэд хариу ирэхгүй бол алдаа гарч, "Дахин оролдох" товч гарна.`
              : 'Удахгүй алдаа гарч, "Дахин оролдох" товч гарна.'}
          </p>
        ) : (
          <p className="mt-4 text-sm text-slate-400">
            Хуудсыг хаахгүй байгаарай — профайл хадгалагдсаны дараа дахин
            үүсгэх шаардлагагүй.
          </p>
        )}
      </div>
    </div>
  );
};

const MODULE_LINKS: Record<ModuleCode, string> = {
  mbti: '/career-assessment',
  iq: '/iq-test',
  skills: '/iq-test',
};

type LoadState =
  | { kind: 'loading' }
  | { kind: 'generating' }
  | { kind: 'incomplete'; missing: ModuleCode[] }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; profile: CareerProfile };

const CenteredCard = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h1 className="text-xl font-bold text-slate-900">{title}</h1>
      <div className="mt-4 text-sm text-slate-600">{children}</div>
    </div>
  </div>
);

export const ResultsPageClient = () => {
  const [state, setState] = useState<LoadState>({ kind: 'loading' });
  const [activeTab, setActiveTab] = useState<
    'profile' | (typeof TABS)[number]['key']
  >('profile');
  const [selectedProfessionId, setSelectedProfessionId] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const generatingSince = useRef<number | null>(null);

  const runGenerate = useCallback(async (force = false) => {
    generatingSince.current = Date.now();
    setElapsedSeconds(0);
    setState({ kind: 'generating' });
    const generated = await generateProfile(force);
    if (generated.profile) {
      setState({ kind: 'ready', profile: generated.profile });
      return;
    }
    if (generated.missingModules?.length) {
      setState({ kind: 'incomplete', missing: generated.missingModules });
      return;
    }
    setState({ kind: 'error', message: generated.error });
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const status = await fetchProfileStatus();
      if (cancelled) return;

      if (!status) {
        setState({
          kind: 'error',
          message: 'Профайлыг уншиж чадсангүй. Дахин нэвтэрч оролдоно уу.',
        });
        return;
      }
      if (status.missingModules.length) {
        setState({ kind: 'incomplete', missing: status.missingModules });
        return;
      }
      if (status.profile) {
        setState({ kind: 'ready', profile: status.profile });
        return;
      }
      // Тестүүд дууссан ч профайл байхгүй — Gemini-ээр шинээр үүсгэнэ.
      void runGenerate(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [runGenerate]);

  // Үүсгэж байх хугацааг секунд тутам шинэчилнэ.
  useEffect(() => {
    if (state.kind !== 'generating') return undefined;
    const timer = setInterval(() => {
      const since = generatingSince.current;
      if (since) setElapsedSeconds(Math.round((Date.now() - since) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [state.kind]);

  const profile = state.kind === 'ready' ? state.profile : null;

  // Мэргэжил үүсэх/шинэчлэгдэх үед эрэмбэ 1-ийг анхдагчаар сонгоно.
  useEffect(() => {
    if (!profile) return;
    const exists = profile.professions.some(
      (profession) => profession.id === selectedProfessionId,
    );
    if (!exists) {
      setSelectedProfessionId(profile.professions[0]?.id ?? '');
    }
  }, [profile, selectedProfessionId]);

  if (state.kind === 'generating') {
    return <GeneratingScreen seconds={elapsedSeconds} />;
  }

  if (state.kind === 'loading') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
        <Spinner />
        <p className="text-base font-medium text-slate-600">
          Үр дүнг уншиж байна…
        </p>
      </div>
    );
  }

  if (state.kind === 'incomplete') {
    return (
      <CenteredCard title="Профайл гаргахад тест дутуу байна">
        <p>
          AI карьерийн профайл гаргахын тулд гурван модулийг бүрэн дуусгах
          шаардлагатай. Дараах тест(үүд) дутуу байна:
        </p>
        <ul className="mt-4 space-y-2 text-left">
          {state.missing.map((code) => (
            <li key={code}>
              <Link
                className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 font-semibold text-[#1b3a6b] hover:bg-slate-50"
                href={MODULE_LINKS[code]}
              >
                <span>{MODULE_META[code].name}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </CenteredCard>
    );
  }

  if (state.kind === 'error') {
    return (
      <CenteredCard title="Профайл үүсгэж чадсангүй">
        <p>{state.message}</p>
        <button
          className="mt-5 w-full rounded-xl bg-[#1b3a6b] px-4 py-3 text-sm font-bold text-white"
          onClick={() => void runGenerate(true)}
          type="button"
        >
          Дахин оролдох
        </button>
      </CenteredCard>
    );
  }

  const { profile: data } = state;
  const selectedProfession =
    data.professions.find(
      (profession) => profession.id === selectedProfessionId,
    ) ?? data.professions[0];
  const universities = universitiesForProfession(
    data.universities,
    selectedProfession,
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <RoadmapHeader
        isProfileActive={activeTab === 'profile'}
        onProfileClick={() => setActiveTab('profile')}
        totalXP={data.user.totalXP}
        onRegenerate={() => void runGenerate(true)}
      />
      <nav
        aria-label="Карьерийн үр дүн"
        className="sticky top-0 z-30 border-b border-slate-200 bg-white print:static"
      >
        <div className="mx-auto max-w-screen-2xl px-4 lg:px-8 xl:px-10">
          <div className="flex gap-1 overflow-x-auto py-2">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                aria-pressed={activeTab === tab.key}
                aria-controls={`panel-${tab.key}`}
                onClick={() => setActiveTab(tab.key)}
                className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${activeTab === tab.key ? 'bg-[#1b3a6b] text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <span aria-hidden="true">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-screen-2xl px-4 py-8 lg:px-8 xl:px-10">
        <div
          id="panel-profile"
          hidden={activeTab !== 'profile'}
          className="space-y-6"
        >
          <ProfileHeroSection mbti={data.mbti} />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <IQSection iq={data.iq} />
            <SkillsRadarSection skills={data.skills} />
          </div>
          <WorkEnvironmentSection
            environments={data.workEnvironments}
            collaborationStyles={data.collaborationStyles}
          />
        </div>
        <div id="panel-education" hidden={activeTab !== 'education'}>
          <EducationSection
            professions={data.professions}
            selectedProfessionId={selectedProfession?.id ?? ''}
            onProfessionChange={setSelectedProfessionId}
            universities={universities}
            professionName={selectedProfession?.name}
          />
        </div>
        <div
          id="panel-roadmap"
          hidden={activeTab !== 'roadmap'}
          className="space-y-6"
        >
          <RoadmapSection
            roadmap={data.roadmap}
            totalXP={data.user.totalXP}
            professions={data.professions}
            selectedProfessionId={selectedProfession?.id ?? ''}
            onProfessionChange={setSelectedProfessionId}
            learningPath={selectedProfession?.learningPath}
          />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 [&>*]:min-w-0">
            <CompactProfessionsList professions={data.professions} />
            <CompactEducationList
              professions={data.professions}
              selectedProfessionId={selectedProfession?.id ?? ''}
              onProfessionChange={setSelectedProfessionId}
              universities={universities}
              professionName={selectedProfession?.name}
            />
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-slate-400">
          Профайлыг {new Date(data.generatedAt).toLocaleString('mn-MN')}-д{' '}
          {data.model} моделиар үүсгэсэн. Цалин, төлбөрийн тоо нь тооцоолсон
          хэмжээ — сургууль, ажил олгогчоос шалгана уу.
        </p>
      </main>
    </div>
  );
};
