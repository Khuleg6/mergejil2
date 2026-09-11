'use client';
import { useState } from 'react';
import MBTIModule from './MBTIModule';
import { QuizCard } from './quizCard';
import { QuizResult } from './quizResult';
import { mbtiQuestions } from './mbtiQuestions';
import type { MbtiType } from '@/lib/mbti';
import {
  calculateMbtiResult,
  resultFromKnownType,
  type MbtiResult,
} from '@/lib/mbtiScoring';
import { saveMbtiResult } from '@/lib/assessmentApi';

export default function AssessmentPage() {
  const [screen, setScreen] = useState<'overview' | 'quiz' | 'result'>(
    'overview',
  );
  const [result, setResult] = useState<MbtiResult | null>(null);

  const finish = (mbtiResult: MbtiResult) => {
    setResult(mbtiResult);
    setScreen('result');
    // Persisted for signed-in users only; a failure here must not block the
    // result the user just earned.
    void saveMbtiResult(mbtiResult);
  };

  return (
    <div className="min-h-screen bg-[#EFF4FF] flex flex-col">
      {screen === 'overview' && (
        <MBTIModule
          questionCount={mbtiQuestions.length}
          onStartTest={() => setScreen('quiz')}
          onSubmitKnownMbti={(type: MbtiType) =>
            finish(resultFromKnownType(type))
          }
        />
      )}
      {screen === 'quiz' && (
        <QuizCard
          onComplete={(answers) =>
            finish(calculateMbtiResult(mbtiQuestions, answers))
          }
        />
      )}
      {screen === 'result' && result && (
        <QuizResult
          result={result}
          onRestart={() => {
            setResult(null);
            setScreen('overview');
          }}
        />
      )}
    </div>
  );
}
