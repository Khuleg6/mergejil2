'use client';

import { useState, type ReactElement } from 'react';
import { useAppState, AVATAR_CATALOG, PRACTICE_ITEMS } from './AppState';
import { PeepsEditor } from './peeps/PeepsEditor';
import { PeepsImage } from './peeps/PeepsImage';
import { peepsPreset } from './peeps/options';
import { SessionBar } from './SessionBar';
import * as S from './lib/selectors';
import type { AssignmentPhase } from './lib/types';

type Tab = 'today' | 'cycle' | 'practice' | 'avatars';

export const StudentShell = ({ studentId }: { studentId: string | null }) => {
  const { db } = useAppState();
  const student = db.students.find((s) => s.id === studentId);
  const [tab, setTab] = useState<Tab>('today');

  if (!student) return null;

  if (!student.avatarId) {
    return (
      <div className="student-shell">
        <SessionBar whoLabel={`${student.name} · Сурагч`} />
        <Onboarding studentId={student.id} />
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'today', label: 'Өнөөдрийн хичээл' },
    { key: 'cycle', label: 'Үгийн дасгал' },
    { key: 'practice', label: 'Нэмэлт дасгал' },
    { key: 'avatars', label: 'Миний дүр' },
  ];

  return (
    <>
      <SessionBar whoLabel={`${student.name} · Сурагч`} />
      <div className="student-shell">
        <nav className="tabs">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={tab === t.key ? 'active' : ''}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        {tab === 'today' && (
          <TodayTab
            studentId={student.id}
            onGoToCycle={() => setTab('cycle')}
          />
        )}
        {tab === 'cycle' && <CycleTab studentId={student.id} />}
        {tab === 'practice' && <PracticeTab studentId={student.id} />}
        {tab === 'avatars' && <AvatarsTab studentId={student.id} />}
      </div>
    </>
  );
};

const Onboarding = ({ studentId }: { studentId: string }) => {
  const { chooseAvatar } = useAppState();
  const starters = AVATAR_CATALOG.filter((a) => a.req === 0);
  const [chosen, setChosen] = useState(starters[0]?.id ?? '');

  return (
    <>
      <h1 className="title" style={{ marginTop: 4 }}>
        Өөрийн дүрийг сонгоорой
      </h1>
      <p className="sub-text">
        Дүрээ хүссэн үедээ сольж болно. Өдөр бүр давтвал шинэ дүр сонгох эрх
        нээгдэнэ.
      </p>
      <div className="card">
        <div role="radiogroup" aria-label="Дүр сонгох" className="avatar-grid">
          {starters.map((a) => (
            <button
              type="button"
              key={a.id}
              role="radio"
              className="avatar-tile"
              aria-checked={a.id === chosen}
              onClick={() => setChosen(a.id)}
            >
              <PeepsImage
                selection={peepsPreset(a.id)}
                alt={a.name}
                size={96}
              />
              <span className="avatar-name">{a.name}</span>
            </button>
          ))}
        </div>
        <button
          className="btn block"
          style={{ marginTop: 16 }}
          onClick={() => chooseAvatar(studentId, chosen)}
        >
          Үргэлжлүүлэх
        </button>
      </div>
    </>
  );
};

const TodayTab = ({
  studentId,
  onGoToCycle,
}: {
  studentId: string;
  onGoToCycle: () => void;
}) => {
  const { db } = useAppState();
  const student = db.students.find((s) => s.id === studentId);
  const assignment = student ? S.assignmentFor(db, student.classId) : undefined;
  const material = assignment
    ? db.materials.find((m) => m.id === assignment.materialId)
    : null;
  if (!student) return null;
  const filled = Math.min(7, student.streakCount);

  return (
    <>
      <div className="peeps-greeting">
        <PeepsImage
          selection={student.peeps ?? peepsPreset(student.avatarId)}
          alt={`${student.name} сурагчийн дүр`}
          size={80}
        />
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: '4px 0 4px' }}>
        Сайн уу, {student.name}!
      </h1>
      <p
        style={{
          color: 'var(--text-color-base)',
          fontSize: 13.5,
          margin: '0 0 20px',
        }}
      >
        Өнөөдрийн хичээл, дасгалаа эндээс эхлүүлээрэй.
      </p>
      <div className="grid2">
        <div className="card">
          {material ? (
            <>
              <h2>{material.title}</h2>
              <p className="meta">
                Хичээлээ орхисон хэсгээсээ үргэлжлүүлээрэй.
              </p>
              <button className="btn outline" onClick={onGoToCycle}>
                Хичээлээ үргэлжлүүлэх
              </button>
            </>
          ) : (
            <>
              <h2>Хичээл хараахан ороогүй байна</h2>
              <p className="meta">
                Багш чинь танай ангид даалгавар хараахан өгөөгүй байна.
              </p>
            </>
          )}
        </div>
        <div className="card">
          <h2>Тасралтгүй давтсан хоног</h2>
          <p style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
            {student.streakCount} хоног
          </p>
          <div className="streak-strip">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`streak-day${i < filled ? ' done' : ''}`}
              />
            ))}
          </div>
          <p className="meta" style={{ margin: '8px 0 0' }}>
            Өнөөдөр ч бас дасгалаа хийж, давтлагаа үргэлжлүүлээрэй.
          </p>
        </div>
      </div>
      {assignment && (
        <div className="card">
          <h2>Миний сурах үгс</h2>
          <p className="meta">Үг бүрийн дасгалыг хэр хийснээ хараарай.</p>
          <table>
            <thead>
              <tr>
                <th>Үг</th>
                <th>Таамаглах</th>
                <th>Бататгах</th>
                <th>Өгүүлбэр зохиох</th>
              </tr>
            </thead>
            <tbody>
              {assignment.wordIds.map((wordId) => {
                const word = S.wordById(db, wordId);
                if (!word) return null;
                const badge = (phase: AssignmentPhase, unlocked: boolean) => {
                  const r = S.getResponse(db, studentId, wordId, phase);
                  if (r) return <span className="badge done">Илгээсэн</span>;
                  if (!unlocked)
                    return <span className="badge locked">Нээгдээгүй</span>;
                  return <span className="badge open">Эхлээгүй</span>;
                };
                return (
                  <tr key={wordId}>
                    <td>{word.word}</td>
                    <td>{badge('PREDICT', assignment.phase1Unlocked)}</td>
                    <td>{badge('CONFIRM', assignment.phase2Unlocked)}</td>
                    <td>{badge('APPLY', assignment.phase3Unlocked)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

const PHASE_ROWS: { phase: AssignmentPhase; label: string }[] = [
  { phase: 'PREDICT', label: 'Утгыг таамаглах' },
  { phase: 'CONFIRM', label: 'Утгыг бататгах' },
  { phase: 'APPLY', label: 'Өгүүлбэр зохиох' },
];

const CycleTab = ({ studentId }: { studentId: string }) => {
  const { db, submitWordResponse } = useAppState();
  const student = db.students.find((s) => s.id === studentId);
  const assignment = student ? S.assignmentFor(db, student.classId) : undefined;
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  if (!student || !assignment) {
    return (
      <div className="card">
        <p className="meta">
          Одоогоор хийх даалгавар алга. Багш чинь даалгавар өгсний дараа энд
          харагдана.
        </p>
      </div>
    );
  }

  const unlockedFlags: Record<AssignmentPhase, boolean> = {
    PREDICT: assignment.phase1Unlocked,
    CONFIRM: assignment.phase2Unlocked,
    APPLY: assignment.phase3Unlocked,
  };

  return (
    <div className="card">
      {assignment.wordIds.map((wordId) => {
        const word = S.wordById(db, wordId);
        if (!word) return null;
        return (
          <div key={wordId} className="word-block">
            <h3>{word.word}</h3>
            {PHASE_ROWS.map(({ phase, label }) => {
              const response = S.getResponse(db, studentId, wordId, phase);
              const unlocked = unlockedFlags[phase];
              const draftKey = `${wordId}-${phase}`;
              return (
                <div key={phase} className="phase-row">
                  <div className="phase-label">{label}</div>
                  {response ? (
                    <div className="submitted-text">{response.text}</div>
                  ) : !unlocked ? (
                    <div className="locked-note">
                      Энэ алхам нээгдээгүй байна. Багшаа хүлээгээрэй.
                    </div>
                  ) : (
                    <>
                      <textarea
                        placeholder="Хариултаа энд бичээрэй."
                        aria-label={`${word.word}: ${label}`}
                        value={drafts[draftKey] ?? ''}
                        onChange={(e) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [draftKey]: e.target.value,
                          }))
                        }
                      />
                      <button
                        className="btn outline"
                        style={{ marginTop: 8 }}
                        onClick={() => {
                          const text = (drafts[draftKey] ?? '').trim();
                          if (!text) return;
                          submitWordResponse(
                            assignment.id,
                            studentId,
                            wordId,
                            phase,
                            text,
                          );
                        }}
                      >
                        Хариултаа илгээх
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const PICTURE_LABELS: Record<string, string> = {
  cup: 'Аяга',
  book: 'Ном',
  cat: 'Муур',
  shoe: 'Гутал',
  tree: 'Мод',
};

const ICONS: Record<string, ReactElement> = {
  cup: (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path d="M14 22h30v18a10 10 0 0 1-10 10H24a10 10 0 0 1-10-10V22z" />
      <path d="M44 26h6a6 6 0 0 1 0 12h-6" />
    </svg>
  ),
  book: (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path d="M10 16c8-4 16-4 22 0v34c-6-4-14-4-22 0V16z" />
      <path d="M54 16c-8-4-16-4-22 0v34c6-4 14-4 22 0V16z" />
    </svg>
  ),
  cat: (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path d="M18 26 12 12l12 8" />
      <path d="M46 26l6-14-12 8" />
      <circle cx={32} cy={34} r={16} />
      <circle cx={26} cy={32} r={1.6} fill="currentColor" />
      <circle cx={38} cy={32} r={1.6} fill="currentColor" />
    </svg>
  ),
  shoe: (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path d="M8 42c4-10 10-18 20-20 6 4 12 6 20 6 4 0 8 4 8 8v6H8v0z" />
    </svg>
  ),
  tree: (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <circle cx={32} cy={24} r={16} />
      <path d="M32 40v18" />
    </svg>
  ),
};

function shuffled<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const PracticeTab = ({ studentId }: { studentId: string }) => {
  const { db, submitExtraPracticeAttempt } = useAppState();
  const student = db.students.find((s) => s.id === studentId);
  const pool = PRACTICE_ITEMS.filter((p) => p.level === student?.level);
  const items = pool.length
    ? pool
    : PRACTICE_ITEMS.filter((p) => p.level === 1);

  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState(() =>
    shuffled([items[0].correct, ...items[0].distractors]),
  );
  const [picked, setPicked] = useState<string | null>(null);

  if (!student) return null;
  const item = items[index % items.length];

  function next() {
    const nextIndex = (index + 1) % items.length;
    setIndex(nextIndex);
    setOptions(
      shuffled([items[nextIndex].correct, ...items[nextIndex].distractors]),
    );
    setPicked(null);
  }

  function choose(key: string) {
    if (picked) return;
    setPicked(key);
    if (key === item.correct) submitExtraPracticeAttempt(studentId, true);
  }

  return (
    <div className="card">
      <span className="level-pill">Түвшин {student.level}</span>
      <p className="meta">Үгэнд тохирох зургийг сонгоорой.</p>
      <p className="word-display">{item.word}</p>
      <div className="picture-options">
        {options.map((key) => {
          const cls = picked
            ? key === item.correct
              ? 'correct'
              : key === picked
                ? 'wrong'
                : ''
            : '';
          return (
            <button
              type="button"
              key={key}
              className={`picture-option ${cls}`}
              aria-label={PICTURE_LABELS[key]}
              onClick={() => choose(key)}
            >
              {ICONS[key]}
            </button>
          );
        })}
      </div>
      <p
        className={`feedback-line ${picked ? (picked === item.correct ? 'correct' : 'wrong') : ''}`}
      >
        {picked
          ? picked === item.correct
            ? 'Зөв хариуллаа!'
            : 'Энэ удаа алдлаа. Зөв хариултыг хараад дараагийн үгийг туршаарай.'
          : ''}
      </p>
      <button className="btn outline" onClick={next}>
        Дараагийн үг
      </button>
    </div>
  );
};

const AvatarsTab = ({ studentId }: { studentId: string }) => {
  const { db, chooseAvatar } = useAppState();
  const student = db.students.find((s) => s.id === studentId);
  if (!student) return null;

  return (
    <>
      <h1 style={{ fontSize: 20, fontWeight: 700, margin: '4px 0 4px' }}>
        Миний дүрүүд
      </h1>
      <p
        style={{
          color: 'var(--text-color-base)',
          fontSize: 13.5,
          margin: '0 0 18px',
        }}
      >
        Өдөр бүр давтвал шинэ дүр сонгох эрх нээгдэнэ.
      </p>
      <PeepsEditor key={student.avatarId} student={student} />
      <h2 className="peeps-presets-title">Давтлагаар нээгдэх дүрүүд</h2>
      <div className="avatar-grid">
        {AVATAR_CATALOG.map((a) => {
          const unlocked = student.streakCount >= a.req;
          return (
            <button
              type="button"
              key={a.id}
              role="radio"
              className={`avatar-tile${unlocked ? '' : ' locked'}`}
              aria-checked={a.id === student.avatarId}
              onClick={() => unlocked && chooseAvatar(studentId, a.id)}
              style={{ cursor: unlocked ? 'pointer' : undefined }}
            >
              <PeepsImage
                selection={peepsPreset(a.id)}
                alt={a.name}
                size={96}
              />
              <span className="avatar-name">{a.name}</span>
              <span className="avatar-req">
                {unlocked
                  ? a.req === 0
                    ? 'Шууд сонгож болно'
                    : 'Сонгох эрх нээгдсэн'
                  : `${a.req} хоног дараалан давтвал нээгдэнэ`}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
};
