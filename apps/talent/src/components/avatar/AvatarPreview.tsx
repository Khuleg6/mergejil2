import { Flame, Shuffle, Check, Sparkles } from 'lucide-react';
import { AvatarImage } from './AvatarImage';
import { student, type Selection } from './avatar-data';

export const StreakBadge = () => (
  <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700">
    <Flame size={17} aria-hidden="true" />
    {student.streak} Day Streak
  </span>
);

export const AvatarPreview = ({
  selection,
  saved,
  onRandomize,
  onSave,
}: {
  selection: Selection;
  saved: boolean;
  onRandomize: () => void;
  onSave: () => void;
}) => (
  <section
    aria-label="Your avatar preview"
    className="surface rounded-3xl p-6 text-center sm:p-8"
  >
    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
      <span>Your character</span>
      <Sparkles size={17} className="text-indigo-400" />
    </div>
    <div className="relative mx-auto mb-7 mt-8 max-w-64">
      <div
        className="aspect-square overflow-hidden rounded-full border-8 border-white shadow-[0_0_0_1px_#e0e7ff,0_16px_40px_-18px_#818cf8]"
        style={{ backgroundColor: `#${selection.background}` }}
      >
        <AvatarImage
          selection={selection}
          size={280}
          alt={`${student.name}'s customized avatar`}
        />
      </div>
      <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border-4 border-white bg-indigo-600 px-4 py-1 text-xs font-bold text-white">
        LEVEL {student.level}
      </span>
    </div>
    <h2 className="text-2xl font-bold tracking-tight">{student.name}</h2>
    <p className="mb-4 mt-1 text-sm text-slate-500">
      A little more you. Every day.
    </p>
    <StreakBadge />
    <div className="mb-6 mt-7 text-left">
      <div className="mb-2 flex justify-between text-xs">
        <span className="font-semibold text-slate-600">
          Level {student.level + 1} is getting closer
        </span>
        <span className="text-slate-500">
          {student.xp} / {student.nextLevelXp} XP
        </span>
      </div>
      <progress
        aria-label="Experience toward next level"
        value={student.xp}
        max={student.nextLevelXp}
        className="h-2 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-slate-100 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-indigo-500 [&::-moz-progress-bar]:bg-indigo-500"
      />
    </div>
    <button
      onClick={onRandomize}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold hover:border-indigo-300 hover:bg-indigo-50"
    >
      <Shuffle size={17} />
      Randomize Avatar
    </button>
    <button
      onClick={onSave}
      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 hover:shadow-md"
    >
      <Check size={17} />
      Save Avatar
    </button>
    <p role="status" className="mt-3 min-h-10 text-xs leading-5 text-slate-500">
      {saved
        ? 'Look saved for this preview! Refreshing resets it.'
        : 'Try it out — this is a preview. Nothing is saved to your account.'}
    </p>
  </section>
);
