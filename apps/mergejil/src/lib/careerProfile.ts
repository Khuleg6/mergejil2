// Гурван тестийн үр дүнгээс Gemini-ээр үүсгэсэн карьерийн профайлын хэлбэр.
// Энэ хэлбэр нь /roadmap хуудасны компонентуудын prop-той тохирно.

export const MODULE_CODES = ['mbti', 'iq', 'skills'] as const;
export type ModuleCode = (typeof MODULE_CODES)[number];

/** Профайлыг DB-д ModuleResult болгон хадгалахад ашиглах модулийн код. */
export const PROFILE_MODULE_CODE = 'career_profile';

export const MODULE_META: Record<
  ModuleCode,
  { name: string; durationMin: number; orderIndex: number; xp: number }
> = {
  mbti: { name: 'MBTI Хувийн шинж', durationMin: 10, orderIndex: 1, xp: 120 },
  iq: { name: 'IQ Танин мэдэхүй', durationMin: 15, orderIndex: 2, xp: 150 },
  skills: { name: 'Ур чадвар', durationMin: 8, orderIndex: 3, xp: 100 },
};

export type MbtiDimensionView = {
  id: string;
  left: string;
  right: string;
  value: number;
  side: 'left' | 'right';
  label: string;
};

export type ProfileMbti = {
  type: string;
  mongolianName: string;
  tagline: string;
  description: string;
  dimensions: MbtiDimensionView[];
  compatibleTypes: string[];
  workStyle: string;
  /** Тухайн төрлийн гол давуу талууд. */
  strengths: string[];
};

export type ProfileIq = {
  totalScore: number;
  label: string;
  percentile: number;
  description: string;
  subScores: {
    id: string;
    category: string;
    score: number;
    max: number;
    color: string;
  }[];
};

export type ProfileSkills = {
  radarData: { subject: string; value: number; fullMark: number }[];
  summary: string;
  strengths: string[];
  gaps: string[];
};

export type ProfileRoadmapPhase = {
  id: string;
  phase: number;
  title: string;
  status: 'current' | 'upcoming' | 'planned';
  color: string;
  duration: string;
  goal: string;
  challenge: string;
  items: string[];
  xp: number;
};

export type ProfileProfession = {
  id: string;
  rank: number;
  name: string;
  englishName: string;
  matchPct: number;
  salaryMin: number;
  salaryMax: number;
  demand: string;
  demandLevel: 'very-high' | 'high' | 'medium' | 'low';
  trend: string;
  description: string;
  skills: string[];
  subjects: string[];
  environment: string;
  /** Их сургуулийн хөтөлбөртэй тааруулахад ашиглах түлхүүр үгс. */
  programKeywords: string[];
  /** Тухайн мэргэжлийн суралцах зам — RoadmapSection-д харагдана. */
  learningPath: {
    summary: string;
    phases: {
      title: string;
      duration: string;
      goal: string;
      challenge: string;
      items: string[];
    }[];
  };
};

export type ProfileUniversity = {
  id: string;
  /** Ямар мэргэжлүүдэд тохирохыг AI заана (мэргэжлийн id-ууд). */
  professionIds: string[];
  name: string;
  fullName: string;
  programs: string[];
  matchScore: number;
  location: string;
  country: string;
  type: string;
  tuition: string;
  highlight: string;
  scholarship: string;
};

export type CareerProfile = {
  /** Профайлыг үүсгэсэн Gemini модель. */
  model: string;
  generatedAt: string;
  user: { name: string; grade: string; completedAt: string; totalXP: number };
  mbti: ProfileMbti;
  iq: ProfileIq;
  skills: ProfileSkills;
  professions: ProfileProfession[];
  universities: ProfileUniversity[];
  workEnvironments: {
    id: string;
    icon: string;
    title: string;
    match: number;
    desc: string;
  }[];
  collaborationStyles: {
    id: string;
    style: string;
    desc: string;
    match: string;
  }[];
  roadmap: ProfileRoadmapPhase[];
};

/**
 * Сонгосон мэргэжилд тохирох сургуулиудыг шүүнэ: эхлээд AI-ийн заасан
 * холбоосоор, байхгүй бол хөтөлбөрийн нэрний түлхүүр үгээр.
 */
export function universitiesForProfession(
  universities: ProfileUniversity[],
  profession: { id: string; programKeywords: string[] } | undefined,
): ProfileUniversity[] {
  if (!profession) return universities;

  const linked = universities.filter((university) =>
    university.professionIds?.includes(profession.id),
  );
  if (linked.length) return linked;

  return matchUniversitiesToProfession(
    universities,
    profession.programKeywords,
  );
}

/** Мэргэжлийн түлхүүр үгээр их сургуулийн хөтөлбөрүүдийг шүүнэ. */
export function matchUniversitiesToProfession<
  T extends { programs: string[] },
>(universities: T[], keywords: string[]): T[] {
  if (!keywords.length) return universities;
  const patterns = keywords.map(
    (keyword) => new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
  );

  const matched = universities.flatMap((university) => {
    const programs = university.programs.filter((program) =>
      patterns.some((pattern) => pattern.test(program)),
    );
    return programs.length ? [{ ...university, programs }] : [];
  });

  // Түлхүүр үг таарахгүй бол хоосон биш, бүх сургуулийг үзүүлнэ.
  return matched.length ? matched : universities;
}
