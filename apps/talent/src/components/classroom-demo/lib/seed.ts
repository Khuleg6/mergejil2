import type { Database, Avatar, ExtraPracticeItem } from './types';
import { isoDaysAgo } from './selectors';

export function seedDatabase(): Database {
  return {
    classes: [{ id: 'c1', name: '8А анги', teacherId: 't1' }],
    students: [
      {
        id: 's1',
        role: 'STUDENT',
        classId: 'c1',
        name: 'Номин',
        phone: '5550102231',
        level: 3,
        streakCount: 5,
        avatarId: 'a1',
        lastPracticeDate: isoDaysAgo(1),
      },
      {
        id: 's2',
        role: 'STUDENT',
        classId: 'c1',
        name: 'Тэмүүлэн',
        phone: '5550109987',
        level: 2,
        streakCount: 1,
        avatarId: null,
        lastPracticeDate: null,
      },
      {
        id: 's3',
        role: 'STUDENT',
        classId: 'c1',
        name: 'Ану',
        phone: '5550104410',
        level: 4,
        streakCount: 13,
        avatarId: 'a3',
        lastPracticeDate: isoDaysAgo(1),
      },
    ],
    materials: [
      {
        id: 'm1',
        classId: 'c1',
        title: 'Намрын ой',
        bodyText:
          'Номин өвөөгийнхөө хамт ойд очлоо. Жим даган алхахад моддын завсраар нар тусаж байв. Навчис салхинд сэрчигнэнэ. Тэд ойн захад хэсэг амраад гэртээ харилаа.',
      },
    ],
    vocabWords: [
      { id: 'w1', materialId: 'm1', word: 'жим', position: 0 },
      { id: 'w2', materialId: 'm1', word: 'навчис', position: 1 },
      { id: 'w3', materialId: 'm1', word: 'сэрчигнэнэ', position: 2 },
    ],
    assignments: [
      {
        id: 'as1',
        classId: 'c1',
        materialId: 'm1',
        wordIds: ['w1', 'w2', 'w3'],
        phase1Unlocked: true,
        phase2Unlocked: false,
        phase3Unlocked: false,
        status: 'ACTIVE',
        dueAt: null,
      },
    ],
    responses: [
      {
        id: 'r1',
        assignmentId: 'as1',
        studentId: 's1',
        wordId: 'w1',
        phase: 'PREDICT',
        text: 'Хүмүүсийн явдаг нарийн зам гэж бодож байна.',
        grade: null,
        feedback: '',
        submittedAt: new Date().toISOString(),
      },
    ],
  };
}

/** First four are free starters, available from onboarding on day one.
 *  The rest unlock purely from streakCount — see selectors.avatarUnlocked. */
export const AVATAR_CATALOG: Avatar[] = [
  { id: 'a1', name: 'Хайрга', req: 0, color: '#997cf2' },
  { id: 'a2', name: 'Зэгс', req: 0, color: '#7a54ef' },
  { id: 'a3', name: 'Оч', req: 0, color: '#582ddc' },
  { id: 'a4', name: 'Бут', req: 0, color: '#3c1e95' },
  { id: 'a5', name: 'Боомт', req: 7, color: '#717171' },
  { id: 'a6', name: 'Намаг', req: 14, color: '#555555' },
  { id: 'a7', name: 'Цог', req: 30, color: '#eb664d' },
  { id: 'a8', name: 'Гэгээ', req: 60, color: '#de2300' },
];

export const PRACTICE_ITEMS: ExtraPracticeItem[] = [
  {
    id: 'p1',
    level: 1,
    word: 'аяга',
    correct: 'cup',
    distractors: ['book', 'tree'],
  },
  {
    id: 'p2',
    level: 1,
    word: 'муур',
    correct: 'cat',
    distractors: ['shoe', 'book'],
  },
  {
    id: 'p3',
    level: 2,
    word: 'ном',
    correct: 'book',
    distractors: ['cup', 'tree'],
  },
  {
    id: 'p4',
    level: 2,
    word: 'гутал',
    correct: 'shoe',
    distractors: ['cat', 'cup'],
  },
  {
    id: 'p5',
    level: 3,
    word: 'мод',
    correct: 'tree',
    distractors: ['cup', 'shoe'],
  },
];
