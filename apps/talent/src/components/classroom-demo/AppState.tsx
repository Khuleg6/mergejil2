'use client';

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import type { PeepsSelection } from './peeps/options';
import type { Database, AssignmentPhase } from './lib/types';
import { seedDatabase, AVATAR_CATALOG, PRACTICE_ITEMS } from './lib/seed';
import { localizeDemoDatabase } from './lib/localize';
import * as M from './lib/mutations';

interface AppStateValue {
  db: Database;
  savePeeps: (studentId: string, selection: PeepsSelection) => void;
  createClass: (name: string, teacherId: string) => void;
  addStudentToClass: (classId: string, name: string, phone: string) => void;
  uploadReadingMaterial: (
    classId: string,
    title: string,
    bodyText: string,
  ) => void;
  toggleVocabWord: (materialId: string, word: string) => void;
  createAssignment: (
    classId: string,
    materialId: string,
    wordIds: string[],
  ) => void;
  unlockPhase: (assignmentId: string, phase: AssignmentPhase) => void;
  submitWordResponse: (
    assignmentId: string,
    studentId: string,
    wordId: string,
    phase: AssignmentPhase,
    text: string,
  ) => void;
  gradeWordResponse: (
    responseId: string,
    grade: 0 | 1 | 2,
    feedback?: string,
  ) => void;
  chooseAvatar: (studentId: string, avatarId: string) => void;
  submitExtraPracticeAttempt: (studentId: string, correct: boolean) => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [db, setDb] = useState<Database>(() => seedDatabase());
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState('');
  useEffect(() => {
    try {
      const saved = localStorage.getItem('talent-classroom-demo-v1');
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (isDatabase(parsed)) setDb(localizeDemoDatabase(parsed));
      }
    } catch {
      setStorageError('Туршилтын өгөгдлийг сэргээж чадсангүй.');
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem('talent-classroom-demo-v1', JSON.stringify(db));
    } catch {
      setStorageError(
        'Хөтчийн хадгалах сан дүүрсэн эсвэл хаалттай тул өөрчлөлтийг хадгалж чадсангүй.',
      );
    }
  }, [db, ready]);

  const createClass = useCallback((name: string, teacherId: string) => {
    setDb((prev) => M.createClass(prev, name, teacherId).db);
  }, []);
  const addStudentToClass = useCallback(
    (classId: string, name: string, phone: string) => {
      setDb((prev) => M.addStudentToClass(prev, classId, name, phone).db);
    },
    [],
  );
  const uploadReadingMaterial = useCallback(
    (classId: string, title: string, bodyText: string) => {
      setDb(
        (prev) => M.uploadReadingMaterial(prev, classId, title, bodyText).db,
      );
    },
    [],
  );
  const toggleVocabWord = useCallback((materialId: string, word: string) => {
    setDb((prev) => M.toggleVocabWord(prev, materialId, word));
  }, []);
  const createAssignment = useCallback(
    (classId: string, materialId: string, wordIds: string[]) => {
      setDb(
        (prev) => M.createAssignment(prev, classId, materialId, wordIds).db,
      );
    },
    [],
  );
  const unlockPhase = useCallback(
    (assignmentId: string, phase: AssignmentPhase) => {
      setDb((prev) => M.unlockPhase(prev, assignmentId, phase).db);
    },
    [],
  );
  const submitWordResponse = useCallback(
    (
      assignmentId: string,
      studentId: string,
      wordId: string,
      phase: AssignmentPhase,
      text: string,
    ) => {
      setDb(
        (prev) =>
          M.submitWordResponse(
            prev,
            assignmentId,
            studentId,
            wordId,
            phase,
            text,
          ).db,
      );
    },
    [],
  );
  const gradeWordResponse = useCallback(
    (responseId: string, grade: 0 | 1 | 2, feedback?: string) => {
      setDb(
        (prev) => M.gradeWordResponse(prev, responseId, grade, feedback).db,
      );
    },
    [],
  );
  const chooseAvatar = useCallback((studentId: string, avatarId: string) => {
    setDb((prev) => {
      const next = M.chooseAvatar(prev, studentId, avatarId).db;
      return {
        ...next,
        students: next.students.map((student) =>
          student.id === studentId ? { ...student, peeps: undefined } : student,
        ),
      };
    });
  }, []);
  const submitExtraPracticeAttempt = useCallback(
    (studentId: string, correct: boolean) => {
      setDb(
        (prev) => M.submitExtraPracticeAttempt(prev, studentId, correct).db,
      );
    },
    [],
  );

  const savePeeps = (studentId: string, selection: PeepsSelection) => {
    setDb((prev) => ({
      ...prev,
      students: prev.students.map((student) =>
        student.id === studentId
          ? { ...student, peeps: selection, avatarId: student.avatarId ?? 'a1' }
          : student,
      ),
    }));
  };

  const value: AppStateValue = {
    savePeeps,
    db,
    createClass,
    addStudentToClass,
    uploadReadingMaterial,
    toggleVocabWord,
    createAssignment,
    unlockPhase,
    submitWordResponse,
    gradeWordResponse,
    chooseAvatar,
    submitExtraPracticeAttempt,
  };

  return (
    <AppStateContext.Provider value={value}>
      {storageError && <p role="alert">{storageError}</p>}
      {ready ? children : <p role="status">Ачаалж байна…</p>}
    </AppStateContext.Provider>
  );
};

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}

const isDatabase = (value: unknown): value is Database => {
  if (!value || typeof value !== 'object') return false;
  return [
    'classes',
    'students',
    'materials',
    'vocabWords',
    'assignments',
    'responses',
  ].every((key) => key in value && Array.isArray(Reflect.get(value, key)));
};

export { AVATAR_CATALOG, PRACTICE_ITEMS };
