// Cognitive-function scoring, ported from the melogy/mbti_test reference
// implementation.
//
// Answers move eight function scores (Ne/Ni/Se/Si/Te/Ti/Fe/Fi). The type is
// then derived two ways, as in the original:
//
//   * "Mistype Investigator" — score all 16 stacks (1.4/1.0/0.8/0.2 by
//     position) and rank them.
//   * "Custom formula" — take the two highest-scoring functions, and for each
//     weigh the two types that own it as their dominant function against a
//     handful of stack-consistency checks. Yields a best guess plus a runner-up
//     with a confidence score.
//
// The original hard-coded its normalisation constants for an 80-question run.
// Ours are derived from whichever question bank is passed in, so the bank can
// change without silently skewing every percentage.
//
// Unlike the original, half the Likert items are reverse-keyed: agreeing with
// one argues against its function. Without that, every item rewarded agreement,
// so a respondent's habit of agreeing (or disagreeing) with everything showed
// up as a personality type.

import {
  MBTI_TYPES,
  MBTI_TYPE_LIST,
  type CognitiveFunction,
  type MbtiType,
} from './mbti';

export const COGNITIVE_FUNCTIONS: CognitiveFunction[] = [
  'Ne',
  'Ni',
  'Se',
  'Si',
  'Te',
  'Ti',
  'Fe',
  'Fi',
];

/** Agreement scale for solo/duo items: strongly disagree → strongly agree. */
export const LIKERT_WEIGHTS = [-1, -0.6, 0, 0.6, 1] as const;
/** A/B slider for case items: fully option A → fully option B. */
export const CASE_WEIGHTS = [1, 0.5, 0, -0.5, -1] as const;
/** A duo item's second function moves at 0.7 of the primary's weight. */
export const DUO_SECONDARY_WEIGHT = 0.7;

/** The shape `mbtiScoring` needs from a question; the bank supplies more. */
export interface ScorableQuestion {
  id: string;
  kind: 'solo' | 'duo' | 'case';
  func: CognitiveFunction;
  func2?: CognitiveFunction;
  /** Reverse-keyed item: agreeing argues against `func`, so the weight flips. */
  reverse?: boolean;
}

export type FunctionScores = Record<CognitiveFunction, number>;

/** Answers are `{ [questionId]: choiceIndex }`, choiceIndex 0-4. */
export type Answers = Record<string, number>;

function emptyScores(): FunctionScores {
  return { Ne: 0, Ni: 0, Se: 0, Si: 0, Te: 0, Ti: 0, Fe: 0, Fi: 0 };
}

export function scoreAnswers(
  questions: ScorableQuestion[],
  answers: Answers,
): FunctionScores {
  const scores = emptyScores();

  for (const question of questions) {
    const choice = answers[question.id];
    if (choice === undefined) continue;

    if (question.kind === 'case') {
      const weight = CASE_WEIGHTS[choice] ?? 0;
      scores[question.func] += weight;
      if (question.func2) scores[question.func2] -= weight;
      continue;
    }

    const weight = (LIKERT_WEIGHTS[choice] ?? 0) * (question.reverse ? -1 : 1);
    scores[question.func] += weight;
    if (question.kind === 'duo' && question.func2) {
      scores[question.func2] += weight * DUO_SECONDARY_WEIGHT;
    }
  }

  return scores;
}

/**
 * Largest score each function could reach if every one of its questions were
 * answered at the extreme — the yardstick every percentage below is measured
 * against.
 */
export function maxScores(questions: ScorableQuestion[]): FunctionScores {
  const max = emptyScores();

  for (const question of questions) {
    if (question.kind === 'case') {
      max[question.func] += 1;
      if (question.func2) max[question.func2] += 1;
      continue;
    }
    max[question.func] += 1;
    if (question.kind === 'duo' && question.func2) {
      max[question.func2] += DUO_SECONDARY_WEIGHT;
    }
  }

  return max;
}

/** A function's score as 0-100, where 50 means "neither way". */
export function functionPercent(score: number, max: number): number {
  if (max === 0) return 50;
  const clamped = Math.max(-max, Math.min(max, score));
  return Math.round(((clamped + max) / (2 * max)) * 1000) / 10;
}

/**
 * Rescales every function to -1..1 against its own ceiling.
 *
 * Raw scores aren't comparable across functions: a bank can't give all eight
 * exactly the same number of questions at every weight, so one function's
 * "+3" may be a stronger signal than another's. Comparing raw scores would
 * bake that quirk into the type and tilt the dichotomy bars off centre.
 */
export function normalizeScores(
  scores: FunctionScores,
  max: FunctionScores,
): FunctionScores {
  const normalized = emptyScores();
  for (const fn of COGNITIVE_FUNCTIONS) {
    normalized[fn] = max[fn] === 0 ? 0 : scores[fn] / max[fn];
  }
  return normalized;
}

export interface DichotomyScore {
  /** Letter shown on the left of the bar. */
  first: string;
  second: string;
  firstLabel: string;
  secondLabel: string;
  firstPercent: number;
  secondPercent: number;
  winner: string;
}

/**
 * The four dichotomies. Each side sums its normalised functions and is shifted
 * by how many it has, so the value can't go negative — the same shape as the
 * original's `+31.6`/`+63.2` offsets, but derived rather than hard-coded.
 * Both sides of every dichotomy hold the same number of functions, so a blank
 * test lands exactly on 50/50.
 */
export function dichotomyScores(
  scores: FunctionScores,
  max: FunctionScores,
): DichotomyScore[] {
  const normalized = normalizeScores(scores, max);
  const groups: {
    first: string;
    second: string;
    firstLabel: string;
    secondLabel: string;
    firstFns: CognitiveFunction[];
    secondFns: CognitiveFunction[];
  }[] = [
    {
      first: 'I',
      second: 'E',
      firstLabel: 'Introvert',
      secondLabel: 'Extravert',
      firstFns: ['Ti', 'Fi', 'Si', 'Ni'],
      secondFns: ['Te', 'Fe', 'Se', 'Ne'],
    },
    {
      first: 'S',
      second: 'N',
      firstLabel: 'Observing',
      secondLabel: 'Intuitive',
      firstFns: ['Se', 'Si'],
      secondFns: ['Ne', 'Ni'],
    },
    {
      first: 'T',
      second: 'F',
      firstLabel: 'Thinking',
      secondLabel: 'Feeling',
      firstFns: ['Ti', 'Te'],
      secondFns: ['Fi', 'Fe'],
    },
    {
      first: 'J',
      second: 'P',
      firstLabel: 'Judging',
      secondLabel: 'Prospecting',
      firstFns: ['Te', 'Fe', 'Ni', 'Si'],
      secondFns: ['Ti', 'Fi', 'Ne', 'Se'],
    },
  ];

  const sum = (fns: CognitiveFunction[]) =>
    fns.reduce((total, fn) => total + normalized[fn], 0);

  return groups.map((group) => {
    const firstValue = sum(group.firstFns) + group.firstFns.length;
    const secondValue = sum(group.secondFns) + group.secondFns.length;
    const total = firstValue + secondValue;

    const firstPercent =
      total === 0 ? 50 : Math.round((firstValue / total) * 1000) / 10;

    return {
      first: group.first,
      second: group.second,
      firstLabel: group.firstLabel,
      secondLabel: group.secondLabel,
      firstPercent,
      secondPercent: Math.round((100 - firstPercent) * 10) / 10,
      winner: firstPercent >= 50 ? group.first : group.second,
    };
  });
}

/** Stack-position weights: dominant, auxiliary, tertiary, inferior. */
const STACK_WEIGHTS = [1.4, 1, 0.8, 0.2];

export interface RankedType {
  type: MbtiType;
  percent: number;
}

/**
 * All 16 types scored by how well the stack matches, best first.
 * Takes normalised scores, so every function carries the same weight.
 */
export function rankTypes(normalized: FunctionScores): RankedType[] {
  // Each normalised score tops out at 1, so this is the best possible total.
  const ceiling = STACK_WEIGHTS.reduce((a, b) => a + b, 0);

  const ranked = MBTI_TYPE_LIST.map((type) => {
    const stack = MBTI_TYPES[type].functions;
    const raw = stack.reduce(
      (total, fn, index) => total + normalized[fn] * STACK_WEIGHTS[index],
      0,
    );
    return {
      type,
      percent: Math.round(((raw + ceiling) / (2 * ceiling)) * 1000) / 10,
    };
  });

  return ranked.sort((a, b) => b.percent - a.percent);
}

const TWIN_FUNCTION: Record<CognitiveFunction, CognitiveFunction> = {
  Fi: 'Ti',
  Ti: 'Fi',
  Ni: 'Si',
  Si: 'Ni',
  Se: 'Ne',
  Ne: 'Se',
  Fe: 'Te',
  Te: 'Fe',
};

export interface TypeCandidate {
  type: MbtiType;
  /** Confidence credits; below 0.5 the original calls the result unclear. */
  credit: number;
}

/** The two types that use `fn` as their dominant function. */
function typesWithDominant(fn: CognitiveFunction): MbtiType[] {
  return MBTI_TYPE_LIST.filter((type) => MBTI_TYPES[type].functions[0] === fn);
}

/**
 * Port of the original's "Custom formula": for each of the user's two
 * strongest functions, judge the two types built on it and keep the better fit.
 * Expects normalised scores so the comparisons are like-for-like.
 */
export function candidateTypes(normalized: FunctionScores): TypeCandidate[] {
  const sorted = [...COGNITIVE_FUNCTIONS].sort((a, b) => normalized[b] - normalized[a]);
  const rankOf = (fn: CognitiveFunction) => sorted.indexOf(fn) + 1;

  const candidates: TypeCandidate[] = [];

  for (let i = 0; i < 2; i += 1) {
    const dominant = sorted[i];
    const [typeA, typeB] = typesWithDominant(dominant);
    if (!typeA || !typeB) continue;

    const creditFor = (type: MbtiType, rival: MbtiType) => {
      const stack = MBTI_TYPES[type].functions as CognitiveFunction[];
      const rivalStack = MBTI_TYPES[rival].functions as CognitiveFunction[];
      let credit = 0;

      // Whichever type's middle two functions score higher fits better.
      const middle = normalized[stack[1]] + normalized[stack[2]];
      const rivalMiddle = normalized[rivalStack[1]] + normalized[rivalStack[2]];
      if (middle > rivalMiddle) credit += 1;

      // Auxiliary and tertiary are expected to outrank the inferior.
      credit += normalized[stack[1]] > normalized[stack[3]] ? 0.5 : -0.5;
      credit += normalized[stack[2]] > normalized[stack[3]] ? 0.5 : -0.5;

      // The auxiliary's opposite-attitude twin should sit near the bottom.
      // (The original compared raw scores here, which ties break oddly; the
      // rank comparison is what it was reaching for.)
      const twinRank = rankOf(TWIN_FUNCTION[stack[1]]);
      if (twinRank >= 7) credit += 0.5;

      // And the auxiliary itself should be the second-strongest function.
      credit += (2 - rankOf(stack[1])) * 0.5;

      return credit;
    };

    const creditA = creditFor(typeA, typeB);
    const creditB = creditFor(typeB, typeA);

    candidates.push(
      creditA >= creditB
        ? { type: typeA, credit: creditA }
        : { type: typeB, credit: creditB },
    );
  }

  return candidates.sort((a, b) => b.credit - a.credit);
}

/** Mongolian confidence wording for a candidate's credit score. */
export function confidenceLabel(credit: number): string {
  if (credit < 0.5) return 'ТОДОРХОЙ БИШ';
  if (credit < 1.5) return 'МАГАДЛАЛТАЙ';
  if (credit < 2) return 'САЙН МАГАДЛАЛТАЙ';
  if (credit < 2.5) return 'ӨНДӨР МАГАДЛАЛТАЙ';
  return 'БАТТАЙ';
}

export interface MbtiResult {
  type: MbtiType;
  /**
   * The type you get by reading the four dichotomy bars instead of the
   * function stack — i.e. how a classic 16-letter test would score the same
   * answers. It disagrees with `type` for roughly one respondent in six, so
   * the result screen names it rather than letting the card contradict the
   * bars printed under it.
   */
  dichotomyType: MbtiType;
  /** Runner-up from the custom formula, when there is one. */
  alternativeType?: MbtiType;
  credit: number;
  confidence: string;
  scores: FunctionScores;
  functionPercents: Record<CognitiveFunction, number>;
  dichotomies: DichotomyScore[];
  ranking: RankedType[];
  answeredCount: number;
  totalQuestions: number;
}

/**
 * Result for a self-reported type: no test was taken, so the function scores
 * are the type's own stack rather than anything measured.
 */
export function resultFromKnownType(type: MbtiType): MbtiResult {
  const stack = MBTI_TYPES[type].functions;
  const scores = emptyScores();
  STACK_WEIGHTS.forEach((weight, index) => {
    scores[stack[index]] = weight;
  });

  const max = emptyScores();
  for (const fn of COGNITIVE_FUNCTIONS) max[fn] = STACK_WEIGHTS[0];

  const functionPercents = {} as Record<CognitiveFunction, number>;
  for (const fn of COGNITIVE_FUNCTIONS) {
    functionPercents[fn] = functionPercent(scores[fn], max[fn]);
  }

  const dichotomies = dichotomyScores(scores, max);

  return {
    type,
    dichotomyType: dichotomies.map((d) => d.winner).join('') as MbtiType,
    credit: 0,
    confidence: 'ӨӨРӨӨ ОРУУЛСАН',
    scores,
    functionPercents,
    dichotomies,
    ranking: rankTypes(normalizeScores(scores, max)),
    answeredCount: 0,
    totalQuestions: 0,
  };
}

export function calculateMbtiResult(
  questions: ScorableQuestion[],
  answers: Answers,
): MbtiResult {
  const scores = scoreAnswers(questions, answers);
  const max = maxScores(questions);
  const normalized = normalizeScores(scores, max);
  const ranking = rankTypes(normalized);
  const candidates = candidateTypes(normalized);

  const best = candidates[0] ?? { type: ranking[0].type, credit: 0 };

  const functionPercents = {} as Record<CognitiveFunction, number>;
  for (const fn of COGNITIVE_FUNCTIONS) {
    functionPercents[fn] = functionPercent(scores[fn], max[fn]);
  }

  const dichotomies = dichotomyScores(scores, max);

  return {
    type: best.type,
    dichotomyType: dichotomies.map((d) => d.winner).join('') as MbtiType,
    alternativeType: candidates[1]?.type,
    credit: best.credit,
    confidence: confidenceLabel(best.credit),
    scores,
    functionPercents,
    dichotomies,
    ranking,
    answeredCount: questions.filter((q) => answers[q.id] !== undefined).length,
    totalQuestions: questions.length,
  };
}
