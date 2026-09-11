// Ур чадварын тестийн оноог 6 чиглэлээр тооцно. Хариулт бүр 0–3 оноотой
// (skillsTestData дахь `value`), тул чиглэл тус бүрийн хувийг гаргана.

export const SKILL_CATEGORIES = [
  { key: 'problem_solving', label: 'Асуудал шийдэх', icon: '🧩' },
  { key: 'communication', label: 'Харилцаа', icon: '🤝' },
  { key: 'creativity', label: 'Бүтээлч', icon: '🎨' },
  { key: 'organization', label: 'Зохион байгуулалт', icon: '🗂️' },
  { key: 'digital', label: 'Дижитал', icon: '💻' },
  { key: 'leadership', label: 'Манлайлал', icon: '🏆' },
] as const;

export type SkillCategoryKey = (typeof SKILL_CATEGORIES)[number]['key'];

/** Радар график дахь 4 тэнхлэг — 6 чиглэлээс бүрдэнэ. */
const RADAR_AXES: { subject: string; categories: SkillCategoryKey[] }[] = [
  { subject: 'Техник', categories: ['digital', 'problem_solving'] },
  { subject: 'Нийгмийн', categories: ['communication'] },
  { subject: 'Бүтээлч', categories: ['creativity'] },
  { subject: 'Удирдлага', categories: ['leadership', 'organization'] },
];

const MAX_VALUE_PER_QUESTION = 3;

export type SkillsQuestionLike = { id: string; category?: string };

export type SkillsCategoryScore = {
  key: string;
  label: string;
  percent: number;
  answered: number;
  total: number;
};

export type SkillsResult = {
  overallPercent: number;
  answeredCount: number;
  totalQuestions: number;
  categories: SkillsCategoryScore[];
  radarData: { subject: string; value: number; fullMark: number }[];
  /** Хамгийн өндөр 3 чиглэл. */
  strengths: string[];
  /** Хамгийн доогуур 2 чиглэл. */
  gaps: string[];
};

const percent = (earned: number, max: number) =>
  max ? Math.round((earned / max) * 100) : 0;

export function calculateSkillsResult(
  questions: SkillsQuestionLike[],
  answers: Record<string, number>,
): SkillsResult {
  const categories: SkillsCategoryScore[] = SKILL_CATEGORIES.map(({ key, label }) => {
    const items = questions.filter((question) => question.category === key);
    const answered = items.filter(
      (question) => answers[question.id] !== undefined,
    );
    const earned = answered.reduce(
      (total, question) => total + (answers[question.id] ?? 0),
      0,
    );
    return {
      key,
      label,
      // Хариулаагүй асуултыг тооцохгүй — хариулсан хэсгийн хувиар үнэлнэ.
      percent: percent(earned, answered.length * MAX_VALUE_PER_QUESTION),
      answered: answered.length,
      total: items.length,
    };
  });

  const byKey = new Map(categories.map((item) => [item.key, item]));
  const radarData = RADAR_AXES.map((axis) => {
    const parts = axis.categories.flatMap((key) => {
      const item = byKey.get(key);
      return item ? [item] : [];
    });
    const value = parts.length
      ? Math.round(
          parts.reduce((total, item) => total + item.percent, 0) / parts.length,
        )
      : 0;
    return { subject: axis.subject, value, fullMark: 100 };
  });

  const ranked = [...categories].sort((a, b) => b.percent - a.percent);
  const answeredCount = Object.keys(answers).length;
  const earnedTotal = questions.reduce(
    (total, question) => total + (answers[question.id] ?? 0),
    0,
  );

  return {
    overallPercent: percent(earnedTotal, answeredCount * MAX_VALUE_PER_QUESTION),
    answeredCount,
    totalQuestions: questions.length,
    categories,
    radarData,
    strengths: ranked.slice(0, 3).map((item) => item.label),
    gaps: ranked
      .slice(-2)
      .reverse()
      .map((item) => item.label),
  };
}
