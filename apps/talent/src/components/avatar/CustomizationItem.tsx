import { Check, Flame, LockKeyhole } from 'lucide-react';
import { AvatarImage } from './AvatarImage';
import { student, type AvatarItem, type Selection } from './avatar-data';

export const CustomizationItem = ({
  item,
  selection,
  selected,
  onSelect,
}: {
  item: AvatarItem;
  selection: Selection;
  selected: boolean;
  onSelect: () => void;
}) => {
  const locked = item.requiredStreak > student.streak;
  return (
    <button
      disabled={locked}
      aria-pressed={selected}
      aria-label={`${item.label}, ${locked ? 'locked, requires ' : ''}${item.requiredStreak ? `${item.requiredStreak} Day Streak` : 'Free'}`}
      onClick={onSelect}
      className={`relative rounded-2xl border-2 p-3 text-left transition duration-200 ${selected ? 'border-indigo-500 bg-indigo-50/60 shadow-sm' : locked ? 'border-slate-100 bg-slate-50' : 'border-slate-100 bg-white hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md'}`}
    >
      <span
        className={`absolute right-3 top-3 z-10 flex size-6 items-center justify-center rounded-full ${selected ? 'bg-indigo-600 text-white' : 'bg-white/90 text-slate-400'}`}
      >
        {selected ? (
          <Check size={14} />
        ) : locked ? (
          <LockKeyhole size={13} />
        ) : (
          <span className="size-2 rounded-full bg-emerald-400" />
        )}
      </span>
      <div
        className={`mx-auto mb-3 aspect-square max-w-32 overflow-hidden rounded-xl ${locked ? 'opacity-70' : ''}`}
      >
        <AvatarImage selection={selection} />
      </div>
      <span className="block text-sm font-bold text-slate-700">
        {item.label}
      </span>
      <span
        className={`mt-1 flex items-center gap-1 text-xs font-medium ${locked ? 'text-slate-500' : 'text-indigo-600'}`}
      >
        {locked ? (
          <LockKeyhole size={12} />
        ) : item.requiredStreak ? (
          <Flame size={12} />
        ) : null}
        {item.requiredStreak ? `${item.requiredStreak} Day Streak` : 'Free'}
      </span>
    </button>
  );
};
