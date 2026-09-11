'use client';
import { useState } from 'react';
import { AppStateProvider, useAppState } from './AppState';
import { TeacherShell } from './TeacherShell';
import { StudentShell } from './StudentShell';
import './classroom.css';

const StudentDemo = () => {
  const { db } = useAppState();
  const [studentId, setStudentId] = useState(db.students[0]?.id ?? '');
  return (
    <>
      <div className="sessionbar">
        <label htmlFor="demo-student">Туршилтын сурагч</label>
        <select
          id="demo-student"
          value={studentId}
          onChange={(event) => setStudentId(event.target.value)}
        >
          {db.students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
      </div>
      <StudentShell key={studentId} studentId={studentId} />
    </>
  );
};

export const ClassroomDemo = ({ role }: { role: 'teacher' | 'student' }) => (
  <main className="classroom-demo" style={{ minHeight: '100vh' }}>
    <AppStateProvider>
      {role === 'teacher' ? <TeacherShell /> : <StudentDemo />}
    </AppStateProvider>
  </main>
);
