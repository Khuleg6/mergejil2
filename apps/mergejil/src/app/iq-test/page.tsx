'use client';

import { useState } from 'react';
import { RequireAuth } from '@/components/RequireAuth';
import { IqModule } from '../career-assessment/components/iqModule';
import { SkillsModule } from '../career-assessment/components/SkillsModule';

export default function IqTestPage() {
  const [isSkillsTest, setIsSkillsTest] = useState(false);

  return (
    <RequireAuth>
      {isSkillsTest ? (
        <SkillsModule />
      ) : (
        <IqModule onComplete={() => setIsSkillsTest(true)} />
      )}
    </RequireAuth>
  );
}
