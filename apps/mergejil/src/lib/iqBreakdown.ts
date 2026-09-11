// IQ тестийн хариултыг категориар задалж, /roadmap хуудасны IQ хэсэгт
// шаардлагатай дэд онооны хэлбэрт хөрвүүлнэ.

const CATEGORY_ORDER = [
  'logical_reasoning',
  'pattern_recognition',
  'numerical_sequence',
  'spatial_reasoning',
  'verbal_analogy',
] as const;

const CATEGORY_COLORS: Record<string, string> = {
  logical_reasoning: '#2563EB',
  pattern_recognition: '#7C3AED',
  numerical_sequence: '#059669',
  spatial_reasoning: '#D97706',
  verbal_analogy: '#DB2777',
};

export type IqAnswerLike = { questionId: string; isCorrect: boolean };
export type IqQuestionLike = { id: string; category: string };

export type IqSubScore = {
  id: string;
  category: string;
  score: number;
  max: number;
  color: string;
};

/** IQ оноог хүн ойлгох шошгоор нэрлэнэ. */
export function iqLabel(score: number): string {
  if (score >= 130) return 'Маш өндөр';
  if (score >= 115) return 'Өндөр';
  if (score >= 90) return 'Дундаж';
  return 'Доод дундаж';
}

/**
 * IQ оноог хүн амьтны дунджаас (100, стандарт хазайлт 15) хэдэн хувийнд
 * байгааг ойролцоогоор тооцно.
 */
export function iqPercentile(score: number): number {
  const z = (score - 100) / 15;
  // Логистик тархалтаар нормаль тархалтыг ойролцоолно.
  const value = 1 / (1 + Math.exp(-1.702 * z));
  return Math.min(99, Math.max(1, Math.round(value * 100)));
}

export function iqSubScores(
  questions: IqQuestionLike[],
  answers: IqAnswerLike[],
  categoryLabels: Record<string, string>,
): IqSubScore[] {
  const categoryOf = new Map(questions.map((q) => [q.id, q.category]));

  return CATEGORY_ORDER.flatMap((category) => {
    const items = answers.filter(
      (answer) => categoryOf.get(answer.questionId) === category,
    );
    if (!items.length) return [];
    const correct = items.filter((answer) => answer.isCorrect).length;
    return [
      {
        id: `iq-sub-${category}`,
        category: categoryLabels[category] ?? category,
        score: Math.round((correct / items.length) * 100),
        max: 100,
        color: CATEGORY_COLORS[category] ?? '#2563EB',
      },
    ];
  });
}
