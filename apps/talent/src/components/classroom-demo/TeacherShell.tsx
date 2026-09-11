'use client';

import { useState } from 'react';
import { useAppState } from './AppState';
import { SessionBar } from './SessionBar';
import * as S from './lib/selectors';
import type { AssignmentPhase } from './lib/types';

type Tab = 'classes' | 'materials' | 'assignment' | 'grading' | 'reports';

export const TeacherShell = () => {
  const { db } = useAppState();
  const [tab, setTab] = useState<Tab>('classes');
  const [selectedClassId, setSelectedClassId] = useState(
    db.classes[0]?.id ?? '',
  );

  const currentClass = db.classes.find((c) => c.id === selectedClassId);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'classes', label: 'Ангиуд' },
    { key: 'materials', label: 'Унших эх' },
    { key: 'assignment', label: 'Даалгавар' },
    { key: 'grading', label: 'Үнэлгээ' },
    { key: 'reports', label: 'Тайлан' },
  ];

  return (
    <>
      <SessionBar whoLabel={`Багш · ${currentClass?.name ?? ''}`} />
      <div className="teacher-shell">
        <div className="sidebar">
          <div
            role="tablist"
            aria-label="Багшийн цэс"
            aria-orientation="vertical"
          >
            {tabs.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="teacher-main">
          {tab === 'classes' && (
            <ClassesPanel
              selectedClassId={selectedClassId}
              onSelectClass={setSelectedClassId}
            />
          )}
          {tab === 'materials' && (
            <MaterialsPanel
              classId={selectedClassId}
              onAssignmentCreated={() => setTab('assignment')}
            />
          )}
          {tab === 'assignment' && (
            <AssignmentPanel
              classId={selectedClassId}
              onGoToMaterials={() => setTab('materials')}
            />
          )}
          {tab === 'grading' && <GradingPanel classId={selectedClassId} />}
          {tab === 'reports' && <ReportsPanel classId={selectedClassId} />}
        </div>
      </div>
    </>
  );
};

const ClassesPanel = ({
  selectedClassId,
  onSelectClass,
}: {
  selectedClassId: string;
  onSelectClass: (id: string) => void;
}) => {
  const { db, createClass, addStudentToClass } = useAppState();
  const [newClassName, setNewClassName] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('');

  const roster = S.rosterFor(db, selectedClassId);
  const currentClass = db.classes.find((c) => c.id === selectedClassId);

  return (
    <>
      <h1 className="page-title">Миний ангиуд</h1>
      <p className="page-sub">
        Сурагчдын жагсаалтыг харахын тулд ангиа сонгоно уу. Мөн шинэ анги нэмж
        болно.
      </p>
      <div className="card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {db.classes.map((c) => (
            <button
              type="button"
              key={c.id}
              onClick={() => onSelectClass(c.id)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 12px',
                border: '1px solid var(--gray-100)',
                borderRadius: 6,
                cursor: 'pointer',
                borderColor:
                  c.id === selectedClassId
                    ? 'var(--highlight-background)'
                    : undefined,
                background:
                  c.id === selectedClassId
                    ? 'var(--highlight-overlay)'
                    : undefined,
              }}
            >
              <span style={{ fontWeight: 600, fontSize: 13.5 }}>{c.name}</span>
              <span style={{ fontSize: 12, color: 'var(--text-color-base)' }}>
                {S.rosterFor(db, c.id).length} сурагч
              </span>
            </button>
          ))}
        </div>
        <div className="add-row">
          <input
            placeholder="Шинэ ангийн нэр"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
          />
          <button
            className="btn outline"
            onClick={() => {
              if (!newClassName.trim()) return;
              createClass(newClassName.trim(), 't1');
              setNewClassName('');
            }}
          >
            Анги нэмэх
          </button>
        </div>
      </div>
      <div className="card">
        <h2>{currentClass?.name ?? ''} — сурагчдын жагсаалт</h2>
        <p className="meta">
          Сурагчийн нэр, утасны дугаарыг оруулж ангидаа нэмнэ үү.
        </p>
        <table>
          <thead>
            <tr>
              <th>Нэр</th>
              <th>Утасны дугаар</th>
              <th>Унших чадварын түвшин</th>
              <th>Тасралтгүй давтсан хоног</th>
            </tr>
          </thead>
          <tbody>
            {roster.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{S.formatPhone(s.phone)}</td>
                <td>Түвшин {s.level}</td>
                <td>{s.streakCount} хоног</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="add-row">
          <input
            placeholder="Сурагчийн нэр"
            value={newStudentName}
            onChange={(e) => setNewStudentName(e.target.value)}
          />
          <input
            placeholder="Утасны дугаар"
            value={newStudentPhone}
            onChange={(e) => setNewStudentPhone(e.target.value)}
          />
          <button
            className="btn"
            onClick={() => {
              const phone = S.normalizePhone(newStudentPhone);
              if (!newStudentName.trim() || phone.length < 7) return;
              addStudentToClass(selectedClassId, newStudentName.trim(), phone);
              setNewStudentName('');
              setNewStudentPhone('');
            }}
          >
            Сурагч нэмэх
          </button>
        </div>
      </div>
    </>
  );
};

const MaterialsPanel = ({
  classId,
  onAssignmentCreated,
}: {
  classId: string;
  onAssignmentCreated: () => void;
}) => {
  const { db, uploadReadingMaterial, toggleVocabWord, createAssignment } =
    useAppState();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const material = S.materialFor(db, classId);

  if (!material) {
    return (
      <>
        <h1 className="page-title">Унших эх</h1>
        <p className="page-sub">Энэ ангид унших эх хараахан нэмээгүй байна.</p>
        <div className="card">
          <label className="field-label">Эхийн гарчиг</label>
          <input
            placeholder="Жишээ нь: Намрын ой"
            style={{ marginBottom: 12 }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label className="field-label">Эхийн агуулга</label>
          <textarea
            placeholder="Унших эхээ энд бичих эсвэл хуулж оруулна уу."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <button
            className="btn"
            style={{ marginTop: 14 }}
            onClick={() => {
              if (!title.trim() || !body.trim()) return;
              uploadReadingMaterial(classId, title.trim(), body.trim());
            }}
          >
            Эхийг хадгалах
          </button>
        </div>
      </>
    );
  }

  const picked = S.vocabForMaterial(db, material.id).map((w) => w.word);
  const tokens = material.bodyText.split(/(\s+)/);

  return (
    <>
      <h1 className="page-title">Унших эх</h1>
      <p className="page-sub">Сурагчдад заах үгээ эхээс дарж сонгоно уу.</p>
      <div className="card">
        <h2>{material.title}</h2>
        <div className="material-text">
          {tokens.map((tok, i) => {
            const clean = tok
              .replace(/^[^\p{L}]+|[^\p{L}]+$/gu, '')
              .toLocaleLowerCase('mn');
            if (/^\p{L}+$/u.test(clean)) {
              return (
                <button
                  key={i}
                  type="button"
                  className="word"
                  aria-pressed={picked.includes(clean)}
                  onClick={() => toggleVocabWord(material.id, clean)}
                >
                  {tok}
                </button>
              );
            }
            return <span key={i}>{tok}</span>;
          })}
        </div>
        <p className="meta" style={{ marginTop: 14 }}>
          Сонгосон үгс
        </p>
        <div className="picked-list">
          {picked.length === 0 ? (
            <span className="help-text">Үг хараахан сонгоогүй байна.</span>
          ) : (
            picked.map((w) => (
              <span key={w} className="pill">
                {w}
              </span>
            ))
          )}
        </div>
        <div style={{ marginTop: 16 }}>
          <button
            className="btn"
            onClick={() => {
              const words = S.vocabForMaterial(db, material.id);
              if (words.length === 0) return;
              createAssignment(
                classId,
                material.id,
                words.map((w) => w.id),
              );
              onAssignmentCreated();
            }}
          >
            Сонгосон үгсээр даалгавар үүсгэх буюу шинэчлэх
          </button>
        </div>
      </div>
    </>
  );
};

const PHASE_INFO: { phase: AssignmentPhase; label: string; sub: string }[] = [
  {
    phase: 'PREDICT',
    label: 'Утгыг таамаглах',
    sub: 'Үгийг дохионы хэлээр үзүүлсний дараа энэ алхмыг нээнэ үү.',
  },
  {
    phase: 'CONFIRM',
    label: 'Утгыг бататгах',
    sub: 'Үгийн утгыг тайлбарласны дараа энэ алхмыг нээнэ үү.',
  },
  {
    phase: 'APPLY',
    label: 'Өгүүлбэр зохиох',
    sub: 'Сурагчид үгийн утгыг ойлгосны дараа энэ алхмыг нээнэ үү.',
  },
];

const AssignmentPanel = ({
  classId,
  onGoToMaterials,
}: {
  classId: string;
  onGoToMaterials: () => void;
}) => {
  const { db, unlockPhase } = useAppState();
  const assignment = S.assignmentFor(db, classId);
  const roster = S.rosterFor(db, classId);

  if (!assignment) {
    return (
      <>
        <h1 className="page-title">Даалгавар</h1>
        <p className="page-sub">
          Одоогоор даалгавар алга. Эхлээд «Унших эх» хэсгээс заах үгсээ сонгоно
          уу.
        </p>
        <div className="card">
          <button className="btn outline" onClick={onGoToMaterials}>
            Унших эх рүү очих
          </button>
        </div>
      </>
    );
  }

  const material = db.materials.find((m) => m.id === assignment.materialId);
  const words = assignment.wordIds
    .map((id) => S.wordById(db, id))
    .filter((w) => w !== undefined);
  const unlockedFlags: Record<AssignmentPhase, boolean> = {
    PREDICT: assignment.phase1Unlocked,
    CONFIRM: assignment.phase2Unlocked,
    APPLY: assignment.phase3Unlocked,
  };

  return (
    <>
      <h1 className="page-title">Даалгавар: {material?.title}</h1>
      <p className="page-sub">
        Үгс: {words.map((w) => w.word).join(', ')}. Сурагчид бэлэн болмогц
        тохирох алхмыг нээнэ үү.
      </p>
      <div className="card">
        <h2>Даалгаврын алхмууд</h2>
        {PHASE_INFO.map((p) => (
          <div
            key={p.phase}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 0',
              borderBottom: '1px solid var(--gray-100)',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>{p.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-color-base)' }}>
                {p.sub}
              </div>
            </div>
            <button
              role="switch"
              aria-label={`${p.label} алхмыг нээх эсвэл хаах`}
              aria-checked={unlockedFlags[p.phase]}
              onClick={() => unlockPhase(assignment.id, p.phase)}
            >
              <span className="knob" />
            </button>
          </div>
        ))}
      </div>
      <div className="card">
        <h2>Даалгаврын гүйцэтгэл</h2>
        <table>
          <thead>
            <tr>
              <th>Сурагч</th>
              <th>Утгыг таамаглах</th>
              <th>Утгыг бататгах</th>
              <th>Өгүүлбэр зохиох</th>
            </tr>
          </thead>
          <tbody>
            {roster.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                {PHASE_INFO.map((p) => {
                  const status = S.phaseStatus(
                    db,
                    assignment,
                    s.id,
                    p.phase,
                    unlockedFlags[p.phase],
                  );
                  const label =
                    status.kind === 'locked'
                      ? 'Нээгдээгүй'
                      : status.kind === 'submitted'
                        ? 'Илгээсэн'
                        : status.kind === 'in_progress'
                          ? `${status.done}/${status.total}`
                          : 'Эхлээгүй';
                  const cls =
                    status.kind === 'submitted'
                      ? 'done'
                      : status.kind === 'locked'
                        ? 'locked'
                        : 'open';
                  return (
                    <td key={p.phase}>
                      <span className={`badge ${cls}`}>{label}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

const GradingPanel = ({ classId }: { classId: string }) => {
  const { db, gradeWordResponse } = useAppState();
  const roster = S.rosterFor(db, classId);
  const [studentId, setStudentId] = useState(roster[0]?.id ?? '');
  const assignment = S.assignmentFor(db, classId);
  const [feedbackDraft, setFeedbackDraft] = useState<Record<string, string>>(
    {},
  );

  return (
    <>
      <h1 className="page-title">Үнэлгээ</h1>
      <p className="page-sub">
        Сурагч бүрийн таамагласан утгыг бататгах алхамд бичсэн тайлбартай нь
        харьцуулна уу.
      </p>
      <div
        style={{ display: 'grid', gridTemplateColumns: '190px 1fr', gap: 16 }}
      >
        <div className="card">
          <div role="listbox" className="student-picker" aria-label="Сурагчид">
            {roster.map((s) => (
              <button
                type="button"
                key={s.id}
                role="option"
                className="student-option"
                aria-selected={s.id === studentId}
                onClick={() => setStudentId(s.id)}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
        <div className="card">
          {!assignment ? (
            <p className="meta">Энэ ангид одоогоор даалгавар алга.</p>
          ) : (
            assignment.wordIds.map((wordId) => {
              const word = S.wordById(db, wordId);
              if (!word) return null;
              const predict = S.getResponse(db, studentId, wordId, 'PREDICT');
              const confirm = S.getResponse(db, studentId, wordId, 'CONFIRM');
              const apply = S.getResponse(db, studentId, wordId, 'APPLY');
              const feedbackKey = confirm?.id ?? '';
              return (
                <div key={wordId} className="word-block">
                  <h3>{word.word}</h3>
                  <div className="grid2">
                    <div className="submitted-text">
                      <div className="help-text" style={{ margin: '0 0 3px' }}>
                        Утгыг таамаглах
                      </div>
                      {predict ? (
                        predict.text
                      ) : (
                        <span className="locked-note">
                          Хариултаа илгээгээгүй байна.
                        </span>
                      )}
                    </div>
                    <div className="submitted-text">
                      <div className="help-text" style={{ margin: '0 0 3px' }}>
                        Утгыг бататгах
                      </div>
                      {confirm ? (
                        confirm.text
                      ) : (
                        <span className="locked-note">
                          Хариултаа илгээгээгүй байна.
                        </span>
                      )}
                    </div>
                  </div>
                  {confirm && (
                    <>
                      <label className="field-label">
                        Үгийн утгыг тайлбарласан хариултыг үнэлэх
                      </label>
                      <div role="radiogroup" className="grade-group">
                        {[0, 1, 2].map((n) => (
                          <button
                            type="button"
                            key={n}
                            role="radio"
                            aria-checked={confirm.grade === n}
                            onClick={() =>
                              gradeWordResponse(confirm.id, n as 0 | 1 | 2)
                            }
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  <div
                    className="submitted-text"
                    style={{ margin: '10px 0 12px' }}
                  >
                    <div className="help-text" style={{ margin: '0 0 3px' }}>
                      Өгүүлбэр зохиох
                    </div>
                    {apply ? (
                      apply.text
                    ) : (
                      <span className="locked-note">
                        Хариултаа илгээгээгүй байна.
                      </span>
                    )}
                  </div>
                  {apply && (
                    <>
                      <label className="field-label">
                        Зохиосон өгүүлбэрийг үнэлэх
                      </label>
                      <div role="radiogroup" className="grade-group">
                        {[0, 1, 2].map((n) => (
                          <button
                            type="button"
                            key={n}
                            role="radio"
                            aria-checked={apply.grade === n}
                            onClick={() =>
                              gradeWordResponse(apply.id, n as 0 | 1 | 2)
                            }
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  {confirm && (
                    <>
                      <label className="field-label" style={{ marginTop: 10 }}>
                        Багшийн зөвлөгөө
                      </label>
                      <textarea
                        placeholder="Сурагчид зориулж товч зөвлөгөө бичнэ үү."
                        value={feedbackDraft[feedbackKey] ?? confirm.feedback}
                        onChange={(e) =>
                          setFeedbackDraft((prev) => ({
                            ...prev,
                            [feedbackKey]: e.target.value,
                          }))
                        }
                        onBlur={(e) =>
                          gradeWordResponse(
                            confirm.id,
                            (confirm.grade ?? 0) as 0 | 1 | 2,
                            e.target.value,
                          )
                        }
                      />
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

const ReportsPanel = ({ classId }: { classId: string }) => {
  const { db } = useAppState();
  const assignment = S.assignmentFor(db, classId);
  const roster = S.rosterFor(db, classId);
  const currentClass = db.classes.find((c) => c.id === classId);
  const material = assignment
    ? db.materials.find((m) => m.id === assignment.materialId)
    : null;

  return (
    <>
      <h1 className="page-title">Ангийн тайлан</h1>
      <p className="page-sub">
        {currentClass?.name}
        {material ? ` — ${material.title}` : ''}
      </p>
      <div className="card">
        <h2>Дахин тайлбарлах шаардлагатай үгс</h2>
        <p className="meta">
          Утгыг бататгах алхмын үнэлсэн хариултуудаас 0 эсвэл 1 оноо авсан
          хариултын эзлэх хувь. Нийт авах оноо: 2.
        </p>
        {!assignment ? (
          <p className="meta">Одоогоор даалгавар алга.</p>
        ) : (
          assignment.wordIds.map((wordId) => {
            const word = S.wordById(db, wordId);
            if (!word) return null;
            const pct = S.wordSupportNeededPct(db, assignment, roster, wordId);
            return (
              <div key={wordId} className="bar-row">
                <div className="label">{word.word}</div>
                {pct === null ? (
                  <span className="help-text">Үнэлээгүй байна</span>
                ) : (
                  <>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="val">{pct}%</div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
      <div className="card">
        <h2>Сурагчдын давтлагын идэвх</h2>
        <p className="meta">Сурагч бүрийн тасралтгүй давтсан хоногийн тоо</p>
        {roster.map((s) => (
          <div key={s.id} className="bar-row">
            <div className="label">{s.name}</div>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ width: `${Math.min(100, s.streakCount * 6)}%` }}
              />
            </div>
            <div className="val">{s.streakCount} хоног</div>
          </div>
        ))}
      </div>
    </>
  );
};
