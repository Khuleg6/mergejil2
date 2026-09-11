import { isDemoMode } from './demo-mode';

type DemoStudent = {
  id: string;
  name: string;
  phoneNumber: string;
  readingLevel: number;
  joinedAt: string;
};
type DemoWord = { id: string; word: string; position: number };
type DemoMaterial = {
  id: string;
  classId: string;
  title: string;
  bodyText: string;
  vocabWords: DemoWord[];
};
type DemoResponse = {
  id: string;
  studentId: string;
  vocabWordId: string;
  phase: 'PREDICT' | 'CONFIRM' | 'APPLY';
  text: string;
  grade: number | null;
  feedback: string | null;
  submittedAt: string;
};
type DemoAssignment = {
  id: string;
  classId: string;
  materialId: string;
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED';
  dueAt: string | null;
  phase1Unlocked: boolean;
  phase2Unlocked: boolean;
  phase3Unlocked: boolean;
  wordIds: string[];
  responses: DemoResponse[];
};
type DemoClass = {
  id: string;
  name: string;
  createdAt: string;
  students: DemoStudent[];
};
type DemoState = {
  classes: DemoClass[];
  materials: DemoMaterial[];
  assignments: DemoAssignment[];
};

const stateKey = 'talent-demo-state-v1';
const now = '2026-09-08T08:00:00.000Z';
const seed: DemoState = {
  classes: [
    {
      id: 'class-8a',
      name: '8A анги',
      createdAt: now,
      students: [
        {
          id: 'student-demo',
          name: 'Demo Student',
          phoneNumber: '99112233',
          readingLevel: 3,
          joinedAt: now,
        },
        {
          id: 'student-2',
          name: 'Ану',
          phoneNumber: '99223344',
          readingLevel: 2,
          joinedAt: now,
        },
        {
          id: 'student-3',
          name: 'Тэмүүлэн',
          phoneNumber: '99334455',
          readingLevel: 4,
          joinedAt: now,
        },
      ],
    },
    {
      id: 'class-9b',
      name: '9Б анги',
      createdAt: now,
      students: [
        {
          id: 'student-4',
          name: 'Номин',
          phoneNumber: '99445566',
          readingLevel: 3,
          joinedAt: now,
        },
      ],
    },
  ],
  materials: [
    {
      id: 'material-1',
      classId: 'class-8a',
      title: 'Өнөөдрийн уншлага',
      bodyText: 'Нар мандахад хүүхдүүд цэцэрлэгт хүрээлэнгээр алхав.',
      vocabWords: [
        { id: 'word-1', word: 'мандахад', position: 4 },
        { id: 'word-2', word: 'цэцэрлэгт', position: 22 },
      ],
    },
    {
      id: 'material-2',
      classId: 'class-9b',
      title: 'Байгаль дэлхий',
      bodyText: 'Байгаль дэлхийгээ хайрлан хамгаалах нь бидний үүрэг.',
      vocabWords: [{ id: 'word-3', word: 'хамгаалах', position: 25 }],
    },
  ],
  assignments: [
    {
      id: 'assignment-1',
      classId: 'class-8a',
      materialId: 'material-1',
      status: 'ACTIVE',
      dueAt: null,
      phase1Unlocked: true,
      phase2Unlocked: true,
      phase3Unlocked: true,
      wordIds: ['word-1', 'word-2'],
      responses: [
        {
          id: 'response-1',
          studentId: 'student-demo',
          vocabWordId: 'word-1',
          phase: 'PREDICT',
          text: 'Нар гарч эхлэх гэсэн утгатай.',
          grade: null,
          feedback: null,
          submittedAt: now,
        },
        {
          id: 'response-2',
          studentId: 'student-demo',
          vocabWordId: 'word-1',
          phase: 'CONFIRM',
          text: 'Нар тэнгэрийн хаяанаас гарч ирэхийг хэлнэ.',
          grade: 4,
          feedback: 'Маш сайн тайлбарласан байна.',
          submittedAt: now,
        },
        {
          id: 'response-3',
          studentId: 'student-demo',
          vocabWordId: 'word-1',
          phase: 'APPLY',
          text: 'Нар мандахад би сургуульдаа явлаа.',
          grade: 5,
          feedback: 'Үгийг өгүүлбэрт зөв хэрэглэжээ.',
          submittedAt: now,
        },
      ],
    },
  ],
};

const cloneSeed = () => JSON.parse(JSON.stringify(seed)) as DemoState;
const load = (): DemoState => {
  if (typeof window === 'undefined') return cloneSeed();
  const stored = window.localStorage.getItem(stateKey);
  if (!stored) {
    const state = cloneSeed();
    save(state);
    return state;
  }
  try {
    return JSON.parse(stored) as DemoState;
  } catch {
    return cloneSeed();
  }
};
const save = (state: DemoState) =>
  window.localStorage.setItem(stateKey, JSON.stringify(state));
const id = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const bodyOf = (options?: RequestInit) =>
  options?.body
    ? (JSON.parse(String(options.body)) as Record<string, unknown>)
    : {};
const findMaterial = (state: DemoState, materialId: string) =>
  state.materials.find((item) => item.id === materialId);
const required = <T>(value: T | undefined, message: string): T => {
  if (value === undefined) throw new Error(message);
  return value;
};
const part = (match: RegExpMatchArray | null, index: number) => {
  if (!match?.[index]) throw new Error('Invalid demo request.');
  return match[index];
};
const assignmentDetail = (state: DemoState, assignment: DemoAssignment) => {
  const material = required(
    findMaterial(state, assignment.materialId),
    'Material not found.',
  );
  const demoClass = required(
    state.classes.find((item) => item.id === assignment.classId),
    'Class not found.',
  );
  return {
    ...assignment,
    materialTitle: material.title,
    wordCount: assignment.wordIds.length,
    responseCount: assignment.responses.length,
    vocabulary: assignment.wordIds.map((wordId) => ({
      vocabWord: required(
        material.vocabWords.find((word) => word.id === wordId),
        'Word not found.',
      ),
    })),
    class: {
      students: demoClass.students.map((student) => ({
        student: {
          ...student,
          user: { name: student.name },
          responses: assignment.responses.filter(
            (response) => response.studentId === student.id,
          ),
        },
      })),
    },
  };
};

export const demoApi = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  if (!isDemoMode())
    throw new Error('Demo API is only available in demo mode.');
  const state = load();
  const method = options?.method || 'GET';
  const body = bodyOf(options);
  let match: RegExpMatchArray | null;

  if (url === '/api/classes' && method === 'GET')
    return {
      classes: state.classes.map((item) => ({
        id: item.id,
        name: item.name,
        createdAt: item.createdAt,
        studentCount: item.students.length,
      })),
    } as T;
  if (url === '/api/classes' && method === 'POST') {
    const item: DemoClass = {
      id: id('class'),
      name: String(body.name),
      createdAt: new Date().toISOString(),
      students: [],
    };
    state.classes.push(item);
    save(state);
    return { class: { ...item, studentCount: 0 } } as T;
  }
  if ((match = url.match(/^\/api\/classes\/([^/]+)$/))) {
    const item = state.classes.find((value) => value.id === part(match, 1));
    if (!item) throw new Error('Class not found.');
    if (method === 'GET') return { class: item } as T;
    if (method === 'PATCH') {
      item.name = String(body.name);
      save(state);
      return { class: item } as T;
    }
    if (method === 'DELETE') {
      state.classes = state.classes.filter((value) => value.id !== item.id);
      save(state);
      return { deleted: true } as T;
    }
  }
  if (
    (match = url.match(/^\/api\/classes\/([^/]+)\/students$/)) &&
    method === 'POST'
  ) {
    const item = required(
      state.classes.find((value) => value.id === part(match, 1)),
      'Class not found.',
    );
    const phoneNumber = String(body.phoneNumber);
    item.students.push({
      id: id('student'),
      name: 'Demo Student',
      phoneNumber,
      readingLevel: 1,
      joinedAt: new Date().toISOString(),
    });
    save(state);
    return { student: item.students.at(-1) } as T;
  }
  if (
    (match = url.match(/^\/api\/classes\/([^/]+)\/students\/([^/]+)$/)) &&
    method === 'DELETE'
  ) {
    const item = required(
      state.classes.find((value) => value.id === part(match, 1)),
      'Class not found.',
    );
    item.students = item.students.filter(
      (student) => student.id !== part(match, 2),
    );
    save(state);
    return { deleted: true } as T;
  }
  if ((match = url.match(/^\/api\/classes\/([^/]+)\/materials$/))) {
    const classId = match[1];
    if (method === 'GET')
      return {
        materials: state.materials
          .filter((item) => item.classId === classId)
          .map((item) => ({
            id: item.id,
            title: item.title,
            vocabularyCount: item.vocabWords.length,
          })),
      } as T;
    if (method === 'POST') {
      const item: DemoMaterial = {
        id: id('material'),
        classId,
        title: String(body.title),
        bodyText: String(body.bodyText),
        vocabWords: [],
      };
      state.materials.push(item);
      save(state);
      return { material: item } as T;
    }
  }
  if ((match = url.match(/^\/api\/materials\/([^/]+)$/))) {
    const item = findMaterial(state, match[1]);
    if (!item) throw new Error('Material not found.');
    if (method === 'GET') return { material: item } as T;
    if (method === 'PATCH') {
      item.title = String(body.title);
      item.bodyText = String(body.bodyText);
      item.vocabWords = [];
      save(state);
      return { material: item, vocabularyCleared: true } as T;
    }
    if (method === 'DELETE') {
      state.materials = state.materials.filter((value) => value.id !== item.id);
      save(state);
      return { deleted: true } as T;
    }
  }
  if (
    (match = url.match(/^\/api\/materials\/([^/]+)\/vocabulary$/)) &&
    method === 'PUT'
  ) {
    const item = required(findMaterial(state, match[1]), 'Material not found.');
    item.vocabWords = (body.words as { word: string; position: number }[]).map(
      (word) => ({ ...word, id: id('word') }),
    );
    save(state);
    return { words: item.vocabWords } as T;
  }
  if ((match = url.match(/^\/api\/classes\/([^/]+)\/assignments$/))) {
    const classId = match[1];
    if (method === 'GET')
      return {
        assignments: state.assignments
          .filter((item) => item.classId === classId)
          .map((item) => assignmentDetail(state, item)),
      } as T;
    if (method === 'POST') {
      const item: DemoAssignment = {
        id: id('assignment'),
        classId,
        materialId: String(body.materialId),
        status: 'DRAFT',
        dueAt: body.dueAt ? String(body.dueAt) : null,
        phase1Unlocked: false,
        phase2Unlocked: false,
        phase3Unlocked: false,
        wordIds: body.wordIds as string[],
        responses: [],
      };
      state.assignments.push(item);
      save(state);
      return { assignment: item } as T;
    }
  }
  if ((match = url.match(/^\/api\/assignments\/([^/]+)$/))) {
    const item = state.assignments.find((value) => value.id === part(match, 1));
    if (!item) throw new Error('Assignment not found.');
    if (method === 'GET')
      return { assignment: assignmentDetail(state, item) } as T;
    if (method === 'PATCH') {
      item.status = body.status as DemoAssignment['status'];
      save(state);
      return { assignment: item } as T;
    }
  }
  if (
    (match = url.match(/^\/api\/assignments\/([^/]+)\/phases$/)) &&
    method === 'PATCH'
  ) {
    const item = required(
      state.assignments.find((value) => value.id === part(match, 1)),
      'Assignment not found.',
    );
    const field =
      body.phase === 'PREDICT'
        ? 'phase1Unlocked'
        : body.phase === 'CONFIRM'
          ? 'phase2Unlocked'
          : 'phase3Unlocked';
    item[field] = Boolean(body.unlocked);
    save(state);
    return { assignment: item } as T;
  }
  if ((match = url.match(/^\/api\/assignments\/([^/]+)\/responses$/))) {
    const item = required(
      state.assignments.find((value) => value.id === part(match, 1)),
      'Assignment not found.',
    );
    if (method === 'POST') {
      const response: DemoResponse = {
        id: id('response'),
        studentId: 'student-demo',
        vocabWordId: String(body.wordId),
        phase: body.phase as DemoResponse['phase'],
        text: String(body.text),
        grade: null,
        feedback: null,
        submittedAt: new Date().toISOString(),
      };
      item.responses.push(response);
      save(state);
      return { response } as T;
    }
    if (method === 'PATCH') {
      const response = required(
        item.responses.find((value) => value.id === body.responseId),
        'Response not found.',
      );
      response.grade = Number(body.grade);
      response.feedback = String(body.feedback);
      save(state);
      return { response } as T;
    }
  }
  if (url === '/api/student/assignments' && method === 'GET')
    return {
      assignments: state.assignments
        .filter((item) => item.status === 'ACTIVE')
        .map((item) => {
          const material = required(
            findMaterial(state, item.materialId),
            'Material not found.',
          );
          return {
            ...item,
            material: { title: material.title, bodyText: material.bodyText },
            vocabulary: item.wordIds.map((wordId) => ({
              vocabWord: required(
                material.vocabWords.find((word) => word.id === wordId),
                'Word not found.',
              ),
            })),
            responses: item.responses.filter(
              (response) => response.studentId === 'student-demo',
            ),
          };
        }),
    } as T;
  throw new Error(`Demo request is not implemented: ${method} ${url}`);
};
