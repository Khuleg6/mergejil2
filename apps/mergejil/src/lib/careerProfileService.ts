// Сервер тал: хадгалагдсан 3 тестийн үр дүнг уншиж, Gemini-ээр карьерийн
// профайл үүсгэж, дахин ашиглахаар DB-д хадгална.

import type { PrismaClient } from '@prisma/client';
import { MBTI_TYPES, MBTI_TYPE_LIST, isMbtiType, type MbtiType } from './mbti';
import { GeminiError, generateJson, geminiModel } from './gemini';
import { iqLabel, iqPercentile } from './iqBreakdown';
import {
  MODULE_META,
  PROFILE_MODULE_CODE,
  type CareerProfile,
  type MbtiDimensionView,
  type ModuleCode,
  type ProfileIq,
  type ProfileProfession,
  type ProfileRoadmapPhase,
  type ProfileSkills,
  type ProfileUniversity,
} from './careerProfile';

type StoredResult = { summary: string | null; detail: unknown; at: Date };
export type StoredResults = Partial<Record<ModuleCode, StoredResult>>;

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : {};

const asArray = (value: unknown): unknown[] =>
  Array.isArray(value) ? value : [];

const num = (value: unknown, fallback = 0) =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const str = (value: unknown, fallback = '') =>
  typeof value === 'string' && value.trim() ? value : fallback;

const slug = (value: string, index: number) =>
  `${value
    .toLowerCase()
    .replace(/[^a-z0-9а-яөүё]+/gi, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 32)}-${index + 1}`;

/**
 * Тохиромжтой төрлүүд: сэтгэлгээний хэв маяг (S/N) нийлж, гадагш/дотогшоо
 * (E/I) болон шийдвэрийн хэв маяг (J/P) харилцан нөхдөг төрлүүдийг авна.
 */
function compatibleTypes(type: MbtiType): MbtiType[] {
  const flip = (letter: string, pair: [string, string]) =>
    letter === pair[0] ? pair[1] : pair[0];
  const [ie, sn, tf, jp] = type.split('');

  const candidates = [
    `${flip(ie, ['I', 'E'])}${sn}${tf}${flip(jp, ['J', 'P'])}`,
    `${flip(ie, ['I', 'E'])}${sn}${tf}${jp}`,
    `${ie}${sn}${tf}${flip(jp, ['J', 'P'])}`,
    `${ie}${sn}${flip(tf, ['T', 'F'])}${jp}`,
  ];

  return candidates.filter(
    (candidate): candidate is MbtiType =>
      candidate !== type && MBTI_TYPE_LIST.includes(candidate as MbtiType),
  );
}

const strList = (value: unknown, fallback: string[] = []) => {
  const items = asArray(value).map((item) => str(item)).filter(Boolean);
  return items.length ? items : fallback;
};

/** Эрэлтийн түвшний товч шошго — badge-д багтахаар. */
const DEMAND_LABELS: Record<ProfileProfession['demandLevel'], string> = {
  'very-high': 'Маш өндөр',
  high: 'Өндөр',
  medium: 'Дунд',
  low: 'Бага',
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Math.round(value)));

// ── Тестийн үр дүнгээс шууд гардаг (Gemini-гүй) хэсгүүд ──────────────────

function mbtiDimensions(detail: Record<string, unknown>): MbtiDimensionView[] {
  const dichotomies = asArray(detail.dichotomies);

  return dichotomies.map((raw, index) => {
    const item = asRecord(raw);
    const firstPercent = num(item.firstPercent, 50);
    const first = str(item.first, '?');
    const second = str(item.second, '?');
    const leftWins = firstPercent >= 50;

    return {
      id: `dim-${first}${second}`.toLowerCase(),
      left: `${str(item.firstLabel, first)} (${first})`,
      right: `${str(item.secondLabel, second)} (${second})`,
      value: Math.round(leftWins ? firstPercent : 100 - firstPercent),
      side: leftWins ? ('left' as const) : ('right' as const),
      label: leftWins ? first : second,
    };
  });
}

function buildIq(result: StoredResult | undefined): ProfileIq {
  const detail = asRecord(result?.detail);
  const totalScore = num(detail.iqScore, Number(result?.summary ?? 0) || 100);
  const subScores = asArray(detail.subScores).map((raw, index) => {
    const item = asRecord(raw);
    return {
      id: str(item.id, `iq-sub-${index}`),
      category: str(item.category, 'Категори'),
      score: num(item.score),
      max: num(item.max, 100),
      color: str(item.color, '#2563EB'),
    };
  });

  return {
    totalScore,
    label: iqLabel(totalScore),
    percentile: iqPercentile(totalScore),
    description: '',
    subScores,
  };
}

function buildSkills(result: StoredResult | undefined): ProfileSkills {
  const detail = asRecord(result?.detail);
  const radarData = asArray(detail.radarData).map((raw) => {
    const item = asRecord(raw);
    return {
      subject: str(item.subject, 'Чадвар'),
      value: num(item.value),
      fullMark: num(item.fullMark, 100),
    };
  });

  return {
    radarData,
    summary: '',
    strengths: asArray(detail.strengths).map((item) => str(item)).filter(Boolean),
    gaps: asArray(detail.gaps).map((item) => str(item)).filter(Boolean),
  };
}

// ── Gemini-ээс авах хэсэг ────────────────────────────────────────────────

type CareerPayload = {
  iqDescription: string;
  skillsSummary: string;
  mbtiTagline: string;
  workStyle: string;
  professions: {
    name: string;
    englishName: string;
    matchPct: number;
    salaryMin: number;
    salaryMax: number;
    demand: string;
    demandLevel: string;
    trend: string;
    description: string;
    skills: string[];
    subjects: string[];
    environment: string;
    programKeywords: string[];
  }[];
  /** Мэргэжлүүдтэй ижил дараалалтай суралцах замууд. */
  learningPaths: {
    summary: string;
    phases: {
      title: string;
      duration: string;
      goal: string;
      challenge: string;
      items: string[];
    }[];
  }[];
};

type ContextPayload = {
  universities: {
    name: string;
    fullName: string;
    programs: string[];
    professionIndexes: number[];
    matchScore: number;
    location: string;
    country: string;
    type: string;
    tuition: string;
    highlight: string;
    scholarship: string;
  }[];
  workEnvironments: { icon: string; title: string; match: number; desc: string }[];
  collaborationStyles: { style: string; desc: string; match: string }[];
  roadmap: {
    title: string;
    duration: string;
    goal: string;
    challenge: string;
    items: string[];
    xp: number;
  }[];
};

const stringArray = (description: string, min = 3, max = 5) => ({
  type: 'array',
  minItems: min,
  maxItems: max,
  description,
  items: { type: 'string' },
});

/** Нэгдүгээр дуудалт: мэргэжил ба суралцах зам. */
export const CAREER_SCHEMA = {
  type: 'object',
  properties: {
    mbtiTagline: { type: 'string' },
    workStyle: { type: 'string' },
    iqDescription: { type: 'string' },
    skillsSummary: { type: 'string' },
    professions: {
      type: 'array',
      minItems: 5,
      maxItems: 5,
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          englishName: { type: 'string' },
          matchPct: { type: 'integer' },
          salaryMin: { type: 'integer' },
          salaryMax: { type: 'integer' },
          demand: { type: 'string' },
          demandLevel: {
            type: 'string',
            enum: ['very-high', 'high', 'medium', 'low'],
          },
          trend: { type: 'string' },
          description: { type: 'string' },
          skills: { type: 'array', items: { type: 'string' } },
          subjects: { type: 'array', items: { type: 'string' } },
          environment: { type: 'string' },
          programKeywords: { type: 'array', items: { type: 'string' } },
        },
        required: [
          'name',
          'englishName',
          'matchPct',
          'salaryMin',
          'salaryMax',
          'demand',
          'demandLevel',
          'trend',
          'description',
          'skills',
          'subjects',
          'environment',
          'programKeywords',
        ],
      },
    },
    // Схемийн үүрлэлт хэт гүн болохоос сэргийлж суралцах замыг мэргэжлээс
    // тусад нь, ижил дараалалтай массивaap авна.
    learningPaths: {
      type: 'array',
      minItems: 5,
      maxItems: 5,
      items: {
        type: 'object',
        properties: {
          summary: { type: 'string' },
          phases: {
            type: 'array',
            minItems: 4,
            maxItems: 4,
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                duration: { type: 'string' },
                goal: { type: 'string' },
                challenge: { type: 'string' },
                items: { type: 'array', items: { type: 'string' } },
              },
              required: ['title', 'duration', 'goal', 'challenge', 'items'],
            },
          },
        },
        required: ['summary', 'phases'],
      },
    },
  },
  required: [
    'mbtiTagline',
    'workStyle',
    'iqDescription',
    'skillsSummary',
    'professions',
    'learningPaths',
  ],
} as const;

/**
 * Хоёрдугаар дуудалт: сургууль, ажлын орчин, roadmap. Бүх талбарыг нэг схемд
 * нэгтгэвэл Gemini схемийг хэт нийлмэл гэж үзэн 400 буцаадаг тул хуваасан.
 */
export const CONTEXT_SCHEMA = {
  type: 'object',
  properties: {
    universities: {
      type: 'array',
      minItems: 6,
      maxItems: 8,
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          fullName: { type: 'string' },
          programs: { type: 'array', items: { type: 'string' } },
          professionIndexes: { type: 'array', items: { type: 'integer' } },
          matchScore: { type: 'integer' },
          location: { type: 'string' },
          country: { type: 'string', enum: ['Монгол', 'Гадаад'] },
          type: { type: 'string' },
          tuition: { type: 'string' },
          highlight: { type: 'string' },
          scholarship: { type: 'string' },
        },
        required: [
          'name',
          'fullName',
          'programs',
          'professionIndexes',
          'matchScore',
          'location',
          'country',
          'type',
          'tuition',
          'highlight',
          'scholarship',
        ],
      },
    },
    workEnvironments: {
      type: 'array',
      minItems: 4,
      maxItems: 4,
      items: {
        type: 'object',
        properties: {
          icon: { type: 'string' },
          title: { type: 'string' },
          match: { type: 'integer' },
          desc: { type: 'string' },
        },
        required: ['icon', 'title', 'match', 'desc'],
      },
    },
    collaborationStyles: {
      type: 'array',
      minItems: 4,
      maxItems: 4,
      items: {
        type: 'object',
        properties: {
          style: { type: 'string' },
          desc: { type: 'string' },
          match: {
            type: 'string',
            enum: ['Маш тохиромжтой', 'Тохиромжтой', 'Бага тохиромжтой'],
          },
        },
        required: ['style', 'desc', 'match'],
      },
    },
    roadmap: {
      type: 'array',
      minItems: 4,
      maxItems: 4,
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          duration: { type: 'string' },
          goal: { type: 'string' },
          challenge: { type: 'string' },
          items: stringArray('Тухайн шатны гол ажлууд', 3, 4),
          xp: { type: 'integer' },
        },
        required: ['title', 'duration', 'goal', 'challenge', 'items', 'xp'],
      },
    },
  },
  required: [
    'universities',
    'workEnvironments',
    'collaborationStyles',
    'roadmap',
  ],
} as const;

const SYSTEM_INSTRUCTION = `Чи бол Монголын карьер чиглүүлэгч зөвлөх. Хэрэглэгчийн MBTI,
IQ болон ур чадварын тестийн бодит үр дүнд тулгуурлан хувийн карьерийн профайл гаргана.

Дүрэм:
- Бүх текстийг монгол хэлээр, 14–25 насны хүнд ойлгомжтой бич.
- Мэргэжлүүдийг Монголын хөдөлмөрийн зах зээлд бодитоор байдаг чиглэлээс сонго.
- Цалинг Монгол төгрөгөөр, сарын дүнгээр (жишээ нь 2500000) бодитой хэмжээнд бич.
- Сургуулиудын дотор Монголын 4-өөс доошгүй, гадаадын 2-оос доошгүй сургууль байлга.
- matchPct-ыг 60–98 хооронд, эрэмбийн дарааллаар буурч байхаар тавь.
- demand талбарт зөвхөн товч шошго бич: "Маш өндөр" / "Өндөр" / "Дунд" / "Бага".
  Эрэлтийн тайлбарыг description дотор бич. trend нь ↑↑↑ / ↑↑ / ↑ / → / ↓ -ийн нэг.
- Тестийн үр дүнг шууд иш татаж, яагаад тохирохыг тайлбарла.
- programKeywords-д зөвхөн ХӨТӨЛБӨРИЙН/мэргэжлийн нэрний түлхүүр үг бич
  (жишээ нь "бизнесийн аналитик", "business analytics"). Сургуулийн нэр бичихгүй.`;

function buildPrompt(input: {
  mbtiType: string;
  mbtiName: string;
  mbtiDescription: string;
  dimensions: MbtiDimensionView[];
  iq: ProfileIq;
  skills: ProfileSkills;
  skillCategories: { label: string; percent: number }[];
}) {
  const dimensionText = input.dimensions
    .map((dimension) => `${dimension.label} ${dimension.value}%`)
    .join(', ');
  const iqText = input.iq.subScores
    .map((sub) => `${sub.category}: ${sub.score}/${sub.max}`)
    .join(', ');
  const skillText = input.skillCategories
    .map((item) => `${item.label}: ${item.percent}%`)
    .join(', ');

  return `Хэрэглэгчийн үнэлгээний үр дүн:

MBTI: ${input.mbtiType} (${input.mbtiName})
Тайлбар: ${input.mbtiDescription}
Хэмжүүрүүд: ${dimensionText}

IQ: ${input.iq.totalScore} (${input.iq.label}, ${input.iq.percentile}-р хувь)
IQ задаргаа: ${iqText || 'задаргаа байхгүй'}

Ур чадвар: ${skillText || 'задаргаа байхгүй'}
Хүчтэй тал: ${input.skills.strengths.join(', ') || '—'}
Хөгжүүлэх тал: ${input.skills.gaps.join(', ') || '—'}

Эдгээрт тулгуурлан хамгийн тохирох 5 мэргэжлийг эрэмбэлэн гарга. learningPaths
массивт мөн 5 суралцах зам, professions-той ЯГ ижил дараалалтайгаар (1-р зам нь
1-р мэргэжлийн) 4 шаттайгаар бич. mbtiTagline, workStyle, iqDescription,
skillsSummary-г хэрэглэгчийн үр дүнд тулгуурлан 1–2 өгүүлбэрээр бич.`;
}

/** Хоёрдугаар дуудалтын prompt — сонгосон мэргэжлүүд дээр тулгуурлана. */
function buildContextPrompt(input: {
  mbtiType: string;
  iqScore: number;
  professions: { name: string; programKeywords: string[] }[];
}) {
  const list = input.professions
    .map(
      (profession, index) =>
        `${index + 1}. ${profession.name} (хөтөлбөрийн түлхүүр үг: ${profession.programKeywords.join(', ')})`,
    )
    .join('\n');

  return `Хэрэглэгчийн MBTI: ${input.mbtiType}, IQ: ${input.iqScore}.
Түүнд санал болгосон 5 мэргэжил:
${list}

Одоо:
1) Эдгээр мэргэжлээр суралцах боломжтой их сургуулиудыг санал болго (Монголд
   4-өөс доошгүй, гадаадад 2-оос доошгүй). Сургууль бүрийн professionIndexes-д
   тухайн сургууль ДЭЭРХ ЖАГСААЛТЫН аль мэргэжлүүдэд тохирохыг дугаараар бич
   (жишээ нь [1, 3]). programs-д тухайн сургуулийн хөтөлбөрийн нэрийг бич.
2) Ажлын орчин 4, хамтран ажиллах хэв маяг 4-ийг тохирлын хувиар үнэл.
3) Одооноос мэргэжилтэн болох хүртэлх 4 шаттай ерөнхий roadmap гарга. Шат бүрийн
   xp нь 300–1200 хооронд, шат дараалан ихсэж байг.`;
}

// ── Профайл үүсгэх ба хадгалах ───────────────────────────────────────────

const ROADMAP_STATUS: ProfileRoadmapPhase['status'][] = [
  'current',
  'upcoming',
  'planned',
  'planned',
];
const ROADMAP_COLORS = [
  'bg-[#1b3a6b]',
  'bg-blue-500',
  'bg-violet-500',
  'bg-[#F59E0B]',
];

export async function generateCareerProfile({
  results,
  userName,
  signal,
}: {
  results: StoredResults;
  userName: string;
  signal?: AbortSignal;
}): Promise<CareerProfile> {
  const mbtiDetail = asRecord(results.mbti?.detail);
  const rawType = str(results.mbti?.summary, 'INTJ');
  const mbtiType: MbtiType = isMbtiType(rawType) ? rawType : 'INTJ';
  const typeInfo = MBTI_TYPES[mbtiType];
  const dimensions = mbtiDimensions(mbtiDetail);
  const iq = buildIq(results.iq);
  const skills = buildSkills(results.skills);
  const skillCategories = asArray(
    asRecord(results.skills?.detail).categories,
  ).map((raw) => {
    const item = asRecord(raw);
    return { label: str(item.label, 'Чадвар'), percent: num(item.percent) };
  });

  // Хоёр дуудалт: нэг схемд бүгдийг нэгтгэвэл Gemini хэт нийлмэл гэж
  // татгалздаг. Хоёрдугаарт мэргэжлүүдийг өгснөөр сургуулиуд нь мэргэжилтэйгээ
  // илүү сайн тааруулагдана.
  const { data, model } = await generateJson<CareerPayload>({
    systemInstruction: SYSTEM_INSTRUCTION,
    prompt: buildPrompt({
      mbtiType,
      mbtiName: typeInfo.name,
      mbtiDescription: typeInfo.description,
      dimensions,
      iq,
      skills,
      skillCategories,
    }),
    schema: CAREER_SCHEMA as unknown as Record<string, unknown>,
    signal,
  });


  // Схемгүй хувилбарт Gemini талбар алдаж/өөр төрлөөр буцааж магадгүй тул
  // бүх талбарыг хэлбэржүүлж авна.
  const learningPaths = asArray(data.learningPaths);
  const professions: ProfileProfession[] = asArray(data.professions).map(
    (raw, index) => {
      const item = asRecord(raw);
      const name = str(item.name, `Мэргэжил ${index + 1}`);
      const path = asRecord(learningPaths[index]);
      const demandLevel = (
        ['very-high', 'high', 'medium', 'low'] as const
      ).includes(item.demandLevel as ProfileProfession['demandLevel'])
        ? (item.demandLevel as ProfileProfession['demandLevel'])
        : 'medium';

      return {
        id: slug(str(item.englishName, name), index),
        rank: index + 1,
        name,
        englishName: str(item.englishName, name),
        matchPct: clamp(num(item.matchPct, 70), 1, 100),
        salaryMin: Math.max(0, num(item.salaryMin)),
        salaryMax: Math.max(0, num(item.salaryMax)),
        // Модель урт тайлбар бичих тохиолдол бий — badge-д товч шошго үлдээнэ.
        demand:
          str(item.demand).length <= 16
            ? str(item.demand, DEMAND_LABELS[demandLevel])
            : DEMAND_LABELS[demandLevel],
        demandLevel,
        trend: str(item.trend, '→').slice(0, 3),
        description: str(item.description),
        skills: strList(item.skills),
        subjects: strList(item.subjects),
        environment: str(item.environment),
        programKeywords: strList(item.programKeywords, [name]),
        learningPath: {
          summary: str(path.summary),
          phases: asArray(path.phases).map((rawPhase) => {
            const phase = asRecord(rawPhase);
            return {
              title: str(phase.title, 'Шат'),
              duration: str(phase.duration),
              goal: str(phase.goal),
              challenge: str(phase.challenge),
              items: strList(phase.items),
            };
          }),
        },
      };
    },
  );

  if (!professions.length) {
    throw new GeminiError('Gemini мэргэжлийн санал буцаасангүй.', 502);
  }

  const { data: context } = await generateJson<ContextPayload>({
    systemInstruction: SYSTEM_INSTRUCTION,
    prompt: buildContextPrompt({
      mbtiType,
      iqScore: iq.totalScore,
      professions: professions.map((profession) => ({
        name: profession.name,
        programKeywords: profession.programKeywords,
      })),
    }),
    schema: CONTEXT_SCHEMA as unknown as Record<string, unknown>,
    signal,
  });

  const universities: ProfileUniversity[] = asArray(context.universities).map(
    (raw, index) => {
      const item = asRecord(raw);
      const name = str(item.name, `Сургууль ${index + 1}`);
      return {
        id: slug(name, index),
        name,
        fullName: str(item.fullName, name),
        programs: strList(item.programs),
        // 1-ээс тоолсон индексийг мэргэжлийн id болгоно.
        professionIds: asArray(item.professionIndexes)
          .map((raw) => professions[num(raw) - 1]?.id)
          .filter((id): id is string => Boolean(id)),
        matchScore: clamp(num(item.matchScore, 70), 1, 100),
        location: str(item.location),
        country: str(item.country) === 'Гадаад' ? 'Гадаад' : 'Монгол',
        type: str(item.type),
        tuition: str(item.tuition),
        highlight: str(item.highlight),
        scholarship: str(item.scholarship),
      };
    },
  );

  const totalXP = (Object.keys(MODULE_META) as ModuleCode[]).reduce(
    (total, code) => (results[code] ? total + MODULE_META[code].xp : total),
    0,
  );

  const completedAt = (results.skills?.at ?? results.mbti?.at ?? new Date())
    .toISOString()
    .slice(0, 10);

  return {
    model,
    generatedAt: new Date().toISOString(),
    user: {
      name: userName,
      grade: `${mbtiType} · IQ ${iq.totalScore}`,
      completedAt,
      totalXP,
    },
    mbti: {
      type: mbtiType,
      mongolianName: typeInfo.name,
      tagline: str(data.mbtiTagline),
      description: typeInfo.description,
      dimensions,
      compatibleTypes: compatibleTypes(mbtiType),
      workStyle: str(data.workStyle),
      strengths: typeInfo.strengths,
    },
    iq: { ...iq, description: str(data.iqDescription) },
    skills: { ...skills, summary: str(data.skillsSummary) },
    professions,
    universities,
    workEnvironments: asArray(context.workEnvironments).map((raw, index) => {
      const item = asRecord(raw);
      const title = str(item.title, `Орчин ${index + 1}`);
      return {
        id: slug(title, index),
        icon: str(item.icon, '💼'),
        title,
        match: clamp(num(item.match, 70), 1, 100),
        desc: str(item.desc),
      };
    }),
    collaborationStyles: asArray(context.collaborationStyles).map(
      (raw, index) => {
        const item = asRecord(raw);
        const style = str(item.style, `Хэв маяг ${index + 1}`);
        return {
          id: slug(style, index),
          style,
          desc: str(item.desc),
          match: str(item.match, 'Тохиромжтой'),
        };
      },
    ),
    roadmap: asArray(context.roadmap).map((raw, index) => {
      const item = asRecord(raw);
      return {
        id: `roadmap-phase${index + 1}`,
        phase: index + 1,
        title: str(item.title, `Шат ${index + 1}`),
        status: ROADMAP_STATUS[index] ?? 'planned',
        color: ROADMAP_COLORS[index] ?? 'bg-slate-500',
        duration: str(item.duration),
        goal: str(item.goal),
        challenge: str(item.challenge),
        items: strList(item.items),
        xp: Math.max(0, num(item.xp, 300 * (index + 1))),
      };
    }),
  };
}

// ── DB-тэй харилцах хэсэг ────────────────────────────────────────────────

/** Хэрэглэгчийн хамгийн сүүлийн session-ы модуль тус бүрийн шинэ үр дүн. */
export async function loadLatestResults(
  db: PrismaClient,
  userId: string,
): Promise<{ sessionId: string | null; results: StoredResults }> {
  const session = await db.assessmentSession.findFirst({
    where: { userId },
    orderBy: { startedAt: 'desc' },
    include: {
      moduleResults: {
        orderBy: { completedAt: 'desc' },
        include: { module: true },
      },
    },
  });

  if (!session) return { sessionId: null, results: {} };

  const results: StoredResults = {};
  for (const row of session.moduleResults) {
    const code = row.module.code as ModuleCode;
    if (code in MODULE_META && !results[code]) {
      results[code] = {
        summary: row.resultSummary,
        detail: row.resultDetail,
        at: row.completedAt,
      };
    }
  }

  return { sessionId: session.id, results };
}

/** Хадгалсан профайлыг уншина. */
export async function loadStoredProfile(
  db: PrismaClient,
  sessionId: string,
): Promise<CareerProfile | null> {
  const row = await db.moduleResult.findFirst({
    where: { sessionId, module: { code: PROFILE_MODULE_CODE } },
    orderBy: { completedAt: 'desc' },
  });

  return (row?.resultDetail as CareerProfile | null) ?? null;
}

/**
 * Профайлыг ModuleResult-д (`career_profile` модулиар) хадгалж, санал болгосон
 * мэргэжлүүдийг CareerRecommendation болгон бичнэ.
 */
export async function saveProfile(
  db: PrismaClient,
  sessionId: string,
  profile: CareerProfile,
): Promise<void> {
  const module = await db.assessmentModule.upsert({
    where: { code: PROFILE_MODULE_CODE },
    update: {},
    create: {
      code: PROFILE_MODULE_CODE,
      name: 'AI карьерийн профайл',
      orderIndex: 4,
    },
  });

  await db.moduleResult.deleteMany({
    where: { sessionId, moduleId: module.id },
  });

  await db.moduleResult.create({
    data: {
      sessionId,
      moduleId: module.id,
      resultSummary: `${profile.professions[0]?.name ?? ''} (${geminiModel()})`,
      resultDetail: profile as unknown as object,
    },
  });

  await db.careerRecommendation.deleteMany({ where: { sessionId } });
  await db.careerRecommendation.createMany({
    data: profile.professions.map((profession) => ({
      sessionId,
      careerTitle: profession.name,
      matchScore: profession.matchPct,
    })),
  });
}
